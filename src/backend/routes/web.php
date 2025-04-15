<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Password;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// パスワードリセット用の標準ルート
Route::get('/reset-password/{token}', function ($token) {
    return redirect(env('FRONTEND_URL') . '/auth/reset-password?token=' . $token);
})->middleware('guest')->name('password.reset');

Route::post('/reset-password', function (Request $request) {
    // APIルートがあるので必要ない
})->middleware('guest')->name('password.update');
