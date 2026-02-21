<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'bio',
        'icon_path',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'email' => 'encrypted',
    ];

    protected $appends = ['icon_url'];

    /**
     * ユーザーが投稿したボケお題
     */
    public function jokeTopics()
    {
        return $this->hasMany(JokeTopic::class);
    }

    /**
     * アイコンのフルURLを取得
     * icon_pathが設定されていない場合はnullを返す（フロントエンドでデフォルト画像を設定）
     */
    public function getIconUrlAttribute(): ?string
    {
        if ($this->icon_path) {
            return asset('storage/' . $this->icon_path);
        }
        return null;
    }
}
