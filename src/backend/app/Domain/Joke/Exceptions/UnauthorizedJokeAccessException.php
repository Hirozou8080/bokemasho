<?php

namespace App\Domain\Joke\Exceptions;

use Exception;

class UnauthorizedJokeAccessException extends Exception
{
    public function __construct(string $action = 'access')
    {
        parent::__construct("You are not authorized to {$action} this joke");
    }
}
