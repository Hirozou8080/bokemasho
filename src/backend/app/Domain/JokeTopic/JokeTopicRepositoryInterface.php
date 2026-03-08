<?php

namespace App\Domain\JokeTopic;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface JokeTopicRepositoryInterface
{
    public function findById(int $id): ?JokeTopicEntity;

    public function findByIdOrFail(int $id): JokeTopicEntity;

    public function findAll(int $perPage = 12): LengthAwarePaginator;

    public function save(JokeTopicEntity $topic): JokeTopicEntity;

    public function delete(int $id): void;

    public function exists(int $id): bool;
}
