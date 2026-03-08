<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\User\UserRepositoryInterface;
use App\Models\User;

class UserRepository implements UserRepositoryInterface
{
    public function findById(int $id): ?array
    {
        $user = User::find($id);

        if (!$user) {
            return null;
        }

        return $user->toArray();
    }
}
