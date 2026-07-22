<?php

namespace App\Exceptions;

use RuntimeException;

class SlotUnavailableException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('This time slot was just taken. Please pick another one.');
    }
}
