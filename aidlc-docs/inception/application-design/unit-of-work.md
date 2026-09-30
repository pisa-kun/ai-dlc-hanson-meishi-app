# 作業単位（Units of Work）定義

## リポジトリ構成

**モノレポ構成** — 1リポジトリ内に3ユニットを管理

```
verde-ec/                          # リポジトリルート
├── frontend/                      # Unit 1: Frontend (Next.js)
├── backend/                       # Unit 2: Backend (Golang)
├── infrastructure/                # Unit 3: Infrastructure (AWS CDK)
├── .github/                       # CI/CDワークフロー
└── README.md
```

---

## Unit 1: Frontend（Next.js）

| 項目 | 内容 |
|------|------|
| **ユニット名** | frontend |
| **技術スタック** | Next.js 14 (App Router) / TypeScript / Tailwind CSS |
| **責務** | ユーザー向け全画面のUI実装、SSRによるページ配信、バックエンドAPIとの通信 |
| **デプロイ先** | AWS ECS Fargate（Next.jsサーバー）+ CloudFront |
| **独立性** | バックエンドAPIのモックがあれば独立して開発・テスト可能 |

### ディレクトリ構成（Next.js標準）

```
frontend/
├── app/                           # App Router ページ
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (shop)/
│   │   ├── page.tsx               # トップ / 商品一覧
│   │   ├── products/
│   │   │   └── [id]/
│   │   │       └── page.tsx       # 商品詳細
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   └── orders/
│   │       └── complete/
│   │           └── page.tsx
│   ├── mypage/
│   │   └── page.tsx
│   ├── layout.tsx                 # ルートレイアウト
│   └── globals.css
├── components/                    # 再利用可能コンポーネント
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   └── ProductGallery.tsx
│   ├── cart/
│   │   └── CartItem.tsx
│   ├── checkout/
│   │   └── PaymentSelector.tsx
│   └── ui/                        # 汎用UIコンポーネント
│       ├── Button.tsx
│       ├── Badge.tsx
│       └── Toast.tsx
├── contexts/                      # React Context
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── lib/                           # ユーティリティ・APIクライアント
│   ├── api-client.ts
│   └── utils.ts
├── types/                         # TypeScript型定義
│   └── index.ts
├── public/                        # 静的ファイル
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Unit 2: Backend（Golang）

| 項目 | 内容 |
|------|------|
| **ユニット名** | backend |
| **技術スタック** | Go 1.22 / Gin Framework / GORM / PostgreSQL |
| **責務** | REST API提供、ビジネスロジック実装、データ永続化、外部サービス統合 |
| **デプロイ先** | AWS ECS Fargate + ALB |
| **独立性** | PostgreSQLとDockerがあれば独立して開発・テスト可能 |

### ディレクトリ構成（Clean Architecture）

```
backend/
├── cmd/
│   └── server/
│       └── main.go                # エントリーポイント
├── internal/
│   ├── domain/                    # ドメイン層（エンティティ・リポジトリIF）
│   │   ├── product.go
│   │   ├── user.go
│   │   ├── cart.go
│   │   ├── order.go
│   │   └── payment.go
│   ├── usecase/                   # ユースケース層（サービス）
│   │   ├── product_service.go
│   │   ├── auth_service.go
│   │   ├── cart_service.go
│   │   ├── order_service.go
│   │   ├── payment_service.go
│   │   └── user_service.go
│   ├── handler/                   # ハンドラー層（HTTP）
│   │   ├── product_handler.go
│   │   ├── auth_handler.go
│   │   ├── cart_handler.go
│   │   ├── order_handler.go
│   │   ├── payment_handler.go
│   │   └── user_handler.go
│   ├── infrastructure/            # インフラ層（DB・外部サービス）
│   │   ├── repository/
│   │   │   ├── product_repository.go
│   │   │   ├── user_repository.go
│   │   │   ├── cart_repository.go
│   │   │   ├── order_repository.go
│   │   │   └── payment_repository.go
│   │   └── external/
│   │       ├── stripe_client.go
│   │       ├── paypay_client.go
│   │       ├── google_oauth.go
│   │       ├── line_oauth.go
│   │       └── ses_client.go
│   └── middleware/
│       ├── auth.go                # JWT検証
│       ├── cors.go
│       ├── rate_limit.go
│       └── logger.go
├── pkg/                           # 共有ユーティリティ
│   ├── jwt/
│   │   └── jwt.go
│   └── config/
│       └── config.go
├── migrations/                    # DBマイグレーション
│   └── *.sql
├── docs/                          # OpenAPI自動生成（swaggo）
│   └── swagger.yaml
├── Dockerfile
├── go.mod
└── go.sum
```

---

## Unit 3: Infrastructure（AWS CDK）

| 項目 | 内容 |
|------|------|
| **ユニット名** | infrastructure |
| **技術スタック** | AWS CDK (TypeScript) |
| **責務** | AWSリソースのIaC定義（ECS、RDS、CloudFront、S3、ALB、VPC等） |
| **デプロイ先** | AWS（CDK deploy） |
| **独立性** | AWSアカウントとCDK CLIがあれば独立してデプロイ可能 |

### ディレクトリ構成

```
infrastructure/
├── bin/
│   └── verde-ec.ts                # CDKアプリエントリーポイント
├── lib/
│   ├── stacks/
│   │   ├── network-stack.ts       # VPC、サブネット、セキュリティグループ
│   │   ├── database-stack.ts      # RDS PostgreSQL
│   │   ├── backend-stack.ts       # ECS Fargate（Golang API）+ ALB
│   │   ├── frontend-stack.ts      # ECS Fargate（Next.js）+ CloudFront
│   │   └── storage-stack.ts       # S3（画像ストレージ）
│   └── constructs/                # 再利用可能CDKコンストラクト
├── cdk.json
├── tsconfig.json
└── package.json
```
