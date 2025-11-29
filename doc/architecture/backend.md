# バックエンドアーキテクチャ

## 概要

Laravel 10 を使用したRESTful APIサーバー。Laravel Sanctumによるトークンベース認証を採用。

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

## フォルダ構成

```
src/backend/
├── app/
│   ├── Console/              # Artisanコマンド
│   ├── Exceptions/           # 例外ハンドラ
│   ├── Http/
│   │   ├── Controllers/      # コントローラー
│   │   │   ├── Auth/
│   │   │   │   ├── AuthController.php
│   │   │   │   └── PasswordResetController.php
│   │   │   ├── ProfileController.php
│   │   │   ├── JokeController.php
│   │   │   └── JokeTopicController.php
│   │   ├── Middleware/       # ミドルウェア
│   │   └── Resources/        # APIリソース
│   ├── Models/               # Eloquentモデル
│   └── Providers/            # サービスプロバイダ
├── bootstrap/                # ブートストラップ
├── config/                   # 設定ファイル
├── database/
│   ├── factories/            # モデルファクトリ
│   ├── migrations/           # マイグレーション
│   └── seeders/              # シーダー
├── public/                   # 公開ディレクトリ
├── resources/                # リソース（View等）
├── routes/
│   ├── api.php               # APIルート
│   ├── web.php               # Webルート
│   ├── channels.php          # ブロードキャストチャンネル
│   └── console.php           # コンソールルート
├── storage/                  # ストレージ
├── tests/                    # テスト
├── vendor/                   # Composer依存パッケージ
├── artisan                   # Artisan CLI
├── composer.json
└── phpunit.xml
```

## コントローラー

### AuthController（認証）
ユーザー認証関連の処理を担当。

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| register | POST /api/register | 新規ユーザー登録 |
| login | POST /api/login | ログイン |
| logout | POST /api/logout | ログアウト |
| user | GET /api/user | 認証ユーザー情報取得 |

### PasswordResetController（パスワードリセット）
パスワードリセット関連の処理を担当。

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| forgotPassword | POST /api/forgot-password | リセットメール送信 |
| resetPassword | POST /api/reset-password | パスワードリセット |

### ProfileController（プロフィール）
ユーザープロフィール関連の処理を担当。

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| show | GET /api/profile | プロフィール取得 |
| update | POST /api/profile | プロフィール更新 |

### JokeTopicController（ボケお題）
ボケお題関連の処理を担当。

| メソッド | エンドポイント | 認証 | 説明 |
|---------|---------------|------|------|
| index | GET /api/joke-topics | 不要 | お題一覧取得 |
| show | GET /api/joke-topics/{id} | 不要 | お題詳細取得 |
| store | POST /api/joke-topics | 必要 | お題作成 |
| update | PUT /api/joke-topics/{id} | 必要 | お題更新 |
| destroy | DELETE /api/joke-topics/{id} | 必要 | お題削除 |

### JokeController（ボケ）
ボケ関連の処理を担当。

| メソッド | エンドポイント | 認証 | 説明 |
|---------|---------------|------|------|
| index | GET /api/jokes | 不要 | ボケ一覧取得 |
| show | GET /api/jokes/{id} | 不要 | ボケ詳細取得 |
| getByTopic | GET /api/topics/{topicId}/jokes | 不要 | お題別ボケ取得 |
| create | POST /api/jokes/create | 必要 | ボケ作成 |
| destroy | DELETE /api/jokes/{id} | 必要 | ボケ削除 |
| vote | POST /api/jokes/{id}/vote | 必要 | ボケ投票 |

## 認証

### Laravel Sanctum
Personal Access Token を使用したステートレスなAPI認証。

### ミドルウェア
- `auth:sanctum` - 認証が必要なエンドポイントに適用

### 認証フロー
1. ユーザーがログイン/登録
2. サーバーがPersonal Access Tokenを発行
3. クライアントがトークンをAuthorizationヘッダーに付与してリクエスト
4. サーバーがトークンを検証

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
