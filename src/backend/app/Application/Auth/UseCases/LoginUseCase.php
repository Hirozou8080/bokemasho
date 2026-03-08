<?php

namespace App\Application\Auth\UseCases;

use App\Domain\Auth\AuthRepositoryInterface;
use App\Domain\Auth\Exceptions\InvalidCredentialsException;
use App\Domain\Auth\Exceptions\EmailNotVerifiedException;
use Illuminate\Support\Facades\Hash;

class LoginUseCase
{
    public function __construct(
        private AuthRepositoryInterface $authRepository,
    ) {}

    public function execute(string $email, string $password): array
    {
        $user = $this->authRepository->findByEmail($email);

        if (!$user || !Hash::check($password, $user->password)) {
            throw new InvalidCredentialsException();
        }

        if (!$user->hasVerifiedEmail()) {
            throw new EmailNotVerifiedException();
        }

        // 既存トークンを削除
        $this->authRepository->deleteTokens($user);

        // 新しいトークンを発行
        $token = $this->authRepository->createToken($user);

        return [
            'token' => $token,
            'user' => $user,
        ];
    }
}
