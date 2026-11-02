import "./style.css";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

const STORAGE_KEY_USERS = "bimo2_users";
const STORAGE_KEY_SESSION = "bimo2_s";
const STORAGE_KEY_ERRORS = "bimo_err";
const STORAGE_VERSION = 2;

const state = {
  lang: localStorage.getItem("bimo_lang") || "bn",
  me: localStorage.getItem(STORAGE_KEY_SESSION) || null,
  db: null,
  tab: "home",
  query: "",
  filter: "",
  limit: 50,
  reg: false
};

const ST = ["New", "Confirmed", "Shipped", "Delivered", "Cancelled", "Returned"];
const SRC = ["Facebook", "Instagram", "WhatsApp", "Messenger", "Website", "Daraz", "Other"];

const T = {
  en: {
    home: "Home",
    orders: "Orders",
    products: "Products",
    customers: "Customers",
    money: "Money",
    settings: "Settings",
    revenue: "Revenue (delivered)",
    profit: "Net profit",
    pending: "Pending orders",
    lowstock: "Low stock",
    last7: "Sales, last 7 days",
    risky: "High-risk orders",
    risk: "Risk",
    search: "Search name, phone, item",
    all: "All",
    order: "Order",
    product: "Product",
    name: "Customer name",
    amount: "Amount (৳)",
    price: "Selling price",
    cost: "Buying cost",
    stock: "Stock",
    qty: "Quantity",
    margin: "Margin",
    save: "Save",
    none: "Nothing here yet.",
    fill: "Fill all fields correctly.",
    nostock: "Not enough stock!",
    riskq: "High-risk order. Save anyway?",
    sure: "Are you sure?",
    paste: "Paste chat → order",
    pastehint: "Paste a customer message from Facebook, Instagram, Messenger or WhatsApp.",
    fill_form: "Fill order form",
    source: "Order came from",
    bysrc: "Sales by source",
    help: "Helper",
    helpnote: "Works offline. Your data never leaves this phone.",
    health: "Health check & auto-repair",
    fb: "Copy feedback info",
    full: "Phone storage is full! Download a backup and free space.",
    more: "Show more",
    saved: "Saved!",
    wamsg: "Hello {n}, your order worth {a} is confirmed. Thank you!",
    watch: "Watch",
    vip: "VIP",
    failed: "failed",
    expense: "Expense",
    note: "Note",
    backup: "Download backup",
    restore: "Restore backup",
    lastbk: "Last backup",
    bkwarn: "No backup in 7+ days. Tap to back up!",
    login: "Login",
    register: "Register",
    username: "Username",
    password: "Password (6+ characters)",
    brand: "Shop name",
    contact: "Phone or email",
    bad: "Username: 3-20 letters/numbers. Password: 6+ characters.",
    taken: "Username already taken.",
    wrong: "Wrong username or password.",
    manual: "Type item manually",
    foot: "Created by Rajib · Open Source (MIT)"
  },

  bn: {
    home: "হোম",
    orders: "অর্ডার",
    products: "প্রডাক্ট",
    customers: "কাস্টমার",
    money: "হিসাব",
    settings: "সেটিংস",
    revenue: "আয় (ডেলিভারড)",
    profit: "নিট লাভ",
    pending: "পেন্ডিং অর্ডার",
    lowstock: "স্টক কম",
    last7: "গত ৭ দিনের বিক্রি",
    risky: "ঝুঁকিপূর্ণ অর্ডার",
    risk: "ঝুঁকি",
    search: "নাম, ফোন, প্রডাক্ট খুঁজুন",
    all: "সব",
    order: "অর্ডার",
    product: "প্রডাক্ট",
    name: "কাস্টমারের নাম",
    amount: "টাকা (৳)",
    price: "বিক্রয় মূল্য",
    cost: "কেনা দাম",
    stock: "স্টক",
    qty: "পরিমাণ",
    margin: "লাভ/পিস",
    save: "সেভ করুন",
    none: "এখনো কিছু নেই।",
    fill: "সব ঘর সঠিকভাবে পূরণ করুন।",
    nostock: "স্টক যথেষ্ট নেই!",
    riskq: "ঝুঁকিপূর্ণ অর্ডার। তবুও সেভ করবেন?",
    sure: "আপনি কি নিশ্চিত?",
    paste: "চ্যাট পেস্ট → অর্ডার",
    pastehint: "ফেসবুক, ইনস্টাগ্রাম, মেসেঞ্জার বা হোয়াটসঅ্যাপের মেসেজ পেস্ট করুন।",
    fill_form: "অর্ডার ফর্মে বসান",
    source: "অর্ডার কোথা থেকে এসেছে",
    bysrc: "মাধ্যম অনুযায়ী বিক্রি",
    help: "সহায়ক",
    helpnote: "অফলাইনে চলে। আপনার ডেটা এই ফোনের বাইরে যায় না।",
    health: "হেলথ চেক ও অটো-রিপেয়ার",
    fb: "ফিডব্যাক তথ্য কপি করুন",
    full: "ফোনের স্টোরেজ ভর্তি! ব্যাকআপ নামিয়ে জায়গা খালি করুন।",
    more: "আরো দেখুন",
    saved: "সেভ হয়েছে!",
    wamsg: "হ্যালো {n}, আপনার {a} মূল্যের অর্ডার কনফার্ম হয়েছে। ধন্যবাদ!",
    watch: "নজরে রাখুন",
    vip: "ভিআইপি",
    failed: "ব্যর্থ",
    expense: "খরচ",
    note: "নোট",
    backup: "ব্যাকআপ ডাউনলোড",
    restore: "ব্যাকআপ রিস্টোর",
    lastbk: "শেষ ব্যাকআপ",
    bkwarn: "৭+ দিন ব্যাকআপ নেই। এখনই নিন!",
    login: "লগইন",
    register: "রেজিস্টার",
    username: "ইউজারনেম",
    password: "পাসওয়ার্ড (৬+ অক্ষর)",
    brand: "দোকানের নাম",
    contact: "ফোন বা ইমেইল",
    bad: "ইউজারনেম: ৩-২০ ইংরেজি অক্ষর/সংখ্যা। পাসওয়ার্ড: ৬+।",
    taken: "ইউজারনেম আগেই নেওয়া।",
    wrong: "ইউজারনেম বা পাসওয়ার্ড ভুল।",
    manual: "নিজে লিখব",
    foot: "তৈরি করেছেন Rajib · ওপেন সোর্স (MIT)"
  }
};

