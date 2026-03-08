# バックエンドアーキテクチャ

## 概要

Laravel 10 を使用したRESTful APIサーバー。Laravel Sanctumによるトークンベース認証を採用。

**アーキテクチャ**: DDD（ドメイン駆動設計）+ クリーンアーキテクチャ

## 技術詳細

### フレームワーク・ライブラリ

| パッケージ | バージョン | 用途 |
|-----------|-----------|------|
| laravel/framework | ^10.10 | Webフレームワーク |
| php | ^8.1 | 言語 |
| laravel/sanctum | ^3.3 | API認証 |
| guzzlehttp/guzzle | ^7.2 | HTTPクライアント |
| laravel/tinker | ^2.8 | REPL |

### 開発用パッケージ

| パッケージ | バージョン | 用途 |
|-----------|-----------|------|
| phpunit/phpunit | ^10.1 | テスト |
| fakerphp/faker | ^1.9.1 | テストデータ生成 |
| laravel/pint | ^1.0 | コードフォーマッタ |
| laravel/sail | ^1.18 | Docker環境 |

## アーキテクチャ概要

### レイヤー構成

```
┌─────────────────────────────────────────────────────┐
│                    Http層                            │
│  Controllers / Requests / Resources                  │
└─────────────────────┬───────────────────────────────┘
                      │ 依存
                      ▼
┌─────────────────────────────────────────────────────┐
│               Application層                          │
│                 UseCases                             │
└─────────────────────┬───────────────────────────────┘
                      │ 依存
                      ▼
┌─────────────────────────────────────────────────────┐
│                 Domain層                             │
│  Entities / RepositoryInterfaces / Exceptions        │
└─────────────────────────────────────────────────────┘
                      ▲
                      │ 実装
┌─────────────────────┴───────────────────────────────┐
│              Infrastructure層                        │
│   Eloquent Repositories / External Services          │
└─────────────────────────────────────────────────────┘
```

### 各層の責務

| 層 | 責務 | 依存先 |
|---|---|---|
| **Http** | HTTPリクエスト/レスポンス処理、バリデーション | Application |
| **Application** | ユースケース実行、トランザクション管理 | Domain |
| **Domain** | ビジネスルール、エンティティ、リポジトリインターフェース | なし |
| **Infrastructure** | DB操作、外部サービス連携の実装 | Domain（インターフェース実装） |

## フォルダ構成

```
src/backend/
├── app/
│   ├── Application/              # アプリケーション層
│   │   ├── Joke/
│   │   │   └── UseCases/
│   │   │       ├── CreateJokeUseCase.php
│   │   │       ├── DeleteJokeUseCase.php
│   │   │       ├── GetJokeDetailUseCase.php
│   │   │       ├── GetJokeListUseCase.php
│   │   │       ├── GetJokesByTopicUseCase.php
│   │   │       └── VoteJokeUseCase.php
│   │   └── JokeTopic/
│   │       └── UseCases/
│   │           ├── CreateJokeTopicUseCase.php
│   │           ├── DeleteJokeTopicUseCase.php
│   │           ├── GetJokeTopicDetailUseCase.php
│   │           ├── GetJokeTopicListUseCase.php
│   │           └── UpdateJokeTopicUseCase.php
│   │
│   ├── Domain/                   # ドメイン層
│   │   ├── Joke/
│   │   │   ├── JokeEntity.php
│   │   │   ├── JokeRepositoryInterface.php
│   │   │   └── Exceptions/
│   │   │       ├── JokeNotFoundException.php
│   │   │       └── UnauthorizedJokeAccessException.php
│   │   ├── JokeTopic/
│   │   │   ├── JokeTopicEntity.php
│   │   │   ├── JokeTopicRepositoryInterface.php
│   │   │   └── Exceptions/
│   │   │       ├── JokeTopicNotFoundException.php
│   │   │       └── UnauthorizedJokeTopicAccessException.php
│   │   ├── User/
│   │   │   └── UserRepositoryInterface.php
│   │   └── Vote/
│   │       └── VoteRepositoryInterface.php
│   │
│   ├── Infrastructure/           # インフラ層
│   │   └── Persistence/
│   │       └── Eloquent/
│   │           ├── JokeRepository.php
│   │           ├── JokeTopicRepository.php
│   │           ├── UserRepository.php
│   │           ├── VoteRepository.php
│   │           └── Models/
│   │               └── JokeModel.php
│   │
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/              # 新アーキテクチャ
│   │   │   │   ├── JokeController.php
│   │   │   │   └── JokeTopicController.php
│   │   │   ├── Auth/             # 認証（未移行）
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── EmailVerificationController.php
│   │   │   │   └── PasswordResetController.php
│   │   │   ├── CategoryController.php
│   │   │   └── ProfileController.php
│   │   ├── Requests/             # FormRequest（バリデーション）
│   │   │   ├── Joke/
│   │   │   │   └── CreateJokeRequest.php
│   │   │   └── JokeTopic/
│   │   │       ├── CreateJokeTopicRequest.php
│   │   │       └── UpdateJokeTopicRequest.php
│   │   ├── Resources/            # APIリソース
│   │   │   ├── JokeResource.php
│   │   │   └── UserResource.php
│   │   └── Middleware/
│   │
│   ├── Models/                   # Eloquentモデル（レガシー）
│   │   ├── Category.php
│   │   ├── Joke.php
│   │   ├── JokeTopic.php
│   │   ├── User.php
│   │   └── Vote.php
│   │
│   └── Providers/
│       └── RepositoryServiceProvider.php  # DIバインディング
│
├── config/
├── database/
├── routes/
│   └── api.php
└── ...
```

