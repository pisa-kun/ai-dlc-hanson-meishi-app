# Generated Files — Frontend (Self-Introduction Page)

## ROOT
- `package.json` — npm workspaces ルート（`web`, `infra`）+ 統合スクリプト
- `.gitignore` — 既存に追記（cdk.out, .next, out 等）
- `README.md` — ビルド・デプロイ手順（NFR-04-9 対応）

## Web (Next.js SSG)
### 設定
- `web/package.json`, `web/tsconfig.json`, `web/next.config.mjs`
- `web/next-intl.config.ts`, `web/tailwind.config.ts`, `web/postcss.config.mjs`
- `web/.eslintrc.json`, `web/vitest.config.ts`, `web/next-env.d.ts`

### App Router
- `web/app/layout.tsx`（Root）
- `web/app/page.tsx`（`/` → `/ja` redirect）
- `web/app/[locale]/layout.tsx`（`<html>` ＋ AppProvider ＋ NextIntlClientProvider ＋ profile.json zod parse）
- `web/app/[locale]/page.tsx`（Server Component で profile を確定 → Header / Layouts / Footer）
- `web/app/globals.css`（CSS Variables 4テーマ ＋ レイアウト切替ユーティリティ）

### Domain & Logic
- `web/schemas/profile.ts`（zod）
- `web/config/themes.ts`（THEMES 定数）
- `web/lib/i18n.ts` / `fallback.ts` / `contrast.ts` / `themeSelectors.ts` / `snsIcon.ts`

### State
- `web/context/AppContext.tsx`（AppProvider + appReducer + URL同期）

### Data & Assets
- `web/data/profile.json`（サンプル）
- `web/messages/ja.json` / `en.json`
- `web/public/images/icon.placeholder.svg`
- `web/public/images/gallery/{main,sub-1,sub-2,sub-3}.placeholder.svg`
- `web/public/images/portfolio/p1.placeholder.svg`

### Components
- `web/components/layout/{Header,Footer,WebLayout,BusinessCardLayout}.tsx`
- `web/components/hero/{HeroWeb,BasicInfo,Gallery,MainImage,SubThumbs}.tsx`
- `web/components/card/BusinessCard.tsx`
- `web/components/sections/{SkillsSection,CareerSection,AchievementsSection,PortfolioSection,BlogSection}.tsx`
- `web/components/controls/{ThemePalette,LanguageSwitcher}.tsx`
- `web/components/common/{SnsLinks,IconImage,SafeImage,AnimatedSection,LocalizedTextView}.tsx`

### Tests
- `web/tests/setup.ts`
- `web/tests/unit/fallback.property.test.ts`（PBT）
- `web/tests/unit/contrast.property.test.ts`（PBT）
- `web/tests/unit/themeContrast.test.ts`（4テーマ WCAG AA 検証）
- `web/tests/unit/profileSchema.test.ts`
- `web/tests/unit/appReducer.test.ts`
- `web/tests/components/ThemePalette.test.tsx`
- `web/tests/components/SubThumbs.test.tsx`

## Infra (AWS CDK)
- `infra/package.json`, `infra/tsconfig.json`, `infra/cdk.json`, `infra/.gitignore`
- `infra/bin/meishi-app.ts`（App エントリ＋スタックタグ）
- `infra/lib/meishi-app-stack.ts`（S3 / OAC / CloudFront / BucketDeployment / CfnOutput）
- `infra/test/meishi-app-stack.test.ts`（Template スナップショット assertion）

---

## ストーリー → 実装マッピング（実装済みフラグ）

| Story | 実装ファイル | 状態 |
|-------|------------|------|
| 1.1 基本プロフィール | `BasicInfo`, `BusinessCard`, `profile.json` | [x] |
| 1.1b 写真ギャラリー | `Gallery`, `MainImage`, `SubThumbs` | [x] |
| 1.2 スキル・経歴・実績 | `SkillsSection`, `CareerSection`, `AchievementsSection` | [x] |
| 1.3 ポートフォリオ | `PortfolioSection` | [x] |
| 1.4 ブログ | `BlogSection` | [x] |
| 2.1 PCレイアウト | `WebLayout`, `globals.css` | [x] |
| 2.2 スマホ名刺 | `BusinessCardLayout`, `BusinessCard`, `globals.css` | [x] |
| 2.3 タブレット | `WebLayout`（grid）, `globals.css` | [x] |
| 3.1〜3.4 テーマ切替 | `ThemePalette`, `AppContext`, `themes.ts`, `globals.css` | [x] |
| 4.1 SNSリンク | `SnsLinks`, `snsIcon.ts` | [x] |
| 5.1〜5.2 多言語 | `LanguageSwitcher`, `i18n.ts`, `messages/*.json`, `tx()` | [x] |
| 6.1 スクロールアニメ | `AnimatedSection`（Framer Motion） | [x] |
| 6.2 ホバー/フォーカス | 全コンポーネント Tailwind ＋ globals.css `:focus-visible` | [x] |
| NFR-4 系（CDK） | `infra/bin/`, `infra/lib/` | [x] |

すべての担当ストーリーの実装が完了しました。
