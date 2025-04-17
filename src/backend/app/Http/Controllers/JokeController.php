<?php

namespace App\Http\Controllers;

use App\Models\Joke;
use App\Models\JokeTopic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class JokeController extends Controller
{
    /**
     * ボケを新規投稿
     */
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'topic_id' => 'required|exists:joke_topics,id',
            'content' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => '認証が必要です'], 401);
        }

        try {
            // お題が存在するか確認
            $topic = JokeTopic::findOrFail($request->topic_id);

            // ボケを作成
            $joke = new Joke();
            $joke->user_id = $user->id;
            $joke->topic_id = $topic->id;
            $joke->content = $request->content;
            $joke->priority = 0;
            $joke->save();

            return response()->json([
                'message' => 'ボケを投稿しました',
                'data' => $joke->load('user')
            ], 201);
        } catch (\Exception $e) {
            Log::error('ボケ投稿エラー: ' . $e->getMessage());
            return response()->json(['message' => 'ボケの投稿に失敗しました'], 500);
        }
    }

    /**
     * ボケ一覧を取得
     */
    public function index(Request $request)
    {
        try {
            $jokes = Joke::with('user', 'topic')
                ->orderBy('priority', 'desc')
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'data' => $jokes
            ]);
        } catch (\Exception $e) {
            Log::error('ボケ一覧取得エラー: ' . $e->getMessage());
            return response()->json(['message' => 'ボケ一覧の取得に失敗しました'], 500);
        }
    }

    /**
     * 特定のお題に紐づくボケ一覧を取得
     */
    public function getByTopic($topicId)
    {
        try {
            $jokes = Joke::with('user')
                ->where('topic_id', $topicId)
                ->orderBy('priority', 'desc')
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'data' => $jokes
            ]);
        } catch (\Exception $e) {
            Log::error('ボケ一覧取得エラー: ' . $e->getMessage());
            return response()->json(['message' => 'ボケ一覧の取得に失敗しました'], 500);
        }
    }

    /**
     * ボケの詳細を取得
     */
    public function show($id)
    {
        try {
            $joke = Joke::with('user', 'topic')->findOrFail($id);

            return response()->json([
                'data' => $joke
            ]);
        } catch (\Exception $e) {
            Log::error('ボケ詳細取得エラー: ' . $e->getMessage());
            return response()->json(['message' => 'ボケの取得に失敗しました'], 500);
        }
    }

    /**
     * ボケを削除
     */
    public function destroy($id)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => '認証が必要です'], 401);
        }

        try {
            $joke = Joke::findOrFail($id);

            // 投稿者本人のみ削除可能
            if ($joke->user_id !== $user->id) {
                return response()->json(['message' => '削除権限がありません'], 403);
            }

            $joke->delete();
            return response()->json(['message' => 'ボケを削除しました']);
        } catch (\Exception $e) {
            Log::error('ボケ削除エラー: ' . $e->getMessage());
            return response()->json(['message' => 'ボケの削除に失敗しました'], 500);
        }
    }

    /**
     * ボケに投票する
     */
    public function vote($id)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => '認証が必要です'], 401);
        }

        try {
            $joke = Joke::findOrFail($id);
            $joke->votes += 1;
            $joke->save();

            return response()->json([
                'message' => 'ボケに投票しました',
                'votes' => $joke->votes
            ]);
        } catch (\Exception $e) {
            Log::error('ボケ投票エラー: ' . $e->getMessage());
            return response()->json(['message' => 'ボケへの投票に失敗しました'], 500);
        }
    }
}
