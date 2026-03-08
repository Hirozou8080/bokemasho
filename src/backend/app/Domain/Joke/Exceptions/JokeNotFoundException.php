<?php

namespace App\Domain\Joke\Exceptions;

use Exception;

class JokeNotFoundException extends Exception
{
    public function __construct(int $id)
    {
        parent::__construct("Joke with ID {$id} not found");
    }
}
