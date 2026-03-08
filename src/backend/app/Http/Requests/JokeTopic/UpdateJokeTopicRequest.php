<?php

namespace App\Http\Requests\JokeTopic;

use Illuminate\Foundation\Http\FormRequest;

class UpdateJokeTopicRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'priority' => 'nullable|integer',
        ];
    }

    public function messages(): array
    {
        return [
            'image.image' => '画像ファイルを選択してください',
            'image.mimes' => '画像はjpeg, png, jpg, gif形式で選択してください',
            'image.max' => '画像サイズは2MB以下にしてください',
            'priority.integer' => '優先度は整数で入力してください',
        ];
    }
}
