<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
  protected $fillable = [
    'user_id',
    'joke_id'
  ];

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function joke()
  {
    return $this->belongsTo(Joke::class);
  }
}
