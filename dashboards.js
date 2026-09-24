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

function bootSequenceLines() {
  const lines = ["sotith@hub:~$ init --system", "Loading dashboards..."];
  DASHBOARDS.forEach((d) => lines.push(`&nbsp;&nbsp;[ok] ${d.href}`));
  lines.push(`&nbsp;&nbsp;[ok] ${IAM_TOOLS.length} IAM tools`);
  lines.push("sotith@hub:~$ status", `${DASHBOARDS.length} dashboards online. Type help.`);
  return lines;
}

function runHubCommand(raw) {
  const line = String(raw ?? "").trim();
  const cmd = line.toLowerCase();
  if (cmd === "") return { lines: [] };
  if (cmd === "help") {
    return {
      lines: [
        "help        show this list",
        "whoami      operator profile",
        "ls          list dashboards",
        "1           enter the SOC dashboard",
        "2           enter the Pentest dashboard",
        "iam         list identity and access tools",
        "clear       clear the screen",
        "up / down   recall earlier commands",
      ],
    };
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
  module.exports = { runHubCommand, DASHBOARDS, IAM_TOOLS, bootSequenceLines };
}
