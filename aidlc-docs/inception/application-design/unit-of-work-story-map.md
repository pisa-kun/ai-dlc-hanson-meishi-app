# ユーザーストーリー × ユニットマッピング

## マッピング表

| ストーリーID | ストーリー名 | Unit 1 Frontend | Unit 2 Backend | Unit 3 Infra |
|------------|------------|:---------------:|:--------------:|:------------:|
| US-01-01 | 商品一覧の閲覧 | ✅ ProductListComponent | ✅ ProductHandler / ProductService | ✅ CloudFront + ECS |
| US-01-02 | キーワード検索 | ✅ ProductListComponent（検索UI） | ✅ ProductHandler.SearchProducts | — |
| US-01-03 | カテゴリフィルタリング | ✅ ProductListComponent（フィルターUI） | ✅ ProductHandler.GetProducts（filter） | — |
| US-01-04 | 商品詳細の確認 | ✅ ProductDetailComponent | ✅ ProductHandler.GetProductByID | — |
| US-02-01 | ソーシャルログイン | ✅ AuthComponent | ✅ AuthHandler / AuthService | ✅ Cognito or JWT設定 |
| US-02-02 | 配送先住所の管理 | ✅ MyPageComponent（住所管理） | ✅ UserHandler / UserService | — |
| US-03-01 | カートへの商品追加 | ✅ ProductDetailComponent（追加ボタン）/ CartContext | ✅ CartHandler / CartService | — |
| US-03-02 | カートの確認・編集 | ✅ CartComponent | ✅ CartHandler / CartService | — |
| US-04-01 | 購入手続き（チェックアウト） | ✅ CheckoutComponent | ✅ OrderHandler / PaymentHandler | ✅ Stripe/PayPay設定 |
| US-04-02 | 注文完了の確認 | ✅ OrderCompleteComponent | ✅ OrderHandler / EmailService | ✅ SES設定 |
| US-05-01 | 注文履歴の確認 | ✅ MyPageComponent（注文履歴） | ✅ OrderHandler.GetOrders | — |
| US-06-01 | モバイルファーストの快適な操作 | ✅ 全コンポーネント（Tailwind CSS） | — | ✅ CloudFront（CDN高速化） |
| US-06-02 | ブランドカラーによる統一されたUI | ✅ 全コンポーネント（#7CFC00/#EAFDFF） | — | — |

## エピック別ユニット負荷

| エピック | Frontend | Backend | Infrastructure |
|---------|:--------:|:-------:|:--------------:|
| EP-01 商品閲覧・検索 | 高 | 中 | 低 |
| EP-02 ユーザー認証 | 中 | 高 | 中 |
| EP-03 ショッピングカート | 高 | 中 | 低 |
| EP-04 注文・決済 | 高 | 高 | 中 |
| EP-05 注文管理 | 中 | 中 | 低 |
| EP-06 UX・デザイン | 高 | 低 | 中 |

## 全ストーリーのユニット割り当て確認

- **Unit 1 Frontend**: 13/13ストーリーに関与（UI実装）
- **Unit 2 Backend**: 11/13ストーリーに関与（API実装）
- **Unit 3 Infrastructure**: 5/13ストーリーに関与（インフラ設定）
- **未割り当てストーリー**: なし ✅
