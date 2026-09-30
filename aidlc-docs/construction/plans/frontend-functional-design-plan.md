# Frontend Functional Design Plan

このプランは、フロントエンド（Next.js SSG）の Functional Design を進めるための質問と、承認後の手順チェックリストで構成されています。
各 `[Answer]:` タグの後に選択肢の英字を記入してください。

---

## Part A: 方針決定のための質問

### Question 1: profile.json の言語フィールド構成
プロフィール情報の多言語フィールドはどう持ちますか？

A) フィールド単位で `{ ja, en }` オブジェクトを保持（例: `tagline: { ja: "…", en: "…" }`）
B) ロケール別に `profile.ja.json` と `profile.en.json` の2ファイルに分ける
C) `profile.json` を1ファイルとし、言語非依存項目（URL、画像パス等）と言語依存項目（テキスト）を分離した構造にする
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 2: profile.json のスキーマバリデーション
JSONのバリデーション方法はどうしますか？

A) TypeScript型定義のみ（コンパイル時チェック、ランタイム検証なし）
B) zod でランタイム検証（ビルド時にバリデーションエラーを発行）
C) JSON Schema ＋ ajv でランタイム検証
D) Other (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 3: 状態管理（テーマ・言語切替）
クライアント側の状態管理（現在のテーマ・現在の言語・選択中サブ画像）はどうしますか？

A) React Context + useReducer（軽量・標準）
B) Zustand（より簡潔なAPI）
C) Jotai / Recoil（atomベース）
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 4: 多言語ライブラリ選定
i18n ライブラリはどれにしますか？

A) next-intl（Next.js App Router 公式推奨）
B) react-i18next（汎用・実績豊富）
C) 自作ミニマル実装（小規模なので翻訳ファイルを直接読む）
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 5: テーマ切替の実装パターン
カラーテーマの切替方法はどれにしますか？

A) CSS Variables（`--color-primary` 等）を root に設定し、テーマごとに値を切り替え
B) Tailwind CSS の data-theme 属性 ＋ カスタムカラー定義
C) styled-components / emotion の ThemeProvider
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 6: スクロールアニメーション実装
スクロールアニメーションはどう実装しますか？

A) Framer Motion（whileInView / viewport）を使用
B) Intersection Observer API ＋ 自作CSSクラス切替
C) AOS（Animate On Scroll）ライブラリ
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 7: 写真ギャラリーの画像配置
写真ギャラリー（メイン1枚＋サブ3枚）の画像配置はどうしますか？

A) `public/images/` 配下に配置し、profile.json でパスを指定
B) `next/image` の最適化対象として `import` 経由で読み込み、profile.json では識別キーのみ持つ
C) 画像はすべて `public/profile/` 配下、メイン用とサブ用の命名規則で管理（profile.json では配列のみ）
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 8: SNSアイコン
SNSリンクのアイコンはどう表示しますか？

A) react-icons（Simple Icons セット）
B) lucide-react / heroicons（汎用アイコン）
C) インラインSVG（自前で svg ファイル管理）
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Part B: 承認後に実行する手順チェックリスト

承認後に下記を順番に実行します。

- [x] Step 1: 上記回答を読み取り、ドメインモデル・コンポーネント階層・状態管理戦略を確定する
- [x] Step 2: `aidlc-docs/construction/frontend/functional-design/domain-entities.md` を生成
- [x] Step 3: `aidlc-docs/construction/frontend/functional-design/business-logic-model.md` を生成
- [x] Step 4: `aidlc-docs/construction/frontend/functional-design/business-rules.md` を生成
- [x] Step 5: `aidlc-docs/construction/frontend/functional-design/frontend-components.md` を生成
- [x] Step 6: requirements.md / stories.md とのトレーサビリティ確認（各成果物末尾にマトリクス記載）
- [x] Step 7: aidlc-state.md を更新
- [x] Step 8: audit.md にユーザー承認を記録
- [x] Step 9: フェーズ完了として git commit && git push を実施
