<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

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
    ]);

    if ($validator->fails()) {
      return response()->json(['errors' => $validator->errors()], 422);
    }

    if ($request->has('username')) {
      $user->username = $request->username;
    }

    if ($request->has('bio')) {
      $user->bio = $request->bio;
    }

    // ユーザーモデルを保存
    User::where('id', $user->id)->update([
      'username' => $user->username,
      'bio' => $user->bio,
    ]);

    // 更新後のユーザー情報を取得
    $updatedUser = User::find($user->id);

    return new UserResource($updatedUser);
  }
}
