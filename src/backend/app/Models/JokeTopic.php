<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JokeTopic extends Model
{
  use HasFactory, SoftDeletes;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'user_id',
    'image_path',
    'priority',
  ];

  /**
   * ボケお題を投稿したユーザー
   */
  public function user()
  {
    return $this->belongsTo(User::class);
  }
}
