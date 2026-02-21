# joke_category テーブル

ボケとカテゴリの多対多リレーションを管理する中間テーブル。
1つのボケに対して最大3つのカテゴリを設定可能。

## カラム定義

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| id | bigint | NO | - | 主キー |
| joke_id | bigint | NO | - | ボケID（外部キー） |
| category_id | bigint | NO | - | カテゴリID（外部キー） |
| created_at | timestamp | YES | NULL | 作成日時 |

## インデックス

| インデックス名 | カラム | 種類 |
|---------------|--------|------|
| PRIMARY | id | PRIMARY |
| joke_category_joke_id_category_id_unique | joke_id, category_id | UNIQUE |

## 外部キー

| カラム | 参照テーブル | 参照カラム | ON DELETE |
|--------|-------------|-----------|-----------|
| joke_id | jokes | id | CASCADE |
| category_id | categories | id | CASCADE |

## 制約

- 同一のボケに同一カテゴリは1回のみ設定可能（ユニーク制約）
- 1ボケあたり最大3カテゴリ（アプリケーション側で制御）
