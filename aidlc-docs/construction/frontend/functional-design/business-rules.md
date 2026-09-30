# Business Rules — Frontend (Self-Introduction Page)

## 概要
ビジネスルールを (1) profile.json バリデーション、(2) カラーテーマのアクセシビリティ、(3) 翻訳フォールバック、(4) 画像フォールバック、(5) UIインタラクションの5カテゴリで整理する。

---

## BR-1: profile.json バリデーションルール

**目的**: ビルド時に不正な profile.json を検出し、デプロイ前に必ず修正する。

| ルールID | 対象 | 制約 | 違反時挙動 |
|---------|------|------|-----------|
| BR-1.1 | `profile.basic.name.ja`, `name.en` | 必須・1文字以上 | ビルドエラー |
| BR-1.2 | `profile.basic.iconImagePath` | 必須・空文字不可 | ビルドエラー |
| BR-1.3 | `profile.gallery` | 1要素以上必須 | ビルドエラー |
| BR-1.4 | `profile.gallery[*].isDefaultMain` | 高々1つだけ true（複数 true は禁止） | ビルドエラー（refine） |
| BR-1.5 | `profile.gallery` の推奨枚数 | 4枚（メイン1＋サブ3） | 4枚未満は警告のみ。BR-1.5b 参照 |
| BR-1.5b | サブ画像枚数 | 0〜3枚（PC/タブレット時の表示） | 3枚未満なら不足分のサムネイル枠を非表示 |
| BR-1.6 | `profile.sns[*].url`, `portfolio[*].url`, `blog[*].url` | 有効なURL（zod の `.url()`） | ビルドエラー |
| BR-1.7 | `profile.career[*].startDate` | ISO 8601（`YYYY-MM`） | ビルドエラー |
| BR-1.8 | `profile.career[*].endDate` | ISO 8601 または null | ビルドエラー |
| BR-1.9 | `profile.career[*].endDate` が指定された場合 | `startDate <= endDate` であること | ビルドエラー（refine） |
| BR-1.10 | `LocalizedText` の各フィールド | `ja`, `en` 両方必須 | ビルドエラー |

**実装上のヒント**: zod の `.refine()` で BR-1.4・BR-1.9 を表現する。

---

## BR-2: カラーテーマのアクセシビリティ（WCAG AA）

**目的**: どのテーマでも文字可読性を担保する（FR-03-7、NFR-02-2）。

| ルールID | 対象 | 制約 |
|---------|------|------|
| BR-2.1 | `text` 色 vs `background` 色 | コントラスト比 ≧ 4.5:1（通常テキスト WCAG AA） |
| BR-2.2 | `textMuted` 色 vs `background` 色 | コントラスト比 ≧ 4.5:1 |
| BR-2.3 | `text` 色 vs `surface` 色 | コントラスト比 ≧ 4.5:1 |
| BR-2.4 | `primary` 色（リンク・アクセント）vs `background` 色 | コントラスト比 ≧ 3:1（UIコンポーネント基準）。primary 上に文字を載せる場合は `primary` の上で 4.5:1 を満たす文字色を別途定義 |
| BR-2.5 | テーマ定義時の検証 | コード生成フェーズで4テーマすべてに対して上記比率を確認。違反テーマは `text` / `background` / `surface` を見直す |

**4テーマの想定設計（コード生成フェーズで最終決定）**

| テーマ | primary | background | surface | text | textMuted | 備考 |
|--------|---------|-----------|---------|------|-----------|------|
| mono   | `#000000` | `#FFFFFF` | `#F5F5F5` | `#111111` | `#555555` | デフォルト |
| lime   | `#7CFC00` | `#0E1A0E` | `#162616` | `#EAFFEA` | `#A8C8A8` | ダーク背景＋ライム差し色 |
| rose   | `#B33E5C` | `#FFF7F8` | `#FBE9EE` | `#1F1216` | `#5A3946` | 暖色明るめ |
| sky    | `#89C3EB` | `#0F1B23` | `#16242E` | `#E6F3FB` | `#A0BFD3` | ダーク背景＋スカイ差し色 |

