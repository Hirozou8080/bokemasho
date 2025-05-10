<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\{
    Joke,
    JokeTopic,
    Vote
};
use Illuminate\Support\Facades\{
    Auth,
    Log,
    Validator
};

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
            $user_id = $request->query('user_id');
            $jokes = Joke::with('user', 'topic')
                ->withCount('votes')
                ->orderBy('priority', 'desc')
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            if ($user_id) {
                $jokes->getCollection()->transform(function ($joke) use ($user_id) {
                    $joke->has_voted = $joke->votes->contains('user_id', $user_id);
                    return $joke;
                });
            } else {
                $jokes->getCollection()->transform(function ($joke) {
                    $joke->has_voted = false;
                    return $joke;
                });
            }

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
    public function vote($jokeId)
    {
        $user = Auth::user();
        Log::info($user);
        if (!$user) {
            return response()->json(['message' => '認証が必要です'], 401);
        }

        try {
            $vote = Vote::where('user_id', $user->id)
                ->where('joke_id', $jokeId)
                ->first();

            if ($vote) {
                // 既に投票済みの場合は投票を取り消し
                $vote->delete();
                $hasVoted = false;
            } else {
                // 新規投票
                Vote::create([
                    'user_id' => $user->id,
                    'joke_id' => $jokeId
                ]);
                $hasVoted = true;
            }

            $voteCount = Vote::where('joke_id', $jokeId)->count();

            return response()->json([
                'message' => $hasVoted ? 'ボケに投票しました' : '投票を取り消しました',
                'vote_count' => $voteCount,
                'has_voted' => $hasVoted
            ]);
        } catch (\Exception $e) {
            Log::error('ボケ投票エラー: ' . $e->getMessage());
            return response()->json(['message' => 'ボケへの投票に失敗しました'], 500);
        }
    }
}
