# コンポーネントメソッド定義

> 詳細なビジネスロジックはCONSTRUCTION フェーズのFunctional Designで定義します。

---

## フロントエンド（Next.js）

### FE-02: ProductListComponent

| メソッド | シグネチャ | 目的 |
|---------|-----------|------|
| fetchProducts | `(params: ProductQueryParams) => Promise<ProductListResponse>` | 商品一覧をAPIから取得 |
| handleSearch | `(keyword: string) => void` | キーワード検索を実行 |
| handleCategoryFilter | `(categoryId: string \| null) => void` | カテゴリフィルターを適用 |
| handlePageChange | `(page: number) => void` | ページネーション制御 |

### FE-03: ProductDetailComponent

| メソッド | シグネチャ | 目的 |
|---------|-----------|------|
| fetchProductDetail | `(productId: string) => Promise<ProductDetail>` | 商品詳細をAPIから取得 |
| handleSizeSelect | `(size: string) => void` | サイズ選択状態を更新 |
| handleColorSelect | `(colorId: string) => void` | カラー選択状態を更新 |
| handleAddToCart | `(product: ProductDetail, options: CartOptions) => Promise<void>` | カートに商品を追加 |

### FE-04: CartComponent

| メソッド | シグネチャ | 目的 |
|---------|-----------|------|
| fetchCart | `() => Promise<Cart>` | カート内容をAPIから取得 |
| handleQuantityUpdate | `(itemId: string, quantity: number) => Promise<void>` | 商品数量を更新 |
| handleRemoveItem | `(itemId: string) => Promise<void>` | カートから商品を削除 |
| calculateTotal | `(items: CartItem[]) => CartSummary` | 合計金額を計算 |

### FE-05: CheckoutComponent

| メソッド | シグネチャ | 目的 |
|---------|-----------|------|
| fetchAddresses | `() => Promise<Address[]>` | 登録済み配送先住所を取得 |
| handleAddressSelect | `(addressId: string) => void` | 配送先住所を選択 |
| handlePaymentSelect | `(method: PaymentMethod) => void` | 決済方法を選択 |
| handleOrderConfirm | `() => Promise<OrderConfirmation>` | 注文を確定する |
| initiateStripePayment | `(orderId: string) => Promise<void>` | Stripe決済セッションを開始 |
| initiatePayPayPayment | `(orderId: string) => Promise<void>` | PayPay決済を開始 |

### FE-06: AuthComponent

| メソッド | シグネチャ | 目的 |
|---------|-----------|------|
| handleGoogleLogin | `() => void` | Google OAuthフローを開始 |
| handleLineLogin | `() => void` | LINE OAuthフローを開始 |
| handleAuthCallback | `(code: string, provider: OAuthProvider) => Promise<void>` | OAuthコールバックを処理 |
| refreshToken | `() => Promise<void>` | アクセストークンをリフレッシュ |

---

## バックエンド（Golang）

### BE-01: ProductHandler

| メソッド | シグネチャ | 目的 |
|---------|-----------|------|
| GetProducts | `(c *gin.Context)` | 商品一覧を返す（検索・フィルター・ページネーション対応） |
| GetProductByID | `(c *gin.Context)` | 指定IDの商品詳細を返す |
| SearchProducts | `(c *gin.Context)` | キーワード・カテゴリで商品を検索 |

### BE-02: AuthHandler

| メソッド | シグネチャ | 目的 |
|---------|-----------|------|
| GoogleCallback | `(c *gin.Context)` | Google OAuthコールバックを処理しJWTを発行 |
| LineCallback | `(c *gin.Context)` | LINE OAuthコールバックを処理しJWTを発行 |
| RefreshToken | `(c *gin.Context)` | Refresh TokenからアクセストークンJWTを再発行 |
| Logout | `(c *gin.Context)` | Refresh Tokenを無効化 |

### BE-03: CartHandler

| メソッド | シグネチャ | 目的 |
|---------|-----------|------|
| GetCart | `(c *gin.Context)` | 認証ユーザーのカート内容を返す |
| AddCartItem | `(c *gin.Context)` | カートに商品を追加 |
| UpdateCartItem | `(c *gin.Context)` | カートアイテムの数量を更新 |
| RemoveCartItem | `(c *gin.Context)` | カートから商品を削除 |

### BE-04: OrderHandler

| メソッド | シグネチャ | 目的 |
|---------|-----------|------|
| CreateOrder | `(c *gin.Context)` | 注文を作成（在庫確認・決済開始） |
| GetOrders | `(c *gin.Context)` | 認証ユーザーの注文一覧を返す |
| GetOrderByID | `(c *gin.Context)` | 指定IDの注文詳細を返す |
| UpdateOrderStatus | `(c *gin.Context)` | 注文ステータスを更新（Webhook経由） |

### BE-05: PaymentHandler

| メソッド | シグネチャ | 目的 |
|---------|-----------|------|
| CreateStripeSession | `(c *gin.Context)` | Stripe Checkout Sessionを作成 |
| CreatePayPayRequest | `(c *gin.Context)` | PayPay決済リクエストを作成 |
| HandleWebhook | `(c *gin.Context)` | Stripe/PayPay Webhookイベントを処理し注文ステータスを更新 |

### BE-06: UserHandler

| メソッド | シグネチャ | 目的 |
|---------|-----------|------|
| GetProfile | `(c *gin.Context)` | 認証ユーザーのプロフィールを返す |
| UpdateProfile | `(c *gin.Context)` | プロフィールを更新 |
| GetAddresses | `(c *gin.Context)` | 配送先住所一覧を返す |
| CreateAddress | `(c *gin.Context)` | 配送先住所を追加 |
| UpdateAddress | `(c *gin.Context)` | 配送先住所を更新 |
| DeleteAddress | `(c *gin.Context)` | 配送先住所を削除 |

### BE-07: Repository Layer

| インターフェース | 主要メソッド | 目的 |
|---------------|------------|------|
| ProductRepository | `FindAll`, `FindByID`, `Search` | 商品データアクセス |
| UserRepository | `FindByID`, `FindByOAuthID`, `Create`, `Update` | ユーザーデータアクセス |
| CartRepository | `FindByUserID`, `AddItem`, `UpdateItem`, `RemoveItem` | カートデータアクセス |
| OrderRepository | `Create`, `FindByUserID`, `FindByID`, `UpdateStatus` | 注文データアクセス |
| PaymentRepository | `Create`, `UpdateStatus`, `FindByOrderID` | 決済データアクセス |
