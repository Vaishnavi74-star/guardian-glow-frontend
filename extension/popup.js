const COLORS = { safe: "#22c55e", caution: "#eab308", suspicious: "#f97316", dangerous: "#ef4444" };
const LABEL = { safe: "Looks safe", caution: "Be careful", suspicious: "Suspicious", dangerous: "Dangerous" };

function paint(result, target) {
  const color = COLORS[result.level] || "#6366f1";
  document.getElementById("score").textContent = result.score;
  document.getElementById("score").style.color = color;
  document.getElementById("level").textContent = LABEL[result.level] || result.level;
  document.getElementById("level").style.color = color;
  document.getElementById("host").textContent = String(target).slice(0, 46);
  document.getElementById("findings").innerHTML = result.findings
    .slice(0, 3)
    .map((f) => `<li><b>${f.label}</b> — ${f.detail}</li>`)
    .join("");
}

async function refreshStats() {
  const { stats = { scanned: 0, blocked: 0 } } = await chrome.storage.local.get("stats");
  document.getElementById("scanned").textContent = stats.scanned;
  document.getElementById("blocked").textContent = stats.blocked;
}

(async () => {
  const { enabled = true } = await chrome.storage.local.get("enabled");
  const toggle = document.getElementById("enabled");
  toggle.checked = enabled;
  toggle.addEventListener("change", () => chrome.storage.local.set({ enabled: toggle.checked }));

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url && /^https?:/.test(tab.url)) {
    document.getElementById("current").textContent = "This tab";
    paint(analyzeUrl(tab.url), new URL(tab.url).hostname);
  } else {
    document.getElementById("current").textContent = "No scannable page in this tab";
    document.getElementById("level").textContent = "Idle";
  }

  document.getElementById("scan").addEventListener("click", () => {
    const target = document.getElementById("target").value.trim();
    if (!target) return;
    chrome.runtime.sendMessage({ type: "SCAMSHIELD_SCAN", target }, (res) => {
      if (res?.result) paint(res.result, target);
      refreshStats();
    });
  });

  document.getElementById("target").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("scan").click();
  });

  const open = () => chrome.runtime.sendMessage({ type: "SCAMSHIELD_OPEN_APP" });
  document.getElementById("open").addEventListener("click", open);
  document.getElementById("dash").addEventListener("click", (e) => { e.preventDefault(); open(); });

  refreshStats();
})();
