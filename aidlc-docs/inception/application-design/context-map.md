# コンテキストマップ

ユニット間のデータフローと依存関係を可視化します。

---

## 1. システム全体コンテキストマップ

```mermaid
flowchart TB
    User(["👤 ユーザー\n（ブラウザ/スマートフォン）"])

    subgraph UNIT1["Unit 1: Frontend（Next.js / ECS Fargate）"]
        direction TB
        AuthCtx["AuthContext\n認証状態管理"]
        CartCtx["CartContext\nカート状態管理"]
        Pages["Pages\n商品/カート/決済/マイページ"]
        ApiClient["ApiClient\nHTTP通信層"]
        Pages --> AuthCtx
        Pages --> CartCtx
        Pages --> ApiClient
    end

    subgraph UNIT2["Unit 2: Backend（Golang / ECS Fargate）"]
        direction TB
        Middleware["Middleware\nJWT認証 / CORS / Rate Limit"]
        Handlers["Handlers\nProduct/Auth/Cart/Order/Payment/User"]
        Services["Services\nビジネスロジック"]
        Repos["Repositories\nデータアクセス層"]
        Middleware --> Handlers
        Handlers --> Services
        Services --> Repos
    end

    subgraph UNIT3["Unit 3: Infrastructure（AWS CDK）"]
        direction TB
        VPC["VPC / Subnet\nネットワーク"]
        ECS["ECS Fargate\nコンテナ実行環境"]
        RDS["RDS PostgreSQL\nデータベース"]
        CF["CloudFront\nCDN"]
        ALB["ALB\nロードバランサー"]
        S3["S3\n画像ストレージ"]
        SES["Amazon SES\nメール送信"]
        VPC --> ECS
        VPC --> RDS
        ECS --> ALB
        CF --> ECS
    end

    subgraph EXTERNAL["外部サービス"]
        Google["Google OAuth2"]
        LINE["LINE Login"]
        Stripe["Stripe\n決済"]
        PayPay["PayPay\n決済"]
    end

    User -->|"HTTPS"| CF
    CF -->|"SSR リクエスト"| UNIT1
    ApiClient -->|"REST API\n/api/v1/..."| ALB
    ALB -->|"HTTP"| Handlers
    Repos -->|"SQL"| RDS
    Services -->|"Webhook"| Stripe
    Services -->|"Webhook"| PayPay
    Services -->|"OAuth callback"| Google
    Services -->|"OAuth callback"| LINE
    Services -->|"SendEmail"| SES
    UNIT3 -.->|"デプロイ設定提供"| UNIT1
    UNIT3 -.->|"デプロイ設定提供"| UNIT2

    style UNIT1 fill:#EAFDFF,stroke:#7CFC00,stroke-width:3px,color:#1a1a1a
    style UNIT2 fill:#f0fff0,stroke:#5BBB00,stroke-width:3px,color:#1a1a1a
    style UNIT3 fill:#fff9e6,stroke:#f0a500,stroke-width:3px,color:#1a1a1a
    style EXTERNAL fill:#f5f5f5,stroke:#999,stroke-width:2px,color:#1a1a1a
    style User fill:#CE93D8,stroke:#6A1B9A,stroke-width:2px,color:#1a1a1a
```

---

## 2. データフロー詳細マップ（購入フロー）

```mermaid
sequenceDiagram
    actor User as 👤 ユーザー
    participant FE as Unit1: Frontend
    participant BE as Unit2: Backend
    participant DB as RDS PostgreSQL
    participant Stripe as Stripe API
    participant SES as Amazon SES

    User->>FE: 商品一覧を閲覧
    FE->>BE: GET /api/v1/products
    BE->>DB: SELECT products
    DB-->>BE: 商品データ
    BE-->>FE: ProductListResponse
    FE-->>User: 商品一覧表示

    User->>FE: 商品をカートに追加
    FE->>BE: POST /api/v1/cart/items
    BE->>DB: INSERT cart_items + 在庫確認
    DB-->>BE: OK
    BE-->>FE: CartResponse
    FE-->>User: カートバッジ更新

    User->>FE: 購入手続きへ
    FE->>BE: POST /api/v1/orders
    BE->>DB: BEGIN TRANSACTION
    BE->>DB: INSERT orders + order_items
    BE->>Stripe: Create Checkout Session
    Stripe-->>BE: session_url
    DB-->>BE: COMMIT
    BE-->>FE: OrderResponse + session_url
    FE-->>User: Stripe決済画面へリダイレクト

    User->>Stripe: 決済情報入力・確定
    Stripe->>BE: POST /api/v1/payments/webhook
    BE->>DB: UPDATE orders SET status='confirmed'
    BE->>SES: SendOrderConfirmation
    SES-->>User: 注文確認メール
    BE-->>FE: リダイレクト（注文完了ページ）
    FE-->>User: 注文完了画面表示
```

