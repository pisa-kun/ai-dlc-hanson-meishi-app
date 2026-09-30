# Story Generation Plan

このプランは、ユーザーストーリー生成の方針を決定するための質問と、承認後に実行する手順チェックリストで構成されています。
各 `[Answer]:` タグの後に選択肢の英字を記入してください。

---

## Part A: 方針決定のための質問

### Question 1: ペルソナ設定
このページの訪問者として最も重要なペルソナは誰ですか？

A) 採用担当者・ヘッドハンター（経歴・スキルを評価する）
B) 同業エンジニア・デザイナー（技術的な交流・コラボの相手を探す）
C) 採用担当者 ＋ 同業エンジニア（両方を主要ペルソナとする）
D) 採用担当者 ＋ 同業エンジニア ＋ 友人・知人（3ペルソナで構成）
E) Other (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 2: ストーリー粒度
ストーリーの粒度はどうしますか？

A) エピックレベル（大きな機能単位、5〜8本程度）
B) 中粒度（機能を分割、10〜15本程度）
C) 細粒度（受け入れ基準ごとに分割、20本以上）
D) Other (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 3: ストーリー記述形式
ストーリーの記述形式はどれにしますか？

A) シンプルな As a / I want / So that のみ
B) As a / I want / So that ＋ Given-When-Then 形式の受け入れ基準
C) As a / I want / So that ＋ 受け入れ基準（箇条書き）
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 4: ストーリー編成方法
ストーリーの編成（グルーピング）はどうしますか？

A) ユーザージャーニーベース（訪問者の体験フローに沿って並べる）
B) 機能ベース（コンテンツ表示・テーマ切替・言語切替などで分類）
C) ペルソナベース（ペルソナごとにストーリーをグルーピング）
D) Other (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 5: ページオーナー（自分）視点のストーリー
ページオーナー（自分）がコンテンツを管理する視点のストーリーも含めますか？

A) 含める（プロフィール情報・カラー・スキル等を設定ファイルで管理する視点も明文化）
B) 含めない（訪問者視点のみに絞る）
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 6: 受け入れ基準の詳細度
受け入れ基準の詳細度はどうしますか？

A) 主要シナリオのみ（ハッピーパス中心）
B) 主要シナリオ ＋ 主要なエッジケース（画面サイズ境界・カラー切替の即時反映など）
C) 主要シナリオ ＋ エッジケース ＋ エラーケース（画像読み込み失敗等）
D) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Part B: 承認後に実行する手順チェックリスト

承認後に下記を順番に実行します。

- [x] Step 1: 上記質問の回答を読み取り、ペルソナ・粒度・形式・編成方法を確定する
- [x] Step 2: `aidlc-docs/inception/user-stories/personas.md` を生成（決定したペルソナ数・属性・動機・ニーズを記載）
- [x] Step 3: `aidlc-docs/inception/user-stories/stories.md` を生成
  - エピック構造（決定した編成方法に従う）
  - 各ストーリーは As a / I want / So that 形式
  - 受け入れ基準を選定された形式で記載
  - 各ストーリーに対応するペルソナを明記
  - INVEST 基準（Independent / Negotiable / Valuable / Estimable / Small / Testable）を満たす
- [x] Step 4: 要件定義書（requirements.md）の機能要件 FR-01〜FR-06 とのトレーサビリティを stories.md 末尾にマッピング
- [x] Step 5: aidlc-state.md を更新（User Stories ステージ完了）
- [x] Step 6: audit.md にユーザー承認を記録
- [x] Step 7: フェーズ完了として git commit && git push を実施
