# 画面一覧

## 概要

本プロジェクトのフロントエンド画面一覧と、各画面で使用するコンポーネント・API呼び出しの対応表です。

## 画面構成

### 認証不要ページ

| パス | ページ名 | 説明 |
|------|---------|------|
| `/` | トップページ | ボケ・お題一覧表示 |
| `/auth/login` | ログイン | ユーザーログイン |
| `/auth/register` | 新規登録 | ユーザー新規登録 |
| `/auth/forgot-password` | パスワードリセット申請 | リセットメール送信 |
| `/auth/reset-password` | パスワードリセット | 新パスワード設定 |
| `/auth/complete` | 登録完了 | 登録完了メッセージ |
| `/joke_topic/list` | お題一覧 | ボケお題リスト |
| `/joke_topic/[id]` | お題詳細 | お題詳細・ボケ投稿 |
| `/jokes` | ボケ一覧 | 全ボケリスト |

### 認証必要ページ

| パス | ページ名 | 説明 |
|------|---------|------|
| `/profile` | プロフィール | ユーザー情報表示 |
| `/profile/edit` | プロフィール編集 | ユーザー情報編集 |
| `/joke_topic/create` | お題作成 | 新規お題投稿 |

## 画面別API呼び出し対応表

### トップページ（/）

| 操作 | API | メソッド | 認証 |
|------|-----|---------|------|
| ボケ一覧取得 | /api/jokes | GET | 不要 |
| お題一覧取得 | /api/joke-topics | GET | 不要 |
| ボケ投票 | /api/jokes/{id}/vote | POST | 必要 |

**使用コンポーネント:**
- MainLayout (テンプレート)
- CardList (organisms)
- Card (molecules)
- Button, Typography (atoms)

### ログインページ（/auth/login）

| 操作 | API | メソッド | 認証 |
|------|-----|---------|------|
| ログイン | /api/login | POST | 不要 |

**使用コンポーネント:**
- MainLayout
- TextField, Button, Typography (atoms)
- MUI: Alert, Paper

### 新規登録ページ（/auth/register）

| 操作 | API | メソッド | 認証 |
|------|-----|---------|------|
| ユーザー登録 | /api/register | POST | 不要 |

**使用コンポーネント:**
- MainLayout
- Regist (user/Regist.tsx)
- TextField, Button, Typography (atoms)
- MUI: Stepper, Step, StepLabel, Paper

### パスワードリセット申請（/auth/forgot-password）

| 操作 | API | メソッド | 認証 |
|------|-----|---------|------|
| リセットメール送信 | /api/forgot-password | POST | 不要 |

**使用コンポーネント:**
- MainLayout
- TextField, Button, Typography (atoms)
- MUI: Alert, Paper

### パスワードリセット（/auth/reset-password）

| 操作 | API | メソッド | 認証 |
|------|-----|---------|------|
| パスワード変更 | /api/reset-password | POST | 不要 |

**使用コンポーネント:**
- MainLayout
- TextField, Button, Typography (atoms)
- MUI: Alert, Paper

### お題一覧（/joke_topic/list）

| 操作 | API | メソッド | 認証 |
|------|-----|---------|------|
| お題一覧取得 | /api/joke-topics | GET | 不要 |

**使用コンポーネント:**
- MainLayout
- CardList (organisms)
- Card (molecules)
- MUI: Pagination

### お題詳細（/joke_topic/[id]）

| 操作 | API | メソッド | 認証 |
|------|-----|---------|------|
| お題詳細取得 | /api/joke-topics/{id} | GET | 不要 |
| ボケ投稿 | /api/jokes/create | POST | 必要 |
| ボケ投票 | /api/jokes/{id}/vote | POST | 必要 |

**使用コンポーネント:**
- MainLayout
- Card (molecules)
- TextField, Button, Typography (atoms)
- MUI: Dialog, Fab, Avatar

### お題作成（/joke_topic/create）

| 操作 | API | メソッド | 認証 |
|------|-----|---------|------|
| お題作成 | /api/joke-topics | POST | 必要 |

**使用コンポーネント:**
- MainLayout
- TextField, Button, Typography (atoms)
- MUI: Paper, Alert

### ボケ一覧（/jokes）

| 操作 | API | メソッド | 認証 |
|------|-----|---------|------|
| ボケ一覧取得 | /api/jokes | GET | 不要 |
| ボケ投票 | /api/jokes/{id}/vote | POST | 必要 |

**使用コンポーネント:**
- MainLayout
- CardList (organisms)
- Card (molecules)
- MUI: Pagination

### プロフィール（/profile）

| 操作 | API | メソッド | 認証 |
|------|-----|---------|------|
| ユーザー情報取得 | /api/user | GET | 必要 |

**使用コンポーネント:**
- MainLayout
- Typography (atoms)
- MUI: Avatar, Paper, Divider

### プロフィール編集（/profile/edit）

| 操作 | API | メソッド | 認証 |
|------|-----|---------|------|
| ユーザー情報取得 | /api/user | GET | 必要 |
| プロフィール更新 | /api/profile | POST | 必要 |

**使用コンポーネント:**
- MainLayout
- TextField, Button, Typography (atoms)
- MUI: Avatar, Paper, Alert

## 画面遷移図

```
[トップページ(/)]
    │
    ├── [ログイン(/auth/login)] ──→ [トップページ]
    │       │
    │       └── [パスワードリセット申請(/auth/forgot-password)]
    │               │
    │               └── [パスワードリセット(/auth/reset-password)]
    │
    ├── [新規登録(/auth/register)] ──→ [登録完了(/auth/complete)] ──→ [トップページ]
    │
    ├── [お題一覧(/joke_topic/list)]
    │       │
    │       └── [お題詳細(/joke_topic/[id])]
    │
    ├── [お題作成(/joke_topic/create)] ※要認証
    │
    ├── [ボケ一覧(/jokes)]
    │
    └── [プロフィール(/profile)] ※要認証
            │
            └── [プロフィール編集(/profile/edit)]
```

## コンポーネント・API対応マトリクス

| コンポーネント/ページ | login | register | user | profile | joke-topics | jokes | vote |
|---------------------|-------|----------|------|---------|-------------|-------|------|
| / (トップ) | | | | | ✓ | ✓ | ✓ |
| /auth/login | ✓ | | | | | | |
| /auth/register | | ✓ | | | | | |
| /auth/forgot-password | | | | | | | |
| /profile | | | ✓ | | | | |
| /profile/edit | | | ✓ | ✓ | | | |
| /joke_topic/list | | | | | ✓ | | |
| /joke_topic/[id] | | | | | ✓ | | ✓ |
| /joke_topic/create | | | | | ✓ | | |
| /jokes | | | | | | ✓ | ✓ |
