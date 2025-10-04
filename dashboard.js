/**
 * SISTEM ABSENSI SEKOLAH - DASHBOARD SCRIPT
 * Mengelola semua fungsionalitas di halaman dashboard.
 */

// Database Pengguna (Harus konsisten dengan login.js)
const userDatabase = {
    "123456": {
        name: "Ahmad Subarjo, S.Pd.",
        photo: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    "654321": {
        name: "Zulaikha, M.Kom.",
        photo: "https://randomuser.me/api/portraits/women/32.jpg"
    }
};

// Variabel Global
let loggedInNIP = null;

// --- FUNGSI UTAMA ---

/**
 * Menginisialisasi dashboard.
 */
function initializeDashboard() {
    loggedInNIP = sessionStorage.getItem('loggedInNIP');
    if (!loggedInNIP) {
        window.location.href = 'index.html';
        return;
    }

    setupEventListeners();
    populateUserData();
    startLiveClock();
    updateAttendanceUI();
    loadAttendanceHistory();
}

/**
 * Mengatur semua event listener untuk tombol.
 */
function setupEventListeners() {
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('clockInBtn').addEventListener('click', handleClockIn);
    document.getElementById('clockOutBtn').addEventListener('click', handleClockOut);
}

// --- FUNGSI DATA PENGGUNA & WAKTU ---

/**
 * Mengisi data pengguna ke dalam UI.
 */
function populateUserData() {
    const userData = userDatabase[loggedInNIP];
    if (userData) {
        document.getElementById('userName').textContent = userData.name;
        document.getElementById('userNIP').textContent = loggedInNIP;
        document.getElementById('userPhoto').src = userData.photo;
    }
}

/**
 * Menjalankan jam digital.
 */
function startLiveClock() {
    const timeEl = document.getElementById('live-time');
    const dateEl = document.getElementById('live-date');
    if (!timeEl || !dateEl) return;

    const update = () => {
        const now = new Date();
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        
        timeEl.textContent = now.toLocaleTimeString('id-ID', timeOptions).replace(/\./g, ':');
        dateEl.textContent = now.toLocaleDateString('id-ID', dateOptions);
    };
    update();
    setInterval(update, 1000);
}

// --- FUNGSI LOGIKA ABSENSI ---

/**
 * Menangani klik tombol Absen Masuk.
 */
function handleClockIn() {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const attendanceData = getAttendanceData();
    
    if (attendanceData.some(record => record.date === todayStr)) {
        alert('Anda sudah melakukan absen masuk hari ini.');
        return;
    }
    
    attendanceData.push({
        date: todayStr,
        clockIn: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        clockOut: null,
        status: 'Hadir'
    });
    
    saveAttendanceData(attendanceData);
    updateAttendanceUI();
    loadAttendanceHistory();
}

/**
 * Menangani klik tombol Absen Pulang.
 */
function handleClockOut() {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const attendanceData = getAttendanceData();
    const todayRecord = attendanceData.find(record => record.date === todayStr);

    if (!todayRecord) {
        alert('Anda harus absen masuk terlebih dahulu.');
        return;
    }
    
    if (todayRecord.clockOut) {
        alert('Anda sudah melakukan absen pulang hari ini.');
        return;
    }

    todayRecord.clockOut = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    saveAttendanceData(attendanceData);
    updateAttendanceUI();
    loadAttendanceHistory();
}

/**
 * Mengupdate UI (tombol dan status) berdasarkan data absensi.
 */
function updateAttendanceUI() {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRecord = getAttendanceData().find(record => record.date === todayStr);

    const statusEl = document.getElementById('attendanceStatus');
    const clockInBtn = document.getElementById('clockInBtn');
    const clockOutBtn = document.getElementById('clockOutBtn');

    if (!todayRecord) { // Belum absen
        statusEl.textContent = 'Belum Absen';
        statusEl.className = 'status-badge status-neutral';
        clockInBtn.disabled = false;
        clockOutBtn.disabled = true;
    } else if (!todayRecord.clockOut) { // Sudah absen masuk
        statusEl.textContent = `Masuk: ${todayRecord.clockIn}`;
        statusEl.className = 'status-badge status-present';
        clockInBtn.disabled = true;
        clockOutBtn.disabled = false;
    } else { // Sudah absen pulang
        statusEl.textContent = 'Absensi Selesai';
        statusEl.className = 'status-badge status-done';
        clockInBtn.disabled = true;
        clockOutBtn.disabled = true;
    }
}

/**
 * Memuat riwayat absensi ke dalam tabel.
 */
function loadAttendanceHistory() {
    const attendanceData = getAttendanceData();
    const tableBody = document.getElementById('historyTableBody');
    tableBody.innerHTML = '';

    if (attendanceData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Belum ada riwayat absensi.</td></tr>';
        return;
    }

    attendanceData.slice().reverse().forEach(record => {
        const row = document.createElement('tr');
        const dateOptions = { day: '2-digit', month: 'long', year: 'numeric' };
        row.innerHTML = `
            <td>${new Date(record.date).toLocaleDateString('id-ID', dateOptions)}</td>
            <td>${record.clockIn || '-'}</td>
            <td>${record.clockOut || '-'}</td>
            <td><span class="status-tag">${record.status}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

// --- FUNGSI HELPER & LOGOUT ---

/**
 * Mengambil data absensi dari localStorage.
 * @returns {Array} - Array data absensi.
 */
function getAttendanceData() {
    const data = localStorage.getItem(`attendance_${loggedInNIP}`);
    return data ? JSON.parse(data) : [];
}

/**
 * Menyimpan data absensi ke localStorage.
 * @param {Array} data - Array data absensi untuk disimpan.
 */
function saveAttendanceData(data) {
    localStorage.setItem(`attendance_${loggedInNIP}`, JSON.stringify(data));
}

/**
 * Menangani proses logout.
 */
function handleLogout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        sessionStorage.removeItem('loggedInNIP');
        window.location.href = 'index.html';
    }
}

// --- INISIALISASI APLIKASI ---
document.addEventListener('DOMContentLoaded', initializeDashboard);
