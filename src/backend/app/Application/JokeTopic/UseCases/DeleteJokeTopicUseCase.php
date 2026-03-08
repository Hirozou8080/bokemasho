<?php

namespace App\Application\JokeTopic\UseCases;

use App\Domain\JokeTopic\JokeTopicRepositoryInterface;
use App\Domain\JokeTopic\Exceptions\UnauthorizedJokeTopicAccessException;
use Illuminate\Support\Facades\Storage;

class DeleteJokeTopicUseCase
{
    public function __construct(
        private JokeTopicRepositoryInterface $jokeTopicRepository,
    ) {}

    public function execute(int $id, int $userId): void
    {
        $topic = $this->jokeTopicRepository->findByIdOrFail($id);

        if (!$topic->belongsTo($userId)) {
            throw new UnauthorizedJokeTopicAccessException('delete');
        }

        // 画像も削除
        if ($topic->imagePath) {
            Storage::disk('public')->delete($topic->imagePath);
        }

        $this->jokeTopicRepository->delete($id);
    }
}
