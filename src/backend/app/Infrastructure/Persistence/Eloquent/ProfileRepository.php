<?php

namespace App\Infrastructure\Persistence\Eloquent;

use App\Domain\Profile\ProfileRepositoryInterface;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class ProfileRepository implements ProfileRepositoryInterface
{
    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    public function update(int $userId, array $data): User
    {
        User::where('id', $userId)->update($data);
        return User::find($userId);
    }

    public function storeIcon(mixed $file): string
    {
        return $file->store('icons', 'public');
    }

    public function deleteIcon(string $path): void
    {
        Storage::disk('public')->delete($path);
    }
}