const $ = (selector) => document.querySelector(selector);

const E = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));

const t = (key) => T[state.lang][key] || T.en[key] || key;

const day = (timestamp = Date.now()) => {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const num = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const dead = (status) => status === "Cancelled" || status === "Returned";

const L = (key) => localStorage.getItem(key);
const S = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

const G = (key, fallback) => {
  try {
    const raw = L(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
const sum = (arr, key) => arr.reduce((total, item) => total + (Number(item[key]) || 0), 0);
const tk = (n) => "৳" + Math.round(n).toLocaleString();

const toast = (message, isError = false) => {
  const node = document.createElement("div");
  node.className = `toast${isError ? " er" : ""}`;
  node.textContent = message;
  const target = $("#toasts");
  target.appendChild(node);
  setTimeout(() => node.remove(), 2800);
};

const cleanData = (raw) => {
  const data = raw && typeof raw === "object" ? raw : {};

  const normalizeProducts = (items) =>
    Array.isArray(items)
      ? items.filter(Boolean).map((item) => ({
          id: num(item.id),
          name: String(item.name ?? ""),
          price: num(item.price),
          cost: num(item.cost),
          stock: num(item.stock)
        }))
      : [];

  const normalizeOrders = (items) =>
    Array.isArray(items)
      ? items.filter(Boolean).map((item) => ({
          id: num(item.id),
          date: String(item.date || day()),
          name: String(item.name ?? ""),
          phone: String(item.phone ?? ""),
          pid: num(item.pid),
          item: String(item.item ?? ""),
          qty: Math.max(1, num(item.qty, 1)),
          amount: num(item.amount),
          cost: num(item.cost),
          method: String(item.method || "COD"),
          src: String(item.src || "Other"),
          pay: item.pay === "Paid" ? "Paid" : "Due",
          status: ST.includes(item.status) ? item.status : "New",
          rk: [0, 1, 2].includes(item.rk) ? item.rk : 0,
          warn: String(item.warn || "")
        }))
      : [];

  const normalizeExpenses = (items) =>
    Array.isArray(items)
      ? items.filter(Boolean).map((item) => ({
          id: num(item.id),
          date: String(item.date || day()),
          type: String(item.type || "Other"),
          amount: num(item.amount),
          note: String(item.note || "")
        }))
      : [];

  const ensureUniqueIds = (items) => {
    const seen = {};
    let maxId = items.reduce((m, x) => Math.max(m, x.id || 0), 0);

    items.forEach((item) => {
      if (!item.id || seen[item.id]) {
        item.id = ++maxId;
      }
      seen[item.id] = true;
    });

    return items;
  };

  const result = {
    bk: num(data.bk),
    products: ensureUniqueIds(normalizeProducts(data.products)),
    orders: ensureUniqueIds(normalizeOrders(data.orders)),
    expenses: ensureUniqueIds(normalizeExpenses(data.expenses))
  };

  return result;
};

const saveData = () => {
  if (!state.me) return false;
  const ok = S(`bimo2_d_${state.me}`, state.db);
  if (!ok) toast(t("full"), true);
  return ok;
};

const hash = async (password, salt) => {
  if (!crypto.subtle) {
    return "x" + btoa(unescape(encodeURIComponent(salt + password)));
  }

  const input = new TextEncoder().encode(salt + password);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const validateProduct = (product) =>
  !!product.name &&
  product.price > 0 &&
  product.price <= 1e7 &&
  product.cost >= 0 &&
  product.stock >= 0 &&
  product.stock <= 1e6;

const validateOrder = (order) =>
  !!order.name &&
  !!order.phone &&
  !!order.item &&
  order.amount > 0 &&
  order.amount <= 1e7 &&
  order.qty > 0 &&
  order.qty <= 1e4;

const validateExpense = (expense) => expense.amount > 0 && expense.amount <= 1e8;

const modal = (html) => {
  closeModal();
  const node = document.createElement("div");
  node.id = "m";
  node.className = "md";
  node.addEventListener("click", (event) => {
    if (event.target === node) closeModal();
  });
  node.innerHTML = `<div class="card">${html}</div>`;
  document.body.appendChild(node);
};

const closeModal = () => {
  const node = $("#m");
  if (node) node.remove();
};

const renderHome = () => {
  const delivered = state.db.orders.filter((o) => o.status === "Delivered");
  const profit = sum(delivered, "amount") - sum(delivered, "cost") - sum(state.db.expenses, "amount");
  const pending = sum(state.db.orders.filter((o) => !dead(o.status) && o.status !== "Delivered"), "amount");
  const lowStock = state.db.products.filter((p) => p.stock <= 5).length;

  const risky = state.db.orders
    .filter((o) => o.rk === 2 && !dead(o.status) && o.status !== "Delivered")
    .slice(0, 5)
    .map((o) => `<small>⚠ ${E(o.name)}: ${E(o.warn)}</small>`)
    .join("");

  return `
    <div class="grid">
      ${[
        ["revenue", tk(sum(delivered, "amount"))],
        ["profit", tk(profit), profit < 0 ? "neg" : "pos"],
        ["pending", tk(pending)],
        ["lowstock", lowStock, lowStock ? "neg" : ""]
      ]
        .map(([key, value, cls = ""]) => `
          <div class="card">
            <small>${t(key)}</small>
            <h3 class="${cls}">${value}</h3>
          </div>
        `)
        .join("")}
    </div>

    <div class="card">
      <small>${t("last7")}</small>
      ${chart()}
    </div>

    <div class="card">
      <small>${t("bysrc")}</small>
      ${srcCard()}
    </div>

    <div class="card">
      <b>${t("risky")}</b>
      ${risky || `<small>${t("none")}</small>`}
    </div>
  `;
};

const chart = () => {
  const dates = [...Array(7)].map((_, i) => day(Date.now() - (6 - i) * 864e5));
  const values = dates.map((date) =>
    sum(state.db.orders.filter((o) => o.date === date && !dead(o.status)), "amount")
  );
  const max = Math.max(...values, 1);

  return `
    <svg viewBox="0 0 280 112" style="width:100%">
      ${values
        .map(
          (value, index) => `
            <rect x="${index * 40 + 6}" y="${92 - (value / max) * 80}" width="28" height="${(value / max) * 80}" rx="4" fill="var(--a)" />
            <text x="${index * 40 + 20}" y="106" font-size="10" fill="var(--m)" text-anchor="middle">${dates[index].slice(8)}</text>
          `
        )
        .join("")}
    </svg>
  `;
};

const srcCard = () => {
  const map = {};
  state.db.orders.forEach((o) => {
    if (!dead(o.status)) {
      const key = o.src || "Other";
      map[key] = (map[key] || 0) + o.amount;
    }
  });

  return `
    <div class="card">
      <small>${t("bysrc")}</small>
      ${Object.entries(map)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(
          ([key, value]) => `
            <div class="row">
              <span>${E(key)}</span>
              <b>${tk(value)}</b>
            </div>
          `
        )
        .join("") || `<small>${t("none")}</small>`}
    </div>
  `;
};

const renderOrderCard = (order) => `
  <div class="card">
    <div class="row">
      <b>${E(order.name)}</b>
      <span class="bd ${dead(order.status) ? "er" : order.status === "Delivered" ? "ok" : ""}">${order.status}</span>
    </div>
    <small>${E(order.phone)} · ${E(order.item)} ×${order.qty}</small>
    <div class="row">
      <b>${tk(order.amount)}</b>
      <span class="bd ${order.pay === "Paid" ? "ok" : "wn"}">${order.method} ${order.pay}</span>
      <span class="bd">${E(order.src || "")}</span>
      <span class="bd ${["ok", "wn", "er"][order.rk]}">${t("risk")}: ${["Low", "Med", "High"][order.rk]}</span>
    </div>
    ${order.warn ? `<small class="neg">⚠ ${E(order.warn)}</small>` : ""}
    <div class="row">
      <select data-action="set-order-status" data-id="${order.id}">
        ${ST.map((s) => `<option ${s === order.status ? "selected" : ""}>${s}</option>`).join("")}
      </select>
      <button class="i" data-action="wa" data-id="${order.id}">💬</button>
      <button class="i" data-action="invoice" data-id="${order.id}">🖨</button>
      <button class="i" data-action="delete-order" data-id="${order.id}">🗑</button>
    </div>
  </div>
`;

const renderOrders = () => {
  const rows = state.db.orders.filter(
    (o) =>
      (!state.filter || o.status === state.filter) &&
      `${o.name}${o.phone}${o.item}`.toLowerCase().includes(state.query.toLowerCase())
  );

  return `
    <div class="row">
      <input placeholder="${t("search")}" value="${E(state.query)}" data-action="search" />
      <select data-action="filter">
        <option value="">${t("all")}</option>
        ${ST.map((s) => `<option value="${s}" ${state.filter === s ? "selected" : ""}>${s}</option>`).join("")}
      </select>
    </div>

    <button class="btn o" data-action="paste-form">📋 ${t("paste")}</button>

    <div class="row">
      <button class="btn" style="flex:1" data-action="open-order-form">+ ${t("order")}</button>
      <button class="btn o" style="flex:1" data-action="csv-export">CSV ⬇</button>
    </div>

    <div id="list" style="display:flex;flex-direction:column;gap:10px">
      ${rows.slice(0, state.limit).map(renderOrderCard).join("") || `<p class="mt">${t("none")}</p>`}
      ${
        rows.length > state.limit
          ? `<button class="btn o" data-action="more-orders">${t("more")} (${rows.length - state.limit})</button>`
          : ""
      }
    </div>
  `;
};

const renderProducts = () => {
  return `
    <button class="btn" data-action="open-product-form">+ ${t("product")}</button>
    ${
      state.db.products.length
        ? state.db.products
            .map(
              (p) => `
            <div class="card">
              <div class="row">
                <b>${E(p.name)}</b>
                <span class="bd ${p.stock <= 5 ? "er" : "ok"}">${t("stock")}: ${p.stock}</span>
              </div>
              <small>${t("price")} ${tk(p.price)} · ${t("cost")} ${tk(p.cost)} · ${t("margin")} ${tk(p.price - p.cost)}</small>
              <div class="row">
                <button class="btn o" style="flex:1" data-action="restock" data-id="${p.id}">+ ${t("stock")}</button>
                <button class="i" data-action="delete-product" data-id="${p.id}">🗑</button>
              </div>
            </div>
          `
            )
            .join("")
        : `<p class="mt">${t("none")}</p>`
    }
  `;
};

const renderCustomers = () => {
  const map = {};
  state.db.orders.forEach((o) => {
    if (!map[o.phone]) map[o.phone] = { name: o.name, n: 0, bad: 0, sum: 0 };
    const row = map[o.phone];
    row.n++;
    if (dead(o.status)) row.bad++;
    else row.sum += o.amount;
  });

  const entries = Object.entries(map).sort((a, b) => b[1].sum - a[1].sum);

  return `
    ${entries.slice(0, state.limit).map(([phone, c]) => `
      <div class="card">
        <div class="row">
          <b>${E(c.name)}</b>
          ${c.bad >= 2 ? `<span class="bd er">${t("watch")}</span>` : c.n > 2 ? `<span class="bd ok">${t("vip")}</span>` : ""}
        </div>
        <small>${E(phone)} · ${c.n} ${t("orders")} · ${c.bad} ${t("failed")}</small>
        <b>${tk(c.sum)}</b>
      </div>
    `).join("") || `<p class="mt">${t("none")}</p>`}
    ${
      entries.length
        ? `<button class="btn o" data-action="more-customers">${t("more")} (${entries.length - state.limit})</button>`
        : ""
    }
  `;
};

const renderMoney = () => {
  const delivered = state.db.orders.filter((o) => o.status === "Delivered");
  const expenseTotal = sum(state.db.expenses, "amount");
  const net = sum(delivered, "amount") - sum(delivered, "cost") - expenseTotal;

  return `
    <div class="grid">
      <div class="card">
        <small>${t("revenue")}</small>
        <h3>${tk(sum(delivered, "amount"))}</h3>
      </div>
      <div class="card">
        <small>${t("expense")}</small>
        <h3 class="neg">${tk(expenseTotal)}</h3>
      </div>
    </div>

    <div class="card">
      <small>${t("profit")}</small>
      <h3 class="${net < 0 ? "neg" : "pos"}">${tk(net)}</h3>
    </div>

    <button class="btn" data-action="open-expense-form">+ ${t("expense")}</button>

    ${state.db.expenses
      .map(
        (e) => `
        <div class="card">
          <div class="row">
            <b>${E(e.type)}</b>
            <b>${tk(e.amount)}</b>
          </div>
          <div class="row">
            <small>${e.date} ${E(e.note)}</small>
            <button class="i" data-action="delete-expense" data-id="${e.id}">🗑</button>
          </div>
        </div>
      `
      )
      .join("")}
  `;
};

const renderSettings = () => {
  const user = getUserProfile();

  return `
    <div class="card">
      <input id="sb" value="${E(user.brand || state.me)}" placeholder="${t("brand")}" />
      <input id="sc" value="${E(user.contact || "")}" placeholder="${t("contact")}" />
      <button class="btn" data-action="save-settings">${t("save")}</button>
    </div>

    <div class="card">
      <button class="btn" data-action="backup">⬇ ${t("backup")}</button>
      <small>${t("lastbk")}: ${state.db.bk ? new Date(state.db.bk).toLocaleDateString() : "—"}</small>
      <button class="btn o" data-action="health-check">🩺 ${t("health")}</button>
      <button class="btn o" data-action="copy-feedback">💬 ${t("fb")}</button>

      <label class="btn o">
        ⬆ ${t("restore")}
        <input type="file" accept=".json" hidden data-action="restore-file" />
      </label>
    </div>
  `;
};

const renderPage = () => {
  const views = {
    home: renderHome,
    orders: renderOrders,
    products: renderProducts,
    customers: renderCustomers,
    money: renderMoney,
    settings: renderSettings
  };

  return views[state.tab]();
};

const renderShell = () => {
  const user = getUserProfile();
  const oldBackup = !state.db.bk || Date.now() - state.db.bk > 6048e5;

  $("#app").innerHTML = `
    <header>
      <b>${E(user.brand)}</b>
      <span>
        <button class="i" data-action="help">🤖</button>
        <button class="i" data-action="theme">◐</button>
        <button class="i" data-action="toggle-lang">${state.lang === "en" ? "বাং" : "EN"}</button>
        <button class="i" data-action="logout">⎋</button>
      </span>
    </header>

    ${oldBackup ? `<div class="warn" data-action="go-settings">⚠ ${t("bkwarn")}</div>` : ""}

    <main>${renderPage()}</main>

    <footer>${t("foot")}</footer>

    <nav>
      ${[
        ["home", "🏠"],
        ["orders", "🧾"],
        ["products", "📦"],
        ["customers", "👥"],
        ["money", "💰"],
        ["settings", "⚙️"]
      ]
        .map(([key, icon]) => `
          <button class="${key === state.tab ? "on" : ""}" data-action="nav" data-tab="${key}">
            ${icon}
            <small>${t(key)}</small>
          </button>
        `)
        .join("")}
    </nav>
  `;
};

const openProductForm = () => {
  modal(`
    <h3>${t("product")}</h3>
    <input id="pn" placeholder="${t("product")}">
    <input id="pp" type="number" placeholder="${t("price")}">
    <input id="pc" type="number" placeholder="${t("cost")}">
    <input id="ps" type="number" placeholder="${t("stock")}">
    <button class="btn" data-action="submit-product">${t("save")}</button>
  `);
};

const addProduct = () => {
  const product = {
    id: Date.now(),
    name: $("#pn").value.trim(),
    price: num($("#pp").value),
    cost: num($("#pc").value) || 0,
    stock: num($("#ps").value) || 0
  };

  if (!validateProduct(product)) {
    return toast(t("fill"), true);
  }

  state.db.products.unshift(product);
  if (!saveData()) {
    state.db.products.shift();
    return;
  }

  closeModal();
  go("products");
};

const openOrderForm = () => {
  modal(`
    <h3>${t("order")}</h3>
    <input id="n" placeholder="${t("name")}">
    <input id="ph" placeholder="01XXXXXXXXX" inputmode="tel">
    <select id="pr" data-action="product-select">
      <option value="">${t("manual")}</option>
      ${state.db.products.map((p) => `<option value="${p.id}">${E(p.name)} (${p.stock})</option>`).join("")}
    </select>
    <input id="it" placeholder="${t("product")}">
    <input id="qt" type="number" value="1" min="1" placeholder="${t("qty")}">
    <input id="am" type="number" placeholder="${t("amount")}">
    <small>${t("source")}</small>
    <select id="sr">${SRC.map((s) => `<option>${s}</option>`).join("")}</select>
    <select id="mt"><option>COD</option><option>bKash</option><option>Nagad</option></select>
    <select id="py"><option>Due</option><option>Paid</option></select>
    <button class="btn" data-action="submit-order">${t("save")}</button>
  `);
};

const addOrder = () => {
  const order = {
    id: Date.now(),
    date: day(),
    name: $("#n").value.trim(),
    phone: bd2en($("#ph").value).replace(/[\s-]/g, ""),
    pid: Number($("#pr").value) || 0,
    item: $("#it").value.trim(),
    qty: Math.max(1, Number($("#qt").value) || 1),
    amount: Number($("#am").value),
    src: $("#sr") ? $("#sr").value : "Other",
    method: $("#mt").value,
    pay: $("#py").value,
    status: "New"
  };

  if (!validateOrder(order)) {
    return toast(t("fill"), true);
  }

  const product = state.db.products.find((x) => x.id === order.pid);
  if (product && product.stock < order.qty) {
    return toast(t("nostock"), true);
  }

  const { r, w } = risk(order);
  order.rk = r >= 3 ? 2 : r >= 1 ? 1 : 0;
  order.warn = w.join(", ");

  if (order.rk === 2 && !confirm(`${t("riskq")}\n${order.warn}`)) return;

  order.cost = product ? product.cost * order.qty : 0;
  if (product) product.stock -= order.qty;

  state.db.orders.unshift(order);

  if (!saveData()) {
    state.db.orders.shift();
    if (product) product.stock += order.qty;
    return;
  }

  closeModal();
  go("orders");
  toast(t("saved"));
};

const openExpenseForm = () => {
  modal(`
    <h3>${t("expense")}</h3>
    <select id="et">
      <option>Ads</option>
      <option>Delivery</option>
      <option>Packaging</option>
      <option>Salary</option>
      <option>Other</option>
    </select>
    <input id="ea" type="number" placeholder="${t("amount")}">
    <input id="en" placeholder="${t("note")}">
    <button class="btn" data-action="submit-expense">${t("save")}</button>
  `);
};

const addExpense = () => {
  const expense = {
    id: Date.now(),
    date: day(),
    type: $("#et").value,
    amount: Number($("#ea").value),
    note: $("#en").value.trim()
  };

  if (!validateExpense(expense)) {
    return toast(t("fill"), true);
  }

  state.db.expenses.unshift(expense);

  if (!saveData()) {
    state.db.expenses.shift();
    return;
  }

  closeModal();
  go("money");
};

const restockProduct = (id) => {
  const qty = Number(prompt(t("qty")));
  if (qty > 0) {
    const item = state.db.products.find((p) => p.id === id);
    if (item) {
      item.stock += qty;
      saveData();
      renderShell();
    }
  }
};

const deleteProduct = (id) => {
  if (!confirm(t("sure"))) return;
  state.db.products = state.db.products.filter((p) => p.id !== id);
  saveData();
  go("products");
};

const deleteOrder = (id) => {
  if (!confirm(t("sure"))) return;
  const order = state.db.orders.find((x) => x.id === id);
  if (!order) return;

  const product = state.db.products.find((p) => p.id === order.pid);
  if (product && !dead(order.status)) product.stock += order.qty;

  state.db.orders = state.db.orders.filter((x) => x.id !== id);
  saveData();
  go("orders");
};

const deleteExpense = (id) => {
  if (!confirm(t("sure"))) return;
  state.db.expenses = state.db.expenses.filter((x) => x.id !== id);
  saveData();
  go("money");
};

const updateOrderStatus = (id, nextStatus) => {
  const order = state.db.orders.find((x) => x.id === id);
  if (!order) return;

  const product = state.db.products.find((p) => p.id === order.pid);

  if (product) {
    if (!dead(order.status) && dead(nextStatus)) {
      product.stock += order.qty;
    } else if (dead(order.status) && !dead(nextStatus)) {
      if (product.stock < order.qty) {
        toast(t("nostock"), true);
        renderShell();
        return;
      }
      product.stock -= order.qty;
    }
  }

  order.status = nextStatus;
  saveData();
  renderShell();
};

const saveSettings = () => {
  const users = G(STORAGE_KEY_USERS, {});
  if (!users[state.me]) users[state.me] = {};
  users[state.me].brand = $("#sb").value.trim() || state.me;
  users[state.me].contact = $("#sc").value.trim();
  S(STORAGE_KEY_USERS, users);
  renderShell();
  toast(t("saved"));
};

const backupData = () => {
  state.db.bk = Date.now();
  saveData();

  const payload = {
    v: STORAGE_VERSION,
    username: state.me,
    user: G(STORAGE_KEY_USERS, {})[state.me],
    data: state.db
  };

  const blob = new Blob([JSON.stringify(payload, null, 1)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `bimo_backup_${state.me}_${day()}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  renderShell();
};

const restoreData = (file) => {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result);
      if (!payload || !payload.data || !Array.isArray(payload.data.orders)) throw new Error("Invalid backup");

      const users = G(STORAGE_KEY_USERS, {});
      users[payload.username] = payload.user;
      S(STORAGE_KEY_USERS, users);
      S(`bimo2_d_${payload.username}`, cleanData(payload.data));

      state.me = payload.username;
      localStorage.setItem(STORAGE_KEY_SESSION, state.me);
      boot();
      toast(t("saved"));
    } catch {
      toast(t("fill"), true);
    }
  };
  reader.readAsText(file);
};

const exportCsv = () => {
  const rows = [
    ["id", "date", "name", "phone", "item", "qty", "amount", "method", "pay", "status"]
  ].concat(
    state.db.orders.map((o) => [
      o.id,
      o.date,
      o.name,
      o.phone,
      o.item,
      o.qty,
      o.amount,
      o.method,
      o.pay,
      o.status
    ])
  );

  const csv =
    "\ufeff" +
    rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "bimo_orders.csv";
  link.click();
  URL.revokeObjectURL(link.href);
};

const bd2en = (value) => String(value).replace(/[০-৯]/g, (c) => "০১২৩৪৫৬৭৮৯".indexOf(c));

const parseOrderText = (text) => {
  const tx = bd2en(text || "").slice(0, 5000);
  const match = tx.match(/(?:\+?88[\s-]?0?[\s-]?|0)1[3-9](?:[\s-]?\d){8}/);
  const phoneRaw = match ? match[0] : "";
  const phoneClean = phoneRaw.replace(/[\s-]/g, "");
  const rest = tx.replace(phoneRaw || "\u0000", " ");
  const low = tx.toLowerCase();

  const amountMatch =
    rest.match(/(\d[\d,]*(?:\.\d+)?)\s*(?:tk|taka|bdt|৳)/i) ||
    rest.match(/(?:৳|tk\.?|bdt)\s*(\d[\d,]*)/i);

  const qtyMatch = rest.match(/(\d+)\s*(?:pcs?|pieces?)/i);

  const product = state.db.products.find((item) => item.name && low.includes(item.name.toLowerCase()));
  const labelMatch = tx.match(/(?:name)\s*[:：-]\s*([^\n,]+)/i);

  const validName = (value) =>
    value &&
    value.length > 1 &&
    value.length <= 40 &&
    !/\d/.test(value) &&
    !(product && value.toLowerCase().includes(product.name.toLowerCase()));

  let name = labelMatch ? labelMatch[1].trim() : "";

  if (!validName(name)) {
    const lines = (phoneRaw ? tx.slice(0, tx.indexOf(phoneRaw)) : tx)
      .split(/\n/)
      .map((line) =>
        line
          .replace(/(?:phone|mobile|mob|number)\s*[:：-]?/gi, "")
          .replace(/[,:;-]+/g, " ")
          .trim()
      )
      .filter(Boolean);

    name =
      lines.reverse().find(validName) ||
      tx
        .split(/[\n,]/)
        .map((part) => part.trim())
        .find(validName) ||
      "";
  }

  return {
    name,
    phone: phoneClean && phoneClean[0] !== "0" ? "0" + phoneClean : phoneClean,
    qty: Math.min(1e4, Number(qtyMatch && qtyMatch[1]) || 1),
    amount: amountMatch ? Number(String(amountMatch[1]).replace(/,/g, "")) : 0,
    pid: product ? product.id : 0,
    item: product ? product.name : ""
  };
};

const pasteForm = () => {
  modal(`
    <h3>📋 ${t("paste")}</h3>
    <small>${t("pastehint")}</small>
    <textarea id="px" rows="6"></textarea>
    <button class="btn" data-action="submit-paste">${t("fill_form")}</button>
  `);
};

const submitPaste = () => {
  const result = parseOrderText($("#px").value);
  const product = state.db.products.find((item) => item.id === result.pid);

  closeModal();
  openOrderForm();

  $("#n").value = result.name;
  $("#ph").value = result.phone;
  $("#it").value = result.item;
  $("#qt").value = result.qty;

  if (product) $("#pr").value = product.id;
  $("#am").value = result.amount || (product ? product.price * result.qty : "");
};

const instructions = {
  profit: "Profit",
  stock: "Stock",
  pending: "Pending",
  backup: "Backup"
};

const answerQuestion = (input) => {
  const x = bd2en(input).toLowerCase();
  const delivered = state.db.orders.filter((o) => o.status === "Delivered");
  const profit = sum(delivered, "amount") - sum(delivered, "cost") - sum(state.db.expenses, "amount");
  const openOrders = state.db.orders.filter((o) => !dead(o.status) && o.status !== "Delivered");
  const todayOrders = state.db.orders.filter((o) => o.date === day() && !dead(o.status));
  const lowStock = state.db.products.filter((p) => p.stock <= 5);
  const highRisk = openOrders.filter((o) => o.rk === 2);

  if (/profit/.test(x)) return `${t("profit")}: ${tk(profit)}`;
  if (/stock/.test(x)) return lowStock.length ? lowStock.slice(0, 6).map((p) => `${p.name} (${p.stock})`).join(", ") : "Stock is fine.";
  if (/pending/.test(x)) return `${openOrders.length} orders · ${tk(sum(openOrders, "amount"))}`;
  if (/today/.test(x)) return `${todayOrders.length} orders · ${tk(sum(todayOrders, "amount"))}`;
  if (/risk/.test(x)) return highRisk.length ? highRisk.slice(0, 5).map((o) => `${o.name}: ${o.warn}`).join("; ") : "No high-risk open orders.";
  return `Try: ${Object.values(instructions).join(", ")}`;
};

const openHelpModal = () => {
  modal(`
    <h3>🤖 ${t("help")}</h3>
    <small>${t("helpnote")}</small>
    <div id="hc" style="display:flex;flex-direction:column;gap:6px;max-height:40vh;overflow:auto"></div>
    <div class="row">
      <button class="i" data-action="ask-help-profit">Profit</button>
      <button class="i" data-action="ask-help-stock">Stock</button>
      <button class="i" data-action="ask-help-pending">Pending</button>
      <button class="i" data-action="ask-help-backup">Backup</button>
    </div>
    <div class="row">
      <input id="hq" style="flex:1" placeholder="Ask...">
      <button class="i" data-action="ask-help-submit">➤</button>
    </div>
  `);
};

const askHelp = (value) => {
  if (!value) {
    const input = $("#hq");
    if (!input) return;
    value = input.value.trim();
  }
  if (!value) return;

  const helpNode = $("#hc");
  if (helpNode) {
    helpNode.insertAdjacentHTML(
      "beforeend",
      `<div class="bd" style="align-self:flex-end">${E(value)}</div><div class="card">${E(answerQuestion(value))}</div>`
    );
    helpNode.scrollTop = 1e5;
  }
};

const risk = (order) => {
  let score = 0;
  const warnings = [];
  const prev = state.db.orders.filter((x) => x.phone === order.phone);
  const bad = prev.filter((x) => dead(x.status)).length;

  if (!/^(\+?88)?01[3-9]\d{8}$/.test(order.phone)) {
    score += 2;
    warnings.push("Invalid phone");
  }
  if (bad >= 2) {
    score += 3;
    warnings.push(`${bad} past cancels`);
  }
  if (prev.some((x) => Date.now() - x.id < 36e5)) {
    score += 1;
    warnings.push("Repeat order");
  }
  if (order.amount > 50000) {
    score += 1;
    warnings.push("High value");
  }
  if (/fake|scam|dummy|hacker/i.test(`${order.name} ${order.item}`)) {
    score += 2;
    warnings.push("Suspicious");
  }
  return { r: score, w: warnings };
};

const healthCheck = () => {
  let fixed = 0;

  state.db.products.forEach((p) => {
    if (p.stock < 0) {
      p.stock = 0;
      fixed++;
    }
  });

  state.db.orders.forEach((o) => {
    if (o.amount < 0) o.amount = 0;
    if (o.qty < 1) o.qty = 1;
  });

  if (fixed) saveData();

  toast(`${fixed ? fixed + " fixed" : "Healthy"}`);
};

const copyFeedback = () => {
  const text = `BIMO v2.5 | ${navigator.userAgent} | lang=${state.lang} | orders=${state.db.orders.length} products=${state.db.products.length} expenses=${state.db.expenses.length} | last backup=${state.db.bk ? day(state.db.bk) : "never"}\nErrors: ${G(STORAGE_KEY_ERRORS, []).slice(-3).join(" | ") || "none"}\nMy feedback: `;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => toast("Copied")).catch(() => toast("Copied manually", true));
  } else {
    prompt("Copy:", text);
  }
};

const ensureAuthSession = () => {
  const users = G(STORAGE_KEY_USERS, {});
  return state.me && users[state.me];
};

const renderAuth = () => {
  $("#app").innerHTML = `
    <div class="auth">
      <div class="card">
        <h2>${t(state.reg ? "register" : "login")}</h2>
        <input id="u" placeholder="${t("username")}" autocomplete="username" />
        ${state.reg ? `
          <input id="br" placeholder="${t("brand")}">
          <input id="ct" placeholder="${t("contact")}">
        ` : ""}
        <input id="p" type="password" placeholder="${t("password")}" autocomplete="${state.reg ? "new-password" : "current-password"}" />
        <button class="btn" data-action="submit-auth">${t(state.reg ? "register" : "login")}</button>
        <button class="btn o" data-action="toggle-register">${t(state.reg ? "login" : "register")}</button>
        <small><a data-action="set-lang-en">English</a> · <a data-action="set-lang-bn">বাংলা</a></small>
      </div>
    </div>
  `;
};

const doAuth = async () => {
  const username = $("#u").value.trim().toLowerCase();
  const password = $("#p").value;
  const users = G(STORAGE_KEY_USERS, {});

  if (!/^[a-z0-9_.]{3,20}$/.test(username) || username === "__proto__" || password.length < 6) {
    return toast(t("bad"), true);
  }

  if (state.reg) {
    if (has(users, username)) return toast(t("taken"), true);

    const salt = crypto.randomUUID ? crypto.randomUUID() : String(Math.random());
    users[username] = {
      salt,
      h: await hash(password, salt),
      brand: $("#br") ? $("#br").value.trim() || username : username,
      contact: $("#ct") ? $("#ct").value.trim() : ""
    };

    S(STORAGE_KEY_USERS, users);
  } else {
    if (!has(users, username) || users[username].h !== (await hash(password, users[username].salt))) {
      return toast(t("wrong"), true);
    }
  }

  state.me = username;
  localStorage.setItem(STORAGE_KEY_SESSION, username);
  boot();
};

const logout = () => {
  localStorage.removeItem(STORAGE_KEY_SESSION);
  state.me = null;
  renderAuth();
};

const boot = () => {
  state.db = cleanData(G(`bimo2_d_${state.me}`, {}));
  renderShell();
  maybeTakeShare();
};

const go = (tabName) => {
  state.tab = tabName;
  state.query = "";
  state.filter = "";
  state.limit = 50;
  renderShell();
  window.scrollTo(0, 0);
};

const setLanguage = (langCode) => {
  state.lang = langCode;
  localStorage.setItem("bimo_lang", langCode);
  if (state.me) renderShell();
  else renderAuth();
};

const maybeTakeShare = () => {
  try {
    const params = new URLSearchParams(location.search);
    const sharedText = [params.get("title"), params.get("text"), params.get("url")].filter(Boolean).join("\n");
    if (sharedText) sessionStorage.setItem("bimo_share", sharedText.slice(0, 5000));
    const share = sessionStorage.getItem("bimo_share");
    if (share && state.me) {
      sessionStorage.removeItem("bimo_share");
      history.replaceState(null, "", location.pathname);
      go("orders");
      pasteForm();
      $("#px").value = share;
    }
  } catch {
    // ignored
  }
};

const openWhatsApp = (id) => {
  const order = state.db.orders.find((x) => x.id === id);
  if (!order) return;

  let phone = order.phone.replace(/\D/g, "");
  if (phone.startsWith("01")) phone = "88" + phone;

  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(
      t("wamsg").replace("{n}", order.name).replace("{a}", tk(order.amount))
    )}`,
    "_blank"
  );
};

const openInvoice = (id) => {
  const order = state.db.orders.find((x) => x.id === id);
  if (!order) return;

  const user = getUserProfile();
  const popup = window.open("", "_blank");
  if (!popup) return;

  popup.document.write(`
    <title>Invoice</title>
    <body style="font:15px system-ui;max-width:420px;margin:30px auto">
      <h2>${E(user.brand || state.me)}</h2>
      <p>Invoice #${String(order.id).slice(-6)} · ${order.date}</p>
      <hr>
      <p><b>${E(order.name)}</b><br>${E(order.phone)}</p>
      <p>${E(order.item)} × ${order.qty}</p>
      <h3>${tk(order.amount)} · ${order.method} · ${order.pay}</h3>
      <script>print();<\/script>
    </body>
  `);
  popup.document.close();
};

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

  switch (action) {
    case "help":
      openHelpModal();
      break;
    case "theme":
      useTheme();
      break;
    case "toggle-lang":
      setLanguage(state.lang === "en" ? "bn" : "en");
      break;
    case "logout":
      logout();
      break;
    case "nav":
      go(target.dataset.tab);
      break;
    case "go-settings":
      go("settings");
      break;
    case "search":
      state.query = target.value;
      renderShell();
      break;
    case "filter":
      state.filter = target.value;
      renderShell();
      break;
    case "open-order-form":
      openOrderForm();
      break;
    case "open-product-form":
      openProductForm();
      break;
    case "open-expense-form":
      openExpenseForm();
      break;
    case "paste-form":
      pasteForm();
      break;
    case "submit-paste":
      submitPaste();
      break;
    case "submit-product":
      addProduct();
      break;
    case "submit-order":
      addOrder();
      break;
    case "submit-expense":
      addExpense();
      break;
    case "restock":
      restockProduct(Number(target.dataset.id));
      break;
    case "delete-product":
      deleteProduct(Number(target.dataset.id));
      break;
    case "delete-order":
      deleteOrder(Number(target.dataset.id));
      break;
    case "delete-expense":
      deleteExpense(Number(target.dataset.id));
      break;
    case "set-order-status":
      updateOrderStatus(Number(target.dataset.id), target.value);
      break;
    case "wa":
      openWhatsApp(Number(target.dataset.id));
      break;
    case "invoice":
      openInvoice(Number(target.dataset.id));
      break;
    case "save-settings":
      saveSettings();
      break;
    case "backup":
      backupData();
      break;
    case "health-check":
      healthCheck();
      break;
    case "copy-feedback":
      copyFeedback();
      break;
    case "restore-file":
      if (target.files && target.files[0]) restoreData(target.files[0]);
      break;
    case "submit-auth":
      doAuth();
      break;
    case "toggle-register":
      state.reg = !state.reg;
      renderAuth();
      break;
    case "set-lang-en":
      setLanguage("en");
      break;
    case "set-lang-bn":
      setLanguage("bn");
      break;
    case "ask-help-stock":
      askHelp("stock");
      break;
    case "ask-help-profit":
      askHelp("profit");
      break;
    case "ask-help-pending":
      askHelp("pending");
      break;
    case "ask-help-backup":
      askHelp("backup");
      break;
    case "ask-help-submit":
      askHelp();
      break;
    case "more-orders":
      state.limit += 50;
      renderShell();
      break;
    case "more-customers":
      state.limit += 50;
      renderShell();
      break;
    case "csv-export":
      exportCsv();
      break;
    default:
      break;
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;

  if (target.matches("[data-action='restore-file']")) {
    restoreData(target.files[0]);
  }

  if (target.matches("#pr")) {
    const selected = state.db.products.find((x) => String(x.id) === String(target.value));
    if (!selected) return;
    const targetIt = $("#it");
    const targetAmount = $("#am");
    if (targetIt) targetIt.value = selected.name;
    if (targetAmount) targetAmount.value = selected.price * (Number($("#qt").value) || 1);
  }

  if (target.matches("[data-action='set-order-status']")) {
    updateOrderStatus(Number(target.dataset.id), target.value);
  }
});

document.addEventListener("input", (event) => {
  const target = event.target;

  if (target.matches("[data-action='search']")) {
    state.query = target.value;
    renderShell();
  }

  if (target.matches("[data-action='filter']")) {
    state.filter = target.value;
    renderShell();
  }

  if (target.matches("#qt")) {
    const selected = state.db.products.find((x) => String(x.id) === String($("#pr").value));
    if (!selected) return;
    const amtField = $("#am");
    if (amtField) amtField.value = selected.price * (Number(target.value) || 1);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target.matches("#hq")) {
    askHelp();
  }
});

const useTheme = () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("bimo_theme", next);
};

const getUserProfile = () => G(STORAGE_KEY_USERS, {})[state.me] || { brand: state.me };

const initialize = () => {
  document.documentElement.dataset.theme = L("bimo_theme") || "dark";

  if (state.me && ensureAuthSession()) {
    boot();
  } else {
    state.me = null;
    renderAuth();
  }
};

initialize();
