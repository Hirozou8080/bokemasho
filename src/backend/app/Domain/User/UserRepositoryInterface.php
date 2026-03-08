<?php

namespace App\Domain\User;

interface UserRepositoryInterface
{
    public function findById(int $id): ?array;
}
