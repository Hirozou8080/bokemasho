<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
// ログインと新規登録のルーティング
Route::post('/register', 'App\Http\Controllers\Api\Auth\AuthController@register');
Route::post('/login', 'App\Http\Controllers\Api\Auth\AuthController@login');

Route::middleware('auth:sanctum')->get('/user', 'App\Http\Controllers\Api\Auth\AuthController@user');
Route::post('/logout', 'App\Http\Controllers\Api\Auth\AuthController@logout');

// パスワードリセット関連のルーティング
Route::post('/forgot-password', 'App\Http\Controllers\Auth\PasswordResetController@forgotPassword');
Route::post('/reset-password', 'App\Http\Controllers\Auth\PasswordResetController@resetPassword');

// メール確認関連のルーティング
Route::get('/email/verify/{id}/{hash}', 'App\Http\Controllers\Auth\EmailVerificationController@verify')
    ->name('verification.verify');
Route::post('/email/resend', 'App\Http\Controllers\Auth\EmailVerificationController@resend')
    ->name('verification.resend');

// プロフィール関連のルーティング
Route::middleware('auth:sanctum')->group(function () {
  Route::get('/profile', 'App\Http\Controllers\Api\ProfileController@show');
  Route::post('/profile', 'App\Http\Controllers\Api\ProfileController@update');
});

// ボケお題関連のルーティング
Route::get('/joke-topics', 'App\Http\Controllers\Api\JokeTopicController@index');
Route::get('/joke-topics/{id}', 'App\Http\Controllers\Api\JokeTopicController@show');

// 認証が必要なボケお題ルート
Route::middleware('auth:sanctum')->group(function () {
  Route::post('/joke-topics', 'App\Http\Controllers\Api\JokeTopicController@store');
  Route::put('/joke-topics/{id}', 'App\Http\Controllers\Api\JokeTopicController@update');
  Route::delete('/joke-topics/{id}', 'App\Http\Controllers\Api\JokeTopicController@destroy');
});

// カテゴリ関連のルーティング
Route::get('/categories', 'App\Http\Controllers\CategoryController@index');

// ボケ関連のルーティング
Route::get('/jokes', 'App\Http\Controllers\Api\JokeController@index');
Route::get('/jokes/{id}', 'App\Http\Controllers\Api\JokeController@show');
Route::get('/topics/{topicId}/jokes', 'App\Http\Controllers\Api\JokeController@getByTopic');

// 認証が必要なボケ関連ルート
Route::middleware('auth:sanctum')->group(function () {
  Route::post('/jokes/create', 'App\Http\Controllers\Api\JokeController@create');
  Route::delete('/jokes/{id}', 'App\Http\Controllers\Api\JokeController@destroy');
  Route::post('/jokes/{id}/vote', 'App\Http\Controllers\Api\JokeController@vote');
});
