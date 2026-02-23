<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
  /**
   * Get authenticated user profile
   */
  public function show()
  {
    $user = Auth::user();
    return new UserResource($user);
  }

  /**
   * Update user profile
   */
  public function update(Request $request)
  {
    Log::info('ProfileController@update started');
    $user = Auth::user();

    // アップロードされたファイルの情報をログに出力
    if ($request->hasFile('icon')) {
      $file = $request->file('icon');
      Log::info('Icon file info', [
        'original_name' => $file->getClientOriginalName(),
        'mime_type' => $file->getMimeType(),
        'size' => $file->getSize(),
        'is_valid' => $file->isValid(),
        'error' => $file->getError(),
      ]);
    }

    $validator = Validator::make($request->all(), [
      'username' => 'sometimes|string|max:255|unique:users,username,' . $user->id,
      'bio' => 'sometimes|nullable|string|max:1000',
      'icon' => 'sometimes|nullable|file|mimes:jpeg,png,jpg,gif,webp,heic,heif|max:10240',
    ], [
      'icon.mimes' => '対応形式: JPEG, PNG, GIF, WebP, HEIC',
      'icon.max' => 'ファイルサイズは10MB以下にしてください',
    ]);

    if ($validator->fails()) {
      Log::error('Validation failed', ['errors' => $validator->errors()->toArray()]);
      return response()->json([
        'message' => $validator->errors()->first(),
        'errors' => $validator->errors()
      ], 422);
    }

    $updateData = [];

    if ($request->has('username')) {
      $updateData['username'] = $request->username;
    }

    if ($request->has('bio')) {
      $updateData['bio'] = $request->bio;
    }

    // アイコン画像のアップロード処理
    if ($request->hasFile('icon')) {
      try {
        // 古いアイコンがあれば削除
        if ($user->icon_path) {
          Storage::disk('public')->delete($user->icon_path);
        }

        // 新しいアイコンを保存
        $iconPath = $request->file('icon')->store('icons', 'public');
        if ($iconPath === false) {
          Log::error('Failed to store icon file');
          return response()->json(['message' => 'アイコンの保存に失敗しました'], 500);
        }
        $updateData['icon_path'] = $iconPath;
        Log::info('Icon saved successfully', ['path' => $iconPath]);
      } catch (\Exception $e) {
        Log::error('Icon upload exception', ['error' => $e->getMessage()]);
        return response()->json(['message' => 'アイコンのアップロードに失敗しました: ' . $e->getMessage()], 500);
      }
    }

    // ユーザーモデルを保存
    if (!empty($updateData)) {
      User::where('id', $user->id)->update($updateData);
    }

    // 更新後のユーザー情報を取得
    $updatedUser = User::find($user->id);

    return new UserResource($updatedUser);
  }
}
