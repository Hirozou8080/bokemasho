<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\JokeTopic\JokeTopicEntity;
use App\Domain\JokeTopic\JokeTopicRepositoryInterface;
use App\Domain\JokeTopic\Exceptions\JokeTopicNotFoundException;
use App\Models\JokeTopic;
use DateTimeImmutable;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class JokeTopicRepository implements JokeTopicRepositoryInterface
{
    public function findById(int $id): ?JokeTopicEntity
    {
        $model = JokeTopic::with('user')->find($id);

        if (!$model) {
            return null;
        }

        return $this->toEntity($model);
    }

    public function findByIdOrFail(int $id): JokeTopicEntity
    {
        $entity = $this->findById($id);

        if (!$entity) {
            throw new JokeTopicNotFoundException($id);
        }

        return $entity;
    }

    public function findAll(int $perPage = 12): LengthAwarePaginator
    {
        return JokeTopic::with('user')
            ->orderBy('priority', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function save(JokeTopicEntity $topic): JokeTopicEntity
    {
        $model = $topic->id
            ? JokeTopic::findOrFail($topic->id)
            : new JokeTopic();

        $model->user_id = $topic->userId;
        $model->image_path = $topic->imagePath;
        $model->priority = $topic->priority;
        $model->save();

        $model->load('user');

        return $this->toEntity($model);
    }

    public function delete(int $id): void
    {
        JokeTopic::findOrFail($id)->delete();
    }

    public function exists(int $id): bool
    {
        return JokeTopic::where('id', $id)->exists();
    }

    private function toEntity(JokeTopic $model): JokeTopicEntity
    {
        return new JokeTopicEntity(
            id: $model->id,
            userId: $model->user_id,
            imagePath: $model->image_path,
            priority: $model->priority,
            createdAt: $model->created_at ? new DateTimeImmutable($model->created_at) : null,
            updatedAt: $model->updated_at ? new DateTimeImmutable($model->updated_at) : null,
        );
    }
}
