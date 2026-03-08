<?php

namespace App\Domain\Joke;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface JokeRepositoryInterface
{
    public function findById(int $id): ?JokeEntity;

    public function findByIdOrFail(int $id): JokeEntity;

    public function findByTopicId(int $topicId, int $perPage = 10): LengthAwarePaginator;

    public function findAll(string $sort = 'latest', ?int $userId = null, int $perPage = 12): LengthAwarePaginator;

    public function save(JokeEntity $joke): JokeEntity;

    public function delete(int $id): void;
}
