<?php

namespace App\Application\JokeTopic\UseCases;

use App\Domain\JokeTopic\JokeTopicEntity;
use App\Domain\JokeTopic\JokeTopicRepositoryInterface;

class GetJokeTopicDetailUseCase
{
    public function __construct(
        private JokeTopicRepositoryInterface $jokeTopicRepository,
    ) {}

    public function execute(int $id): JokeTopicEntity
    {
        return $this->jokeTopicRepository->findByIdOrFail($id);
    }
}