---

## 3. ユニット間インターフェース定義

```mermaid
flowchart LR
    subgraph IF1["Unit1 ↔ Unit2 インターフェース"]
        direction TB
        OAS["OpenAPI仕様書\nbackend/docs/swagger.yaml"]
        Types["TypeScript型定義\nfrontend/types/index.ts"]
        Env1["環境変数\nNEXT_PUBLIC_API_BASE_URL"]
    end

    subgraph IF2["Unit2 ↔ Unit3 インターフェース"]
        direction TB
        ECR["ECRイメージURI\nDockerイメージタグ"]
        Secrets["AWS Secrets Manager\nDB接続情報 / APIキー"]
        Env2["環境変数\nDATABASE_URL / JWT_SECRET"]
    end

    subgraph IF3["Unit1 ↔ Unit3 インターフェース"]
        direction TB
        CFUrl["CloudFront URL\nCDKスタック出力"]
        Env3["環境変数\nNEXT_PUBLIC_CDN_URL"]
    end

    UNIT1(["Unit 1\nFrontend"]) --- IF1
    IF1 --- UNIT2(["Unit 2\nBackend"])
    UNIT2 --- IF2
    IF2 --- UNIT3(["Unit 3\nInfra"])
    UNIT1 --- IF3
    IF3 --- UNIT3

    style UNIT1 fill:#EAFDFF,stroke:#7CFC00,stroke-width:2px
    style UNIT2 fill:#f0fff0,stroke:#5BBB00,stroke-width:2px
    style UNIT3 fill:#fff9e6,stroke:#f0a500,stroke-width:2px
```

---

## 4. ユニット間依存関係サマリー

| 依存元 | 依存先 | 依存種別 | インターフェース |
|--------|--------|---------|----------------|
| Unit 1 Frontend | Unit 2 Backend | 実行時（Runtime） | REST API（OpenAPI仕様） |
| Unit 1 Frontend | Unit 3 Infrastructure | デプロイ時（Deploy） | CloudFront URL、ECS設定 |
| Unit 2 Backend | Unit 3 Infrastructure | デプロイ時（Deploy） | ECS設定、RDS接続情報、Secrets Manager |
| Unit 2 Backend | Stripe | 実行時（Runtime） | Stripe SDK / Webhook |
| Unit 2 Backend | PayPay | 実行時（Runtime） | PayPay REST API / Webhook |
| Unit 2 Backend | Google OAuth | 実行時（Runtime） | OAuth2 Authorization Code Flow |
| Unit 2 Backend | LINE Login | 実行時（Runtime） | OAuth2 Authorization Code Flow |
| Unit 2 Backend | Amazon SES | 実行時（Runtime） | AWS SDK for Go |

---

## テキスト代替表現（Mermaid非対応環境向け）

```
システム全体構成:
  ユーザー
    → [HTTPS] → CloudFront (Unit3)
    → [SSR] → Next.js Frontend (Unit1)
    → [REST API] → ALB (Unit3)
    → [HTTP] → Golang Backend (Unit2)
    → [SQL] → RDS PostgreSQL (Unit3)

外部サービス連携 (Unit2から):
  → Google OAuth2 (認証)
  → LINE Login (認証)
  → Stripe (決済)
  → PayPay (決済)
  → Amazon SES (メール)

ユニット間依存:
  Unit1 --実行時依存--> Unit2 (REST API)
  Unit1 --デプロイ依存--> Unit3 (CloudFront/ECS)
  Unit2 --デプロイ依存--> Unit3 (ECS/RDS/ALB)
```
