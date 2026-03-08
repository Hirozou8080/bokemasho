<?php

namespace App\Application\Joke\UseCases;

use App\Domain\Vote\VoteRepositoryInterface;

class VoteJokeUseCase
{
    public function __construct(
        private VoteRepositoryInterface $voteRepository,
    ) {}

    public function execute(int $jokeId, int $userId): array
    {
        $hasVoted = $this->voteRepository->hasVoted($userId, $jokeId);

        if ($hasVoted) {
            $this->voteRepository->unvote($userId, $jokeId);
            $hasVoted = false;
        } else {
            $this->voteRepository->vote($userId, $jokeId);
            $hasVoted = true;
        }

        $voteCount = $this->voteRepository->countByJokeId($jokeId);

        return [
            'has_voted' => $hasVoted,
            'vote_count' => $voteCount,
        ];
    }
}
