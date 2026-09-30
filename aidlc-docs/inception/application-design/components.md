# コンポーネント定義

## フロントエンドコンポーネント（Next.js）

### FE-01: LayoutComponent
| 項目 | 内容 |
|------|------|
| 目的 | 全ページ共通のレイアウト（ナビゲーション、フッター）を提供 |
| 責務 | ナビゲーションバー表示、カートバッジ更新、認証状態に応じたUI切り替え |
| インターフェース | `children: ReactNode`, `cartCount: number`, `isAuthenticated: boolean` |

### FE-02: ProductListComponent
| 項目 | 内容 |
|------|------|
| 目的 | 商品一覧・検索・フィルタリング画面を提供 |
| 責務 | 商品グリッド表示、キーワード検索、カテゴリフィルター、ページネーション |
| インターフェース | `products: Product[]`, `categories: Category[]`, `onFilter: FilterFn` |

### FE-03: ProductDetailComponent
| 項目 | 内容 |
|------|------|
| 目的 | 商品詳細情報の表示と購入オプション選択 |
| 責務 | 画像ギャラリー、サイズ/カラー選択、在庫確認、カート追加 |
| インターフェース | `product: ProductDetail`, `onAddToCart: AddToCartFn` |

### FE-04: CartComponent
| 項目 | 内容 |
|------|------|
| 目的 | ショッピングカートの表示・編集 |
| 責務 | カートアイテム一覧、数量変更、削除、合計金額計算 |
| インターフェース | `cartItems: CartItem[]`, `onUpdate: UpdateCartFn`, `onRemove: RemoveFn` |

### FE-05: CheckoutComponent
| 項目 | 内容 |
|------|------|
| 目的 | 購入手続き（配送先・決済方法選択・注文確定） |
| 責務 | 配送先住所選択、決済方法選択（Stripe/PayPay）、注文サマリー表示、注文確定 |
| インターフェース | `addresses: Address[]`, `cartSummary: CartSummary`, `onConfirm: ConfirmFn` |

### FE-06: AuthComponent
| 項目 | 内容 |
|------|------|
| 目的 | ソーシャルログイン画面 |
| 責務 | Google/LINEログインボタン表示、OAuthリダイレクト処理、エラー表示 |
| インターフェース | `onLoginSuccess: LoginSuccessFn`, `onLoginError: LoginErrorFn` |

### FE-07: MyPageComponent
| 項目 | 内容 |
|------|------|
| 目的 | ユーザーアカウント管理画面 |
| 責務 | プロフィール表示、注文履歴一覧、配送先住所管理 |
| インターフェース | `user: User`, `orders: Order[]`, `addresses: Address[]` |

### FE-08: OrderCompleteComponent
| 項目 | 内容 |
|------|------|
| 目的 | 注文完了画面 |
| 責務 | 注文番号表示、配送ステータスタイムライン、継続ショッピングへの誘導 |
| インターフェース | `order: OrderConfirmation` |

---

## バックエンドコンポーネント（Golang）

### BE-01: ProductHandler
| 項目 | 内容 |
|------|------|
| 目的 | 商品関連APIエンドポイントの処理 |
| 責務 | 商品一覧取得、商品詳細取得、検索・フィルタリング、在庫確認 |
| インターフェース | HTTP Handler（GET /products, GET /products/:id, GET /products/search） |

### BE-02: AuthHandler
| 項目 | 内容 |
|------|------|
| 目的 | 認証関連APIエンドポイントの処理 |
| 責務 | OAuthコールバック処理、JWTトークン発行、トークンリフレッシュ、ログアウト |
| インターフェース | HTTP Handler（POST /auth/google/callback, POST /auth/line/callback, POST /auth/refresh, POST /auth/logout） |

### BE-03: CartHandler
| 項目 | 内容 |
|------|------|
| 目的 | カート関連APIエンドポイントの処理 |
| 責務 | カート取得、商品追加、数量更新、商品削除 |
| インターフェース | HTTP Handler（GET /cart, POST /cart/items, PUT /cart/items/:id, DELETE /cart/items/:id） |

### BE-04: OrderHandler
| 項目 | 内容 |
|------|------|
| 目的 | 注文関連APIエンドポイントの処理 |
| 責務 | 注文作成、注文一覧取得、注文詳細取得、注文ステータス更新 |
| インターフェース | HTTP Handler（POST /orders, GET /orders, GET /orders/:id） |

### BE-05: PaymentHandler
| 項目 | 内容 |
|------|------|
| 目的 | 決済関連APIエンドポイントの処理 |
| 責務 | Stripe決済セッション作成、PayPay決済リクエスト、Webhookイベント処理 |
| インターフェース | HTTP Handler（POST /payments/stripe/session, POST /payments/paypay/request, POST /payments/webhook） |

### BE-06: UserHandler
| 項目 | 内容 |
|------|------|
| 目的 | ユーザー関連APIエンドポイントの処理 |
| 責務 | プロフィール取得・更新、配送先住所CRUD |
| インターフェース | HTTP Handler（GET /users/me, PUT /users/me, GET/POST/PUT/DELETE /users/me/addresses） |

### BE-07: Repository Layer
| 項目 | 内容 |
|------|------|
| 目的 | データベースアクセスの抽象化 |
| 責務 | PostgreSQL CRUD操作、クエリ最適化、トランザクション管理 |
| インターフェース | Interface定義（ProductRepository, UserRepository, OrderRepository, CartRepository） |

### BE-08: MiddlewareComponent
| 項目 | 内容 |
|------|------|
| 目的 | 横断的関心事の処理 |
| 責務 | JWT認証検証、CORS設定、レートリミット、リクエストロギング、エラーハンドリング |
| インターフェース | Gin Middleware Functions |
