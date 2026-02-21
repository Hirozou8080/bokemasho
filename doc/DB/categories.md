# categories テーブル

ボケに付与するカテゴリ（タグ）を管理するテーブル。

## カラム定義

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| id | bigint | NO | - | 主キー |
| name | varchar(50) | NO | - | カテゴリ名（ユニーク） |
| created_at | timestamp | YES | NULL | 作成日時 |
| updated_at | timestamp | YES | NULL | 更新日時 |

## インデックス

| インデックス名 | カラム | 種類 |
|---------------|--------|------|
| PRIMARY | id | PRIMARY |
| categories_name_unique | name | UNIQUE |

## リレーション

- `joke_category` テーブルを介して `jokes` と多対多の関係
