# NFR Requirements — Frontend (Self-Introduction Page)

## 概要
本ドキュメントは、`requirements.md` の NFR-01〜NFR-05 を Frontend ユニット向けに展開し、各 NFR に対する具体的な目標値・測定方法・受け入れ基準を整理する。

---

## NFR-1: パフォーマンス

| ID | 要件 | 目標値 | 測定方法 | 受け入れ基準 |
|----|------|--------|---------|------------|
| NFR-1.1 | Lighthouse Performance | ≧ 90 | Lighthouse CI（モバイル / スロー4G） | スコア 90 以上 |
| NFR-1.2 | LCP（Largest Contentful Paint） | ≦ 2.5 秒 | Lighthouse / web-vitals | 4G想定で 2.5s 以内 |
| NFR-1.3 | CLS（Cumulative Layout Shift） | ≦ 0.1 | Lighthouse / web-vitals | 0.1 未満 |
| NFR-1.4 | INP（Interaction to Next Paint） | ≦ 200ms | Lighthouse / web-vitals | 200ms 以内（テーマ切替・ギャラリー切替・言語切替） |
| NFR-1.5 | 初期JSバンドルサイズ（gzip後） | ≦ 200 KB | Next.js ビルドレポート | 200KB 以下 |
| NFR-1.6 | 画像サイズ最適化 | WebP / AVIF 対応 | next/image を使用 | Lighthouse の "Use modern image formats" にパス |

**根拠**: 要件 NFR-01 — Lighthouse 90+、LCP 2.5s 以内、SSG 採用。

---

## NFR-2: アクセシビリティ

| ID | 要件 | 目標値 | 測定方法 | 受け入れ基準 |
|----|------|--------|---------|------------|
| NFR-2.1 | WCAG 2.1 準拠レベル | AA | axe-core / Lighthouse Accessibility | スコア 95 以上、重大違反 0 |
| NFR-2.2 | 文字コントラスト比（通常テキスト） | ≧ 4.5:1 | 4テーマ全てで自動テスト（lib/contrast.ts ＋ PBT） | 全テーマでパス |
| NFR-2.3 | キーボード操作 | 全ての操作可能要素にフォーカス可・Enter/Space で起動 | 手動テスト ＋ E2E（任意） | テーマパレット・ギャラリー・言語切替・SNS リンク全て可 |
| NFR-2.4 | スクリーンリーダー対応 | 適切な alt / aria-label / aria-pressed / aria-current | NVDA / VoiceOver で確認 | 主要要素が読み上げられる |
| NFR-2.5 | reduced-motion 対応 | `prefers-reduced-motion: reduce` でアニメ無効化 | DevTools のエミュレーション | 全アニメーションが停止 |
| NFR-2.6 | フォーカス可視化 | `:focus-visible` でアウトライン表示 | 手動テスト | キーボード操作時のみ表示 |

**根拠**: 要件 NFR-02、Story 3.3 / 6.1 / 6.2、business-rules.md BR-2 / BR-5。

---

## NFR-3: 保守性

| ID | 要件 | 目標値 | 受け入れ基準 |
|----|------|--------|------------|
| NFR-3.1 | プロフィール情報の単一源 | `data/profile.json` のみで全コンテンツ管理 | コード変更なしで `profile.json` 編集だけで全項目更新できる |
| NFR-3.2 | スキーマ検証 | zod による build-time 検証 | 不正な profile.json は build エラーで停止 |
| NFR-3.3 | カラーテーマ追加容易性 | `config/themes.ts` の配列に1要素追加 + globals.css に `[data-theme=...]` を追加するだけ | 新テーマ追加に 10 分以内 |
| NFR-3.4 | 多言語追加容易性 | `messages/{locale}.json` 追加 + next-intl 設定 + 各 LocalizedText に新ロケール追加 | 新言語の追加が体系的に可能 |
| NFR-3.5 | TypeScript strict mode | tsconfig `strict: true` | 型エラー 0 |
| NFR-3.6 | Lint / Format | ESLint + Prettier | CI で `npm run lint` / `npm run format:check` パス |

