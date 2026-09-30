# ユニット分割計画

アプリケーション設計の内容を踏まえ、作業単位（Units of Work）の分割方針を決定するための質問です。
各質問の `[Answer]:` タグの後に選択肢のアルファベットを記入してください。

---

## Question 1
フロントエンドとバックエンドのリポジトリ構成はどれを希望しますか？

A) モノレポ（1リポジトリにfrontend/backendディレクトリを分けて管理）
B) 分離リポジトリ（frontend・backendを別々のリポジトリで管理）
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2
フロントエンドのディレクトリ構成はどれを希望しますか？

A) Feature-based（機能単位: features/product, features/cart, features/auth...）
B) Layer-based（レイヤー単位: components, hooks, services, contexts...）
C) Next.js標準（app/, components/, lib/, types/...）
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 3
バックエンドのディレクトリ構成はどれを希望しますか？

A) Clean Architecture（domain/, usecase/, infrastructure/, handler/）
B) Standard Go Layout（cmd/, internal/, pkg/）
C) シンプル構成（handlers/, services/, repositories/, models/）
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4
インフラコード（IaC）はどのように管理しますか？

A) 別ユニット（Unit 3: Infrastructure）として独立管理（Terraform or AWS CDK）
B) バックエンドユニット内に含める
C) 初期バージョンではIaCコードは不要（手動構築）
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## 実行チェックリスト（生成フェーズ用）

### フェーズ1: ユニット定義
- [x] unit-of-work.md の作成

### フェーズ2: 依存関係定義
- [x] unit-of-work-dependency.md の作成

### フェーズ3: ストーリーマッピング
- [x] unit-of-work-story-map.md の作成

### フェーズ4: コンテキストマップ（追加指示）
- [x] context-map.md の作成（Mermaid図によるユニット間関係性の可視化）
