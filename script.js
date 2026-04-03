/* ══════════════════════════════════════
   TakaloCash — Logique principale (app.js)
   ══════════════════════════════════════ */

// ── CONFIGURATION SUPABASE ────────────────────────────────────────────────────

const supabaseClient = supabase.createClient(
    "https://nyeopreahmajoisartoz.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZW9wcmVhaG1ham9pc2FydG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NjgzMDgsImV4cCI6MjA5MDE0NDMwOH0.2ASTgZPKssdhGnFGcjit7BZOdEFOnFqIHkmt8w239EA"
);

// ── ÉTAT GLOBAL ───────────────────────────────────────────────────────────────

let currentUserId   = null;
let userSolde       = 0;
let allTransactions = [];
let currentFilter   = "Tous";
let selectedMonth   = null;
let currentMode     = "Envoyer";
let currentMobileMode = "";

// ── CONSTANTES ────────────────────────────────────────────────────────────────

const TAUX = { "TRX": 150, "USDT": 4600 };
const ADDR_RECEPT = {
    "TRX":  "T-ADIRESY-TRX-AO-AMINAO",
    "USDT": "T-ADIRESY-USDT-AO-AMINAO"
};
const MONTHS = ["Janv","Févr","Mars","Avr","Mai","Juin","Juil","Août","Sept","Oct","Nov","Déc"];

// ── AUTH ──────────────────────────────────────────────────────────────────────

async function handleLogin() {
    const email    = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const errEl    = document.getElementById('auth-error');
    errEl.style.display = 'none';

    if (!email || !password) {
        errEl.innerText = "Veuillez remplir tous les champs.";
        errEl.style.display = 'block';
        return;
    }

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
        errEl.innerText = "Email ou mot de passe incorrect.";
        errEl.style.display = 'block';
        return;
    }
    initApp();
}

async function initApp() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (user) {
        currentUserId = user.id;
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('main-app').style.display      = 'block';
        document.getElementById('nav-header').style.display    = 'block';
        document.getElementById('app-footer').style.display    = 'block';
        fetchData();
    }
}

async function logout() {
    await supabaseClient.auth.signOut();
    location.reload();
}

// ── DATA ──────────────────────────────────────────────────────────────────────

async function fetchData() {
    try {
        // Données utilisateur
        const { data: u, error: uError } = await supabaseClient
            .from('users')
            .select('*')
            .eq('id', currentUserId)
            .single();

        if (uError) throw uError;

        if (u) {
            userSolde = u.solde || 0;
            updateSoldeUI();

            const profileImg = u.avatar_url || "https://via.placeholder.com/100";
            document.getElementById('header-pp').src = profileImg;

            document.getElementById('side-name').innerText  = u.full_name || "Mpanjifa";
            document.getElementById('side-id').innerText    = u.takalo_id || ("TK-" + u.id.substring(0, 4).toUpperCase());
            document.getElementById('side-phone').innerText = u.phone || "Tsy misy laharana";
            document.getElementById('side-email').innerText = u.email || "email@example.com";
        }

        // Transactions
        const { data: ts, error: tError } = await supabaseClient
            .from('transactions')
            .select('*')
            .eq('user_id', currentUserId)
            .order('created_at', { ascending: false });

        if (tError) throw tError;
        allTransactions = ts || [];

        renderPreview();
        renderFullHistory();
        renderMonthPicker();

    } catch (err) {
        console.error("Erreur fetchData:", err);
    }
}

function updateSoldeUI() {
    document.getElementById('display-solde').innerText = userSolde.toLocaleString() + " Ar";
}

// ── NAVIGATION ────────────────────────────────────────────────────────────────

function showPage(p) {
    document.getElementById('page-home').style.display    = p === 'home'    ? 'block' : 'none';
    document.getElementById('page-history').style.display = p === 'history' ? 'block' : 'none';

    if (p === 'history') {
        document.getElementById('header-left').innerHTML =
            `<i class="fa-solid fa-arrow-left" onclick="showPage('home')" style="color:var(--yellow); cursor:pointer;"></i> &nbsp; Historique`;
        if (document.getElementById('sidebar').classList.contains('active')) toggleMenu();
    } else {
        document.getElementById('header-left').innerHTML =
            `<span style="color:var(--yellow)">TAKALO</span>CASH`;
    }
}

function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('active');
    overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
}

// ── TRANSACTION CRYPTO ────────────────────────────────────────────────────────

