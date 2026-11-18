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
}
