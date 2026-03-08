<?php

namespace App\Domain\JokeTopic;

use DateTimeImmutable;

class JokeTopicEntity
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $userId,
        public readonly ?string $imagePath,
        public readonly int $priority,
        public readonly ?DateTimeImmutable $createdAt = null,
        public readonly ?DateTimeImmutable $updatedAt = null,
    ) {}

    public static function create(
        int $userId,
        string $imagePath,
    ): self {
        return new self(
            id: null,
            userId: $userId,
            imagePath: $imagePath,
            priority: 0,
            createdAt: new DateTimeImmutable(),
            updatedAt: new DateTimeImmutable(),
        );
    }

    public function belongsTo(int $userId): bool
    {
        return $this->userId === $userId;
    }

    public function withImagePath(string $imagePath): self
    {
        return new self(
            id: $this->id,
            userId: $this->userId,
            imagePath: $imagePath,
            priority: $this->priority,
            createdAt: $this->createdAt,
            updatedAt: new DateTimeImmutable(),
        );
    }

    public function withPriority(int $priority): self
    {
        return new self(
            id: $this->id,
            userId: $this->userId,
            imagePath: $this->imagePath,
            priority: $priority,
            createdAt: $this->createdAt,
            updatedAt: new DateTimeImmutable(),
        );
    }
}