※上記は設計案。コード生成時にコントラスト計算で再調整。

---

## BR-3: 翻訳フォールバック規則

**目的**: 翻訳キーが欠落・空文字でも表示崩れを起こさない（FR-05、Story 5.2）。

| ルールID | 状況 | 動作 |
|---------|------|------|
| BR-3.1 | `LocalizedText.en` が空文字 or undefined | `ja` の値を表示 |
| BR-3.2 | `LocalizedText.ja` が空文字 or undefined | `en` の値を表示 |
| BR-3.3 | 両方欠落 | UI上は空文字を返すが、開発時は console.warn で警告（本番では無音） |
| BR-3.4 | next-intl の翻訳キー（UIラベル）欠落 | `messages/ja.json` の値にフォールバック。それも欠落なら翻訳キー文字列をそのまま表示 |

**実装ヒント**: `function tx(text: LocalizedText, locale: Locale): string` を作り、上記ルールを集約。

---

## BR-4: 画像フォールバック規則

**目的**: 画像読み込み失敗・リソース不足でもUIを破綻させない。

| ルールID | 状況 | 動作 |
|---------|------|------|
| BR-4.1 | `iconImagePath` 読み込み失敗 | 名前イニシャル（先頭1文字）を背景円付きで表示 |
| BR-4.2 | `gallery[*].path` 読み込み失敗 | 該当枠にプレースホルダ画像（汎用シルエット）を表示。他のサブ画像は通常通り操作可能 |
| BR-4.3 | `portfolio[*].thumbnailPath` 読み込み失敗 | 汎用プレースホルダ画像を表示。リンク自体は機能する |
| BR-4.4 | サブ画像3枚に満たない場合 | 不足分のサムネイル枠を DOM 上に出さない（BR-1.5b と整合） |

**実装ヒント**: `next/image` の `onError` ハンドラで state を切替、フォールバックUIを出す。

---

## BR-5: UIインタラクションルール

| ルールID | 対象 | ルール |
|---------|------|--------|
| BR-5.1 | 外部リンク | `target="_blank"` ＋ `rel="noopener noreferrer"` を必須（Story 1.3, 4.1） |
| BR-5.2 | テーマパレットボタン | `aria-pressed` を選択中ボタンに付与 |
| BR-5.3 | ギャラリーサブサムネイル | `<button>` 要素として実装（キーボード対応）。選択中は `aria-current="true"` |
| BR-5.4 | 言語切替ボタン | `aria-pressed` を選択中ロケールに付与 |
| BR-5.5 | アニメーション | `prefers-reduced-motion: reduce` 設定時はアニメーション無効化（Story 6.1） |
| BR-5.6 | フォーカスリング | キーボード操作時のみ可視化（`:focus-visible`） |
| BR-5.7 | 連打耐性 | テーマ切替・ギャラリー切替は同一state更新で冪等。連打しても遷移途中でもUIは正しく追従 |
| BR-5.8 | スクロール位置保持（言語切替時） | `currentLocale` 切替時にスクロール位置を変更しない（FR-05、Story 5.1 エッジケース） |

---

## BR-6: レスポンシブ表示の境界規則

| ルールID | 条件 | レイアウト |
|---------|------|-----------|
| BR-6.1 | viewport ≧ 1024px | Web版（多カラムグリッド） |
| BR-6.2 | 768px ≦ viewport < 1024px | Web版（2カラムグリッドに縮退、ギャラリーは表示） |
| BR-6.3 | viewport < 768px | 名刺レイアウト（写真1枚、ギャラリー非表示） |
| BR-6.4 | 境界値（767px / 768px / 1023px / 1024px） | Storyの受け入れ基準（境界エッジケース）に従って明確に切替 |
