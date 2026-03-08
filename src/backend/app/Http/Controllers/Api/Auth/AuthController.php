<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Application\Auth\UseCases\LoginUseCase;
use App\Application\Auth\UseCases\LogoutUseCase;
use App\Application\Auth\UseCases\RegisterUseCase;
use App\Domain\Auth\Exceptions\InvalidCredentialsException;
use App\Domain\Auth\Exceptions\EmailNotVerifiedException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        private LoginUseCase $loginUseCase,
        private LogoutUseCase $logoutUseCase,
        private RegisterUseCase $registerUseCase,
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->loginUseCase->execute(
                $request->email,
                $request->password
            );

            return response()->json([
                'token' => $result['token'],
                'user' => $result['user'],
            ], 200);
        } catch (InvalidCredentialsException $e) {
            throw ValidationException::withMessages([
                'email' => [$e->getMessage()],
            ]);
        } catch (EmailNotVerifiedException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'email_verified' => false,
            ], 403);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        $this->logoutUseCase->execute($request->user());

        return response()->json(['message' => 'ログアウトしました'], 200);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json(['user' => $request->user()]);
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = $this->registerUseCase->execute(
            $request->username,
            $request->email,
            $request->password
        );

        return response()->json([
            'message' => '登録が完了しました。メールアドレスに送信された確認リンクをクリックしてください。',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
            ],
        ], 201);
    }
}
