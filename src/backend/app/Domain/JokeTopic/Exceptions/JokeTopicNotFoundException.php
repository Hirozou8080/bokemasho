<?php

namespace App\Domain\JokeTopic\Exceptions;

use Exception;

class JokeTopicNotFoundException extends Exception
{
    public function __construct(int $id)
    {
        parent::__construct("JokeTopic with ID {$id} not found");
    }
}
