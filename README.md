# Cat Registry System

這是一個使用 Next.js 15、TypeScript、Prisma ORM 和 Tailwind CSS 構建的貓咪登記管理系統。

## 功能特性

- 🐱 貓咪資料管理
- 📊 儀表板統計
- 📸 圖片上傳功能
- 🔐 安全的資料儲存
- 📱 響應式設計

## 技術棧

- **框架**: Next.js 15 (App Router)
- **語言**: TypeScript
- **資料庫**: SQLite (Prisma ORM)
- **樣式**: Tailwind CSS
- **部署**: Vercel
- **CI/CD**: GitHub Actions

## 快速開始

### 環境要求

- Node.js 20+
- npm 或 yarn

### 安裝與運行

1. 克隆專案
```bash
git clone [your-repo-url]
cd cat-registery-system
```

2. 安裝依賴
```bash
npm install
```

3. 設置環境變量
```bash
cp .env.example .env
```
編輯 `.env` 文件，設置必要的環境變量。

4. 設置資料庫
```bash
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

5. 啟動開發伺服器
```bash
npm run dev
```

打開 [http://localhost:3000](http://localhost:3000) 查看應用程式。

## 開發腳本

- `npm run dev` - 啟動開發伺服器
- `npm run build` - 建置生產版本
- `npm run start` - 啟動生產伺服器
- `npm run lint` - 執行 ESLint 檢查
- `npm run prisma:seed` - 填充測試資料

## CI/CD 配置

本專案使用 GitHub Actions 進行持續整合與測試。

### 工作流程

1. **測試與檢查**: 每次 push 或 PR 都會執行
   - ESLint 代碼檢查
   - TypeScript 類型檢查
   - 建置測試
   - 安全掃描

> **注意**: 部署功能已暫時停用，待未來規劃完成後再啟用。

### 未來部署規劃 (待啟用)

當準備好部署時，可以啟用以下功能：

1. **預覽部署**: 非 main 分支的部署
   - 自動部署到 Vercel 預覽環境
   - 每個 PR 都有預覽連結

2. **生產部署**: main 分支的部署
   - 自動部署到 Vercel 生產環境
   - 僅在測試通過後執行

#### 部署設置步驟

1. **設置 GitHub Secrets**:
   - `VERCEL_TOKEN`: Vercel 訪問令牌
   - `VERCEL_ORG_ID`: Vercel 組織 ID
   - `VERCEL_PROJECT_ID`: Vercel 專案 ID

2. **取消註解 workflow 中的部署步驟**

### 手動部署

#### 部署到 Vercel

最簡單的方式是使用 Vercel 平台：

1. 推送代碼到 GitHub
2. 在 [Vercel](https://vercel.com) 導入 GitHub 倉庫
3. 設置環境變量
4. 自動部署

#### 本地建置

```bash
npm run build
npm start
```

## 專案結構

```
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React 組件
│   └── lib/             # 工具函數
├── prisma/              # 資料庫架構和遷移
├── public/             # 靜態資源
└── .github/workflows/  # CI/CD 配置
```

## 資料庫管理

### 遷移資料庫

```bash
npx prisma migrate dev --name [migration-name]
```

### 更新 Prisma Client

```bash
npx prisma generate
```

### 查看資料庫

```bash
npx prisma studio
```

## 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 授權

此專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 文件。
