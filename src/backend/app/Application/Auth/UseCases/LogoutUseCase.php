<?php

namespace App\Application\Auth\UseCases;

use App\Domain\Auth\AuthRepositoryInterface;
use App\Models\User;

class LogoutUseCase
{
    public function __construct(
        private AuthRepositoryInterface $authRepository,
    ) {}

    public function execute(?User $user): void
    {
        if ($user) {
            $this->authRepository->deleteCurrentToken($user);
        }
    }
}
