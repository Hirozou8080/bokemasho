<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    /**
     * このカテゴリに紐づくボケ
     */
    public function jokes()
    {
        return $this->belongsToMany(Joke::class, 'joke_category');
    }
}
