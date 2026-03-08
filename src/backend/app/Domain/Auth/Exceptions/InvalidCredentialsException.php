<?php

namespace App\Domain\Auth\Exceptions;

use Exception;

class InvalidCredentialsException extends Exception
{
    public function __construct()
    {
        parent::__construct('認証情報が記録と一致しません。');
    }
}
