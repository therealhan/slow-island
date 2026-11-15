(function () {
  "use strict";
  var list = document.querySelector("[data-task-list]");
  if (!list) return;
  var storage = window.SlowIslandStorage;
  var ui = window.SlowIslandUI;
  var tasks = window.SLOW_ISLAND_TASKS || [];
  var todayLabel = document.querySelector("[data-today-label]");
  if (todayLabel) todayLabel.textContent = new Intl.DateTimeFormat("zh-Hant", { year: "numeric", month: "long", day: "numeric" }).format(new Date());

  function render() {
    var completedToday = storage.getTodayTasks();
    list.replaceChildren();
    tasks.forEach(function (task, index) {
      var isDone = Boolean(completedToday[task.id]);
      var card = ui.element("article", "task-card" + (isDone ? " is-done" : ""));
      var button = ui.element("button", "task-check" + (isDone ? " checked" : ""), isDone ? "✓" : "");
      button.type = "button";
      button.disabled = isDone;
      button.setAttribute("aria-label", isDone ? task.title + "，已完成" : "完成任務：" + task.title);
      button.addEventListener("click", function () {
        var result = storage.completeTask(task);
        var message = document.querySelector("[data-task-message]");
        if (message) message.textContent = result.message;
        if (result.ok) render();
      });
      var copy = ui.element("div", "task-copy");
      var meta = ui.element("span", "task-category", task.category === "wellbeing" ? "身心照顧" : task.category === "mindfulness" ? "心情練習" : "日常小事");
      var title = ui.element("h3", "", task.title);
      var description = ui.element("p", "", task.description);
      copy.append(meta, title, description);
      var reward = ui.element("span", "task-reward");
      reward.append(ui.element("span", "reward-star", "★"), document.createTextNode("+" + task.reward.amount));
      var indicator = ui.element("span", "task-done-label", isDone ? "已完成" : "領取星星");
      card.append(button, copy, reward, indicator);
      card.style.setProperty("--task-index", index);
      list.append(card);
    });
    var count = document.querySelector("[data-task-count]");
    if (count) count.textContent = tasks.filter(function (task) { return Boolean(completedToday[task.id]); }).length + " / " + tasks.length;
  }

  function refreshDateLabel() {
    if (todayLabel) todayLabel.textContent = new Intl.DateTimeFormat("zh-Hant", { year: "numeric", month: "long", day: "numeric" }).format(new Date());
  }

  window.addEventListener("slow-island-state-change", render);
  window.addEventListener("slow-island-day-change", function () {
    refreshDateLabel();
    render();
  });
  render();
}());
