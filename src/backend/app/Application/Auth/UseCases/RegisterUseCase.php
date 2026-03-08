<?php

namespace App\Application\Auth\UseCases;

use App\Domain\Auth\AuthRepositoryInterface;
use App\Models\User;

class RegisterUseCase
{
    public function __construct(
        private AuthRepositoryInterface $authRepository,
    ) {}

    public function execute(string $username, string $email, string $password): User
    {
        $user = $this->authRepository->create([
            'username' => $username,
            'email' => $email,
            'password' => $password,
        ]);

        // メール確認用の通知を送信
        $user->sendEmailVerificationNotification();

        return $user;
    }
}
