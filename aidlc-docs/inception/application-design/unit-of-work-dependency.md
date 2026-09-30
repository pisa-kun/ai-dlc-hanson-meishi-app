# ユニット間依存関係

## 依存関係マトリクス

| ユニット | Unit 1: Frontend | Unit 2: Backend | Unit 3: Infrastructure |
|---------|:----------------:|:---------------:|:---------------------:|
| **Unit 1: Frontend** | — | 依存（API呼び出し） | 依存（デプロイ先） |
| **Unit 2: Backend** | なし | — | 依存（デプロイ先） |
| **Unit 3: Infrastructure** | なし | なし | — |

## 依存関係の詳細

### Unit 1 → Unit 2（実行時依存）
- **種別**: 実行時依存（Runtime Dependency）
- **内容**: FrontendはBackendのREST APIを呼び出す
- **インターフェース**: HTTP/HTTPS（REST API、OpenAPI仕様書で定義）
- **疎結合化**: APIのベースURLを環境変数で管理し、モックサーバーで代替可能

### Unit 1 → Unit 3（デプロイ依存）
- **種別**: デプロイ依存（Deploy Dependency）
- **内容**: FrontendのECS FargateタスクとCloudFrontはInfrastructureが定義
- **インターフェース**: CDKスタック出力（CloudFront URL等）

### Unit 2 → Unit 3（デプロイ依存）
- **種別**: デプロイ依存（Deploy Dependency）
- **内容**: BackendのECS FargateタスクとRDS、ALBはInfrastructureが定義
- **インターフェース**: CDKスタック出力（ALB DNS名、RDS接続情報等）

## 開発順序推奨

```
Phase 1（並行可能）:
  Unit 3: Infrastructure  ← AWSリソース定義（開発環境）
  Unit 2: Backend         ← API実装（ローカルDocker）

Phase 2（Unit 2完了後）:
  Unit 1: Frontend        ← BackendのAPIに接続して実装

Phase 3（全Unit完了後）:
  統合テスト・E2Eテスト
```

## 共有インターフェース（契約）

| インターフェース | 定義場所 | 利用ユニット |
|---------------|---------|------------|
| REST API仕様（OpenAPI） | backend/docs/swagger.yaml | Frontend, Backend |
| TypeScript型定義（APIレスポンス） | frontend/types/index.ts | Frontend |
| 環境変数定義 | 各ユニットの.env.example | 全ユニット |
| Dockerイメージタグ規約 | .github/workflows/ | Backend, Infrastructure |
