<?php

namespace App\Http\Requests\Joke;

use Illuminate\Foundation\Http\FormRequest;

class CreateJokeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'topic_id' => 'required|exists:joke_topics,id',
            'content' => 'required|string|max:60',
            'categories' => 'nullable|array|max:3',
            'categories.*' => 'string|max:6',
        ];
    }

    public function messages(): array
    {
        return [
            'topic_id.required' => 'お題IDは必須です',
            'topic_id.exists' => '指定されたお題が見つかりません',
            'content.required' => 'ボケ内容は必須です',
            'content.max' => 'ボケ内容は60文字以内で入力してください',
            'categories.max' => 'カテゴリは3つまで指定できます',
            'categories.*.max' => 'カテゴリ名は6文字以内で入力してください',
        ];
    }
}
