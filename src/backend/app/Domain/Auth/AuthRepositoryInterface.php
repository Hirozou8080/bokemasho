<?php

namespace App\Domain\Auth;

use App\Models\User;

interface AuthRepositoryInterface
{
    public function findByEmail(string $email): ?User;

    public function create(array $data): User;

    public function deleteTokens(User $user): void;

    public function createToken(User $user): string;

    public function deleteCurrentToken(User $user): void;
}
