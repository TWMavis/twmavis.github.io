# CPR 姿勢訓練系統 — 部署指南

## 快速部署（推薦）

### 方法一：GitHub Pages（免費，離線 PWA）

1. 建立 GitHub 帳號（免費）：https://github.com
2. 建立新 Repository（public）
3. 上傳 `index.html`、`manifest.json`、`sw.js` 三個檔案
4. Settings → Pages → Deploy from branch: main
5. 得到網址如：`https://yourname.github.io/cpr-trainer/`
6. iPad Safari 開啟 → 分享按鈕 → 加入主畫面 → 即成離線 App

### 方法二：Vercel（免費，更快）

```bash
npm install -g vercel
cd cpr-trainer/
vercel deploy
```

### 方法三：本地 Wi-Fi 伺服器（完全離線）

在同一 Wi-Fi 網路下：

```bash
# Python 3
cd cpr-trainer/
python3 -m http.server 8080

# 或 Node.js
npx serve .
```

iPad 開啟：`http://電腦IP:8080`
注意：本地伺服器**不支援 HTTPS**，攝影機權限可能受限。
建議使用 ngrok 加 HTTPS：
```bash
ngrok http 8080
```

---

## 系統功能說明

| 功能 | 技術實作 |
|------|---------|
| 即時骨架顯示 | MediaPipe Pose (33點) |
| 手臂伸直檢測 | 肩-肘-腕關節角度 > 155° |
| 身體垂直檢測 | 肩膀X座標 vs 手腕X座標偏差 |
| 按壓頻率偵測 | 肩膀Y軸波谷偵測 + 計時 |
| 評分系統 | 四項姿勢檢查通過率 % |
| 離線存儲 | localStorage（訓練記錄） |
| 離線運行 | Service Worker + Cache API |

## iPad 最佳設定

- **橫向使用**（Landscape）
- **解析度**：系統支援 iPad 全解析度
- 建議攝影機位置：正側面，距離 1.5–2 公尺
- 允許 Safari 攝影機權限

## 注意事項

- 首次使用**需要網路**載入 MediaPipe 模型（約 10MB）
- 之後完全離線可用（Service Worker 快取）
- MediaPipe 模型在 iPad（A12+）上約 30fps
- 所有訓練記錄儲存在本地，不傳送至伺服器
