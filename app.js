const items = [
  {id:1,name:"Shadow Agent",type:"Outfit",rarity:"Epic"},
  {id:2,name:"Neon Phantom",type:"Outfit",rarity:"Legendary"},
  {id:3,name:"Crimson Operative",type:"Outfit",rarity:"Rare"},
  {id:4,name:"Cyber Cape",type:"Back Bling",rarity:"Epic"},
  {id:5,name:"Ghost Pack",type:"Back Bling",rarity:"Rare"},
  {id:6,name:"Voltage Blade",type:"Pickaxe",rarity:"Legendary"},
  {id:7,name:"Night Cutter",type:"Pickaxe",rarity:"Epic"},
  {id:8,name:"Redline Raider",type:"Outfit",rarity:"Rare"}
];

const get = key => JSON.parse(localStorage.getItem(key) || "[]");
const set = (key,value) => localStorage.setItem(key,JSON.stringify(value));

let favorites = get("overdrive_favorites");
let loadouts = get("overdrive_loadouts");
let currentFilter = "All";

const locker = document.getElementById("locker");
const favoriteBox = document.getElementById("favorites");
const loadoutBox = document.getElementById("loadouts");

function renderLocker() {
  const filtered = currentFilter === "All"
    ? items
    : items.filter(item => item.type === currentFilter);

  document.getElementById("itemCount").textContent =
    filtered.length + " ITEMS";

  locker.innerHTML = "";

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "item";

    const name = document.createElement("h3");
    name.textContent = item.name;

    const type = document.createElement("p");
    type.textContent = item.type + " · " + item.rarity;

    const button = document.createElement("button");
    const saved = favorites.includes(item.id);
    button.textContent = saved ? "★ FAVORITED" : "☆ FAVORITE";

    button.addEventListener("click", () => {
      favorites = favorites.includes(item.id)
        ? favorites.filter(id => id !== item.id)
        : [...favorites,item.id];

      set("overdrive_favorites",favorites);
      renderLocker();
      renderFavorites();
    });

    card.append(name,type,button);
    locker.appendChild(card);
  });
}

function renderFavorites() {
  favoriteBox.innerHTML = "";

  const selected = items.filter(item => favorites.includes(item.id));

  if (!selected.length) {
    favoriteBox.textContent = "No favorites saved yet.";
    return;
  }

  selected.forEach(item => {
    const line = document.createElement("p");
    line.textContent = "★ " + item.name;
    favoriteBox.appendChild(line);
  });
}

function renderLoadouts() {
  loadoutBox.innerHTML = "";

  if (!loadouts.length) {
    loadoutBox.textContent = "No saved loadouts yet.";
    return;
  }

  loadouts.forEach((loadout,index) => {
    const row = document.createElement("p");
    row.textContent = loadout + " ";

    const remove = document.createElement("button");
    remove.textContent = "DELETE";
    remove.addEventListener("click", () => {
      loadouts.splice(index,1);
      set("overdrive_loadouts",loadouts);
      renderLoadouts();
    });

    row.appendChild(remove);
    loadoutBox.appendChild(row);
  });
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    document.querySelectorAll(".filter").forEach(b =>
      b.classList.remove("active")
    );

    button.classList.add("active");
    renderLocker();
  });
});

document.getElementById("addFavorite").addEventListener("click", () => {
  if (!favorites.includes(1)) favorites.push(1);
  set("overdrive_favorites",favorites);
  renderLocker();
  renderFavorites();
});

document.getElementById("saveLoadout").addEventListener("click", () => {
  const field = document.getElementById("loadoutName");
  const name = field.value.trim();

  if (!name) {
    alert("Enter a loadout name first.");
    return;
  }

  loadouts.push(name);
  set("overdrive_loadouts",loadouts);
  field.value = "";
  renderLoadouts();
});

const playerName = document.getElementById("playerName");

playerName.value = localStorage.getItem("overdrive_player") || "";

function updatePlayer() {
  const name = playerName.value.trim();
  localStorage.setItem("overdrive_player",name);
  document.getElementById("welcome").textContent =
    "WELCOME, " + (name || "PLAYER").toUpperCase();
}

playerName.addEventListener("input",updatePlayer);

updatePlayer();
renderLocker();
renderFavorites();
renderLoadouts();

if ("serviceWorker" in navigator) {
  window.addEventListener("load",() => {
    navigator.serviceWorker.register("./sw.js").catch(console.error);
  });

  

/* PROJECT OVERDRIVE V2 */
(() => {
  if (document.getElementById("overdriveSearch")) return;

  const search = document.createElement("input");
  search.id = "overdriveSearch";
  search.type = "search";
  search.placeholder = "SEARCH YOUR LOCKER...";
  search.style.cssText =
    "width:100%;padding:14px;margin:12px 0;background:#151515;color:white;border:1px solid #ff3030;border-radius:10px;font-size:16px;";

  locker.parentNode.insertBefore(search, locker);

  const rarityColors = {
    Common: "#a0a0a0",
    Uncommon: "#39c65b",
    Rare: "#399bff",
    Epic: "#b45cff",
    Legendary: "#ffad32",
    Mythic: "#ff4545"
  };

  function upgradeCards() {
    locker.querySelectorAll(".item").forEach(card => {
      const name = card.querySelector("h3")?.textContent || "";
      const item = items.find(entry => entry.name === name);

      if (item) {
        card.style.border = "1px solid " +
          (rarityColors[item.rarity] || "#ff3030");

        if (!card.querySelector(".v2-rarity")) {
          const badge = document.createElement("small");
          badge.className = "v2-rarity";
          badge.textContent = item.rarity || "Uncommon";
          badge.style.cssText =
            "display:block;margin:8px 0;color:" +
            (rarityColors[item.rarity] || "#39c65b") +
            ";font-weight:bold;";
          card.appendChild(badge);
        }

        card.style.display =
          name.toLowerCase().includes(search.value.toLowerCase())
          ? ""
          : "none";
      }
    });
  }

  search.addEventListener("input", upgradeCards);

  new MutationObserver(upgradeCards).observe(locker, {
    childList: true,
    subtree: true
  });

  upgradeCards();
})();
