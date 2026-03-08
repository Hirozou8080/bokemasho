<?php

namespace App\Application\Joke\UseCases;

use App\Domain\Joke\JokeEntity;
use App\Domain\Joke\JokeRepositoryInterface;

class GetJokeDetailUseCase
{
    public function __construct(
        private JokeRepositoryInterface $jokeRepository,
    ) {}

    public function execute(int $id): JokeEntity
    {
        return $this->jokeRepository->findByIdOrFail($id);
    }
}
