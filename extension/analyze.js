// Shared heuristic engine (mirrors the ScamShield web app rules, runs fully offline).
const SAFE_DOMAINS = [
  "google.com","youtube.com","github.com","wikipedia.org","microsoft.com",
  "apple.com","amazon.com","paypal.com","netflix.com","linkedin.com",
  "instagram.com","facebook.com","x.com","cloudflare.com","openai.com",
];
const SHORTENERS = ["bit.ly","tinyurl.com","t.co","goo.gl","ow.ly","is.gd","rb.gy","cutt.ly","shorturl.at"];
const BAD_TLDS = [".zip",".click",".top",".xyz",".gq",".tk",".ml",".cf",".rest",".mom",".lol",".buzz"];
const BRANDS = ["paypal","amazon","apple","google","microsoft","netflix","facebook","instagram","whatsapp","sbi","hdfc","icici","dhl","fedex"];
const SCAM_PHRASES = [
  "verify your account","account suspended","kyc","unusual activity","confirm your password",
  "click here immediately","you have won","lottery","claim your prize","gift card","crypto giveaway",
  "wire transfer","send otp","share otp","refund pending","update payment",
];
const URGENCY = ["urgent","immediately","within 24 hours","final warning","last chance","act now","expires today"];

function hostOf(raw) {
  try {
    const u = new URL(/^https?:\/\//i.test(raw) ? raw : "https://" + raw);
    return { host: u.hostname.toLowerCase(), protocol: u.protocol, href: u.href, path: u.pathname + u.search };
  } catch {
    return null;
  }
}

function levenshtein(a, b) {
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      m[i][j] = Math.min(m[i-1][j] + 1, m[i][j-1] + 1, m[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
  return m[a.length][b.length];
}

/** @returns {{score:number,level:string,findings:{label:string,detail:string,severity:string}[],recommendations:string[]}} */
function analyzeUrl(input) {
  const findings = [];
  const recommendations = [];
  let score = 6;
  const parsed = hostOf(input || "");

  if (!parsed) {
    return {
      score: 45, level: "suspicious",
      findings: [{ label: "Unparseable target", detail: "This does not look like a valid web address.", severity: "medium" }],
      recommendations: ["Double-check the address before opening it."],
    };
  }

  const { host, protocol, path } = parsed;
  const bare = host.replace(/^www\./, "");
  const root = bare.split(".").slice(-2).join(".");

  if (SAFE_DOMAINS.includes(root)) {
    findings.push({ label: "Recognised domain", detail: `${root} is a well-known, high-reputation domain.`, severity: "info" });
  } else {
    score += 10;
    findings.push({ label: "Unfamiliar domain", detail: `${bare} is not in our high-reputation allowlist.`, severity: "low" });
  }

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    score += 35;
    findings.push({ label: "Raw IP address host", detail: "Legitimate brands do not serve logins from bare IP addresses.", severity: "high" });
    recommendations.push("Never enter credentials on an IP-address URL.");
  }

  if (SHORTENERS.includes(bare)) {
    score += 22;
    findings.push({ label: "URL shortener", detail: `${bare} hides the real destination.`, severity: "medium" });
    recommendations.push("Expand the short link before opening it.");
  }

  const badTld = BAD_TLDS.find((t) => bare.endsWith(t));
  if (badTld) {
    score += 24;
    findings.push({ label: "High-abuse TLD", detail: `${badTld} is heavily used in phishing campaigns.`, severity: "high" });
  }

  for (const brand of BRANDS) {
    const label = bare.split(".")[0];
    const impersonates =
      (bare.includes(brand) && root !== `${brand}.com` && !SAFE_DOMAINS.includes(root)) ||
      (label.length > 3 && levenshtein(label, brand) === 1);
    if (impersonates) {
      score += 34;
      findings.push({ label: "Brand impersonation", detail: `Host looks like "${brand}" but is not the official domain.`, severity: "high" });
      recommendations.push(`Open ${brand} directly by typing the address yourself.`);
      break;
    }
  }

  if (protocol === "http:") {
    score += 14;
    findings.push({ label: "No encryption (HTTP)", detail: "Traffic to this page is sent in clear text.", severity: "medium" });
  }

  if ((bare.match(/-/g) || []).length >= 3 || bare.split(".").length >= 5) {
    score += 12;
    findings.push({ label: "Deceptive host structure", detail: "Excessive hyphens or subdomains are a common cloaking trick.", severity: "medium" });
  }

  if (/(login|signin|verify|secure|update|billing|wallet|recover)/i.test(path) && !SAFE_DOMAINS.includes(root)) {
    score += 16;
    findings.push({ label: "Credential-harvesting path", detail: "The path targets sign-in or payment details.", severity: "medium" });
    recommendations.push("Log in only from the app or a bookmark you trust.");
  }

  const text = (input || "").toLowerCase();
  const phrase = SCAM_PHRASES.find((p) => text.includes(p));
  if (phrase) {
    score += 18;
    findings.push({ label: "Scam wording detected", detail: `Contains "${phrase}".`, severity: "high" });
  }
  const urgent = URGENCY.find((p) => text.includes(p));
  if (urgent) {
    score += 10;
    findings.push({ label: "Pressure tactics", detail: `Urgency cue "${urgent}" found.`, severity: "medium" });
  }

  score = Math.max(2, Math.min(99, score));
  const level = score >= 75 ? "dangerous" : score >= 45 ? "suspicious" : score >= 22 ? "caution" : "safe";

  if (level === "safe") recommendations.push("No action needed — this destination looks clean.");
  else {
    recommendations.push("Do not enter passwords, OTPs or card details here.");
    recommendations.push("Report it to the ScamShield community feed to protect others.");
  }

  return { score, level, findings, recommendations: [...new Set(recommendations)].slice(0, 5) };
}

if (typeof module !== "undefined") module.exports = { analyzeUrl };
