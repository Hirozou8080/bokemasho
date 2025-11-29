# 技術スタック・アーキテクチャ

## 概要

本プロジェクトは、Next.js（フロントエンド）+ Laravel（バックエンドAPI）のモノレポ構成で構築されています。

## 技術スタック

### フロントエンド

| カテゴリ | 技術 | バージョン |
|---------|------|-----------|
| フレームワーク | Next.js | 14.0.4 |
| 言語 | TypeScript | ^5 |
| UIライブラリ | React | ^18 |
| UIコンポーネント | MUI (Material-UI) | ^7.0.1 |
| スタイリング | Emotion | ^11.14.0 |
| CSSフレームワーク | Tailwind CSS | ^3.3.0 |
| HTTPクライアント | Axios | ^1.6.3 |
| アイコン | @mui/icons-material | ^7.0.1 |

### バックエンド

| カテゴリ | 技術 | バージョン |
|---------|------|-----------|
| フレームワーク | Laravel | ^10.10 |
| 言語 | PHP | ^8.1 |
| 認証 | Laravel Sanctum | ^3.3 |
| HTTPクライアント | Guzzle | ^7.2 |
| テスト | PHPUnit | ^10.1 |

### インフラ

| カテゴリ | 技術 |
|---------|------|
| コンテナ | Docker / Docker Compose |
| Webサーバー | Nginx |
| アナリティクス | Google Analytics 4 |

## プロジェクト構成

```
bokemasho/
├── src/
│   ├── frontend/          # Next.js フロントエンド
│   │   ├── app/           # App Router
│   │   ├── public/        # 静的ファイル
│   │   └── package.json
│   └── backend/           # Laravel バックエンド
│       ├── app/           # アプリケーションコード
│       ├── routes/        # ルーティング定義
│       ├── database/      # マイグレーション・シーダー
│       └── composer.json
├── docker/                # Docker設定
├── nginx_log/             # Nginxログ
├── public/                # 公開ディレクトリ
├── doc/                   # ドキュメント
└── docker-compose.yml
```

## 詳細ドキュメント

- [フロントエンドアーキテクチャ](./frontend.md)
- [バックエンドアーキテクチャ](./backend.md)
