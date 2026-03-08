<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\Auth\AuthRepositoryInterface;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthRepository implements AuthRepositoryInterface
{
    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function create(array $data): User
    {
        return User::create([
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }

    public function deleteTokens(User $user): void
    {
        $user->tokens()->delete();
    }

    public function createToken(User $user): string
    {
        return $user->createToken("login:user{$user->id}")->plainTextToken;
    }

    public function deleteCurrentToken(User $user): void
    {
        $token = $user->currentAccessToken();
        if ($token) {
            $token->delete();
        }
    }
}
