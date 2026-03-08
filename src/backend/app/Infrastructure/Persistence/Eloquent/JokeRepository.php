<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\Joke\JokeEntity;
use App\Domain\Joke\JokeRepositoryInterface;
use App\Domain\Joke\Exceptions\JokeNotFoundException;
use App\Infrastructure\Persistence\Eloquent\Models\JokeModel;
use App\Models\Category;
use DateTimeImmutable;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class JokeRepository implements JokeRepositoryInterface
{
    public function findById(int $id): ?JokeEntity
    {
        $model = JokeModel::with(['user', 'topic', 'categories'])->find($id);

        if (!$model) {
            return null;
        }

        return $this->toEntity($model);
    }

    public function findByIdOrFail(int $id): JokeEntity
    {
        $entity = $this->findById($id);

        if (!$entity) {
            throw new JokeNotFoundException($id);
        }

        return $entity;
    }

    public function findByTopicId(int $topicId, int $perPage = 10): LengthAwarePaginator
    {
        return JokeModel::with(['user', 'categories'])
            ->where('topic_id', $topicId)
            ->orderBy('priority', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function findAll(string $sort = 'latest', ?int $userId = null, int $perPage = 12): LengthAwarePaginator
    {
        $query = JokeModel::with(['user', 'topic', 'categories', 'votes'])
            ->withCount('votes');

        if ($sort === 'popular') {
            $oneWeekAgo = now()->subWeek();
            $query->withCount(['votes as weekly_votes_count' => function ($q) use ($oneWeekAgo) {
                $q->where('created_at', '>=', $oneWeekAgo);
            }])
                ->orderBy('weekly_votes_count', 'desc')
                ->orderBy('created_at', 'desc');
        } elseif ($sort === 'ranking') {
            $query->orderBy('votes_count', 'desc')
                ->orderBy('created_at', 'desc');
        } else {
            $query->orderBy('priority', 'desc')
                ->orderBy('created_at', 'desc');
        }

        $paginator = $query->paginate($perPage);

        // has_votedフラグを追加
        $paginator->getCollection()->transform(function ($joke) use ($userId) {
            $joke->has_voted = $userId
                ? $joke->votes->contains('user_id', $userId)
                : false;
            return $joke;
        });

        return $paginator;
    }

    public function save(JokeEntity $joke): JokeEntity
    {
        $model = $joke->id
            ? JokeModel::findOrFail($joke->id)
            : new JokeModel();

        $model->user_id = $joke->userId;
        $model->topic_id = $joke->topicId;
        $model->content = $joke->content;
        $model->priority = $joke->priority;
        $model->save();

        // カテゴリの同期
        if (!empty($joke->categoryIds)) {
            $model->categories()->sync($joke->categoryIds);
        }

        $model->load(['user', 'categories']);

        return $this->toEntity($model);
    }

    public function delete(int $id): void
    {
        JokeModel::findOrFail($id)->delete();
    }

    private function toEntity(JokeModel $model): JokeEntity
    {
        return new JokeEntity(
            id: $model->id,
            userId: $model->user_id,
            topicId: $model->topic_id,
            content: $model->content,
            priority: $model->priority,
            createdAt: $model->created_at ? new DateTimeImmutable($model->created_at) : null,
            updatedAt: $model->updated_at ? new DateTimeImmutable($model->updated_at) : null,
            categoryIds: $model->categories->pluck('id')->toArray(),
            votesCount: $model->votes_count ?? 0,
        );
    }
}
