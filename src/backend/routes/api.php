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
Route::post('/register', 'App\Http\Controllers\Auth\AuthController@register');
Route::post('/login', 'App\Http\Controllers\Auth\AuthController@login');

Route::middleware('auth:sanctum')->get('/user', 'App\Http\Controllers\Auth\AuthController@user');
Route::post('/logout', 'App\Http\Controllers\Auth\AuthController@logout');

// パスワードリセット関連のルーティング
Route::post('/forgot-password', 'App\Http\Controllers\Auth\PasswordResetController@forgotPassword');
Route::post('/reset-password', 'App\Http\Controllers\Auth\PasswordResetController@resetPassword');

// プロフィール関連のルーティング
Route::middleware('auth:sanctum')->group(function () {
  Route::get('/profile', 'App\Http\Controllers\ProfileController@show');
  Route::post('/profile', 'App\Http\Controllers\ProfileController@update');
});

// ボケお題関連のルーティング
Route::get('/bokeh-topics', 'App\Http\Controllers\BokehTopicController@index');
Route::get('/bokeh-topics/{id}', 'App\Http\Controllers\BokehTopicController@show');

// 認証が必要なボケお題ルート
Route::middleware('auth:sanctum')->group(function () {
  Route::post('/bokeh-topics', 'App\Http\Controllers\BokehTopicController@store');
  Route::put('/bokeh-topics/{id}', 'App\Http\Controllers\BokehTopicController@update');
  Route::delete('/bokeh-topics/{id}', 'App\Http\Controllers\BokehTopicController@destroy');
});
