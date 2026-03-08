<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// Domain Interfaces
use App\Domain\Joke\JokeRepositoryInterface;
use App\Domain\JokeTopic\JokeTopicRepositoryInterface;
use App\Domain\Vote\VoteRepositoryInterface;
use App\Domain\User\UserRepositoryInterface;
use App\Domain\Auth\AuthRepositoryInterface;
use App\Domain\Profile\ProfileRepositoryInterface;

// Infrastructure Implementations
use App\Infrastructure\Persistence\Eloquent\JokeRepository;
use App\Infrastructure\Persistence\Eloquent\JokeTopicRepository;
use App\Infrastructure\Persistence\Eloquent\VoteRepository;
use App\Infrastructure\Persistence\Eloquent\UserRepository;
use App\Infrastructure\Persistence\Eloquent\AuthRepository;
use App\Infrastructure\Persistence\Eloquent\ProfileRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(JokeRepositoryInterface::class, JokeRepository::class);
        $this->app->bind(JokeTopicRepositoryInterface::class, JokeTopicRepository::class);
        $this->app->bind(VoteRepositoryInterface::class, VoteRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(AuthRepositoryInterface::class, AuthRepository::class);
        $this->app->bind(ProfileRepositoryInterface::class, ProfileRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
