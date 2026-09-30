# コンポーネント依存関係

## システム全体アーキテクチャ

```
[ユーザー（ブラウザ/スマートフォン）]
        |
        | HTTPS
        v
[CloudFront CDN]
        |
   +---------+----------+
   |                    |
   v                    v
[S3 静的アセット]   [Next.js App (ECS Fargate)]
                        |
                        | REST API (HTTPS)
                        v
                [ALB (Application Load Balancer)]
                        |
                        v
                [Golang API (ECS Fargate)]
                        |
          +-------------+-------------+
          |             |             |
          v             v             v
    [RDS PostgreSQL] [Stripe API] [LINE/Google OAuth]
                              |
                              v
                        [Amazon SES]
```

---

## フロントエンド依存関係マトリクス

| コンポーネント | 依存先 | 通信方式 |
|--------------|--------|---------|
| FE-01 LayoutComponent | FE-SVC-02 AuthContext, FE-SVC-03 CartContext | Context API |
| FE-02 ProductListComponent | FE-SVC-01 ApiClient | HTTP GET |
| FE-03 ProductDetailComponent | FE-SVC-01 ApiClient, FE-SVC-03 CartContext | HTTP GET / Context |
| FE-04 CartComponent | FE-SVC-01 ApiClient, FE-SVC-03 CartContext | HTTP GET/PUT/DELETE / Context |
| FE-05 CheckoutComponent | FE-SVC-01 ApiClient, FE-SVC-02 AuthContext | HTTP POST |
| FE-06 AuthComponent | FE-SVC-02 AuthContext | Context API |
| FE-07 MyPageComponent | FE-SVC-01 ApiClient, FE-SVC-02 AuthContext | HTTP GET/PUT |
| FE-08 OrderCompleteComponent | FE-SVC-01 ApiClient | HTTP GET |

---

## バックエンド依存関係マトリクス

| ハンドラー | サービス | リポジトリ | 外部サービス |
|-----------|---------|-----------|------------|
| BE-01 ProductHandler | SVC-01 ProductService | ProductRepository | — |
| BE-02 AuthHandler | SVC-02 AuthService | UserRepository | Google OAuth, LINE OAuth |
| BE-03 CartHandler | SVC-03 CartService | CartRepository, ProductRepository | — |
| BE-04 OrderHandler | SVC-04 OrderService | OrderRepository | SVC-05 PaymentService, SVC-07 EmailService |
| BE-05 PaymentHandler | SVC-05 PaymentService | PaymentRepository | Stripe API, PayPay API |
| BE-06 UserHandler | SVC-06 UserService | UserRepository | — |
| BE-08 MiddlewareComponent | SVC-02 AuthService | — | — |

---

## フロントエンド ↔ バックエンド APIマッピング

| フロントエンド操作 | APIエンドポイント | バックエンドハンドラー |
|-----------------|----------------|-------------------|
| 商品一覧取得 | GET /api/v1/products | BE-01 ProductHandler.GetProducts |
| 商品詳細取得 | GET /api/v1/products/:id | BE-01 ProductHandler.GetProductByID |
| 商品検索 | GET /api/v1/products/search | BE-01 ProductHandler.SearchProducts |
| Googleログイン | POST /api/v1/auth/google/callback | BE-02 AuthHandler.GoogleCallback |
| LINEログイン | POST /api/v1/auth/line/callback | BE-02 AuthHandler.LineCallback |
| トークンリフレッシュ | POST /api/v1/auth/refresh | BE-02 AuthHandler.RefreshToken |
| カート取得 | GET /api/v1/cart | BE-03 CartHandler.GetCart |
| カート追加 | POST /api/v1/cart/items | BE-03 CartHandler.AddCartItem |
| カート更新 | PUT /api/v1/cart/items/:id | BE-03 CartHandler.UpdateCartItem |
| カート削除 | DELETE /api/v1/cart/items/:id | BE-03 CartHandler.RemoveCartItem |
| 注文作成 | POST /api/v1/orders | BE-04 OrderHandler.CreateOrder |
| 注文一覧 | GET /api/v1/orders | BE-04 OrderHandler.GetOrders |
| 注文詳細 | GET /api/v1/orders/:id | BE-04 OrderHandler.GetOrderByID |
| Stripe決済 | POST /api/v1/payments/stripe/session | BE-05 PaymentHandler.CreateStripeSession |
| PayPay決済 | POST /api/v1/payments/paypay/request | BE-05 PaymentHandler.CreatePayPayRequest |
| プロフィール取得 | GET /api/v1/users/me | BE-06 UserHandler.GetProfile |
| 住所一覧 | GET /api/v1/users/me/addresses | BE-06 UserHandler.GetAddresses |

---

## データフロー（購入フロー）

```
1. ユーザーが商品選択
   FE-03 → GET /api/v1/products/:id → BE-01 → ProductRepository → RDS

2. カートに追加
   FE-03 → POST /api/v1/cart/items → BE-03 → CartRepository → RDS
   FE-SVC-03 CartContext 更新

3. チェックアウト
   FE-05 → POST /api/v1/orders → BE-04 → OrderService
     → CartRepository（カート取得）
     → ProductRepository（在庫確認）
     → OrderRepository（注文作成）
     → PaymentService（決済セッション作成）
     → Stripe/PayPay API

4. 決済完了（Webhook）
   Stripe/PayPay → POST /api/v1/payments/webhook → BE-05
     → PaymentRepository（ステータス更新）
     → OrderRepository（ステータス更新）
     → EmailService → Amazon SES（確認メール送信）
```
