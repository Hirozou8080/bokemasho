<?php

namespace App\Application\Profile\UseCases;

use App\Models\User;

class GetProfileUseCase
{
    public function execute(User $user): User
    {
        return $user;
    }
}