function switchMode(m) {
    currentMode = m;
    document.getElementById('trans-title').innerText = m + " Crypto";
    document.getElementById('service-starlink').style.display = m === 'Recevoir' ? 'none' : 'flex';

    const inputAddr  = document.getElementById('input-addr');
    const asset      = document.getElementById('crypto-select').value;
    const labelRight = document.getElementById('label-right');
    const unitSuffix = document.getElementById('unit-suffix');
    const copyBtn    = document.getElementById('copy-btn');

    if (m === 'Recevoir') {
        labelRight.innerText    = "Quantité Crypto :";
        unitSuffix.innerText    = asset;
        inputAddr.value         = ADDR_RECEPT[asset];
        inputAddr.readOnly      = true;
        copyBtn.style.display   = "block";
    } else {
        labelRight.innerText    = "Montant (Ar) :";
        unitSuffix.innerText    = "Ar";
        inputAddr.value         = "";
        inputAddr.readOnly      = false;
        copyBtn.style.display   = "none";
    }
    updateCalc();
}

function updateCalc() {
    const cry        = document.getElementById('crypto-select').value;
    const val        = parseFloat(document.getElementById('input-main').value) || 0;
    const resDisplay = document.getElementById('calc-res');
    const unitSuffix = document.getElementById('unit-suffix');

    if (currentMode === 'Envoyer') {
        unitSuffix.innerText  = "Ar";
        resDisplay.innerText  = (val / TAUX[cry]).toFixed(4) + " " + cry;
    } else {
        unitSuffix.innerText              = cry;
        resDisplay.innerText              = (val * TAUX[cry]).toLocaleString() + " Ar";
        document.getElementById('input-addr').value = ADDR_RECEPT[cry];
    }
}

async function executeTrans() {
    const valInput  = document.getElementById('input-main');
    const addrInput = document.getElementById('input-addr');
    const val       = parseFloat(valInput.value);
    const cry       = document.getElementById('crypto-select').value;

    if (!val || val <= 0) return alert("Veuillez entrer un montant valide !");
    if (currentMode === 'Envoyer' && !addrInput.value.trim()) return alert("Veuillez entrer l'adresse destinataire !");

    const finalAr = currentMode === 'Envoyer' ? val : (val * TAUX[cry]);

    if (currentMode === 'Envoyer') {
        if (userSolde < finalAr) return alert("Solde insuffisant !");
        userSolde -= finalAr;
        updateSoldeUI();
        await supabaseClient.from('users').update({ solde: userSolde }).eq('id', currentUserId);
    }

    try {
        await supabaseClient.from('transactions').insert([{
            user_id: currentUserId,
            montant: finalAr,
            service: currentMode + " " + cry,
            status:  "En attente",
            adresse: addrInput.value || "Non spécifié"
        }]);

        alert("Transaction enregistrée ! ✅");
        valInput.value  = "";
        addrInput.value = currentMode === 'Recevoir' ? ADDR_RECEPT[cry] : "";
        updateCalc();
        fetchData();
    } catch (err) {
        console.error(err);
        alert("Une erreur est survenue lors de l'enregistrement.");
    }
}

function copyAddress() {
    const addr = document.getElementById('input-addr').value;
    navigator.clipboard.writeText(addr).then(() => alert("Adresse copiée !"));
}

// ── MOBILE MONEY ──────────────────────────────────────────────────────────────

function openMobile(type) {
    currentMobileMode = type;
    document.getElementById('mob-title').innerText  = type + " MM";
    document.getElementById('mob-amount').value     = "";
    document.getElementById('mob-phone').value      = "";
    document.getElementById('modal-mobile').style.display = 'flex';
    if (document.getElementById('sidebar').classList.contains('active')) toggleMenu();
}

async function executeMobile() {
    const amount = parseFloat(document.getElementById('mob-amount').value);
    const phone  = document.getElementById('mob-phone').value.trim();

    if (!amount || amount <= 0) return alert("Montant invalide !");
    if (!phone)                 return alert("Numéro de compte requis !");
    if (currentMobileMode === 'Retrait' && userSolde < amount) return alert("Solde insuffisant !");

    try {
        userSolde += currentMobileMode === 'Dépôt' ? amount : -amount;
        updateSoldeUI();
        await supabaseClient.from('users').update({ solde: userSolde }).eq('id', currentUserId);

        await supabaseClient.from('transactions').insert([{
            user_id: currentUserId,
            montant: amount,
            service: currentMobileMode,
            status:  "En attente",
            adresse: phone
        }]);

        alert(currentMobileMode + " enregistré ! ✅");
        document.getElementById('modal-mobile').style.display = 'none';
        fetchData();
    } catch (err) {
        console.error(err);
        alert("Une erreur est survenue.");
    }
}

// ── HISTORIQUE ────────────────────────────────────────────────────────────────

