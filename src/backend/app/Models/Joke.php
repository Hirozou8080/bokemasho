<?php

namespace App\Models;

use Illuminate\Database\Eloquent\{
    Factories\HasFactory,
    Model,
    SoftDeletes
};

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

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    public function hasVotedBy(User $user)
    {
        return $this->votes()->where('user_id', $user->id)->exists();
    }

    /**
     * このボケに紐づくカテゴリ
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'joke_category');
    }
}
