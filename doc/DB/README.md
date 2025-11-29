# DBテーブル設計

## テーブル一覧

| テーブル名 | 説明 |
|-----------|------|
| [users](./users.md) | ユーザ情報管理テーブル |
| [joke_topics](./joke_topics.md) | ボケのお題管理テーブル |
| [jokes](./jokes.md) | ボケ管理テーブル |
| [votes](./votes.md) | いいね投票管理テーブル |
| [personal_access_tokens](./personal_access_tokens.md) | アクセストークン管理テーブル |
| [password_reset_tokens](./password_reset_tokens.md) | パスワードリセットトークン管理テーブル |
| [failed_jobs](./failed_jobs.md) | 失敗したジョブ管理テーブル |

## ER図

```mermaid
erDiagram
    users ||--o{ joke_topics : "お題投稿者"
    users ||--o{ jokes : "投稿者"
    users ||--o{ votes : "投票者"
    joke_topics ||--o{ jokes : "お題"
    jokes ||--o{ votes : "投票対象ボケ"

    users {
        bigint id PK "ユーザーID"
        varchar username "ユーザー名"
        varchar email "メールアドレス"
        timestamp email_verified_at "メールアドレス確認日時"
        varchar icon_path "アイコンパス"
        varchar password "パスワード"
        varchar remember_token "リメンバートークン"
        text bio "自己紹介"
        int role "ロール"
        timestamp last_login_at "最終ログイン日時"
        boolean is_blocked "ブロック状態"
        timestamp blocked_until "ブロック期限"
        timestamp deleted_at "削除日時"
        timestamp created_at "作成日時"
        timestamp updated_at "更新日時"
    }

    joke_topics {
        bigint id PK "お題ID"
        bigint user_id FK "ユーザーID"
        varchar image_path "画像パス"
        int priority "優先度"
        timestamp deleted_at "削除日時"
        timestamp created_at "作成日時"
        timestamp updated_at "更新日時"
    }

    jokes {
        bigint id PK "ボケID"
        bigint user_id FK "ユーザーID"
        bigint topic_id FK "お題ID"
        text content "ボケ内容"
        int priority "優先度"
        timestamp deleted_at "削除日時"
        timestamp created_at "作成日時"
        timestamp updated_at "更新日時"
    }

    votes {
        bigint id PK "投票ID"
        bigint user_id FK "ユーザーID"
        bigint joke_id FK "ボケID"
        timestamp created_at "作成日時"
        timestamp updated_at "更新日時"
    }
```
