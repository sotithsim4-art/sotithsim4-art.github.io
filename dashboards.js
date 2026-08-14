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

function bootSequenceLines() {
  const lines = ["sotith@hub:~$ init --system", "Loading dashboards..."];
  DASHBOARDS.forEach((d) => lines.push(`&nbsp;&nbsp;[ok] ${d.href}`));
  lines.push("sotith@hub:~$ status", `${DASHBOARDS.length} dashboards online. Awaiting selection.`);
  return lines;
}
