# 📖 Undangan Pernikahan Digital - Konsep 3D Flip Book

Undangan digital interaktif berbasis **3D Flip Book** dengan efek membalik halaman seperti buku fisik nyata, dilengkapi musik pengiring, efek suara lembaran kertas, dan tata letak elegan bertema tradisional Jawa modern.

---

## ✨ Fitur Utama

1. **Cover Depan Eksklusif**:
   - Menggunakan ilustrasi mempelai adat Jawa dengan hiasan floral botani elegan.
   - Kartu nama mempelai dengan aksen emas (*gold foil*) dan kaligrafi mewah.
   - Kolom nama tamu personal (*Kepada Yth. Tamu Undangan*).
2. **Efek 3D Realistis (St.PageFlip)**:
   - Efek membalik halaman 3D interaktif (bisa digeser dengan mouse/sentuhan jari di HP).
   - Bayangan lipatan buku (*spine shadow*) di bagian tengah seperti buku cetak asli.
   - Efek suara gemerisik kertas (*Paper Rustle SFX*) menggunakan Web Audio API.
3. **Responsif (Desktop & Mobile)**:
   - **Layar Lebar / Desktop**: Tampilan 2 halaman berdampingan (*two-page spread*).
   - **Smartphone**: Otomatis menyesuaikan menjadi 1 halaman penuh yang nyaman dibaca dan di-swipe.
4. **Struktur Halaman Lengkap**:
   - **Halaman 1 (Cover)**: Sampul Depan Ilustrasi Pasangan Pengantin.
   - **Halaman 2**: Salam Pembuka & Ayat Suci (QS. Ar-Rum: 21).
   - **Halaman 3**: Profil Mempelai Pria & Wanita beserta keluarga besar.
   - **Halaman 4**: Rangkaian Acara (Akad Nikah, Resepsi, Live Countdown Timer, & Simpan ke Google Calendar).
   - **Halaman 5**: Peta & Lokasi Gedung dengan tombol langsung ke Google Maps & Dress Code.
   - **Halaman 6**: Kisah Perjalanan Cinta (*Our Love Story Timeline*).
   - **Halaman 7**: Tanda Kasih / Amplop Digital (BCA, Mandiri) dengan tombol Salin Rekening 1-Klik.
   - **Halaman 8**: Konfirmasi Kehadiran (RSVP) & Kirim Doa Restu (tersimpan otomatis).
   - **Halaman 9**: Pitutur Luhur Filosofi Pernikahan & Ucapan Terima Kasih.
   - **Halaman 10 (Back Cover)**: Sampul Belakang Monogram Emas & Tanda Tangan Mempelai.
5. **Personalisasi Nama Tamu Otomatis**:
   - Buka dengan parameter `?to=Nama+Tamu` (contoh: `index.html?to=Bapak+Budi+dan+Keluarga`).
   - Nama tamu otomatis muncul di Amplop Pembuka dan di Sampul Depan.
6. **Musik Pengiring (BGM)**:
   - Dilengkapi tombol pemutar musik mengambang (*floating vinyl disc*) di pojok kanan atas dan di bilah navigasi bawah.

---

## 🚀 Cara Menjalankan & Membuka

Cukup klik dua kali (double click) file **`index.html`** untuk membukanya di browser favorit Anda (Google Chrome, Microsoft Edge, Safari, Mozilla Firefox).

Atau buka melalui terminal:
```powershell
start "d:\Flip Book Invitation\index.html"
```

---

## ⚙️ Cara Mengubah Data & Teks

Semua data mempelai, tanggal acara, lokasi, hingga nomor rekening dapat diubah dengan mudah di file **`config.js`**:

- **Nama Mempelai**: Ubah bagian `brideAndGroom`
- **Tanggal & Waktu Acara**: Ubah bagian `events.akad` dan `events.resepsi`
- **Target Countdown**: Ubah `events.countdownTarget` (format: `YYYY-MM-DDTHH:mm:ss`)
- **Nomor Rekening**: Ubah bagian `gifts`
- **Lagu / Musik**: Ganti link `audio.customMusicUrl` atau letakkan file `music.mp3` di folder ini
