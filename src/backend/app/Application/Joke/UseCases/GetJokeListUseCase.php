<?php

namespace App\Application\Joke\UseCases;

use App\Domain\Joke\JokeRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetJokeListUseCase
{
    public function __construct(
        private JokeRepositoryInterface $jokeRepository,
    ) {}

    public function execute(
        string $sort = 'latest',
        ?int $userId = null,
        int $perPage = 12
    ): LengthAwarePaginator {
        return $this->jokeRepository->findAll($sort, $userId, $perPage);
    }
}
