<?php

namespace App\Domain\Vote;

interface VoteRepositoryInterface
{
    public function hasVoted(int $userId, int $jokeId): bool;

    public function vote(int $userId, int $jokeId): void;

    public function unvote(int $userId, int $jokeId): void;

    public function countByJokeId(int $jokeId): int;
}
