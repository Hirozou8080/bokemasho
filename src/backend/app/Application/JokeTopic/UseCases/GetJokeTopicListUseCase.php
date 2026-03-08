<?php

namespace App\Application\JokeTopic\UseCases;

use App\Domain\JokeTopic\JokeTopicRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetJokeTopicListUseCase
{
    public function __construct(
        private JokeTopicRepositoryInterface $jokeTopicRepository,
    ) {}

    public function execute(int $perPage = 12): LengthAwarePaginator
    {
        return $this->jokeTopicRepository->findAll($perPage);
    }
}
