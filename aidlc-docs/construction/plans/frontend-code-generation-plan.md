# Frontend Code Generation Plan

## ユニットコンテキスト

| 項目 | 内容 |
|------|------|
| ユニット名 | frontend（単一ユニット） |
| ワークスペースルート | `c:\Users\4101480\Documents\kiro-handson` |
| 構成 | npm workspaces：`web/`（Next.js SSG）+ `infra/`（AWS CDK） |
| 担当ストーリー | Story 1.1 / 1.1b / 1.2 / 1.3 / 1.4 / 2.1 / 2.2 / 2.3 / 3.1 / 3.2 / 3.3 / 3.4 / 4.1 / 5.1 / 5.2 / 6.1 / 6.2（計15ストーリー） |
| 外部依存 | AWS（S3 / CloudFront）— デプロイ時のみ |
| 既存コード | なし（新規作成）。`verde-ec/` は別プロジェクトにつき影響なし |

---

## 全体方針

- **Server Components 優先**：`'use client'` は状態を持つコンポーネント（AppProvider 配下）に限定
- **i18nルーティング**：`app/[locale]/` セグメントで `ja` / `en` を提供。ルート `/` は `/ja` にリダイレクト（client navigation）
- **profile.json は Server Component で zod parse**：ビルド時検証 → Client Components へ props 渡し
- **状態管理**：AppContext（テーマ・ロケール・ギャラリー選択）。永続化なし
- **テーマ実装**：CSS Variables ＋ `[data-theme="..."]` 切替 ＋ Tailwind の arbitrary values
- **アニメ**：Framer Motion（`useReducedMotion` 対応）
- **デプロイ**：CDK + S3 + CloudFront + OAC（infra/ 配下）

---

## ディレクトリ構成（最終）

```
kiro-handson/
├── README.md                         # ROOT: ビルド・デプロイ手順
├── package.json                      # workspaces (web, infra)
├── .gitignore                        # 既存に追記（web/.next, web/out, infra/cdk.out）
├── web/
│   ├── package.json
│   ├── next.config.mjs               # output: 'export', images.unoptimized: true
│   ├── next-intl.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   ├── vitest.config.ts
│   ├── .eslintrc.json
│   ├── app/
│   │   ├── layout.tsx                # RootLayout (基本HTMLとmetadata)
│   │   ├── page.tsx                  # / → /ja に redirect
│   │   ├── globals.css               # CSS Variables / [data-theme] / base styles
│   │   └── [locale]/
│   │       ├── layout.tsx            # NextIntlClientProvider + AppProvider
│   │       └── page.tsx              # メインページ（Server Component で profile parse）
│   ├── components/
│   │   ├── layout/{Header,Footer,WebLayout,BusinessCardLayout}.tsx
│   │   ├── hero/{HeroWeb,BasicInfo,Gallery,MainImage,SubThumbs}.tsx
│   │   ├── card/BusinessCard.tsx
│   │   ├── sections/{SkillsSection,CareerSection,AchievementsSection,PortfolioSection,BlogSection}.tsx
│   │   ├── controls/{ThemePalette,LanguageSwitcher}.tsx
│   │   └── common/{SnsLinks,IconImage,AnimatedSection,LocalizedTextView,SafeImage}.tsx
│   ├── context/AppContext.tsx
│   ├── data/profile.json             # サンプル付き
│   ├── schemas/profile.ts            # zod スキーマ
│   ├── config/themes.ts              # ColorTheme[] 定数
│   ├── lib/{fallback.ts,contrast.ts,themeSelectors.ts,i18n.ts,snsIcon.ts}
│   ├── messages/{ja.json,en.json}
│   ├── public/images/{icon.placeholder.svg, gallery/*.placeholder.svg, portfolio/*.placeholder.svg}
│   └── tests/
│       ├── unit/
│       │   ├── fallback.property.test.ts        # PBT
│       │   ├── contrast.property.test.ts        # PBT
│       │   ├── appReducer.test.ts
│       │   └── profileSchema.test.ts
│       └── components/
│           ├── ThemePalette.test.tsx
│           └── SubThumbs.test.tsx
├── infra/
│   ├── package.json
│   ├── cdk.json
│   ├── tsconfig.json
│   ├── bin/meishi-app.ts
│   ├── lib/meishi-app-stack.ts
│   └── test/meishi-app-stack.test.ts
└── aidlc-docs/                       # 既存。本フェーズの成果物サマリは ./construction/frontend/code/ に格納
```

**画像のプレースホルダ方針**: 実際のJPEG画像を含めず、SVGプレースホルダを配置。ユーザーが `web/data/profile.json` と画像ファイルを差し替えるだけで使える状態にする。

---

## 実行ステップ（チェックリスト）

