(function () {
  "use strict";
  var grid = document.querySelector("[data-shop-grid]");
  if (!grid) return;
  var storage = window.SlowIslandStorage;
  var ui = window.SlowIslandUI;
  var items = window.SLOW_ISLAND_ITEMS || [];
  var message = document.querySelector("[data-island-message]");

  function currencyKey(type) {
    if (type === "star") return "stars";
    if (type === "shell") return "shells";
    return type;
  }

  function setMessage(text, kind) {
    message.textContent = text;
    message.classList.toggle("is-error", kind === "error");
  }

  function render() {
    var state = storage.getState();
    grid.replaceChildren();
    items.forEach(function (item, index) {
      var owned = state.unlockedItems.indexOf(item.id) >= 0;
      var placed = state.placedItems.indexOf(item.id) >= 0;
      var card = ui.element("article", "shop-card paper-card");
      var image = ui.element("img", "shop-item-image");
      image.src = ui.assetPath(item.image);
      image.alt = item.name;
      var copy = ui.element("div", "shop-item-copy");
      copy.append(ui.element("span", "item-category", item.category === "plant" ? "植物" : item.category === "furniture" ? "家具" : "裝飾品"));
      copy.append(ui.element("h3", "", item.name), ui.element("p", "", item.description));
      var controls = ui.element("div", "shop-card-footer");
      if (!owned) {
        var buy = ui.element("button", "button button-small", "★ " + item.cost.amount + "　帶回家");
        buy.type = "button";
        buy.disabled = state.currencies[currencyKey(item.cost.type)] < item.cost.amount;
        buy.addEventListener("click", function () {
          var result = storage.purchaseItem(item);
          setMessage(result.message, result.ok ? "success" : "error");
          render();
        });
        controls.append(buy);
      } else {
        controls.append(ui.element("span", "owned-label", "已收入收藏"));
        var place = ui.element("button", "button button-small " + (placed ? "button-quiet" : ""), placed ? "收回收藏" : "放到島上");
        place.type = "button";
        place.addEventListener("click", function () {
          var result = storage.togglePlacement(item.id);
          setMessage(result.message, result.ok ? "success" : "error");
          render();
        });
        controls.append(place);
      }
      card.append(image, copy, controls);
      card.style.setProperty("--card-index", index);
      grid.append(card);
    });
    var count = document.querySelector("[data-placed-count]");
    if (count) count.textContent = state.placedItems.length;
  }

  window.addEventListener("slow-island-state-change", render);
  render();
}());
