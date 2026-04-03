const supabaseClient = supabase.createClient("URL_NAO", "KEY_NAO");
let currentUserId = null;

// Manokatra ny mombamomba ny mpampiasa
function openEditProfile() {
    // Maka data avy amin'ny UI
    const name = document.getElementById('side-name').innerText;
    const phone = document.getElementById('side-phone').innerText;
    
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-phone').value = phone;
    document.getElementById('modal-profile').style.display = 'flex';
}

// Preview sary
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => document.getElementById('modal-pp-view').src = e.target.result;
        reader.readAsDataURL(input.files[0]);
    }
}

// Update Profil any amin'ny Supabase
async function updateProfile() {
    const btn = document.getElementById('btn-update-profile');
    const name = document.getElementById('edit-name').value;
    const fileInput = document.getElementById('edit-avatar-file');
    
    btn.disabled = true;
    btn.innerText = "Andraso...";

    try {
        let url = document.getElementById('modal-pp-view').src;

        if (fileInput.files[0]) {
            const file = fileInput.files[0];
            const path = `avatars/${currentUserId}-${Date.now()}`;
            await supabaseClient.storage.from('profiles').upload(path, file);
            const { data } = supabaseClient.storage.from('profiles').getPublicUrl(path);
            url = data.publicUrl;
        }

        await supabaseClient.from('users').update({ 
            full_name: name, 
            avatar_url: url 
        }).eq('id', currentUserId);

        alert("Vita! ✅");
        location.reload();
    } catch (e) {
        alert("Error: " + e.message);
    } finally {
        btn.disabled = false;
    }
}
