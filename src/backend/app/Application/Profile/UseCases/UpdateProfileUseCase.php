<?php

namespace App\Application\Profile\UseCases;

use App\Domain\Profile\ProfileRepositoryInterface;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class UpdateProfileUseCase
{
    public function __construct(
        private ProfileRepositoryInterface $profileRepository,
    ) {}

    public function execute(
        User $user,
        ?string $username = null,
        ?string $bio = null,
        ?UploadedFile $icon = null
    ): User {
        $updateData = [];

        if ($username !== null) {
            $updateData['username'] = $username;
        }

        if ($bio !== null) {
            $updateData['bio'] = $bio;
        }

        $oldIconPath = null;

        if ($icon !== null) {
            $oldIconPath = $user->icon_path;

            $iconPath = $this->profileRepository->storeIcon($icon);
            if ($iconPath === false) {
                Log::error('Failed to store icon file');
                throw new \RuntimeException('アイコンの保存に失敗しました');
            }

            $updateData['icon_path'] = $iconPath;
            Log::info('Icon saved successfully', ['path' => $iconPath]);
        }

        if (empty($updateData)) {
            return $user;
        }

        $updatedUser = $this->profileRepository->update($user->id, $updateData);

        // DB更新成功後に古いアイコンを削除
        if ($oldIconPath) {
            $this->profileRepository->deleteIcon($oldIconPath);
            Log::info('Old icon deleted', ['path' => $oldIconPath]);
        }

        return $updatedUser;
    }
}