**根拠**: 要件 NFR-03、ユーザー追加要件（profile.json 一元管理 + ビルド時自動取り込み）。

---

## NFR-4: ホスティング・デプロイ

| ID | 要件 | 目標値 | 受け入れ基準 |
|----|------|--------|------------|
| NFR-4.1 | 静的サイト出力 | Next.js 14 `output: 'export'` で `out/` ディレクトリ生成 | `npm run build` 後に `out/` に index.html 等が出力される |
| NFR-4.2 | IaC ツール | AWS CDK v2（TypeScript） | `infra/` ディレクトリに CDK プロジェクト |
| NFR-4.3 | ホスティング構成 | S3 + CloudFront + OAC | プライベートS3、CloudFront経由のみアクセス可 |
| NFR-4.4 | TLS / HTTPS | CloudFront のデフォルト証明書（最小要件） | https:// で配信 |
| NFR-4.5 | デプロイ自動化 | 1コマンド（`npm run deploy`） | ビルド → S3アップロード → CloudFront キャッシュ無効化を一括実行 |
| NFR-4.6 | 環境分離 | 最低限 prod スタック | スタック名 `MeishiAppProdStack`（または同等） |
| NFR-4.7 | デプロイ手順の文書化 | ROOT `README.md` | 前提条件・初回手順・再デプロイ手順が記載される |

**根拠**: 要件 NFR-04、ユーザー追加要件（CDK によるIaC化）。

---

## NFR-5: テスト

| ID | 要件 | 目標値 | 受け入れ基準 |
|----|------|--------|------------|
| NFR-5.1 | テストフレームワーク | Vitest | `npm run test` でユニットテスト実行 |
| NFR-5.2 | プロパティベーステスト | fast-check | `lib/contrast.ts` / `lib/fallback.ts` 等の純粋関数で適用 |
| NFR-5.3 | カバレッジ目標 | 純粋関数: ≧ 90%、コンポーネント: 主要なレンダリングのみ | カバレッジレポートで確認 |
| NFR-5.4 | コンポーネントテスト | 主要コンポーネントのスモークテスト | Vitest + @testing-library/react |
| NFR-5.5 | profile.json バリデーションテスト | zod スキーマの正常系・異常系をPBTでテスト | fast-check で多様な入力を検証 |

**根拠**: 要件 NFR-05、拡張機能設定（PBT: Partial — 純粋関数のみ）。

---

## NFR-6: セキュリティ（最小要件のみ）

セキュリティ拡張は無効（要件分析で B 選択）。最小限の常識的ガードのみ規定する。

| ID | 要件 | 目標値 |
|----|------|--------|
| NFR-6.1 | 外部リンクの安全化 | `target="_blank"` 利用箇所には必ず `rel="noopener noreferrer"` |
| NFR-6.2 | 機密情報の扱い | `profile.json` には個人公開情報のみ。秘密情報・APIキーは含めない |
| NFR-6.3 | 静的サイトゆえの制約 | サーバーサイド処理なし。XSS等のリスクは React のデフォルトエスケープに依拠 |

---

## NFR トレーサビリティ

| 元の要件 | 本ドキュメントの ID |
|---------|------------------|
| NFR-01 パフォーマンス | NFR-1.1〜1.6 |
| NFR-02 アクセシビリティ | NFR-2.1〜2.6 |
| NFR-03 保守性 | NFR-3.1〜3.6 |
| NFR-04 ホスティング | NFR-4.1〜4.7 |
| NFR-05 テスト | NFR-5.1〜5.5 |
| 最小セキュリティ | NFR-6.1〜6.3 |

---

## 品質ゲート（Build & Test ステージで検証）

- [ ] `npm run build` 成功
- [ ] `npm run lint` エラー 0
- [ ] `npm run test` 全パス
- [ ] Lighthouse Performance ≧ 90、Accessibility ≧ 95
- [ ] 4テーマ全てで WCAG AA コントラスト比パス（自動テスト）
- [ ] CDK `npm run deploy` で S3 + CloudFront にデプロイ成功