## コントローラー

### Api/JokeController（ボケ）
ボケ関連の処理を担当。UseCaseを呼び出す薄いController。

| メソッド | エンドポイント | 認証 | UseCase |
|---------|---------------|------|---------|
| index | GET /api/jokes | 不要 | GetJokeListUseCase |
| show | GET /api/jokes/{id} | 不要 | GetJokeDetailUseCase |
| getByTopic | GET /api/topics/{topicId}/jokes | 不要 | GetJokesByTopicUseCase |
| create | POST /api/jokes/create | 必要 | CreateJokeUseCase |
| destroy | DELETE /api/jokes/{id} | 必要 | DeleteJokeUseCase |
| vote | POST /api/jokes/{id}/vote | 必要 | VoteJokeUseCase |

### Api/JokeTopicController（ボケお題）
ボケお題関連の処理を担当。

| メソッド | エンドポイント | 認証 | UseCase |
|---------|---------------|------|---------|
| index | GET /api/joke-topics | 不要 | GetJokeTopicListUseCase |
| show | GET /api/joke-topics/{id} | 不要 | GetJokeTopicDetailUseCase |
| store | POST /api/joke-topics | 必要 | CreateJokeTopicUseCase |
| update | PUT /api/joke-topics/{id} | 必要 | UpdateJokeTopicUseCase |
| destroy | DELETE /api/joke-topics/{id} | 必要 | DeleteJokeTopicUseCase |

### AuthController（認証）※未移行
ユーザー認証関連の処理を担当。

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| register | POST /api/register | 新規ユーザー登録 |
| login | POST /api/login | ログイン |
| logout | POST /api/logout | ログアウト |
| user | GET /api/user | 認証ユーザー情報取得 |

### PasswordResetController（パスワードリセット）※未移行

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| forgotPassword | POST /api/forgot-password | リセットメール送信 |
| resetPassword | POST /api/reset-password | パスワードリセット |

### ProfileController（プロフィール）※未移行

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| show | GET /api/profile | プロフィール取得 |
| update | POST /api/profile | プロフィール更新 |

## DIバインディング

`RepositoryServiceProvider` でインターフェースと実装をバインド:

```php
$this->app->bind(JokeRepositoryInterface::class, JokeRepository::class);
$this->app->bind(JokeTopicRepositoryInterface::class, JokeTopicRepository::class);
$this->app->bind(VoteRepositoryInterface::class, VoteRepository::class);
$this->app->bind(UserRepositoryInterface::class, UserRepository::class);
```

## 認証

### Laravel Sanctum
Personal Access Token を使用したステートレスなAPI認証。

**重要**: セッション認証（`Auth::login()`）は使用せず、トークン認証のみで完結している。

### トークン設定
- **有効期限**: 7日間（`config/sanctum.php` の `expiration` で設定）
- **多重ログイン**: 不可（ログイン時に既存トークンを削除）

### ミドルウェア
- `auth:sanctum` - 認証が必要なエンドポイントに適用

### 認証フロー
1. ユーザーがログイン（メール確認済みの場合のみ）
2. サーバーがPersonal Access Tokenを発行（既存トークンは削除）
3. クライアントがトークンをAuthorizationヘッダーに付与してリクエスト
4. サーバーがトークンを検証（有効期限切れの場合は401エラー）

## データベース

### 使用テーブル

| テーブル | 説明 |
|---------|------|
| users | ユーザー情報 |
| joke_topics | ボケお題 |
| jokes | ボケ |
| votes | 投票 |
| personal_access_tokens | アクセストークン |
| password_reset_tokens | パスワードリセットトークン |
| failed_jobs | 失敗ジョブ |

詳細は [DB設計](../DB/README.md) を参照。