function filterType(type, btn) {
    currentFilter = type;
    document.querySelectorAll('#type-filter .filter-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderFullHistory();
}

function renderMonthPicker() {
    const container = document.getElementById('month-filter-container');
    if (!container) return;
    container.innerHTML = `<div class="filter-chip ${selectedMonth === null ? 'active' : ''}" onclick="filterMonth(null, this)">Tous</div>`;
    const unique = [...new Set(allTransactions.map(t => new Date(t.created_at).getMonth()))].sort((a, b) => b - a);
    unique.forEach(m => {
        container.innerHTML += `<div class="filter-chip" onclick="filterMonth(${m}, this)">${MONTHS[m]}</div>`;
    });
}

function filterMonth(m, btn) {
    selectedMonth = m;
    document.querySelectorAll('#month-filter-container .filter-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderFullHistory();
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR') + " à " + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function renderPreview() {
    const b = document.getElementById('history-preview-body');
    if (!b) return;
    b.innerHTML = "";
    if (allTransactions.length === 0) {
        b.innerHTML = `<tr><td colspan="2" style="text-align:center; color:var(--gray); padding:20px;">Aucune transaction</td></tr>`;
        return;
    }
    allTransactions.slice(0, 4).forEach(t => {
        b.innerHTML += `
            <tr>
                <td><b>${t.service}</b><br><small style="color:var(--gray);">${formatDate(t.created_at)}</small></td>
                <td style="text-align:right;"><b>${t.montant.toLocaleString()} Ar</b></td>
            </tr>`;
    });
}

function renderFullHistory() {
    const b = document.getElementById('history-full-body');
    if (!b) return;
    b.innerHTML = "";

    let filtered = allTransactions;
    if (currentFilter !== 'Tous') filtered = filtered.filter(t => t.service.includes(currentFilter));
    if (selectedMonth !== null)   filtered = filtered.filter(t => new Date(t.created_at).getMonth() === selectedMonth);

    if (filtered.length === 0) {
        b.innerHTML = `<tr><td colspan="2" style="text-align:center; color:var(--gray); padding:20px;">Aucune transaction</td></tr>`;
        return;
    }
    filtered.forEach(t => {
        const color = t.status === 'confirmé' ? 'var(--green)' : 'var(--yellow)';
        b.innerHTML += `
            <tr>
                <td><b>${t.service}</b><br><small style="color:var(--gray);">${formatDate(t.created_at)}</small></td>
                <td style="text-align:right;">
                    <b>${t.montant.toLocaleString()} Ar</b><br>
                    <span style="color:${color}; font-size:10px; font-weight:700;">${t.status || 'En attente'}</span>
                </td>
            </tr>`;
    });
}

// ── PROFIL ────────────────────────────────────────────────────────────────────

function openEditProfile() {
    const img    = document.getElementById('header-pp').src;
    const name   = document.getElementById('side-name').innerText;
    const email  = document.getElementById('side-email').innerText;
    const phone  = document.getElementById('side-phone').innerText;
    const idUser = document.getElementById('side-id').innerText;

    document.getElementById('modal-pp-view').src          = img;
    document.getElementById('modal-name-view').innerText  = name;
    document.getElementById('modal-id-view').innerText    = idUser;
    document.getElementById('edit-name').value  = name  !== "Mpanjifa"           ? name  : "";
    document.getElementById('edit-email').value = email !== "email@example.com"  ? email : "";
    document.getElementById('edit-phone').value = phone !== "Tsy misy laharana"  ? phone : "";

    document.getElementById('modal-profile').style.display = 'flex';
    if (document.getElementById('sidebar').classList.contains('active')) toggleMenu();
}

function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => { document.getElementById('modal-pp-view').src = e.target.result; };
        reader.readAsDataURL(input.files[0]);
    }
}

async function updateProfile() {
    const btn      = document.getElementById('btn-update-profile');
    const newName  = document.getElementById('edit-name').value.trim();
    const newPhone = document.getElementById('edit-phone').value.trim();
    const fileInput = document.getElementById('edit-avatar-file');

    btn.innerText = "Andraso kely...";
    btn.disabled  = true;

    try {
        let avatarUrl = document.getElementById('modal-pp-view').src;

        if (fileInput.files && fileInput.files[0]) {
            const file     = fileInput.files[0];
            const fileExt  = file.name.split('.').pop();
            const fileName = `${currentUserId}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabaseClient.storage
                .from('profiles')
                .upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data: publicData } = supabaseClient.storage
                .from('profiles')
                .getPublicUrl(filePath);
            avatarUrl = publicData.publicUrl;
        }

        const { error } = await supabaseClient
            .from('users')
            .update({ full_name: newName, phone: newPhone, avatar_url: avatarUrl })
            .eq('id', currentUserId);
        if (error) throw error;

        alert("Voatahiry ny fanovana! ✅");
        document.getElementById('modal-profile').style.display = 'none';
        fetchData();
    } catch (err) {
        console.error(err);
        alert("Nisy olana: " + err.message);
    } finally {
        btn.innerText = "Tehirizina";
        btn.disabled  = false;
    }
}

// ── DÉMARRAGE ─────────────────────────────────────────────────────────────────
initApp();
