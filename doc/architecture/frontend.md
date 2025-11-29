# フロントエンドアーキテクチャ

## 概要

Next.js 14 App Routerを採用し、MUI (Material-UI) をUIコンポーネントライブラリとして使用しています。
コンポーネント設計にはアトミックデザインの考え方を取り入れています。

## 技術詳細

### フレームワーク・ライブラリ

| パッケージ | バージョン | 用途 |
|-----------|-----------|------|
| next | 14.0.4 | Reactフレームワーク |
| react / react-dom | ^18 | UIライブラリ |
| typescript | ^5 | 型安全な開発 |
| @mui/material | ^7.0.1 | UIコンポーネント |
| @mui/icons-material | ^7.0.1 | アイコン |
| @emotion/react | ^11.14.0 | CSS-in-JS |
| @emotion/styled | ^11.14.0 | styled components |
| tailwindcss | ^3.3.0 | ユーティリティCSS |
| axios | ^1.6.3 | HTTPクライアント |

## フォルダ構成

```
src/frontend/
├── app/
│   ├── components/           # コンポーネント（アトミックデザイン）
│   │   ├── atoms/            # 最小単位のコンポーネント
│   │   │   ├── Box.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Grid.tsx
│   │   │   ├── TextField.tsx
│   │   │   └── Typography.tsx
│   │   ├── molecules/        # 複数のatomsで構成
│   │   │   ├── Card.tsx
│   │   │   ├── LoginButton.tsx
│   │   │   └── SearchField.tsx
│   │   ├── organisms/        # 複雑なUIコンポーネント
│   │   │   └── CardList.tsx
│   │   ├── templates/        # ページレイアウト
│   │   │   └── MainLayout.tsx
│   │   ├── layouts/          # 共通レイアウト部品
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── LoginButtonWrapper.tsx
│   │   ├── pages/            # ページコンポーネント
│   │   └── user/             # ユーザー関連コンポーネント
│   │       └── Regist.tsx
│   ├── lib/                  # ユーティリティ・ヘルパー
│   │   ├── auth.ts           # 認証関連関数
│   │   └── fetch.tsx         # API通信関数
│   ├── css/                  # スタイルシート
│   ├── auth/                 # 認証ページ
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── complete/
│   ├── profile/              # プロフィールページ
│   │   └── edit/
│   ├── joke_topic/           # ボケお題ページ
│   │   ├── list/
│   │   ├── create/
│   │   └── [id]/
│   ├── jokes/                # ボケ一覧ページ
│   ├── page.tsx              # トップページ
│   ├── layout.tsx            # ルートレイアウト
│   ├── theme-registry.tsx    # MUIテーマ設定
│   ├── globals.css           # グローバルCSS
│   ├── not-found.tsx         # 404ページ
│   └── sitemap.ts            # サイトマップ生成
├── public/                   # 静的ファイル
│   └── images/               # 画像ファイル
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## アトミックデザイン

本プロジェクトではアトミックデザインの考え方を採用し、コンポーネントを以下の階層で管理しています。

### Atoms（原子）
最小単位のUIコンポーネント。MUIコンポーネントをラップしてカスタマイズ。

| コンポーネント | 説明 | ベースコンポーネント |
|--------------|------|-------------------|
| Button | ボタン | MUI Button |
| TextField | テキスト入力 | MUI TextField |
| Typography | テキスト表示 | MUI Typography |
| Box | レイアウトボックス | MUI Box |
| Grid | グリッドレイアウト | MUI Grid |

### Molecules（分子）
複数のAtomsを組み合わせた機能的なコンポーネント。

| コンポーネント | 説明 |
|--------------|------|
| Card | カード表示 |
| LoginButton | ログインボタン |
| SearchField | 検索フィールド |

### Organisms（有機体）
複雑なUIを構成する大きなコンポーネント。

| コンポーネント | 説明 |
|--------------|------|
| CardList | カードリスト表示 |

### Templates（テンプレート）
ページ全体のレイアウトを定義。

| コンポーネント | 説明 |
|--------------|------|
| MainLayout | メインレイアウト（Header + Content + Footer） |

### Layouts（レイアウト部品）
ページ共通で使用するレイアウト部品。

| コンポーネント | 説明 |
|--------------|------|
| Header | ヘッダー（ナビゲーション含む） |
| Footer | フッター |
| LoginButtonWrapper | ログイン状態に応じたボタン表示 |

## UIコンポーネント

### MUI (Material-UI)

主要なMUIコンポーネントの使用箇所：

| コンポーネント | 用途 |
|--------------|------|
| AppBar, Toolbar | ヘッダー |
| Button, ButtonGroup | ボタン |
| Card, CardContent, CardMedia, CardActions | カード表示 |
| TextField | フォーム入力 |
| Typography | テキスト |
| Dialog, DialogTitle, DialogContent, DialogActions | モーダル |
| Alert | アラート・通知 |
| CircularProgress | ローディング |
| Avatar | ユーザーアイコン |
| Paper | コンテナ |
| Stepper, Step, StepLabel | ステップウィザード |
| Pagination | ページネーション |
| Fab | フローティングアクションボタン |
| Divider | 区切り線 |
| Stack | レイアウト |

### アイコン

@mui/icons-material を使用：

| アイコン | 用途 |
|---------|------|
| Home | ホームナビゲーション |
| ThumbUp | いいねボタン |
| EmojiEmotions | ボケるボタン |
| ArrowForward, ArrowBack | ナビゲーション |
| Send | 送信ボタン |
| CloudUpload | アップロードボタン |
| AddCircle, AddCircleOutline | 追加ボタン |
| ListAlt | リスト表示 |

## 認証

### 認証方式
Laravel Sanctum の Personal Access Token を使用したトークンベース認証。

### 認証フロー
1. ログイン/登録時にAPIからトークンを取得
2. トークンをlocalStorageに保存
3. API呼び出し時にAuthorizationヘッダーにトークンを付与

### 認証関連関数（lib/auth.ts）

| 関数 | 説明 |
|------|------|
| getToken() | localStorageからトークン取得 |
| setToken(token) | トークンを保存 |
| clearToken() | トークンを削除 |
| login(email, password) | ログイン |
| logout() | ログアウト |
| register(username, email, password, password_confirmation) | 新規登録 |
| getUser() | ユーザー情報取得 |
| sendPasswordResetLink(email) | パスワードリセットメール送信 |
| resetPassword(email, password, password_confirmation, token) | パスワードリセット |
| updateProfile(userData) | プロフィール更新 |

## API通信

### 環境変数

| 変数名 | 説明 |
|--------|------|
| NEXT_PUBLIC_API_URL | APIエンドポイントURL |
| NEXT_PUBLIC_BACKEND_URL | バックエンドURL（画像表示用） |
| NEXT_PUBLIC_BACKEND_CONTAINER_URL | コンテナ内バックエンドURL |

### 通信関数（lib/fetch.tsx）

| 関数 | 説明 |
|------|------|
| fetchPost(props) | POST リクエスト |
| fetchGet(props) | GET リクエスト |
| buildHeaders(extra) | 認証ヘッダー生成 |
