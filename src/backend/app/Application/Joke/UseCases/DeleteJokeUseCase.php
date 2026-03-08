<?php

namespace App\Application\Joke\UseCases;

use App\Domain\Joke\JokeRepositoryInterface;
use App\Domain\Joke\Exceptions\UnauthorizedJokeAccessException;

class DeleteJokeUseCase
{
    public function __construct(
        private JokeRepositoryInterface $jokeRepository,
    ) {}

    public function execute(int $jokeId, int $userId): void
    {
        $joke = $this->jokeRepository->findByIdOrFail($jokeId);

        if (!$joke->belongsTo($userId)) {
            throw new UnauthorizedJokeAccessException('delete');
        }

        $this->jokeRepository->delete($jokeId);
    }
}
