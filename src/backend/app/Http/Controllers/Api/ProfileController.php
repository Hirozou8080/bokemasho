<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Application\Profile\UseCases\GetProfileUseCase;
use App\Application\Profile\UseCases\UpdateProfileUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    public function __construct(
        private GetProfileUseCase $getProfileUseCase,
        private UpdateProfileUseCase $updateProfileUseCase,
    ) {}

    public function show(): UserResource
    {
        $user = Auth::user();
        $result = $this->getProfileUseCase->execute($user);

        return new UserResource($result);
    }

    public function update(UpdateProfileRequest $request): UserResource|JsonResponse
    {
        Log::info('ProfileController@update started');
        $user = Auth::user();

        if ($request->hasFile('icon')) {
            $file = $request->file('icon');
            Log::info('Icon file info', [
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'is_valid' => $file->isValid(),
                'error' => $file->getError(),
            ]);
        }

        try {
            $updatedUser = $this->updateProfileUseCase->execute(
                user: $user,
                username: $request->has('username') ? $request->username : null,
                bio: $request->has('bio') ? $request->bio : null,
                icon: $request->file('icon'),
            );

            return new UserResource($updatedUser);
        } catch (\RuntimeException $e) {
            Log::error('Profile update error', ['error' => $e->getMessage()]);
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
