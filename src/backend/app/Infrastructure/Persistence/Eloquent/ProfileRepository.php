<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\Profile\ProfileRepositoryInterface;
use App\Models\User;

class ProfileRepository implements ProfileRepositoryInterface
{
    public function update(int $userId, array $data): User
    {
        User::where('id', $userId)->update($data);

        return User::find($userId);
    }

    public function findById(int $id): ?User
    {
        return User::find($id);
    }
}
