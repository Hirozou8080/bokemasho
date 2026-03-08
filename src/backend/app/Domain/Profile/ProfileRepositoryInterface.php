<?php

namespace App\Domain\Profile;

use App\Models\User;

interface ProfileRepositoryInterface
{
    public function findById(int $id): ?User;

    public function update(int $userId, array $data): User;

    public function storeIcon(mixed $file): string;

    public function deleteIcon(string $path): void;
}
