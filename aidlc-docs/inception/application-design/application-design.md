# アプリケーション設計書（統合版）

## 設計方針サマリー

| 項目 | 決定内容 |
|------|---------|
| フロントエンド状態管理 | React Context + useReducer（外部ライブラリなし） |
| バックエンドAPI | RESTful API + OpenAPI（Swagger）仕様書自動生成 |
| データベース | Amazon RDS（PostgreSQL） |
| 認証方式 | JWT（アクセストークン）+ Refresh Token（HTTPOnly Cookie） |
| レンダリング戦略 | SSR（サーバーサイドレンダリング）メイン |

---

## システム構成概要

本システムは2つの独立したユニットで構成されます：

- **Unit 1: Frontend** — Next.js (App Router) + TypeScript
- **Unit 2: Backend** — Golang (Gin Framework) + PostgreSQL

---

## フロントエンドアーキテクチャ

### コンポーネント構成（8コンポーネント）

| ID | コンポーネント | 役割 |
|----|--------------|------|
| FE-01 | LayoutComponent | 共通レイアウト（ナビ・フッター） |
| FE-02 | ProductListComponent | 商品一覧・検索・フィルター |
| FE-03 | ProductDetailComponent | 商品詳細・購入オプション |
| FE-04 | CartComponent | カート管理 |
| FE-05 | CheckoutComponent | 購入手続き・決済 |
| FE-06 | AuthComponent | ソーシャルログイン |
| FE-07 | MyPageComponent | アカウント管理 |
| FE-08 | OrderCompleteComponent | 注文完了 |

### グローバル状態管理（React Context）

| Context | 管理状態 |
|---------|---------|
| AuthContext | ユーザー情報、認証状態、ローディング |
| CartContext | カートアイテム、合計数量、合計金額 |

### ページルーティング（Next.js App Router）

| パス | コンポーネント | レンダリング |
|------|--------------|------------|
| `/` | ProductListComponent | SSR |
| `/products/[id]` | ProductDetailComponent | SSR |
| `/cart` | CartComponent | SSR（認証必須） |
| `/checkout` | CheckoutComponent | SSR（認証必須） |
| `/orders/complete` | OrderCompleteComponent | SSR（認証必須） |
| `/login` | AuthComponent | SSR |
| `/mypage` | MyPageComponent | SSR（認証必須） |

---

## バックエンドアーキテクチャ

### レイヤー構成

```
Handler Layer（HTTP）
    ↓
Service Layer（ビジネスロジック）
    ↓
Repository Layer（データアクセス）
    ↓
Database（PostgreSQL）
```

### APIエンドポイント一覧（OpenAPI生成対象）

| グループ | エンドポイント数 | ハンドラー |
|---------|:-------------:|---------|
| 商品 | 3 | BE-01 ProductHandler |
| 認証 | 4 | BE-02 AuthHandler |
| カート | 4 | BE-03 CartHandler |
| 注文 | 3 | BE-04 OrderHandler |
| 決済 | 3 | BE-05 PaymentHandler |
| ユーザー | 6 | BE-06 UserHandler |
| **合計** | **23** | |

### データモデル（主要エンティティ）

| エンティティ | 主要フィールド |
|------------|-------------|
| User | id, oauth_provider, oauth_id, email, name, created_at |
| Product | id, name, description, price, category_id, images, variants |
| ProductVariant | id, product_id, size, color, stock_quantity |
| Cart | id, user_id, items |
| CartItem | id, cart_id, product_variant_id, quantity |
| Order | id, user_id, address_id, status, total_amount, created_at |
| OrderItem | id, order_id, product_variant_id, quantity, unit_price |
| Payment | id, order_id, provider, status, amount, provider_payment_id |
| Address | id, user_id, postal_code, prefecture, city, street, name |

---

## 外部サービス統合

| サービス | 用途 | 統合方式 |
|---------|------|---------|
| Google OAuth2 | ソーシャルログイン | OAuth2 Authorization Code Flow |
| LINE Login | ソーシャルログイン | OAuth2 Authorization Code Flow |
| Stripe | クレジットカード決済 | Stripe Checkout + Webhook |
| PayPay | 電子マネー決済 | PayPay API + Webhook |
| Amazon SES | 注文確認メール | AWS SDK for Go |
| Amazon RDS | PostgreSQL | database/sql + pgx driver |

---

## 詳細ドキュメント参照

- コンポーネント定義: `components.md`
- メソッド定義: `component-methods.md`
- サービス層: `services.md`
- 依存関係: `component-dependency.md`
