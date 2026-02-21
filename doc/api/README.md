# API一覧

## 概要

Laravel バックエンドが提供するRESTful APIの一覧です。
ベースURL: `{NEXT_PUBLIC_API_URL}`

## 認証方式

Laravel Sanctum による Personal Access Token 認証を使用。

```
Authorization: Bearer {token}
```

## エンドポイント一覧

### 認証 (Auth)

#### ユーザー登録
```
POST /api/register
```

**リクエスト:**
```json
{
  "username": "ユーザー名",
  "email": "user@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**レスポンス:**
```json
{
  "message": "登録が完了しました。メールアドレスに送信された確認リンクをクリックしてください。",
  "user": {
    "id": 1,
    "username": "ユーザー名"
  }
}
```

**備考:** 登録後はメール確認が必要です。トークンは発行されません。

#### ログイン
```
POST /api/login
```

**リクエスト:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス（成功時）:**
```json
{
  "token": "access_token_here",
  "user": {
    "id": 1,
    "username": "ユーザー名",
    "email": "user@example.com"
  }
}
```

**レスポンス（メール未確認時 - 403）:**
```json
{
  "message": "メールアドレスが確認されていません。メールに送信された確認リンクをクリックしてください。",
  "email_verified": false
}
```

**備考:** メールアドレスが確認されていないユーザーはログインできません。

#### ログアウト
```
POST /api/logout
```
**認証:** 必要

**レスポンス:**
```json
{
  "message": "Logged out successfully"
}
```

#### 認証ユーザー情報取得
```
GET /api/user
```
**認証:** 必要

**レスポンス:**
```json
{
  "id": 1,
  "username": "ユーザー名",
  "email": "user@example.com",
  "bio": "自己紹介文",
  "icon_url": "http://localhost:8080/storage/icons/xxx.jpg",
  "created_at": "2024-01-01T00:00:00.000000Z"
}
```

**備考:** `icon_url`は自動生成される属性で、アイコンが未設定の場合はnullを返します。

### メール確認

#### メール確認
```
GET /api/email/verify/{id}/{hash}
```
**認証:** 不要

メール内の確認リンクからアクセスされます。確認完了後、フロントエンドの完了画面にリダイレクトします。

#### 確認メール再送信
```
POST /api/email/resend
```

**リクエスト:**
```json
{
  "email": "user@example.com"
}
```

**レスポンス:**
```json
{
  "message": "確認メールを再送信しました。"
}
```

### パスワードリセット

#### リセットメール送信
```
POST /api/forgot-password
```

**リクエスト:**
```json
{
  "email": "user@example.com"
}
```

**レスポンス:**
```json
{
  "message": "Password reset link sent"
}
```

#### パスワードリセット実行
```
POST /api/reset-password
```

**リクエスト:**
```json
{
  "email": "user@example.com",
  "password": "newpassword123",
  "password_confirmation": "newpassword123",
  "token": "reset_token_here"
}
```

**レスポンス:**
```json
{
  "message": "Password reset successfully"
}
```

### プロフィール

#### プロフィール取得
```
GET /api/profile
```
**認証:** 必要

**レスポンス:**
```json
{
  "id": 1,
  "username": "ユーザー名",
  "email": "user@example.com",
  "bio": "自己紹介文",
  "icon_url": "http://localhost:8080/storage/icons/xxx.jpg"
}
```

#### プロフィール更新
```
POST /api/profile
```
**認証:** 必要

**リクエスト (multipart/form-data):**
```
username: 新しいユーザー名
bio: 自己紹介文
icon: (画像ファイル - jpeg,png,jpg,gif, 最大2MB)
```

**レスポンス:**
```json
{
  "id": 1,
  "username": "新しいユーザー名",
  "email": "user@example.com",
  "bio": "自己紹介文",
  "icon_url": "http://localhost:8080/storage/icons/xxx.jpg"
}
```

**備考:** アイコンが未設定の場合、`icon_url`はnullを返します。フロントエンドでデフォルトアイコン(`/images/robot-logo.png`)を設定してください。

### ボケお題 (Joke Topics)

#### お題一覧取得
```
GET /api/joke-topics
```
**認証:** 不要

**クエリパラメータ:**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| page | int | ページ番号 |
| per_page | int | 1ページあたりの件数 |

**レスポンス:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "お題タイトル",
      "description": "お題の説明",
      "image": "path/to/image.jpg",
      "user_id": 1,
      "user": {
        "id": 1,
        "name": "投稿者名"
      },
      "jokes_count": 10,
      "created_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 50
  }
}
```

#### お題詳細取得
```
GET /api/joke-topics/{id}
```
**認証:** 不要

**レスポンス:**
```json
{
  "id": 1,
  "title": "お題タイトル",
  "description": "お題の説明",
  "image": "path/to/image.jpg",
  "user_id": 1,
  "user": {
    "id": 1,
    "name": "投稿者名"
  },
  "jokes": [
    {
      "id": 1,
      "content": "ボケの内容",
      "votes_count": 5
    }
  ],
  "created_at": "2024-01-01T00:00:00.000000Z"
}
```

