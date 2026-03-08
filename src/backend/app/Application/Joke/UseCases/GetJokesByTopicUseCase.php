<?php

namespace App\Application\Joke\UseCases;

use App\Domain\Joke\JokeRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetJokesByTopicUseCase
{
    public function __construct(
        private JokeRepositoryInterface $jokeRepository,
    ) {}

    public function execute(int $topicId, int $perPage = 10): LengthAwarePaginator
    {
        return $this->jokeRepository->findByTopicId($topicId, $perPage);
    }
}
