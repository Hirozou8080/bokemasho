<?php

namespace App\Domain\Auth\Exceptions;

use Exception;

class EmailNotVerifiedException extends Exception
{
    public function __construct()
    {
        parent::__construct('メールアドレスが確認されていません。メールに送信された確認リンクをクリックしてください。');
    }
}
