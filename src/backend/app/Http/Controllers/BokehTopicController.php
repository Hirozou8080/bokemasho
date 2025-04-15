<?php

namespace App\Http\Controllers;

use App\Models\BokehTopic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class BokehTopicController extends Controller
{
  /**
   * お題一覧を取得
   */
  public function index()
  {
    $topics = BokehTopic::with('user')
      ->orderBy('priority', 'desc')
      ->orderBy('created_at', 'desc')
      ->paginate(10);

    return response()->json([
      'data' => $topics
    ]);
  }

  /**
   * お題の詳細を取得
   */
  public function show($id)
  {
    $topic = BokehTopic::with('user')->findOrFail($id);
    return response()->json([
      'data' => $topic
    ]);
  }

  /**
   * お題を新規作成
   */
  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    if ($validator->fails()) {
      return response()->json(['errors' => $validator->errors()], 422);
    }

    $user = Auth::user();
    if (!$user) {
      return response()->json(['message' => '認証が必要です'], 401);
    }

    try {
      $topic = new BokehTopic();
      $topic->user_id = $user->id;

      // 画像をアップロード
      if ($request->hasFile('image')) {
        $path = $request->file('image')->store('bokeh_topics', 'public');
        $topic->image_path = $path;
      } else {
        return response()->json(['message' => '画像が必要です'], 422);
      }

      $topic->save();

      return response()->json([
        'message' => 'お題を投稿しました',
        'data' => $topic
      ], 201);
    } catch (\Exception $e) {
      Log::error('ボケお題投稿エラー: ' . $e->getMessage());
      return response()->json(['message' => 'お題の投稿に失敗しました'], 500);
    }
  }

  /**
   * お題を更新
   */
  public function update(Request $request, $id)
  {
    $validator = Validator::make($request->all(), [
      'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
      'priority' => 'nullable|integer',
    ]);

    if ($validator->fails()) {
      return response()->json(['errors' => $validator->errors()], 422);
    }

    $user = Auth::user();
    $topic = BokehTopic::findOrFail($id);

    // 投稿者本人のみ更新可能
    if ($topic->user_id !== $user->id) {
      return response()->json(['message' => '更新権限がありません'], 403);
    }

    try {
      if ($request->has('priority')) {
        $topic->priority = $request->priority;
      }

      // 画像がアップロードされた場合
      if ($request->hasFile('image')) {
        // 古い画像を削除
        if ($topic->image_path) {
          Storage::disk('public')->delete($topic->image_path);
        }

        $path = $request->file('image')->store('bokeh_topics', 'public');
        $topic->image_path = $path;
      }

      $topic->save();

      return response()->json([
        'message' => 'お題を更新しました',
        'data' => $topic
      ]);
    } catch (\Exception $e) {
      Log::error('ボケお題更新エラー: ' . $e->getMessage());
      return response()->json(['message' => 'お題の更新に失敗しました'], 500);
    }
  }

  /**
   * お題を削除
   */
  public function destroy($id)
  {
    $user = Auth::user();
    $topic = BokehTopic::findOrFail($id);

    // 投稿者本人のみ削除可能
    if ($topic->user_id !== $user->id) {
      return response()->json(['message' => '削除権限がありません'], 403);
    }

    try {
      // 画像も削除
      if ($topic->image_path) {
        Storage::disk('public')->delete($topic->image_path);
      }

      $topic->delete();
      return response()->json(['message' => 'お題を削除しました']);
    } catch (\Exception $e) {
      Log::error('ボケお題削除エラー: ' . $e->getMessage());
      return response()->json(['message' => 'お題の削除に失敗しました'], 500);
    }
  }
}
