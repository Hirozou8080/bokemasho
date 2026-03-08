<?php

namespace App\Http\Requests\JokeTopic;

use Illuminate\Foundation\Http\FormRequest;

class CreateJokeTopicRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'image.required' => '画像は必須です',
            'image.image' => '画像ファイルを選択してください',
            'image.mimes' => '画像はjpeg, png, jpg, gif形式で選択してください',
            'image.max' => '画像サイズは2MB以下にしてください',
        ];
    }
}
