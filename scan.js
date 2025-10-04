/**
 * SISTEM ABSENSI SEKOLAH - FACE SCAN SCRIPT
 * Simulasi login menggunakan kamera.
 */

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('webcam');
    const scanButton = document.getElementById('scanButton');
    const scanStatus = document.getElementById('scanStatus');
    const webcamFeedback = document.getElementById('webcam-feedback');

    /**
     * Memulai stream kamera.
     */
    async function startWebcam() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            scanStatus.textContent = "Kamera siap. Arahkan wajah Anda dan klik tombol.";
        } catch (err) {
            scanStatus.textContent = "Error: Gagal mengakses kamera. Mohon izinkan akses pada browser Anda.";
            scanButton.disabled = true;
        }
    }

    /**
     * Menangani proses scan (simulasi).
     */
    function handleScan() {
        scanStatus.textContent = "Menganalisis...";
        scanButton.disabled = true;
        webcamFeedback.classList.add('scanned');

        // Simulasi proses verifikasi selama 2.5 detik
        setTimeout(() => {
            // Dalam simulasi ini, kita anggap scan berhasil dan me-login-kan NIP 654321
            const scannedNIP = "654321";
            
            sessionStorage.setItem('loggedInNIP', scannedNIP);
            window.location.href = 'dashboard.html';

        }, 2500);
    }

    scanButton.addEventListener('click', handleScan);
    startWebcam();
});
