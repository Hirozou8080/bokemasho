<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\Vote\VoteRepositoryInterface;
use App\Models\Vote;

class VoteRepository implements VoteRepositoryInterface
{
    public function hasVoted(int $userId, int $jokeId): bool
    {
        return Vote::where('user_id', $userId)
            ->where('joke_id', $jokeId)
            ->exists();
    }

    public function vote(int $userId, int $jokeId): void
    {
        Vote::create([
            'user_id' => $userId,
            'joke_id' => $jokeId,
        ]);
    }

    public function unvote(int $userId, int $jokeId): void
    {
        Vote::where('user_id', $userId)
            ->where('joke_id', $jokeId)
            ->delete();
    }

    public function countByJokeId(int $jokeId): int
    {
        return Vote::where('joke_id', $jokeId)->count();
    }
}
