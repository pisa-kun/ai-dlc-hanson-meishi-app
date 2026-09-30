# Self-Introduction Page (meishi-app)

PCでは通常のWebレイアウト、スマホでは「名刺」レイアウトで表示される自己紹介ページです。
4つのカラーテーマ切り替え、日本語/英語切り替え、写真ギャラリー（メイン1枚＋サブ3枚）に対応しています。

- **Frontend**: Next.js 14 App Router + TypeScript + Tailwind CSS（SSG）
- **i18n**: next-intl（ja / en）
- **State**: React Context + useReducer
- **Animation**: Framer Motion（`prefers-reduced-motion` 対応）
- **Schema**: zod（ビルド時 profile.json 検証）
- **Test**: Vitest + fast-check（プロパティベーステスト：純粋関数）
- **Infrastructure**: AWS CDK v2 (TypeScript) → S3 + CloudFront + OAC

---

## ディレクトリ構成

```
meishi-app/
├── package.json            # npm workspaces のルート（web, infra）
├── web/                    # Next.js フロントエンド
│   ├── app/                # App Router (/[locale]/page.tsx)
│   ├── components/         # UI コンポーネント
│   ├── context/            # AppContext (theme/locale/gallery)
│   ├── data/profile.json   # ★コンテンツの単一情報源（編集ターゲット）
│   ├── schemas/profile.ts  # zod スキーマ
│   ├── config/themes.ts    # カラーテーマ定義
│   ├── lib/                # 純粋関数（contrast, fallback, snsIcon, i18n）
│   ├── messages/           # UIラベル（ja.json / en.json）
│   ├── public/images/      # 顔アイコン・ギャラリー画像
│   └── tests/              # Vitest + fast-check
└── infra/                  # AWS CDK スタック
    ├── bin/meishi-app.ts   # CDK アプリエントリ
    └── lib/meishi-app-stack.ts  # S3 + CloudFront + OAC
```

---

## 前提条件

- **Node.js 20 LTS 以上**（v23 でも動作確認済み）/ npm 10 以上
- AWS にデプロイする場合：
  - AWS CLI v2
  - 有効な AWS 認証情報（`aws configure` または SSO）
  - 対象アカウント・リージョンで CDK Bootstrap 済み
  - 社内プロキシ環境の場合は `NODE_TLS_REJECT_UNAUTHORIZED=0` と `--no-verify-ssl` が必要

---

## セットアップ

```bash
git clone https://github.com/Tom-Panasonic/ai-dlc-hansdon-meishi-app.git
cd ai-dlc-hansdon-meishi-app
npm install
```

`web/` と `infra/` の依存関係が npm workspaces 経由で一括インストールされます。

---

## ローカル開発（localhost で動作確認）

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。`/` は自動的に `/ja/` にリダイレクトされます。

主要動作確認ポイント：

1. **カラーテーマ切替**: ヘッダー左の4つの丸ボタン（黒 / ライム / ローズ / スカイ）をクリック
2. **言語切替**: ヘッダー右の `JP` / `EN` ボタン
3. **写真ギャラリー**: PCサイズでヒーロー領域のサブサムネをクリック → メイン画像が切り替わる
4. **レスポンシブ**: ウィンドウを 768px 未満に縮めると名刺レイアウトに切り替わる

---

## コンテンツ編集

### `web/data/profile.json` を編集

すべてのプロフィール情報（名前、肩書き、SNS URL、スキル、経歴、ポートフォリオ、ブログリンク等）はこのJSONで一元管理されています。スキーマは `web/schemas/profile.ts` に zod で定義されており、ビルド時に検証されます。

多言語フィールドは `{ "ja": "...", "en": "..." }` 形式：

```json
"name": { "ja": "田中 将斗", "en": "Masato Tanaka" }
```

不正なJSONを書くとビルドが失敗します（zod が違反箇所を表示）。

### 画像の差し替え

`web/public/images/` 配下に配置：

- `icon.jpg` — 顔アイコン（スマホ名刺に表示）
- `gallery/main.jpg` — ヒーローのメイン画像
- `gallery/sub-1.png` — サブサムネ1
- `gallery/sub-2.placeholder.svg`, `sub-3.placeholder.svg` — サブサムネ2/3（ダミー）

