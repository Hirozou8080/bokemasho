<?php

namespace App\Application\Joke\UseCases;

use App\Domain\Joke\JokeEntity;
use App\Domain\Joke\JokeRepositoryInterface;
use App\Models\Category;

class CreateJokeUseCase
{
    public function __construct(
        private JokeRepositoryInterface $jokeRepository,
    ) {}

    public function execute(
        int $userId,
        int $topicId,
        string $content,
        array $categoryNames = []
    ): JokeEntity {
        // カテゴリ名からIDを取得（存在しなければ作成）
        $categoryIds = [];
        foreach ($categoryNames as $categoryName) {
            $category = Category::firstOrCreate(['name' => trim($categoryName)]);
            $categoryIds[] = $category->id;
        }

        $joke = JokeEntity::create(
            userId: $userId,
            topicId: $topicId,
            content: $content,
            categoryIds: $categoryIds,
        );

        return $this->jokeRepository->save($joke);
    }
}
