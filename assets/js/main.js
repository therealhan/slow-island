(function () {
  "use strict";

  var storage = window.SlowIslandStorage;
  var tasks = window.SLOW_ISLAND_TASKS || [];
  var items = window.SLOW_ISLAND_ITEMS || [];
  var basePath = document.body.getAttribute("data-base-path") || "./";

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function assetPath(path) {
    return basePath + path;
  }

  function renderCurrencies() {
    var state = storage.getState();
    document.querySelectorAll("[data-currency]").forEach(function (node) {
      node.textContent = state.currencies[node.getAttribute("data-currency")] || 0;
    });
  }

  function renderHomeTasks() {
    var list = document.querySelector("[data-home-tasks]");
    if (!list) return;
    var today = storage.getTodayTasks();
    var done = tasks.filter(function (task) { return Boolean(today[task.id]); }).length;
    var preview = tasks.slice(0, 3);
    list.replaceChildren();
    preview.forEach(function (task) {
      var row = element("div", "mini-task-row" + (today[task.id] ? " is-done" : ""));
      var marker = element("span", "mini-check", today[task.id] ? "✓" : "");
      marker.setAttribute("aria-hidden", "true");
      row.append(marker, element("span", "mini-task-title", task.title), element("span", "mini-reward", "★ " + task.reward.amount));
      list.append(row);
    });
    var count = document.querySelector("[data-home-task-count]");
    if (count) count.textContent = done + " / " + tasks.length + " 完成";
    var progress = document.querySelector("[data-home-progress]");
    if (progress) progress.style.width = (tasks.length ? done / tasks.length * 100 : 0) + "%";
  }

  function renderPlacedDecorations() {
    var containers = document.querySelectorAll("[data-placed-decorations]");
    if (!containers.length) return;
    var state = storage.getState();
    containers.forEach(function (container) {
      container.replaceChildren();
      state.placedItems.forEach(function (id, index) {
        var item = items.find(function (entry) { return entry.id === id; });
        if (!item) return;
        var placed = element("img", "scene-item scene-item-" + (index % 9));
        placed.src = assetPath(item.image);
        placed.alt = item.name;
        placed.title = item.name;
        placed.style.setProperty("--item-order", index);
        container.append(placed);
      });
    });
  }

  function renderCollection() {
    var grid = document.querySelector("[data-collection-grid]");
    if (!grid) return;
    var unlocked = storage.getState().unlockedItems;
    var filter = document.querySelector(".filter-chip.active");
    var category = filter ? filter.getAttribute("data-filter") : "all";
    var filtered = items.filter(function (item) { return category === "all" || item.category === category; });
    grid.replaceChildren();
    filtered.forEach(function (item) {
      var owned = unlocked.indexOf(item.id) >= 0;
      var card = element("article", "collection-card paper-card" + (owned ? "" : " is-locked"));
      var visual = element("div", "item-visual");
      var image = element("img");
      image.src = assetPath(item.image);
      image.alt = owned ? item.name : "尚未解鎖的物品";
      visual.append(image);
      if (!owned) visual.append(element("span", "lock-ribbon", "尚未收藏"));
      var details = element("div", "item-details");
      var meta = element("span", "item-category", item.category === "plant" ? "植物" : item.category === "furniture" ? "家具" : "裝飾品");
      var title = element("h3", "", owned ? item.name : "？？？");
      var description = element("p", "", owned ? item.description : "完成任務，收集星星來解鎖這件小物。");
      var price = element("span", "item-cost", owned ? "已收入收藏" : "★ " + item.cost.amount);
      details.append(meta, title, description, price);
      card.append(visual, details);
      grid.append(card);
    });
    var count = document.querySelector("[data-collection-count]");
    if (count) count.textContent = unlocked.length;
    var progress = document.querySelector("[data-collection-progress]");
    if (progress) progress.style.width = Math.min(100, unlocked.length / items.length * 100) + "%";
  }

  function renderProgress() {
    var state = storage.getState();
    var values = {
      completed: state.completedTasks,
      earned: state.totalStarsEarned,
      items: state.unlockedItems.length,
      placed: state.placedItems.length
    };
    Object.keys(values).forEach(function (key) {
      var node = document.querySelector('[data-stat="' + key + '"]');
      if (node) node.textContent = values[key];
    });
    var grid = document.querySelector("[data-achievement-grid]");
    if (!grid) return;
    grid.replaceChildren();
    var achievements = window.SLOW_ISLAND_ACHIEVEMENTS || [];
    achievements.forEach(function (achievement) {
      var unlocked = state.achievements.indexOf(achievement.id) >= 0;
      var card = element("article", "achievement-card paper-card" + (unlocked ? " is-unlocked" : ""));
      var icon = element("span", "achievement-icon achievement-icon-" + achievement.icon, achievement.icon === "star" ? "★" : achievement.icon === "flower" ? "✿" : "☀");
      var copy = element("div", "achievement-copy");
      copy.append(element("span", "achievement-status", unlocked ? "已點亮" : "慢慢靠近"), element("h3", "", achievement.name), element("p", "", achievement.description));
      card.append(icon, copy);
      grid.append(card);
    });
    var count = document.querySelector("[data-achievement-count]");
    if (count) count.textContent = state.achievements.length;
  }

  function showStorageError(detail) {
    var notice = document.querySelector("[data-storage-alert]");
    if (!notice) {
      notice = element("p", "storage-alert");
      notice.setAttribute("data-storage-alert", "");
      notice.setAttribute("role", "alert");
      var main = document.querySelector("main");
      if (main) main.insertBefore(notice, main.firstChild);
    }
    notice.textContent = detail;
  }

  function renderAll() {
    storage.updateAchievements();
    renderCurrencies();
    renderHomeTasks();
    renderPlacedDecorations();
    renderCollection();
    renderProgress();
  }

  function scheduleDailyRefresh() {
    var now = new Date();
    var nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    window.setTimeout(function () {
      renderAll();
      window.dispatchEvent(new CustomEvent("slow-island-day-change"));
      scheduleDailyRefresh();
    }, Math.max(1000, nextMidnight.getTime() - now.getTime()));
  }

  document.querySelectorAll(".filter-chip").forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelectorAll(".filter-chip").forEach(function (chip) { chip.classList.remove("active"); });
      button.classList.add("active");
      renderCollection();
    });
  });
  window.addEventListener("slow-island-state-change", renderAll);
  window.addEventListener("slow-island-storage-error", function (event) { showStorageError(event.detail); });
  window.SlowIslandUI = { element: element, assetPath: assetPath, renderAll: renderAll, renderCurrencies: renderCurrencies, renderPlacedDecorations: renderPlacedDecorations };
  if (window.SLOW_ISLAND_STORAGE_ERROR) showStorageError(window.SLOW_ISLAND_STORAGE_ERROR);
  renderAll();
  scheduleDailyRefresh();
}());
