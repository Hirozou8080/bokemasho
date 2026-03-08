<?php

namespace App\Domain\Joke;

use DateTimeImmutable;

class JokeEntity
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $userId,
        public readonly int $topicId,
        public readonly string $content,
        public readonly int $priority,
        public readonly ?DateTimeImmutable $createdAt = null,
        public readonly ?DateTimeImmutable $updatedAt = null,
        public readonly array $categoryIds = [],
        public readonly int $votesCount = 0,
        public readonly bool $hasVoted = false,
    ) {}

    public static function create(
        int $userId,
        int $topicId,
        string $content,
        array $categoryIds = []
    ): self {
        return new self(
            id: null,
            userId: $userId,
            topicId: $topicId,
            content: $content,
            priority: 0,
            createdAt: new DateTimeImmutable(),
            updatedAt: new DateTimeImmutable(),
            categoryIds: $categoryIds,
        );
    }

    public function belongsTo(int $userId): bool
    {
        return $this->userId === $userId;
    }
}