`profile.json` 内のパスをファイル名に合わせて更新してください。

---

## ビルド

静的ファイルを生成（`web/out/` に出力）：

```bash
npm run build:web
```

内部的には `cross-env NEXT_BUILD_MODE=export next build` が実行され、`web/out/` に静的HTMLが生成されます。

---

## テスト

```bash
npm test
```

- 純粋関数のプロパティベーステスト（`tx`、コントラスト計算）
- スキーマの正常系・異常系
- コンポーネントのスモークテスト（ThemePalette、SubThumbs）
- 4テーマのコントラスト比 WCAG AA 準拠検証

---

## デプロイ（AWS S3 + CloudFront）

### 環境情報

| 項目 | 値 |
|------|-----|
| AWS Profile | `pcms-dev` |
| Region | `ap-northeast-1` |

### 初回のみ：CDK Bootstrap

対象 AWS アカウント・リージョンで初回1度だけ：

```bash
# 社内プロキシ環境の場合
$env:NODE_TLS_REJECT_UNAUTHORIZED=0
$env:AWS_PROFILE='pcms-dev'
$env:CDK_DEFAULT_ACCOUNT='463470975657'
$env:CDK_DEFAULT_REGION='ap-northeast-1'
$env:JSII_SILENCE_WARNING_UNTESTED_NODE_VERSION=1

cd infra
npx cdk bootstrap aws://463470975657/ap-northeast-1
```

### 本番デプロイ（ビルド → S3アップロード → CloudFront invalidation）

```bash
# 1. 環境変数を設定（PowerShell）
$env:NODE_TLS_REJECT_UNAUTHORIZED=0
$env:AWS_PROFILE='pcms-dev'
$env:CDK_DEFAULT_ACCOUNT='463470975657'
$env:CDK_DEFAULT_REGION='ap-northeast-1'
$env:JSII_SILENCE_WARNING_UNTESTED_NODE_VERSION=1

# 2. 静的ビルド
npm run build:web

# 3. CDK デプロイ
cd infra
npx cdk deploy MeishiAppProdStack --require-approval never
```

完了すると、CloudFormation Outputs に `DistributionDomainName` が表示されます。

**初回デプロイ後の反映には CloudFront のグローバル展開で5〜15分かかることがあります。**

### コンテンツ更新時の再デプロイ

```bash
# profile.json や画像を編集後
npm run build:web
cd infra
npx cdk deploy MeishiAppProdStack --require-approval never
```

`BucketDeployment` が自動で S3 同期 + CloudFront `/*` invalidation を実行します。

### 差分プレビュー

```bash
cd infra
npx cdk diff
```

### スタック削除

```bash
cd infra
npx cdk destroy MeishiAppProdStack --force
```

S3バケット内のオブジェクトも削除されます（`autoDeleteObjects: true`）。

---

## トラブルシュート

| 症状 | 対処 |
|------|------|
| `SSL: CERTIFICATE_VERIFY_FAILED` | `$env:NODE_TLS_REJECT_UNAUTHORIZED=0` を設定、AWS CLI には `--no-verify-ssl` を付与 |
| `Cannot find name 'process'` | `infra/tsconfig.json` に `"types": ["node"]` があるか確認 |
| `Error: This stack uses assets, so the toolkit stack must be deployed.` | `npx cdk bootstrap` 未実行 |
| CloudFront にアクセスして 403 | OAC バケットポリシー反映待ち（数分）。または `web/out/` が空 |
| 更新が反映されない | ブラウザの強制リロード（Ctrl+Shift+R）。invalidation 進行中の場合は数分待つ |
| zod バリデーションエラーでビルド失敗 | `web/data/profile.json` のスキーマ違反箇所がエラーメッセージに表示される |

---

## ドキュメント

設計関連の詳細ドキュメントは `aidlc-docs/` 配下にあります：

- `aidlc-docs/inception/requirements/requirements.md` — 要件定義書
- `aidlc-docs/inception/user-stories/stories.md` — ユーザーストーリー（15本）
- `aidlc-docs/construction/frontend/functional-design/` — ドメインモデル / コンポーネント設計
- `aidlc-docs/construction/frontend/nfr-design/` — NFR デザインパターン
- `aidlc-docs/construction/frontend/infrastructure-design/` — CDK構成 / デプロイ手順詳細
