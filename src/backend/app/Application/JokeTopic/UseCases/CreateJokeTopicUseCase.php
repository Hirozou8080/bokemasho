<?php

namespace App\Application\JokeTopic\UseCases;

use App\Domain\JokeTopic\JokeTopicEntity;
use App\Domain\JokeTopic\JokeTopicRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CreateJokeTopicUseCase
{
    public function __construct(
        private JokeTopicRepositoryInterface $jokeTopicRepository,
    ) {}

    public function execute(int $userId, UploadedFile $image): JokeTopicEntity
    {
        $imagePath = $image->store('joke_topics', 'public');

        $topic = JokeTopicEntity::create(
            userId: $userId,
            imagePath: $imagePath,
        );

        return $this->jokeTopicRepository->save($topic);
    }
}
