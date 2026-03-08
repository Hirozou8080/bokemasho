<?php

namespace App\Application\JokeTopic\UseCases;

use App\Domain\JokeTopic\JokeTopicEntity;
use App\Domain\JokeTopic\JokeTopicRepositoryInterface;
use App\Domain\JokeTopic\Exceptions\UnauthorizedJokeTopicAccessException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UpdateJokeTopicUseCase
{
    public function __construct(
        private JokeTopicRepositoryInterface $jokeTopicRepository,
    ) {}

    public function execute(
        int $id,
        int $userId,
        ?UploadedFile $image = null,
        ?int $priority = null
    ): JokeTopicEntity {
        $topic = $this->jokeTopicRepository->findByIdOrFail($id);

        if (!$topic->belongsTo($userId)) {
            throw new UnauthorizedJokeTopicAccessException('update');
        }

        // 画像の更新
        if ($image) {
            // 古い画像を削除
            if ($topic->imagePath) {
                Storage::disk('public')->delete($topic->imagePath);
            }
            $newImagePath = $image->store('joke_topics', 'public');
            $topic = $topic->withImagePath($newImagePath);
        }

        // priorityの更新
        if ($priority !== null) {
            $topic = $topic->withPriority($priority);
        }

        return $this->jokeTopicRepository->save($topic);
    }
}
