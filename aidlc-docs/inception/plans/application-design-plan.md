# アプリケーション設計計画

要件・ユーザーストーリー・モックデザインを踏まえ、コンポーネント設計の方針を決定するための質問です。
各質問の `[Answer]:` タグの後に選択肢のアルファベットを記入してください。

---

## Question 1
フロントエンドの状態管理ライブラリはどれを使用しますか？

A) Zustand（軽量・シンプル、Next.js との相性が良い）
B) Redux Toolkit（大規模・厳格な状態管理）
C) React Context + useReducer（外部ライブラリなし）
D) TanStack Query（サーバー状態管理に特化）+ Zustand（クライアント状態）
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 2
バックエンドのAPIアーキテクチャスタイルはどれを使用しますか？

A) RESTful API（リソースベース、シンプル）
B) RESTful API + OpenAPI（Swagger）仕様書自動生成
C) GraphQL
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 3
データベース設計の方針はどれを選択しますか？

A) Amazon RDS（PostgreSQL）— リレーショナル、トランザクション整合性重視
B) Amazon DynamoDB — NoSQL、スケーラビリティ重視
C) RDS（PostgreSQL）をメインに、セッション/キャッシュにElastiCache（Redis）を併用
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4
認証トークン管理の方式はどれを選択しますか？

A) JWT（アクセストークン）+ Refresh Token（HTTPOnly Cookie）
B) AWS Cognito（マネージドサービス、ソーシャルログイン統合が容易）
C) セッションベース認証（サーバーサイドセッション）
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5
フロントエンドのレンダリング戦略はどれを選択しますか？

A) SSG（静的生成）メイン — 商品ページをビルド時に生成、高速
B) SSR（サーバーサイドレンダリング）メイン — 常に最新データ、SEO重視
C) ハイブリッド — 商品一覧/詳細はISR（増分静的再生成）、カート/マイページはCSR
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## 実行チェックリスト（生成フェーズ用）

### フェーズ1: コンポーネント定義
- [x] components.md の作成（フロントエンド・バックエンド両方）

### フェーズ2: メソッド定義
- [x] component-methods.md の作成

### フェーズ3: サービス層設計
- [x] services.md の作成

### フェーズ4: 依存関係定義
- [x] component-dependency.md の作成

### フェーズ5: 統合ドキュメント
- [x] application-design.md の作成（全成果物の統合）
