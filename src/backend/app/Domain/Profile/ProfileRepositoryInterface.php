<?php

namespace App\Domain\Profile;

use App\Models\User;

interface ProfileRepositoryInterface
{
    public function update(int $userId, array $data): User;

    public function findById(int $id): ?User;
}
