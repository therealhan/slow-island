(function () {
  "use strict";

  var STORAGE_KEY = "slowIslandState";
  var state;

  function localDateKey(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function numberOrZero(value) {
    return Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
  }

  function currencyKey(type) {
    if (type === "star") return "stars";
    if (type === "shell") return "shells";
    return type;
  }

  function reportStorageError(message, error) {
    console.error(message, error);
    window.SLOW_ISLAND_STORAGE_ERROR = "小島進度儲存發生問題；請檢查瀏覽器儲存空間或隱私設定。";
    window.dispatchEvent(new CustomEvent("slow-island-storage-error", { detail: window.SLOW_ISLAND_STORAGE_ERROR }));
  }

  function normalizeState(saved) {
    var clean = saved && typeof saved === "object" ? saved : {};
    var dailyTasks = clean.dailyTasks && typeof clean.dailyTasks === "object" ? clean.dailyTasks : {};
    var safeDailyTasks = {};
    Object.keys(dailyTasks).forEach(function (date) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date) && dailyTasks[date] && typeof dailyTasks[date] === "object") {
        safeDailyTasks[date] = {};
        Object.keys(dailyTasks[date]).forEach(function (taskId) {
          if (dailyTasks[date][taskId] === true) safeDailyTasks[date][taskId] = true;
        });
      }
    });
    return {
      currencies: {
        stars: numberOrZero(clean.currencies && clean.currencies.stars),
        shells: numberOrZero(clean.currencies && clean.currencies.shells)
      },
      dailyTasks: safeDailyTasks,
      unlockedItems: Array.isArray(clean.unlockedItems) ? clean.unlockedItems.filter(function (id) { return typeof id === "string"; }) : [],
      placedItems: Array.isArray(clean.placedItems) ? clean.placedItems.filter(function (id) { return typeof id === "string"; }) : [],
      totalStarsEarned: numberOrZero(clean.totalStarsEarned),
      completedTasks: numberOrZero(clean.completedTasks),
      achievements: Array.isArray(clean.achievements) ? clean.achievements.filter(function (id) { return typeof id === "string"; }) : []
    };
  }

  function readState() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return normalizeState({});
      return normalizeState(JSON.parse(raw));
    } catch (error) {
      reportStorageError("無法讀取或解析小島進度，已暫時使用新進度。", error);
      return normalizeState({});
    }
  }

  function save() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new CustomEvent("slow-island-state-change", { detail: state }));
      return true;
    } catch (error) {
      reportStorageError("無法儲存小島進度。", error);
      return false;
    }
  }

  function todayTasks() {
    var key = localDateKey(new Date());
    if (!state.dailyTasks[key]) state.dailyTasks[key] = {};
    return state.dailyTasks[key];
  }

  function hasCompletedTask(taskId) {
    return Boolean(todayTasks()[taskId]);
  }

  function completeTask(task) {
    var today = todayTasks();
    if (today[task.id]) return { ok: false, message: "這件小事今天已經完成囉。" };
    var rewardCurrency = currencyKey(task.reward.type);
    today[task.id] = true;
    state.currencies[rewardCurrency] += task.reward.amount;
    state.totalStarsEarned += task.reward.type === "star" || task.reward.type === "stars" ? task.reward.amount : 0;
    state.completedTasks += 1;
    if (!save()) {
      delete today[task.id];
      state.currencies[rewardCurrency] -= task.reward.amount;
      state.totalStarsEarned -= task.reward.type === "star" || task.reward.type === "stars" ? task.reward.amount : 0;
      state.completedTasks -= 1;
      return { ok: false, message: "進度沒有儲存成功，任務尚未完成；請檢查瀏覽器儲存設定。" };
    }
    return { ok: true, message: "完成了！" + task.reward.amount + (task.reward.type === "star" ? " 顆星星已放進口袋。" : " 枚貝殼已放進口袋。") };
  }

  function purchaseItem(item) {
    var costCurrency = currencyKey(item.cost.type);
    if (state.unlockedItems.indexOf(item.id) !== -1) return { ok: false, message: "這件物品已經在你的收藏裡了。" };
    if (!state.currencies[costCurrency] || state.currencies[costCurrency] < item.cost.amount) {
      return { ok: false, message: "星星還不夠，再完成幾件小任務就可以帶它回家囉。" };
    }
    state.currencies[costCurrency] -= item.cost.amount;
    state.unlockedItems.push(item.id);
    if (!save()) {
      state.currencies[costCurrency] += item.cost.amount;
      state.unlockedItems.pop();
      return { ok: false, message: "進度沒有儲存成功，物品尚未購買；請檢查瀏覽器儲存設定。" };
    }
    return { ok: true, message: "帶回家了！它已經加入收藏。" };
  }

  function togglePlacement(itemId) {
    if (state.unlockedItems.indexOf(itemId) === -1) return { ok: false, message: "先收藏這件物品，才能放到島上喔。" };
    var index = state.placedItems.indexOf(itemId);
    if (index >= 0) {
      state.placedItems.splice(index, 1);
      if (!save()) {
        state.placedItems.splice(index, 0, itemId);
        return { ok: false, message: "進度沒有儲存成功，裝飾位置沒有變更。" };
      }
      return { ok: true, placed: false, message: "已將裝飾收回收藏。" };
    }
    state.placedItems.push(itemId);
    if (!save()) {
      state.placedItems.pop();
      return { ok: false, message: "進度沒有儲存成功，裝飾尚未放置。" };
    }
    return { ok: true, placed: true, message: "已把裝飾放到小島上！" };
  }

  function updateAchievements() {
    var definitions = window.SLOW_ISLAND_ACHIEVEMENTS || [];
    var values = {
      completedTasks: state.completedTasks,
      totalStarsEarned: state.totalStarsEarned,
      unlockedItems: state.unlockedItems.length
    };
    var changed = false;
    var newlyUnlocked = [];
    definitions.forEach(function (achievement) {
      if (values[achievement.metric] >= achievement.goal && state.achievements.indexOf(achievement.id) < 0) {
        state.achievements.push(achievement.id);
        newlyUnlocked.push(achievement.id);
        changed = true;
      }
    });
    if (changed && !save()) {
      state.achievements = state.achievements.filter(function (id) { return newlyUnlocked.indexOf(id) < 0; });
      return false;
    }
    return changed;
  }

  state = readState();
  window.SlowIslandStorage = {
    key: STORAGE_KEY,
    getState: function () { return state; },
    getTodayKey: function () { return localDateKey(new Date()); },
    getTodayTasks: todayTasks,
    hasCompletedTask: hasCompletedTask,
    completeTask: completeTask,
    purchaseItem: purchaseItem,
    togglePlacement: togglePlacement,
    save: save,
    updateAchievements: updateAchievements
  };
}());
