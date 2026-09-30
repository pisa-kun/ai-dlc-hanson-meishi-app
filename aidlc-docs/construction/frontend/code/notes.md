# Implementation Notes

## 設計判断・トレードオフ

### 1. レスポンシブ切替を CSS のみで実装
ビューポート判定をJSで行うとSSRハイドレーション時にFOUCが起きるため、`.layout-web` / `.layout-card` を `@media (min-width: 768px)` で切替える方式を採用。両レイアウトのDOMが常にマウントされるが、表示領域は片側のみ。CLS 防止に寄与。

### 2. テーマ色は CSS Variables で単一源化
`config/themes.ts` には UI メタデータ（key / 表示名 / スウォッチ色 / デフォルトフラグ）のみを保持し、実際の色定義は `globals.css` の `[data-theme="..."]` セレクタ内にまとめた。これにより：
- カラーテーマ追加 = `themes.ts` に1行 + `globals.css` に `[data-theme="..."]` ブロック追加
- Tailwind 側は `colors: { primary: 'var(--color-primary)', ... }` で参照、`bg-primary` など通常のクラスがそのまま動的テーマに追従

### 3. AppContext の中でロケール変更時に URL も同期
`useApp` 内 `useEffect` で URL 末尾セグメント（`/ja/...` ↔ `/en/...`）を `router.replace` する。これにより next-intl のメッセージ取得とブラウザ履歴・SEO の整合が取れる。スクロール位置とテーマ選択は保持（Story 5.1 エッジケース）。

### 4. 写真ギャラリー：サブには現在のメイン画像を表示しない
`SubThumbs` は `excludeId={currentMainId}` を渡され、メイン昇格中の画像をサムネに含めない。これにより同じ画像を2箇所に出さず、視覚的な混乱を防ぐ。サブ最大枚数は要件の3枚に固定。

### 5. SafeImage：next/image のフォールバック
`onError` 時にイニシャル文字を表示する単純なプレースホルダ。next/image の `placeholder="blur"` は静的アセットでないと使いづらいため、自前実装。

### 6. zod バリデーションは Server Component で実行
`app/[locale]/layout.tsx` と `page.tsx` の両方で `ProfileSchema.parse()` するが、Next.js の SSG ビルドで両方ともビルド時に解決される。失敗時はビルドエラーとなり、デプロイ前に必ず気づく。

### 7. 画像はSVGプレースホルダのみ同梱
リポジトリに JPEG を含めると差し替えが面倒になるため、すべて SVG のテキストプレースホルダ。ユーザーは `web/public/images/` 配下のファイルを差し替え、`profile.json` のパスを更新するだけで OK。

### 8. CDK の `S3BucketOrigin.withOriginAccessControl`
旧来の OAI ではなく、AWS が推奨する OAC パターンを採用。CDK v2.150 以降で `aws-cdk-lib/aws-cloudfront-origins` の `S3BucketOrigin.withOriginAccessControl` ヘルパが利用可能。バケットポリシーは CDK が自動付与。

### 9. PBT を純粋関数のみに限定
拡張設定で「PBT: Partial（純粋関数のみ）」を選択したため、`lib/contrast.ts` と `lib/fallback.ts` のみ PBT 対象。コンポーネントは @testing-library/react によるスモークテスト。

### 10. 4テーマすべてで WCAG AA を担保するテスト
`tests/unit/themeContrast.test.ts` で `globals.css` の値をハードコピーして検証。CSS と TS で値が二重管理になるが、テーマ追加時は両方更新する運用とする（オプション：CSS をパースして値を取得するテストにすれば二重管理を解消可能だが、初版はシンプルに）。

---

## 既知の制限・将来の改善

- **写真ギャラリーが3枚未満**: コードは `images.length` に応じて自動調整（サブ0枚なら `<ul>` 自体非表示）。
- **next/image の最適化**: `output: 'export'` のため `images.unoptimized: true` で画像最適化はビルド時に静的に行われる。差し替える画像は事前に最適化（webp化など）を推奨。
- **CloudFront カスタムドメイン**: 本リリースでは `*.cloudfront.net` のデフォルトドメインのみ。将来 Route 53 + ACM で独自ドメイン化可能。
- **CI/CD**: 現在は手動デプロイ。GitHub Actions + OIDC で自動化可。

---

## 動作確認ポイント（localhost）

```bash
npm install
npm run dev
```

→ http://localhost:3000

確認したいこと：
- [ ] PC幅でヒーローの写真ギャラリー（メイン＋サブ3枚）が表示される
- [ ] サブをクリック／タップでメイン画像がフェードして切り替わる
- [ ] 768px 未満に絞ると名刺レイアウトに切り替わる
- [ ] テーマパレットで4色（黒/ライム/ローズ/スカイ）を切り替えると配色が滑らかに変化する
- [ ] JP/EN で言語が即時切り替わる
- [ ] スクロールするとセクションがフェードイン
- [ ] SNSリンクが新タブで開く
