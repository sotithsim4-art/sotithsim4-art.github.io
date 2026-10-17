// To add a new dashboard to the hub, add an entry here — nothing else needs to change.
const DASHBOARDS = [
  {
    href: "soc-dashboard.html",
    icon: "🛡",
    tag: "DEFENSIVE",
    tagClass: "high",
    title: "SOC Dashboard",
    description: "Blue-team portfolio: threat detection, incident response, GRC, and monitoring tools built like a live security operations center.",
    stats: ["16 Projects", "4 Certifications"],
  },
  {
    href: "pentest-dashboard.html",
    icon: "💀",
    tag: "OFFENSIVE",
    tagClass: "critical",
    title: "Pentest Dashboard",
    description: "Red-team toolkit: reconnaissance, enumeration, and vulnerability-identification tools for authorized penetration testing.",
    stats: ["5 Tools", "Authorized Use Only"],
  },
];

function renderHub() {
  const grid = document.getElementById("hub-grid");
  grid.innerHTML = DASHBOARDS.map((d) => `
    <a href="${d.href}" class="hub-card">
      <div class="hub-card-icon">${d.icon}</div>
      <div class="project-tag ${d.tagClass}">${d.tag}</div>
      <h2>${d.title}</h2>
      <p>${d.description}</p>
      <div class="hub-card-stats">
        ${d.stats.map((s) => `<span>${s}</span>`).join("")}
      </div>
      <span class="hub-card-cta">ENTER DASHBOARD →</span>
    </a>
  `).join("");
}

const IAM_TOOLS = [
  {
    repo: "rbac-checker",
    title: "RBAC Checker",
    description: "Allow or deny from a named role. Only admin can grant access.",
  },
  {
    repo: "least-privilege-auditor",
    title: "Least Privilege Auditor",
    description: "Flags wildcard grants and permissions that can change who has access.",
  },
  {
    repo: "mfa-coverage",
    title: "MFA Coverage",
    description: "Counts active accounts that still have no second factor.",
  },
  {
    repo: "access-review",
    title: "Access Review",
    description: "Marks access unused for more than 90 days as revoke.",
  },
  {
    repo: "jml-checklist",
    title: "Joiner Mover Leaver",
    description: "Checklist for a new hire, a role change, and an account leaving.",
  },
];

function renderIam() {
  const grid = document.getElementById("iam-grid");
  grid.innerHTML = IAM_TOOLS.map((tool) => `
    <a class="hub-card" href="https://github.com/sotithsim4-art/${tool.repo}" target="_blank" rel="noopener">
      <div class="project-tag high">IAM</div>
      <h2>${tool.title}</h2>
      <p>${tool.description}</p>
      <span class="hub-card-cta">VIEW ON GITHUB →</span>
    </a>
  `).join("");
}

// Associate: Regulatory Support section. Gate is client-side only (a convenience lock, not security):
// the passcode is stored as a SHA-256 hash. Keep anything truly sensitive out of this page.
const REG_SUPPORT_HASH = "f44fa27fe300f86b7385babc3d127788dd77d561364e9d1b27c913b7f1eff396";
const REG_SUPPORT_TOOLS = [
  {
    folder: "control-mapping",
    title: "Regulatory Control Mapping Hub",
    description: "Map each control once across NIST CSF 2.0, GLBA Safeguards, Reg S-P, NYDFS Part 500, SOX ITGCs and DORA. Evidence, owners, review dates, gap reports.",
  },
  {
    folder: "data-discovery",
    title: "Data Discovery and Classification",
    description: "Finds NPI and PII in file shares and databases, tags sensitivity, maps lineage and flags shadow copies.",
  },
  {
    folder: "access-governance",
    title: "Access Governance and Recertification",
    description: "Manager attestations, orphaned and excessive access, MFA coverage and audit-ready review records.",
  },
];

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function renderRegSupport() {
  const grid = document.getElementById("reg-grid");
  grid.innerHTML = REG_SUPPORT_TOOLS.map((tool) => `
    <a class="hub-card" href="https://github.com/sotithsim4-art/brain-vault/tree/add-compliance-apps/compliance-apps/${tool.folder}" target="_blank" rel="noopener">
      <div class="project-tag high">REG SUPPORT</div>
      <h2>${tool.title}</h2>
      <p>${tool.description}</p>
      <span class="hub-card-cta">VIEW ON GITHUB →</span>
    </a>
  `).join("");
}

