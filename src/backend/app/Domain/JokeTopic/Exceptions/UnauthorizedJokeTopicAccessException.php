<?php

namespace App\Domain\JokeTopic\Exceptions;

use Exception;

class UnauthorizedJokeTopicAccessException extends Exception
{
    public function __construct(string $action = 'access')
    {
        parent::__construct("You are not authorized to {$action} this joke topic");
    }
}
