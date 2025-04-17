<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Joke extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'topic_id',
        'content',
        'priority',
    ];

    /**
     * ボケを投稿したユーザー
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * このボケが紐づくお題
     */
    public function topic()
    {
        return $this->belongsTo(JokeTopic::class, 'topic_id');
    }
}