function unlockRegSupport() {
  document.getElementById("reg-lock").hidden = true;
  document.getElementById("reg-content").hidden = false;
  renderRegSupport();
}

function initRegSupport() {
  const form = document.getElementById("reg-form");
  const input = document.getElementById("reg-code");
  const msg = document.getElementById("reg-msg");
  try { if (sessionStorage.getItem("reg-unlocked") === "1") return unlockRegSupport(); } catch (e) {}
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let ok = false;
    try { ok = (await sha256Hex(input.value.trim())) === REG_SUPPORT_HASH; } catch (e) {}
    if (ok) {
      try { sessionStorage.setItem("reg-unlocked", "1"); } catch (e) {}
      unlockRegSupport();
    } else {
      msg.textContent = "Access denied.";
      input.value = "";
    }
  });
}

function bootSequenceLines() {
  return [
    "sotith@hub:~$ init --system",
    "[ OK ] Portfolio environment ready",
    ...DASHBOARDS.map((d) => `[ OK ] ${d.title} / ${d.tag.toLowerCase()}`),
    `[ OK ] ${IAM_TOOLS.length} identity &amp; access tools indexed`,
    "",
    "MISSION: Detect threats. Investigate signals. Protect systems.",
    "",
    "Choose your path: soc / pentest / iam",
    "Type help for commands. Use Up / Down for history.",
  ];
}

function runHubCommand(raw) {
  const line = String(raw ?? "").trim();
  const cmd = line.toLowerCase();
  if (cmd === "") return { lines: [] };
  if (cmd === "help") {
    return {
      lines: [
        "help        show this list",
        "status      portfolio availability",
        "whoami      operator profile",
        "ls          list dashboards",
        "soc / 1     enter the SOC dashboard",
        "pentest / 2 enter the Pentest dashboard",
        "iam         list identity and access tools",
        "clear       clear the screen",
        "up / down   recall earlier commands",
      ],
    };
  }
  if (cmd === "status") {
    return { lines: [
      `READY / ${DASHBOARDS.length} dashboard entries available`,
      `INDEXED / ${IAM_TOOLS.length} IAM tools`,
      "SESSION / Public portfolio visitor",
      "Choose soc, pentest, or iam to explore.",
    ] };
  }
  if (cmd === "whoami") {
    return {
      lines: [
        "Sotith Sim",
        "SOC analyst, Army veteran, cybersecurity.",
        "github.com/sotithsim4-art",
        "tryhackme.com/p/sotithsim4",
      ],
    };
  }
  if (cmd === "ls" || cmd === "dashboards") {
    return {
      lines: DASHBOARDS.map((dashboard, index) => {
        const number = String(index + 1).padEnd(3, " ");
        const href = dashboard.href.padEnd(24, " ");
        return `${number}${href}${dashboard.tag.padEnd(12, " ")}${dashboard.title}`;
      }),
    };
  }
  if (cmd === "1" || cmd === "soc") {
    return { lines: ["Opening SOC dashboard..."], navigate: DASHBOARDS[0].href };
  }
  if (cmd === "2" || cmd === "pentest") {
    return { lines: ["Opening Pentest dashboard..."], navigate: DASHBOARDS[1].href };
  }
  if (cmd === "iam") {
    return {
      lines: IAM_TOOLS.map((tool) => `${tool.repo.padEnd(28, " ")}${tool.title}`),
      anchor: "iam",
    };
  }
  if (cmd === "clear") return { lines: [], clear: true };
  return { lines: [`command not found: ${line}`, "Type help."] };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { runHubCommand, DASHBOARDS, IAM_TOOLS, REG_SUPPORT_TOOLS, bootSequenceLines };
}
