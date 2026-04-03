/* ══════════════════════════════════════
   TakaloCash — Feuille de style principale
   ══════════════════════════════════════ */

:root {
    --bg-body: #0d1117;
    --bg-nav: #161b22;
    --card: #1c2128;
    --yellow: #fcd535;
    --green: #2ebd85;
    --red: #ff4d4d;
    --gray: #848e9c;
    --border: rgba(255, 255, 255, 0.1);
    --grad-yellow: linear-gradient(135deg, #fcd535, #f7b500);
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    background: var(--bg-body);
    font-family: 'Inter', sans-serif;
    color: white;
    overflow-x: hidden;
}

/* ── HEADER ─────────────────────────── */
header {
    background: var(--bg-nav);
    padding: 18px 20px;
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 1000;
}

header i {
    transition: 0.2s;
}

header i:active {
    transform: scale(0.9);
    color: var(--yellow) !important;
}

.header-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1.5px solid var(--yellow);
    object-fit: cover;
    cursor: pointer;
}

/* ── LAYOUT ─────────────────────────── */
.container {
    max-width: 480px;
    margin: auto;
    padding: 15px;
}

/* ── SOLDE ──────────────────────────── */
.solde-card {
    text-align: center;
    padding: 35px 20px;
    background: radial-gradient(circle at top right, #1c2128, #0d1117);
    border-radius: 28px;
    margin-bottom: 25px;
    border: 1px solid var(--border);
}

.solde-amount {
    font-size: 38px;
    font-weight: 800;
    margin: 8px 0;
    letter-spacing: -1px;
}

/* ── ACTIONS & SERVICES ─────────────── */
.main-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 30px;
}

.btn-action {
    border: none;
    padding: 18px;
    border-radius: 16px;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-family: 'Inter', sans-serif;
}

.btn-env {
    background: var(--grad-yellow);
    color: black;
}

.btn-rec {
    background: var(--green);
    color: white;
}

.services-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 30px;
}

.service-item {
    background: var(--card);
    border: 1px solid var(--border);
    padding: 15px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: 0.2s;
}

.service-item:hover {
    border-color: var(--yellow);
}

.icon-box {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    background: #000;
    border: 1px solid var(--border);
    flex-shrink: 0;
}

/* ── FORMULAIRE TRANSACTION ─────────── */
.trans-box {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 22px;
    margin-bottom: 30px;
}

.styled-input {
    background: var(--bg-body);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px;
    color: white;
    width: 100%;
    outline: none;
    font-size: 14px;
    margin-top: 5px;
    font-family: 'Inter', sans-serif;
}

.styled-input:focus {
    border-color: var(--yellow);
}

.btn-valider {
    width: 100%;
    background: var(--grad-yellow);
    border: none;
    padding: 18px;
    border-radius: 14px;
    font-weight: 800;
    cursor: pointer;
    color: black;
    margin-top: 15px;
    font-size: 16px;
    font-family: 'Inter', sans-serif;
    transition: opacity 0.2s;
}

.btn-valider:hover {
    opacity: 0.9;
}

.btn-valider:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* ── HISTORIQUE ─────────────────────── */
.scroll-filter {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding: 5px 0 15px 0;
    scrollbar-width: none;
}

.scroll-filter::-webkit-scrollbar {
    display: none;
}

.filter-chip {
    background: var(--card);
    border: 1px solid var(--border);
    padding: 8px 18px;
    border-radius: 25px;
    font-size: 11px;
    white-space: nowrap;
    cursor: pointer;
    color: var(--gray);
    font-weight: 600;
    transition: 0.2s;
}

.filter-chip.active {
    background: var(--yellow);
    color: black;
    border-color: var(--yellow);
}

.history-table {
    width: 100%;
    border-collapse: collapse;
}

.history-table td {
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
}

/* ── SIDEBAR ────────────────────────── */
.sidebar {
    position: fixed;
    top: 0;
    right: -100%;
    width: 80%;
    max-width: 320px;
    height: 100%;
    background: var(--bg-nav);
    z-index: 2000;
    transition: 0.4s;
    padding: 30px;
    overflow-y: auto;
}

.sidebar.active {
    right: 0;
}

.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: none;
    z-index: 1500;
    backdrop-filter: blur(5px);
}

/* ── MODALS ─────────────────────────── */
.modal {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    z-index: 5000;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.modal-box {
    background: var(--card);
    padding: 30px;
    border-radius: 28px;
    width: 100%;
    max-width: 340px;
    border: 1px solid var(--border);
}

/* ── FOOTER ─────────────────────────── */
footer {
    background: var(--bg-nav);
    padding: 40px 20px;
    border-top: 1px solid var(--border);
    margin-top: 50px;
}

.footer-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 25px;
    margin-bottom: 30px;
}

.footer-link {
    color: var(--gray);
    text-decoration: none;
    font-size: 12px;
    display: block;
    margin-bottom: 10px;
    transition: color 0.2s;
}

.footer-link:hover {
    color: white;
}

.lang-select {
    background: transparent;
    color: var(--gray);
    border: none;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    outline: none;
}
