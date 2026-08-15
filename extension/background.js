importScripts("analyze.js");

const APP_URL = "https://scamshield.lovable.app";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "scamshield-scan-link",
    title: "Scan link with ScamShield",
    contexts: ["link", "selection", "page"],
  });
  chrome.storage.local.get({ stats: null }, ({ stats }) => {
    if (!stats) chrome.storage.local.set({ stats: { scanned: 0, blocked: 0 }, history: [], enabled: true });
  });
});

async function recordScan(target, result) {
  const { stats = { scanned: 0, blocked: 0 }, history = [] } = await chrome.storage.local.get(["stats", "history"]);
  stats.scanned += 1;
  if (result.level === "dangerous") stats.blocked += 1;
  const entry = { target, score: result.score, level: result.level, at: Date.now() };
  await chrome.storage.local.set({ stats, history: [entry, ...history].slice(0, 50) });
  return entry;
}

function paintBadge(tabId, result) {
  const colors = { safe: "#22c55e", caution: "#eab308", suspicious: "#f97316", dangerous: "#ef4444" };
  chrome.action.setBadgeBackgroundColor({ tabId, color: colors[result.level] || "#6366f1" });
  chrome.action.setBadgeText({ tabId, text: String(result.score) });
}

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (info.status !== "complete" || !tab.url || !/^https?:/.test(tab.url)) return;
  const { enabled = true } = await chrome.storage.local.get("enabled");
  if (!enabled) return;
  const result = analyzeUrl(tab.url);
  await recordScan(tab.url, result);
  paintBadge(tabId, result);
  if (result.level === "dangerous") {
    chrome.tabs.sendMessage(tabId, { type: "SCAMSHIELD_WARN", result, url: tab.url }, () => void chrome.runtime.lastError);
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const target = info.linkUrl || info.selectionText || info.pageUrl;
  const result = analyzeUrl(target);
  await recordScan(target, result);
  if (tab?.id) {
    paintBadge(tab.id, result);
    chrome.tabs.sendMessage(tab.id, { type: "SCAMSHIELD_RESULT", result, url: target }, () => void chrome.runtime.lastError);
  }
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "SCAMSHIELD_SCAN") {
    const result = analyzeUrl(msg.target);
    recordScan(msg.target, result).then(() => sendResponse({ result }));
    return true;
  }
  if (msg?.type === "SCAMSHIELD_OPEN_APP") {
    chrome.tabs.create({ url: `${APP_URL}/scan/url` });
  }
});
