/**
 * SISTEM ABSENSI SEKOLAH - LOGIN SCRIPT
 * Dibuat untuk kemudahan maintenance.
 */

// Simulasi Database Pengguna (Di dunia nyata, ini datang dari server)
const userDatabase = {
    "123456": {
        password: "password123",
        name: "Ahmad Subarjo, S.Pd.",
        photo: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    "654321": {
        password: "password456",
        name: "Zulaikha, M.Kom.",
        photo: "https://randomuser.me/api/portraits/women/32.jpg"
    }
};

/**
 * Fungsi untuk mengupdate jam dan tanggal secara real-time.
 */
function updateLiveClock() {
    const timeEl = document.getElementById('live-time');
    const dateEl = document.getElementById('live-date');
    if (!timeEl || !dateEl) return;

    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    timeEl.textContent = now.toLocaleTimeString('id-ID', timeOptions).replace(/\./g, ':');
    dateEl.textContent = now.toLocaleDateString('id-ID', dateOptions);
}

/**
 * Fungsi untuk menangani proses login.
 * @param {Event} event - Event dari form submission.
 */
function handleLogin(event) {
    event.preventDefault(); // Mencegah reload halaman
    const nipInput = document.getElementById('nip');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    const nip = nipInput.value;
    const password = passwordInput.value;
    const user = userDatabase[nip];

    errorMessage.textContent = ''; // Reset pesan error

    if (user && user.password === password) {
        // Login berhasil
        // sessionStorage digunakan agar login hilang saat browser ditutup
        sessionStorage.setItem('loggedInNIP', nip);
        window.location.href = 'dashboard.html';
    } else {
        // Login gagal
        errorMessage.textContent = 'NIP atau Password yang Anda masukkan salah.';
        nipInput.focus();
    }
}

// Inisialisasi saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Jalankan jam
    updateLiveClock();
    setInterval(updateLiveClock, 1000);

    // Tambahkan event listener ke form login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});
