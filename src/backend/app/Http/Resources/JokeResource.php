<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JokeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'topic_id' => $this->topic_id,
            'content' => $this->content,
            'priority' => $this->priority,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => $this->whenLoaded('user'),
            'topic' => $this->whenLoaded('topic'),
            'categories' => $this->whenLoaded('categories'),
            'votes_count' => $this->votes_count ?? 0,
            'has_voted' => $this->has_voted ?? false,
        ];
    }
}
