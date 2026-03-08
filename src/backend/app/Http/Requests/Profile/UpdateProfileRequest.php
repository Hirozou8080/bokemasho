<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = Auth::id();

        return [
            'username' => 'sometimes|string|max:255|unique:users,username,' . $userId,
            'bio' => 'sometimes|nullable|string|max:1000',
            'icon' => 'sometimes|nullable|file|mimes:jpeg,png,jpg,gif,webp,heic,heif|max:10240',
        ];
    }

    public function messages(): array
    {
        return [
            'username.unique' => 'このユーザー名は既に使用されています',
            'username.max' => 'ユーザー名は255文字以内で入力してください',
            'bio.max' => '自己紹介は1000文字以内で入力してください',
            'icon.mimes' => '対応形式: JPEG, PNG, GIF, WebP, HEIC',
            'icon.max' => 'ファイルサイズは10MB以下にしてください',
        ];
    }
}