### Step 1: Project Structure Setup（ROOT・workspaces）
- [x] ROOT `package.json` を作成（workspaces: `web`, `infra`、統合スクリプト）
- [x] `.gitignore` に `web/.next/`, `web/out/`, `infra/cdk.out/`, `infra/cdk.context.json`, ワークスペース各 `node_modules/` を追記

### Step 2: Web Workspace Bootstrap
- [x] `web/package.json`（Next.js 14 / TypeScript / Tailwind / next-intl / zod / framer-motion / react-icons / Vitest / fast-check 等）
- [x] `web/tsconfig.json`（strict, paths `@/*`）
- [x] `web/next.config.mjs`（`output: 'export'`、`images.unoptimized: true`、`trailingSlash: true`）
- [x] `web/tailwind.config.ts` ＋ `web/postcss.config.mjs`
- [x] `web/.eslintrc.json`（`next/core-web-vitals`）
- [x] `web/vitest.config.ts`（jsdom）
- [x] `web/next-intl.config.ts`（locales `['ja','en']`、defaultLocale `'ja'`）

### Step 3: Domain & Schemas
- [x] `web/schemas/profile.ts` — zod スキーマ（domain-entities.md 準拠、BR-1.4 / BR-1.9 を `.refine()` で実装）
- [x] `web/config/themes.ts` — `THEMES` 定数（mono/lime/rose/sky）

### Step 4: Pure Functions（PBT 対象）
- [x] `web/lib/fallback.ts` — `tx(text, locale)` 翻訳フォールバック
- [x] `web/lib/contrast.ts` — `relativeLuminance` / `contrastRatio` / `hexToRgb` / `WCAG_AA_NORMAL`
- [x] `web/lib/themeSelectors.ts` — `themeFromKey` / `getDefaultTheme` / `getThemeKeys`
- [x] `web/lib/snsIcon.ts` — platform 値 → react-icons コンポーネント解決
- [x] `web/lib/i18n.ts` — next-intl の `getRequestConfig`

### Step 5: i18n Messages
- [x] `web/messages/ja.json` — UIラベル（hero / sections / controls / errors）
- [x] `web/messages/en.json` — 同上の英訳

### Step 6: State Management（Context + Reducer）
- [x] `web/context/AppContext.tsx` — `AppProvider`, `useApp`, `appReducer`
- [x] `<html data-theme>` の useEffect 副作用

### Step 7: Sample Data
- [x] `web/data/profile.json` — 全エンティティを埋めたサンプル（タロウさん）
- [x] `web/public/images/icon.placeholder.svg` ＋ gallery/sub-{1,2,3}.placeholder.svg ＋ portfolio/p1.placeholder.svg

### Step 8: Global Styles
- [x] `web/app/globals.css` — CSS Variables / `[data-theme="..."]` 4テーマ / base typography / `:focus-visible` / `prefers-reduced-motion` ガード

### Step 9: App Router Layouts
- [x] `web/app/layout.tsx` — RootLayout（メタデータ、フォント、html lang は `[locale]/layout` 側で動的）
- [x] `web/app/page.tsx` — `/` → `/ja` にリダイレクト（next/navigation の redirect）
- [x] `web/app/[locale]/layout.tsx` — NextIntlClientProvider ＋ AppProvider のセット

### Step 10: Page Composition（Server Component）
- [x] `web/app/[locale]/page.tsx` — Server で `ProfileSchema.parse(profileJson)`、`<Header /><WebLayout /><BusinessCardLayout /><Footer />` を配置

### Step 11: Common Components
- [x] `LocalizedTextView` — `tx()` ラッパ
- [x] `SafeImage` — onError でプレースホルダにフォールバック（BR-4）
- [x] `IconImage` — 顔アイコン用
- [x] `SnsLinks` — react-icons（FaGithub / FaLinkedin / SiQiita / SiZenn / FaXTwitter / FaGlobe）
- [x] `AnimatedSection` — Framer Motion `whileInView` ＋ `useReducedMotion`

### Step 12: Controls
- [x] `ThemePalette` — 4つの丸ボタン、`aria-pressed`、ツールチップ、Tabキーで巡回
- [x] `LanguageSwitcher` — JP/EN ボタン、`aria-pressed`

### Step 13: Hero & Gallery
- [x] `BasicInfo` — 名前 / 肩書き / 一言
- [x] `Gallery` — `MainImage` ＋ `SubThumbs`
- [x] `MainImage` — Framer Motion `AnimatePresence` でクロスフェード
- [x] `SubThumbs` — `<button>` 配列、`aria-current`、Enter/Space 対応
- [x] `HeroWeb` — Gallery + BasicInfo + SnsLinks の grid

### Step 14: Sections
- [x] `SkillsSection` / `CareerSection` / `AchievementsSection` / `PortfolioSection` / `BlogSection` — 0件時は null

