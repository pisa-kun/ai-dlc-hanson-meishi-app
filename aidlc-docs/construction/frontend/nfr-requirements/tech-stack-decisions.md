# Tech Stack Decisions — Frontend (Self-Introduction Page)

## 確定済み技術スタック

| カテゴリ | 採用技術 | バージョン目安 | 決定根拠 / 検討した代替案 |
|---------|---------|--------------|------------------------|
| **フレームワーク** | Next.js（App Router） | 14.x | SSG (`output: 'export'`)、TypeScript標準、画像最適化、i18n対応。代替: Vite+React（i18n と SSG が手作り）、Astro（学習コスト） |
| **言語** | TypeScript | 5.x | 型安全性、Next.js 標準、zod との型推論連携 |
| **スタイリング** | Tailwind CSS | 3.x | レスポンシブ・テーマ切替（CSS Variables）と相性良。代替: CSS Modules（テーマ切替の柔軟性低） |
| **状態管理** | React Context + useReducer | React 18 標準 | テーマ・言語・ギャラリー画像のシンプルな状態に十分。代替: Zustand（オーバースペック） |
| **多言語** | next-intl | 3.x | App Router 公式推奨、SSG 対応。代替: react-i18next（App Router の SSR/SSG 統合がやや複雑） |
| **アニメーション** | Framer Motion | 11.x | scroll-in / トランジション / reduced-motion 対応がワンセット。代替: 自作 Intersection Observer（実装量増） |
| **アイコン** | react-icons（Simple Icons セット） | 5.x | GitHub/LinkedIn/Qiita/Zenn/X 等のブランドアイコンが揃う |
| **スキーマ検証** | zod | 3.x | 型推論との一体感、build-time 検証 |
| **テスト** | Vitest | 1.x or 2.x | Next.js と相性良、Vite ベース |
| **PBT** | fast-check | 3.x | 純粋関数のプロパティ検証（コントラスト比計算 / フォールバック） |
| **コンポーネントテスト** | @testing-library/react | 16.x | 実装に依存しないUIテスト |
| **Lint** | ESLint + eslint-config-next | 8.x / 14.x | Next.js 推奨ルール |
| **Format** | Prettier | 3.x | コード整形統一 |
| **IaC** | AWS CDK v2（TypeScript） | 2.x | TypeScript で型安全に IaC 記述、Next.js コードと言語統一 |
| **CDK Constructs** | aws-cdk-lib<br/>aws-s3<br/>aws-cloudfront<br/>aws-cloudfront-origins<br/>aws-s3-deployment | 2.x | S3 + CloudFront + OAC + BucketDeployment の標準構成 |
| **パッケージマネージャ** | npm | Node 20.x 同梱 | デフォルト・移植性高 |
| **Node.js** | 20 LTS | 20.x | Next.js 14 推奨 |

---

## 決定の根拠（要点）

### Next.js を選んだ理由
- **SSG**: `output: 'export'` で静的ファイル化 → S3 に配置可能（NFR-04-1, NFR-04-2）
- **next/image**: 画像最適化（NFR-1.6）
- **App Router + next-intl**: i18n のサーバー/クライアント両対応（FR-05）
- **エコシステム**: Tailwind / Framer Motion / Vitest との連携が確立されている

### CSS Variables + Tailwind を選んだ理由
- **テーマ切替**: `[data-theme="lime"] { --color-primary: ... }` で動的切替可能（FR-03、business-logic-model.md Logic 2）
- **Tailwind の `arbitrary value`**: `bg-[var(--color-primary)]` のように CSS Variables を直接利用可
- **保守性**: `config/themes.ts` で TypeScript 定数として宣言し、テーマ追加が容易（NFR-3.3）

### zod を選んだ理由
- **型推論**: スキーマから TypeScript 型を自動生成（`z.infer<typeof ProfileSchema>`）
- **Build-time検証**: Next.js のビルド時に Server Component で `parse()` 実行 → エラー時はビルド停止（NFR-3.2）
- **PBT との相性**: fast-check と組み合わせやすい

### AWS CDK v2 を選んだ理由（NFR-04 追加分）
- **言語統一**: フロントエンドと同じ TypeScript で記述
- **型安全**: 構成エラーをコンパイル時に検出
- **BucketDeployment**: `out/` を S3 に同期するハイレベル construct が公式提供
- **OAC（Origin Access Control）**: 旧 OAI に代わる推奨パターン。CloudFront 経由のみで S3 へアクセス
- **キャッシュ無効化**: `BucketDeployment` の `distribution` プロパティで自動 invalidation

### 採用しなかったもの
- **Zustand / Jotai / Recoil**: 状態数が少なく、Context で十分
- **react-i18next**: App Router での統合が next-intl ほど整っていない
- **CDK v1**: EOL 済み
- **Terraform**: TypeScript で書きたい・CDK の方がフロントと統一できる
- **Amplify Hosting**: より細かい構成制御のため CDK を選択
- **CloudFront Functions / Lambda@Edge**: 当面不要（純粋な静的サイト）

---

## ディレクトリ構成（最終）

```
kiro-handson/
├── README.md                         # ROOT。ビルド・デプロイ手順を集約
├── package.json                      # workspaces 化（web/ と infra/）
├── web/                              # Next.js フロントエンド
│   ├── package.json
│   ├── next.config.mjs               # output: 'export'
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── data/
│   │   └── profile.json
│   ├── schemas/
│   │   └── profile.ts
│   ├── config/
│   │   └── themes.ts
│   ├── lib/
│   ├── messages/
│   │   ├── ja.json
│   │   └── en.json
│   ├── public/
│   │   └── images/
│   ├── styles/
│   └── tests/
├── infra/                            # AWS CDK
│   ├── package.json
│   ├── cdk.json
│   ├── tsconfig.json
│   ├── bin/
│   │   └── meishi-app.ts             # CDK エントリポイント
│   ├── lib/
│   │   └── meishi-app-stack.ts       # S3 + CloudFront + OAC + BucketDeployment
│   └── test/
└── .gitignore
```

**Note**: 現在ワークスペースには `verde-ec/` が残骸として存在するが、本プロジェクトでは無視（`.gitignore` で除外済み）。実装フェーズで上記ディレクトリ構造に新規作成する。

---

## バージョン固定方針

- メジャー版を package.json に固定（`^14.0.0` 等は使用しない）
- セマンティックバージョン（`14.2.5` のように）でロックファイル（`package-lock.json`）を生成
- アップグレードは個別に PR（自動アップデート無し）

---

## 補足: テーマカラー設計の確認

要件 FR-03-6 で確定した4テーマを CSS Variables で実装する際の対応関係：

| テーマキー | カラーコード（primary） | 用途 |
|----------|--------------------|------|
| `mono` | `#000000` | デフォルト |
| `lime` | `#7CFC00` | アクセント |
| `rose` | `#B33E5C` | アクセント |
| `sky`  | `#89C3EB` | アクセント |

各テーマの background / text / surface などの完全な配色は **NFR Design** ステージで CSS Variables テーブルとして確定する。
