<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    /**
     * カテゴリ一覧を取得（サジェスト用）
     */
    public function index(Request $request)
    {
        try {
            $query = Category::query();

            // 検索キーワードがある場合は部分一致でフィルタ
            if ($search = $request->query('search')) {
                $query->where('name', 'like', '%' . $search . '%');
            }

            $categories = $query->orderBy('name')->limit(20)->get();

            return response()->json([
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            Log::error('カテゴリ一覧取得エラー: ' . $e->getMessage());
            return response()->json(['message' => 'カテゴリ一覧の取得に失敗しました'], 500);
        }
    }
}
