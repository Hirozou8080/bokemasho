# CLAUDE.md

このファイルはClaude Codeがこのリポジトリで作業する際のガイダンスを提供します。

## 重要なルール

### 1. 作業開始時は必ずdocフォルダを確認する

**開発や質問への回答を行う前に、必ず以下のドキュメントを確認すること:**

```
doc/
├── README.md              # プロジェクト概要
├── architecture/          # 技術スタック・アーキテクチャ
│   ├── README.md
│   ├── frontend.md
│   └── backend.md
├── DB/                    # データベース設計
│   └── README.md
├── screens/               # 画面一覧・API対応表
│   └── README.md
├── api/                   # API仕様書
│   └── README.md
└── features/              # 機能一覧
    └── README.md
```

特に重要:
- **画面・コンポーネント関連:** `doc/screens/README.md`
- **API関連:** `doc/api/README.md`
- **DB関連:** `doc/DB/README.md`
- **アーキテクチャ関連:** `doc/architecture/`

### 2. ソースコード変更時はdocも必ず更新する

**以下の変更を行った場合、対応するドキュメントを必ず更新すること:**

| 変更内容 | 更新するドキュメント |
|---------|---------------------|
| 新しい画面/ページ追加 | `doc/screens/README.md` |
| API呼び出しの追加・変更 | `doc/screens/README.md`, `doc/api/README.md` |
| 新しいAPIエンドポイント追加 | `doc/api/README.md` |
| DBテーブル追加・変更 | `doc/DB/` 配下の該当ファイル |
| コンポーネント追加・変更 | `doc/architecture/frontend.md` |
| 新しいパッケージ追加 | `doc/architecture/README.md` |
| 新機能追加 | `doc/features/README.md` |

**これは必須であり、省略してはならない。**

### 3. PR作成時のルール

**PRを作成する際は、必ず`.github/PULL_REQUEST_TEMPLATE.md`のテンプレートに従うこと:**

1. **概要**: 変更内容を簡潔に説明
2. **変更種別**: 該当するものにチェック（新機能、バグ修正、リファクタリング等）
3. **変更内容**: 変更の詳細を箇条書きで記載
4. **関連Issue**: 関連するIssueがあれば記載
5. **テスト方法**: 動作確認の手順を具体的に記載
6. **チェックリスト**: 該当項目にチェック
7. **スクリーンショット**: UI変更がある場合は添付

**PRのベースブランチ:**
- 通常の機能開発: `develop`
- 緊急のバグ修正: `master`（要確認）

---

## プロジェクト概要

「ボケ魔性」- 参加型お笑いプラットフォーム。ユーザーがボケお題を投稿し、それに対してボケを投稿・投票できるサービス。

## 技術スタック

### フロントエンド (src/frontend/)
- **フレームワーク:** Next.js 14 (App Router)
- **言語:** TypeScript 5
- **UI:** MUI (Material-UI) 7.0.1, Emotion
- **CSS:** Tailwind CSS 3.3
- **HTTP:** Axios

### バックエンド (src/backend/)
- **フレームワーク:** Laravel 10.10
- **言語:** PHP 8.1
- **認証:** Laravel Sanctum 3.3 (Personal Access Token)
- **テスト:** PHPUnit 10.1

### インフラ
- Docker / Docker Compose
- Nginx

## プロジェクト構成

```
bokemasho/
├── src/
│   ├── frontend/          # Next.js
│   │   ├── app/
│   │   │   ├── components/  # アトミックデザイン
│   │   │   │   ├── atoms/
│   │   │   │   ├── molecules/
│   │   │   │   ├── organisms/
│   │   │   │   ├── templates/
│   │   │   │   └── layouts/
│   │   │   ├── lib/         # auth.ts, fetch.tsx
│   │   │   └── [各ページ]/
│   │   └── public/
│   └── backend/           # Laravel
│       ├── app/
│       │   ├── Http/Controllers/
│       │   └── Models/
│       ├── routes/api.php
│       └── database/
├── docker/
├── doc/                   # 技術ドキュメント（git追跡外）
└── docker-compose.yml
```

## 開発コマンド

### フロントエンド
```bash
cd src/frontend
npm install
npm run dev          # 開発サーバー起動
npm run build        # ビルド
npm run lint         # リント
```

### バックエンド
```bash
cd src/backend
composer install
php artisan serve    # 開発サーバー起動
php artisan migrate  # マイグレーション実行
php artisan test     # テスト実行
./vendor/bin/pint    # コードフォーマット
```

### Docker
```bash
docker-compose up -d      # コンテナ起動
docker-compose down       # コンテナ停止
docker-compose logs -f    # ログ確認
```

## アーキテクチャ

### フロントエンド - アトミックデザイン
- **atoms:** Button, TextField, Typography, Box, Grid
- **molecules:** Card, LoginButton, SearchField
- **organisms:** CardList
- **templates:** MainLayout
- **layouts:** Header, Footer, LoginButtonWrapper

### 認証フロー
1. ログイン/登録 → APIからトークン取得
2. トークンをlocalStorageに保存
3. API呼び出し時にAuthorizationヘッダーに付与

### 主要API
| エンドポイント | メソッド | 認証 | 説明 |
|---------------|---------|------|------|
| /api/register | POST | 不要 | ユーザー登録 |
| /api/login | POST | 不要 | ログイン |
| /api/logout | POST | 必要 | ログアウト |
| /api/user | GET | 必要 | ユーザー情報取得 |
| /api/joke-topics | GET/POST | 一部 | お題一覧/作成 |
| /api/jokes | GET | 不要 | ボケ一覧 |
| /api/jokes/create | POST | 必要 | ボケ投稿 |
| /api/jokes/{id}/vote | POST | 必要 | ボケ投票 |

## データベース

主要テーブル:
- **users** - ユーザー情報
- **joke_topics** - ボケお題
- **jokes** - ボケ
- **votes** - 投票

## 環境変数

### フロントエンド (.env.local)
```
NEXT_PUBLIC_API_URL=          # APIエンドポイント
NEXT_PUBLIC_BACKEND_URL=      # バックエンドURL（画像用）
NEXT_PUBLIC_BACKEND_CONTAINER_URL=  # コンテナ内バックエンドURL
```

### バックエンド (.env)
```
APP_URL=
DB_CONNECTION=mysql
DB_HOST=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
```

## 詳細ドキュメント

詳細な技術ドキュメントは `doc/` フォルダを参照:
- `doc/architecture/` - アーキテクチャ詳細
- `doc/DB/` - DB設計
- `doc/screens/` - 画面一覧・API対応表
- `doc/api/` - API仕様書
