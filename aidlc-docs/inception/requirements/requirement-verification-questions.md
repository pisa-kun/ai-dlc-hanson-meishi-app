# 要件確認質問

「自分の自己紹介ページ」の要件をより明確にするため、以下の質問にお答えください。
各質問の `[Answer]:` タグの後に、選択肢の英字（A、B、C...）を記入してください。
選択肢に該当するものがない場合は最後の選択肢（Other）を選び、内容を記述してください。

---

## Question 1
自己紹介ページに掲載したいコンテンツはどれですか？（複数該当する場合は最も優先度の高いものを選択）

A) 基本プロフィール（名前、写真、肩書き、一言メッセージ）のみ
B) 基本プロフィール ＋ スキル・経歴・実績
C) 基本プロフィール ＋ スキル・経歴 ＋ ポートフォリオ・作品集
D) 基本プロフィール ＋ スキル・経歴 ＋ ポートフォリオ ＋ ブログ・記事リンク
E) Other (please describe after [Answer]: tag below)

[Answer]: D

---

## Question 2
SNS・連絡先リンクの掲載はどうしますか？

A) 掲載しない
B) メールアドレスのみ
C) GitHub / LinkedIn など技術系SNSのみ
D) Twitter/X、Instagram などSNS全般
E) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 3
スマホ表示（名刺デザイン）に含めたい情報はどれですか？

A) 名前・肩書き・連絡先のみ（シンプル名刺）
B) 名前・肩書き・写真・連絡先（スタンダード名刺）
C) 名前・肩書き・写真・スキルタグ・連絡先（リッチ名刺）
D) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 4
カラーテーマの切り替え機能について、どのような操作方法にしますか？

A) ページ上部にカラーパレット（丸いボタン）を並べてクリックで切り替え
B) ドロップダウンメニューで選択して切り替え
C) ページ右下にフローティングボタンとして配置
D) Other (please describe after [Answer]: tag below)

[Answer]: D(Aかも、指定したカラーコードを丸いボタンを数個配置)

---

## Question 5
選択したカラーテーマは次回アクセス時も保持しますか？

A) 保持する（ブラウザのlocalStorageに保存）
B) 保持しない（毎回デフォルトカラーで表示）
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 6
デフォルト（初期表示）のカラーテーマはどうしますか？

A) 自分で決めたい（後で具体的なカラーコードを指定する）
B) AIに提案してほしい（センスの良い配色を提案してもらう）
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7
技術スタックについて、希望はありますか？

A) シンプルなHTML/CSS/JavaScript（フレームワークなし）
B) React（Vite または Create React App）
C) Next.js（SSG/静的サイト生成）
D) Vue.js
E) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 8
ページのホスティング（公開方法）について、希望はありますか？

A) まだ決めていない（コードだけ生成してほしい）
B) GitHub Pages
C) Vercel
D) Netlify
E) Other (please describe after [Answer]: tag below)

[Answer]: E(AWS S3の静的webサイトホスティング)

---

## Question 9
アニメーション・インタラクションについて、どの程度取り入れますか？

A) なし（静的なページ）
B) 最小限（フェードイン程度）
C) 適度（スクロールアニメーション、ホバーエフェクトなど）
D) リッチ（パーティクル、3Dエフェクトなど）
E) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 10
多言語対応は必要ですか？

A) 日本語のみ
B) 英語のみ
C) 日本語・英語の切り替え機能あり
D) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 11（拡張機能：セキュリティ）
このプロジェクトにセキュリティ拡張ルールを適用しますか？

A) Yes — すべてのセキュリティルールをブロッキング制約として適用（本番グレードのアプリに推奨）
B) No — セキュリティルールをスキップ（PoC・プロトタイプ・実験的プロジェクトに適切）
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 12（拡張機能：プロパティベーステスト）
プロパティベーステスト（PBT）ルールを適用しますか？

A) Yes — すべてのPBTルールをブロッキング制約として適用（ビジネスロジック・データ変換を含むプロジェクトに推奨）
B) Partial — 純粋関数とシリアライゼーションのみPBTルールを適用
C) No — PBTルールをスキップ（シンプルなCRUD・UIのみのプロジェクトに適切）
D) Other (please describe after [Answer]: tag below)

[Answer]: B

---
