# サービス層定義

## バックエンドサービス（Golang）

### SVC-01: ProductService
| 項目 | 内容 |
|------|------|
| 目的 | 商品ドメインのビジネスロジックを集約 |
| 責務 | 商品一覧取得（ページネーション）、商品詳細取得、検索・フィルタリング、在庫状況判定 |
| 依存 | ProductRepository |
| 主要メソッド | `GetProducts(filter)`, `GetProductByID(id)`, `SearchProducts(keyword, category)` |

### SVC-02: AuthService
| 項目 | 内容 |
|------|------|
| 目的 | 認証・認可のビジネスロジックを集約 |
| 責務 | OAuthトークン検証、ユーザー作成/取得、JWT発行・検証、Refresh Token管理 |
| 依存 | UserRepository, JWTUtil, OAuthClient（Google/LINE） |
| 主要メソッド | `AuthenticateWithGoogle(code)`, `AuthenticateWithLine(code)`, `RefreshAccessToken(refreshToken)`, `ValidateToken(token)` |

### SVC-03: CartService
| 項目 | 内容 |
|------|------|
| 目的 | カートドメインのビジネスロジックを集約 |
| 責務 | カート取得・作成、商品追加（在庫チェック含む）、数量更新、削除、合計金額計算 |
| 依存 | CartRepository, ProductRepository |
| 主要メソッド | `GetCart(userID)`, `AddItem(userID, productID, options)`, `UpdateItem(cartItemID, quantity)`, `RemoveItem(cartItemID)` |

### SVC-04: OrderService
| 項目 | 内容 |
|------|------|
| 目的 | 注文ドメインのビジネスロジックを集約 |
| 責務 | 注文作成（在庫確保・カートクリア）、注文一覧・詳細取得、ステータス管理、注文確認メール送信 |
| 依存 | OrderRepository, CartRepository, ProductRepository, PaymentService, EmailService |
| 主要メソッド | `CreateOrder(userID, addressID, paymentMethod)`, `GetOrders(userID)`, `GetOrderByID(orderID)`, `UpdateStatus(orderID, status)` |

### SVC-05: PaymentService
| 項目 | 内容 |
|------|------|
| 目的 | 決済処理のビジネスロジックを集約 |
| 責務 | Stripe Checkout Session作成、PayPay決済リクエスト、Webhookイベント処理、決済ステータス更新 |
| 依存 | PaymentRepository, OrderRepository, StripeClient, PayPayClient |
| 主要メソッド | `CreateStripeSession(order)`, `CreatePayPayRequest(order)`, `ProcessWebhookEvent(event)` |

### SVC-06: UserService
| 項目 | 内容 |
|------|------|
| 目的 | ユーザードメインのビジネスロジックを集約 |
| 責務 | プロフィール取得・更新、配送先住所CRUD |
| 依存 | UserRepository |
| 主要メソッド | `GetProfile(userID)`, `UpdateProfile(userID, data)`, `GetAddresses(userID)`, `CreateAddress(userID, address)` |

### SVC-07: EmailService
| 項目 | 内容 |
|------|------|
| 目的 | メール送信の抽象化 |
| 責務 | 注文確認メール送信（Amazon SES経由） |
| 依存 | AWS SES Client |
| 主要メソッド | `SendOrderConfirmation(order, user)` |

---

## フロントエンドサービス（Next.js）

### FE-SVC-01: ApiClient
| 項目 | 内容 |
|------|------|
| 目的 | バックエンドAPIとの通信を抽象化 |
| 責務 | HTTPリクエスト送信、認証ヘッダー付与、エラーハンドリング、トークンリフレッシュ |
| 実装 | fetch API ラッパー（Axiosは使用しない） |
| 主要メソッド | `get(url)`, `post(url, body)`, `put(url, body)`, `delete(url)` |

### FE-SVC-02: AuthContext
| 項目 | 内容 |
|------|------|
| 目的 | 認証状態のグローバル管理（React Context） |
| 責務 | ログイン状態保持、ユーザー情報管理、ログイン/ログアウト処理 |
| 実装 | React Context + useReducer |
| 状態 | `user: User \| null`, `isAuthenticated: boolean`, `isLoading: boolean` |

### FE-SVC-03: CartContext
| 項目 | 内容 |
|------|------|
| 目的 | カート状態のグローバル管理（React Context） |
| 責務 | カートアイテム数管理、カート操作のディスパッチ |
| 実装 | React Context + useReducer |
| 状態 | `items: CartItem[]`, `totalCount: number`, `totalAmount: number` |
