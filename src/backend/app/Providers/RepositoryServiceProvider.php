<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// Domain Interfaces
use App\Domain\Joke\JokeRepositoryInterface;
use App\Domain\JokeTopic\JokeTopicRepositoryInterface;
use App\Domain\Vote\VoteRepositoryInterface;
use App\Domain\User\UserRepositoryInterface;

// Infrastructure Implementations
use App\Infrastructure\Persistence\Eloquent\JokeRepository;
use App\Infrastructure\Persistence\Eloquent\JokeTopicRepository;
use App\Infrastructure\Persistence\Eloquent\VoteRepository;
use App\Infrastructure\Persistence\Eloquent\UserRepository;

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
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
