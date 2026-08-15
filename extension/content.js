// Injects the ScamShield warning / result overlay on the page.
(() => {
  const ID = "scamshield-overlay-root";

  const COLORS = {
    safe: ["#22c55e", "Looks safe"],
    caution: ["#eab308", "Be careful"],
    suspicious: ["#f97316", "Suspicious"],
    dangerous: ["#ef4444", "Phishing site blocked"],
  };

  function render({ result, url, blocking }) {
    document.getElementById(ID)?.remove();
    const [color, heading] = COLORS[result.level] || COLORS.caution;

    const root = document.createElement("div");
    root.id = ID;
    root.style.cssText = `position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;
      font-family:system-ui,-apple-system,Segoe UI,sans-serif;${blocking ? "background:rgba(6,8,20,.82);backdrop-filter:blur(8px);" : "background:transparent;pointer-events:none;align-items:flex-start;justify-content:flex-end;padding:18px;"}`;

    const card = document.createElement("div");
    card.style.cssText = `pointer-events:auto;max-width:${blocking ? "440px" : "340px"};width:100%;border-radius:20px;padding:22px;
      background:rgba(16,18,38,.92);border:1px solid ${color}55;box-shadow:0 24px 60px rgba(0,0,0,.5);color:#e8eaf6;`;

    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:34px;height:34px;border-radius:11px;display:grid;place-items:center;background:${color}22;color:${color};font-weight:800">!</div>
        <div style="flex:1">
          <div style="font-size:11px;letter-spacing:.14em;color:#9aa0c0">SCAMSHIELD</div>
          <div style="font-weight:800;color:${color};font-size:${blocking ? "18px" : "15px"}">${heading}</div>
        </div>
        <div style="font-size:22px;font-weight:900;color:${color}">${result.score}</div>
      </div>
      <div style="margin-top:10px;font-size:12px;color:#9aa0c0;word-break:break-all">${String(url).slice(0, 120)}</div>
      <ul style="margin:12px 0 0;padding-left:18px;font-size:12.5px;line-height:1.6;color:#c9cde8">
        ${result.findings.slice(0, 4).map((f) => `<li><b>${f.label}</b> — ${f.detail}</li>`).join("")}
      </ul>
      ${result.recommendations?.length ? `<div style="margin-top:12px;font-size:12px;color:#9aa0c0">${result.recommendations[0]}</div>` : ""}
      <div style="display:flex;gap:8px;margin-top:16px">
        ${blocking ? `<button data-act="back" style="flex:1;cursor:pointer;border:0;border-radius:12px;padding:10px;font-weight:700;color:#fff;background:linear-gradient(135deg,#6366f1,#a855f7)">Take me back</button>` : ""}
        <button data-act="close" style="flex:1;cursor:pointer;border:1px solid rgba(255,255,255,.14);border-radius:12px;padding:10px;font-weight:600;color:#e8eaf6;background:rgba(255,255,255,.06)">${blocking ? "Continue anyway" : "Dismiss"}</button>
      </div>`;

    card.addEventListener("click", (e) => {
      const act = e.target?.dataset?.act;
      if (act === "close") root.remove();
      if (act === "back") history.length > 1 ? history.back() : (location.href = "about:blank");
    });

    root.appendChild(card);
    document.documentElement.appendChild(root);
    if (!blocking) setTimeout(() => root.remove(), 9000);
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === "SCAMSHIELD_WARN") render({ ...msg, blocking: true });
    if (msg?.type === "SCAMSHIELD_RESULT") render({ ...msg, blocking: false });
  });
})();
