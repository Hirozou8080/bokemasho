<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\JokeTopic\CreateJokeTopicRequest;
use App\Http\Requests\JokeTopic\UpdateJokeTopicRequest;
use App\Application\JokeTopic\UseCases\CreateJokeTopicUseCase;
use App\Application\JokeTopic\UseCases\DeleteJokeTopicUseCase;
use App\Application\JokeTopic\UseCases\GetJokeTopicListUseCase;
use App\Application\JokeTopic\UseCases\UpdateJokeTopicUseCase;
use App\Domain\JokeTopic\Exceptions\JokeTopicNotFoundException;
use App\Domain\JokeTopic\Exceptions\UnauthorizedJokeTopicAccessException;
use App\Models\JokeTopic;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class JokeTopicController extends Controller
{
    public function __construct(
        private GetJokeTopicListUseCase $getJokeTopicListUseCase,
        private CreateJokeTopicUseCase $createJokeTopicUseCase,
        private UpdateJokeTopicUseCase $updateJokeTopicUseCase,
        private DeleteJokeTopicUseCase $deleteJokeTopicUseCase,
    ) {}

    public function index(): JsonResponse
    {
        $topics = $this->getJokeTopicListUseCase->execute();

        return response()->json(['data' => $topics]);
    }

    public function show(int $id): JsonResponse
    {
        $topic = JokeTopic::with('user')->find($id);

        if (!$topic) {
            return response()->json(['message' => 'お題が見つかりません'], 404);
        }

        return response()->json(['data' => $topic]);
    }

    public function store(CreateJokeTopicRequest $request): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => '認証が必要です'], 401);
        }

        try {
            $topic = $this->createJokeTopicUseCase->execute(
                userId: $user->id,
                image: $request->file('image'),
            );

            return response()->json([
                'message' => 'お題を投稿しました',
                'data' => $topic,
            ], 201);
        } catch (\Exception $e) {
            Log::error('ボケお題投稿エラー: ' . $e->getMessage());
            return response()->json(['message' => 'お題の投稿に失敗しました'], 500);
        }
    }

    public function update(UpdateJokeTopicRequest $request, int $id): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => '認証が必要です'], 401);
        }

        try {
            $topic = $this->updateJokeTopicUseCase->execute(
                id: $id,
                userId: $user->id,
                image: $request->file('image'),
                priority: $request->priority,
            );

            return response()->json([
                'message' => 'お題を更新しました',
                'data' => $topic,
            ]);
        } catch (JokeTopicNotFoundException $e) {
            return response()->json(['message' => 'お題が見つかりません'], 404);
        } catch (UnauthorizedJokeTopicAccessException $e) {
            return response()->json(['message' => '更新権限がありません'], 403);
        } catch (\Exception $e) {
            Log::error('ボケお題更新エラー: ' . $e->getMessage());
            return response()->json(['message' => 'お題の更新に失敗しました'], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => '認証が必要です'], 401);
        }

        try {
            $this->deleteJokeTopicUseCase->execute($id, $user->id);

            return response()->json(['message' => 'お題を削除しました']);
        } catch (JokeTopicNotFoundException $e) {
            return response()->json(['message' => 'お題が見つかりません'], 404);
        } catch (UnauthorizedJokeTopicAccessException $e) {
            return response()->json(['message' => '削除権限がありません'], 403);
        } catch (\Exception $e) {
            Log::error('ボケお題削除エラー: ' . $e->getMessage());
            return response()->json(['message' => 'お題の削除に失敗しました'], 500);
        }
    }
}
