# Slow Island（慢慢小島）

一款以每日小任務、收藏與小島佈置為核心的療癒系單頁靜態網站。使用 HTML、CSS、原生 JavaScript 與瀏覽器 `localStorage`，不需要後端、帳號或外部服務。

## 開始使用

以瀏覽器開啟 `index.html` 即可體驗，也可以將整個資料夾部署到 GitHub Pages。遊戲進度儲存在瀏覽器的 `slowIslandState`。

## 網站頁面

- `index.html`：小島首頁、今日任務與遊戲入口。
- `pages/tasks.html`：每日任務及星星獎勵。
- `pages/island.html`：購買、選擇並放置小島裝飾。
- `pages/collection.html`：已收藏與尚未解鎖的物品圖鑑。
- `pages/progress.html`：任務、獎勵統計及成就。

## 專案結構

- `assets/css/style.css`：共用視覺與響應式樣式。
- `assets/js/`：儲存、共用導覽、每日任務及島嶼互動。
- `assets/images/`：本地島嶼與物品 SVG 插畫。
- `data/`：任務、道具及成就靜態定義。

每日任務完成紀錄按本地日期分開；完成任務領取星星、購買物品、放置裝飾與成就進度都會儲存於本機。
