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
    Log::info('ProfileController@update');
    $user = Auth::user();

    $validator = Validator::make($request->all(), [
      'username' => 'sometimes|string|max:255|unique:users,username,' . $user->id,
      'bio' => 'sometimes|nullable|string|max:1000',
      'icon' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    if ($validator->fails()) {
      return response()->json(['errors' => $validator->errors()], 422);
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
      // 古いアイコンがあれば削除
      if ($user->icon_path) {
        Storage::disk('public')->delete($user->icon_path);
      }

      // 新しいアイコンを保存
      $iconPath = $request->file('icon')->store('icons', 'public');
      $updateData['icon_path'] = $iconPath;
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
