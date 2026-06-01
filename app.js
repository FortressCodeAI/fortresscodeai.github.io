import { API_URL } from "./config.js";
import { renderModulesView } from "./views/modules.js";
import { renderEnvelopeView } from "./views/envelope.js";
import { renderHITLView } from "./views/hitl.js";
import { renderMarketplaceView } from "./views/marketplace.js";
import { renderLogsView } from "./views/logs.js";

const contentArea = document.getElementById("content-area");
const eventLog = document.getElementById("event-log");

document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => loadView(btn.dataset.view));
});

loadView("dashboard");
verifyIdentity();
connectEventStream();

function loadView(view) {
  if (view === "dashboard") {
    contentArea.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Builder Dashboard</div>
            <div class="card-subtitle">Design, govern, and publish deterministic modules.</div>
          </div>
        </div>
        <p>Use the navigation to create modules, run them through the Governance Envelope, and publish to the marketplace.</p>
      </div>
    `;
  } else if (view === "modules") {
    renderModulesView(contentArea);
  } else if (view === "envelope") {
    renderEnvelopeView(contentArea);
  } else if (view === "hitl") {
    renderHITLView(contentArea);
  } else if (view === "marketplace") {
    renderMarketplaceView(contentArea);
  } else if (view === "logs") {
    renderLogsView(contentArea);
  } else if (view === "settings") {
    contentArea.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">Settings</div>
        </div>
        <p>Configure API URL and Supabase in <code>config.js</code>.</p>
      </div>
    `;
  }
}

async function verifyIdentity() {
  try {
    const res = await fetch(`${API_URL}/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        signature: "dev-mode",
        publicKey: "dev-mode",
        nonce: "123"
      })
    });

    const data = await res.json();
    document.getElementById("user-name").textContent = data.userId || "dev-user";
    document.getElementById("authority-level").textContent = `Authority: ${data.authorityLevel || "builder"}`;
  } catch {
    document.getElementById("user-name").textContent = "offline-dev";
    document.getElementById("authority-level").textContent = "Authority: local";
  }
}

function connectEventStream() {
  try {
    const ws = new WebSocket(`${API_URL.replace("https", "wss")}/events`);
    ws.onmessage = msg => {
      const event = JSON.parse(msg.data);
      eventLog.textContent += `\n${new Date().toISOString()} — ${event.type}`;
    };
  } catch {
    eventLog.textContent += "\nEvent stream unavailable in dev mode.";
  }
}
