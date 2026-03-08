<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Joke\CreateJokeRequest;
use App\Application\Joke\UseCases\CreateJokeUseCase;
use App\Application\Joke\UseCases\DeleteJokeUseCase;
use App\Application\Joke\UseCases\GetJokeDetailUseCase;
use App\Application\Joke\UseCases\GetJokeListUseCase;
use App\Application\Joke\UseCases\GetJokesByTopicUseCase;
use App\Application\Joke\UseCases\VoteJokeUseCase;
use App\Domain\Joke\Exceptions\JokeNotFoundException;
use App\Domain\Joke\Exceptions\UnauthorizedJokeAccessException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class JokeController extends Controller
{
    public function __construct(
        private CreateJokeUseCase $createJokeUseCase,
        private GetJokeListUseCase $getJokeListUseCase,
        private GetJokeDetailUseCase $getJokeDetailUseCase,
        private GetJokesByTopicUseCase $getJokesByTopicUseCase,
        private DeleteJokeUseCase $deleteJokeUseCase,
        private VoteJokeUseCase $voteJokeUseCase,
    ) {}

    public function create(CreateJokeRequest $request): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => '認証が必要です'], 401);
        }

        try {
            $joke = $this->createJokeUseCase->execute(
                userId: $user->id,
                topicId: $request->topic_id,
                content: $request->content,
                categoryNames: $request->categories ?? [],
            );

            return response()->json([
                'message' => 'ボケを投稿しました',
                'data' => $joke,
            ], 201);
        } catch (\Exception $e) {
            Log::error('ボケ投稿エラー: ' . $e->getMessage());
            return response()->json(['message' => 'ボケの投稿に失敗しました'], 500);
        }
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $jokes = $this->getJokeListUseCase->execute(
                sort: $request->query('sort', 'latest'),
                userId: $request->query('user_id'),
            );

            return response()->json(['data' => $jokes]);
        } catch (\Exception $e) {
            Log::error('ボケ一覧取得エラー: ' . $e->getMessage());
            return response()->json(['message' => 'ボケ一覧の取得に失敗しました'], 500);
        }
    }

    public function getByTopic(int $topicId): JsonResponse
    {
        try {
            $jokes = $this->getJokesByTopicUseCase->execute($topicId);

            return response()->json(['data' => $jokes]);
        } catch (\Exception $e) {
            Log::error('ボケ一覧取得エラー: ' . $e->getMessage());
            return response()->json(['message' => 'ボケ一覧の取得に失敗しました'], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $joke = $this->getJokeDetailUseCase->execute($id);

            return response()->json(['data' => $joke]);
        } catch (JokeNotFoundException $e) {
            return response()->json(['message' => 'ボケが見つかりません'], 404);
        } catch (\Exception $e) {
            Log::error('ボケ詳細取得エラー: ' . $e->getMessage());
            return response()->json(['message' => 'ボケの取得に失敗しました'], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => '認証が必要です'], 401);
        }

        try {
            $this->deleteJokeUseCase->execute($id, $user->id);

            return response()->json(['message' => 'ボケを削除しました']);
        } catch (JokeNotFoundException $e) {
            return response()->json(['message' => 'ボケが見つかりません'], 404);
        } catch (UnauthorizedJokeAccessException $e) {
            return response()->json(['message' => '削除権限がありません'], 403);
        } catch (\Exception $e) {
            Log::error('ボケ削除エラー: ' . $e->getMessage());
            return response()->json(['message' => 'ボケの削除に失敗しました'], 500);
        }
    }

    public function vote(int $jokeId): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => '認証が必要です'], 401);
        }

        try {
            $result = $this->voteJokeUseCase->execute($jokeId, $user->id);

            return response()->json([
                'message' => $result['has_voted'] ? 'ボケに投票しました' : '投票を取り消しました',
                'vote_count' => $result['vote_count'],
                'has_voted' => $result['has_voted'],
            ]);
        } catch (\Exception $e) {
            Log::error('ボケ投票エラー: ' . $e->getMessage());
            return response()->json(['message' => 'ボケへの投票に失敗しました'], 500);
        }
    }
}
