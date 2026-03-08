<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use App\Models\Category;
use App\Models\JokeTopic;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Database\Eloquent\{
    Factories\HasFactory,
    Model,
    SoftDeletes
};

class JokeModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'jokes';

    protected $fillable = [
        'user_id',
        'topic_id',
        'content',
        'priority',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function topic()
    {
        return $this->belongsTo(JokeTopic::class, 'topic_id');
    }

    public function votes()
    {
        return $this->hasMany(Vote::class, 'joke_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'joke_category', 'joke_id', 'category_id');
    }
}