### Step 15: Layouts
- [x] `Header` — ThemePalette + LanguageSwitcher
- [x] `Footer` — シンプルなコピーライト
- [x] `WebLayout` — PC/タブレット用、`@media (min-width: 768px)` で表示
- [x] `BusinessCardLayout` — スマホ用、`@media (max-width: 767px)` で表示
- [x] `BusinessCard` — リッチ名刺カード（写真1枚 + 名前/肩書/タグ/SNS）

### Step 16: Tests — Unit (PBT 含む)
- [x] `tests/unit/fallback.property.test.ts` — `tx()` の不変条件テスト
- [x] `tests/unit/contrast.property.test.ts` — `contrastRatio` の対称性・範囲・自己同一
- [x] `tests/unit/appReducer.test.ts` — reducer の各 action
- [x] `tests/unit/profileSchema.test.ts` — 正常系 + 異常系（BR-1 違反）

### Step 17: Tests — Component
- [x] `tests/components/ThemePalette.test.tsx` — クリックで dispatch、aria-pressed 切替
- [x] `tests/components/SubThumbs.test.tsx` — クリック / Enter / Space / aria-current

### Step 18: Theme Contrast Compliance Test
- [x] `tests/unit/themeContrast.test.ts` — 4テーマ全色組で WCAG AA を検証（NFR-2.2 / P-12）

### Step 19: Infra (CDK) Workspace Bootstrap
- [x] `infra/package.json`（aws-cdk-lib / constructs / aws-cdk / typescript / ts-node）
- [x] `infra/cdk.json`（`app: npx ts-node bin/meishi-app.ts`）
- [x] `infra/tsconfig.json`

### Step 20: CDK Stack Implementation
- [x] `infra/bin/meishi-app.ts` — App エントリ、prod スタック作成、Tags 一括付与
- [x] `infra/lib/meishi-app-stack.ts` — S3 / OAC / CloudFront / BucketDeployment / CfnOutput

### Step 21: CDK Snapshot Test
- [x] `infra/test/meishi-app-stack.test.ts` — 主要リソース数とプロパティの assertion

### Step 22: ROOT README.md
- [x] 概要 / アーキテクチャ要約 / 前提条件 / セットアップ / ローカル開発 / プロフィール編集 / デプロイ / トラブルシュート / 詳細ドキュメント参照

### Step 23: Code Generation Summary（aidlc-docs/construction/frontend/code/）
- [x] `aidlc-docs/construction/frontend/code/generated-files.md` — 生成ファイル一覧 ＋ ストーリー対応
- [x] `aidlc-docs/construction/frontend/code/notes.md` — 実装メモ（特殊な判断・トレードオフ）

### Step 24: Local Verification 案内
- [x] aidlc-state.md / audit.md を更新
- [x] localhost 起動コマンド（`npm install` ＋ `npm run dev`）をユーザーに案内

### Step 25: Phase Commit & Push
- [x] `git add -A` ＋ commit ＋ push（フェーズ完了ルール）

---

## ストーリー → 実装ステップのトレーサビリティ

| Story | 実装ステップ |
|-------|------------|
| 1.1 基本プロフィール | Step 7, 11, 13, 15 |
| 1.1b 写真ギャラリー | Step 13 |
| 1.2 スキル・経歴・実績 | Step 14 |
| 1.3 ポートフォリオ | Step 14 |
| 1.4 ブログ | Step 14 |
| 2.1 PCレイアウト | Step 8, 10, 15 |
| 2.2 スマホ名刺 | Step 8, 15 |
| 2.3 タブレット | Step 8, 15 |
| 3.1〜3.4 テーマ切替 | Step 3, 4, 6, 8, 12 |
| 4.1 SNSリンク | Step 4, 11 |
| 5.1〜5.2 多言語 | Step 4, 5, 6, 9, 11 |
| 6.1 スクロールアニメ | Step 11 |
| 6.2 ホバー/フォーカス | Step 8, 12, 13 |
| NFR-4 系（CDK） | Step 19, 20, 21, 22 |

---

## 範囲・前提

- **生成範囲**: 上記ファイル一式。テストはコード生成のみ（実行は Build & Test ステージ）
- **依存インストール**: `npm install` は実行しない（ユーザーが localhost 検証時に実行）
- **画像**: SVGプレースホルダのみ。実画像はユーザーが配置
- **ドメイン**: 設定なし（CloudFrontのデフォルト `*.cloudfront.net` のみ）
- **Author**: `tanaka.masato <tanaka.masato@jp.panasonic.com>` でcommit
- **完了条件**: 全 Step が `[x]`、全成果物がリポジトリに格納、ROOT README.md が存在、ローカル起動コマンドが案内済み