#### お題作成
```
POST /api/joke-topics
```
**認証:** 必要

**リクエスト (multipart/form-data):**
```
title: お題タイトル
description: お題の説明
image: (ファイル)
```

**レスポンス:**
```json
{
  "id": 1,
  "title": "お題タイトル",
  "description": "お題の説明",
  "image": "path/to/image.jpg",
  "user_id": 1,
  "created_at": "2024-01-01T00:00:00.000000Z"
}
```

#### お題更新
```
PUT /api/joke-topics/{id}
```
**認証:** 必要（投稿者のみ）

**リクエスト:**
```json
{
  "title": "更新後のタイトル",
  "description": "更新後の説明"
}
```

#### お題削除
```
DELETE /api/joke-topics/{id}
```
**認証:** 必要（投稿者のみ）

### カテゴリ (Categories)

#### カテゴリ一覧取得（サジェスト用）
```
GET /api/categories
```
**認証:** 不要

**クエリパラメータ:**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| search | string | 検索キーワード（部分一致） |

**レスポンス:**
```json
{
  "data": [
    { "id": 1, "name": "シュール" },
    { "id": 2, "name": "下ネタ" }
  ]
}
```

### ボケ (Jokes)

#### ボケ一覧取得
```
GET /api/jokes
```
**認証:** 不要

**クエリパラメータ:**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| page | int | ページ番号 |
| per_page | int | 1ページあたりの件数 |
| sort | string | ソート順（`latest`: 新着順（デフォルト）, `popular`: 人気順（過去1週間のいいね数降順）, `ranking`: ランキング（全期間のいいね数降順）） |
| user_id | int | ユーザーID（投票状態取得用） |

**レスポンス:**
```json
{
  "data": [
    {
      "id": 1,
      "content": "ボケの内容",
      "joke_topic_id": 1,
      "user_id": 1,
      "user": {
        "id": 1,
        "name": "投稿者名"
      },
      "joke_topic": {
        "id": 1,
        "title": "お題タイトル"
      },
      "categories": [
        { "id": 1, "name": "シュール" }
      ],
      "votes_count": 5,
      "created_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 10,
    "total": 100
  }
}
```

#### ボケ詳細取得
```
GET /api/jokes/{id}
```
**認証:** 不要

#### お題別ボケ取得
```
GET /api/topics/{topicId}/jokes
```
**認証:** 不要

#### ボケ作成
```
POST /api/jokes/create
```
**認証:** 必要

**リクエスト:**
```json
{
  "content": "ボケの内容",
  "joke_topic_id": 1,
  "categories": ["シュール", "天然ボケ"]
}
```

**備考:**
- `categories`は任意で、最大3つまで指定可能
- 新しいカテゴリ名を指定すると自動的に作成される

**レスポンス:**
```json
{
  "id": 1,
  "content": "ボケの内容",
  "joke_topic_id": 1,
  "user_id": 1,
  "categories": [
    { "id": 1, "name": "シュール" },
    { "id": 2, "name": "天然ボケ" }
  ],
  "created_at": "2024-01-01T00:00:00.000000Z"
}
```

#### ボケ削除
```
DELETE /api/jokes/{id}
```
**認証:** 必要（投稿者のみ）

#### ボケ投票
```
POST /api/jokes/{id}/vote
```
**認証:** 必要

**レスポンス:**
```json
{
  "message": "Vote recorded",
  "votes_count": 6
}
```

## エラーレスポンス

### 認証エラー (401)
```json
{
  "message": "Unauthenticated."
}
```

### バリデーションエラー (422)
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

### 権限エラー (403)
```json
{
  "message": "This action is unauthorized."
}
```

### Not Found (404)
```json
{
  "message": "Resource not found."
}
```

## API呼び出し元一覧

| API | 呼び出し元ページ |
|-----|----------------|
| POST /api/register | /auth/register |
| POST /api/login | /auth/login |
| POST /api/logout | Header (LoginButtonWrapper) |
| GET /api/user | /profile, /profile/edit, Header |
| GET /api/email/verify/{id}/{hash} | メールリンク → /auth/complete |
| POST /api/email/resend | /auth/login (メール未確認時) |
| POST /api/forgot-password | /auth/forgot-password |
| POST /api/reset-password | /auth/reset-password |
| GET /api/profile | /profile |
| POST /api/profile | /profile/edit |
| GET /api/joke-topics | /, /joke_topic/list |
| GET /api/joke-topics/{id} | /joke_topic/[id] |
| POST /api/joke-topics | /joke_topic/create |
| GET /api/jokes | /, /jokes |
| POST /api/jokes/create | /joke_topic/[id] |
| POST /api/jokes/{id}/vote | /, /joke_topic/[id], /jokes |
| GET /api/categories | /joke_topic/[id] (サジェスト用) |
