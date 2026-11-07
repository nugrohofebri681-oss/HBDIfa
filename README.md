# A Little Place in Time — Birthday OS for Ifa

**Version:** 3.0 — Elegant & Nostalgic  
**Birthday:** 17 November 2026

## Buka di HP / laptop

1. Ekstrak file ZIP ini.
2. Buka `index.html` di Chrome / Edge / Firefox. HTML dan seluruh fitur selain gambar film tersimpan dalam satu file tersebut.
3. Pada kunjungan pertama, ikuti atau lewati pembuka. Klik **Baca suratnya** atau pilih satu dari enam kartu Memory Desk.
4. Website dapat dibuka **offline**, tetapi gambar asli film di bagian Cinema **butuh internet**. Tanpa internet, masih tampil placeholder dan catatan film.

## Apa yang sudah bisa dicoba?

- Opening berisi amplop, birthday reveal, make-a-wish, dan masuk ke Memory Desk. Bisa dilewati dan diulang.
- **Birthday Letter:** surat lima halaman (gaya tulisan yang sudah disetujui); navigasi bab, swipe, salin surat, cetak / simpan PDF melalui fitur Print browser.
- **Our Little Cinema:** tiket dua sisi (14 & 17) yang bisa dibalik, pilihan dua film, dan tiga still dari film asli untuk setiap film (ditampilkan lewat URL sumber eksternal saat online), dengan navigasi frame dan catatan personal. **Tidak berisi video/klip film.**
- **Little Chapters:** tiga catatan pendek tentang buku dan kehidupan.
- **Open When:** enam surat situasional.
- **Keepsake Box:** tutup animasi, enam benda yang bisa diketuk, koleksi tercatat lokal, dan postcard tambahan setelah semua ditemukan.
- **One Last Wish:** doa penutup dan simpan kartu PNG.

## Pengaturan dan aksesibilitas

- Tidak ada akun, pelacak yang dipasang proyek, backend, atau font CDN. **Gambar Cinema mengambil dari situs eksternal dan dapat memunculkan permintaan ke layanan tersebut**; gambar dan metadata pengunjung dapat diproses oleh penyedia sumber.
- Suara tombol dapat diaktifkan manual; mati secara default.
- Browser menyimpan riwayat pembuka, koleksi yang dibuka, dan enam benda yang ditemukan di penyimpanan lokal (jika diizinkan browser).
- Ada tombol navigasi, swipe surat, keyboard Esc untuk menutup, dan dukungan Reduce Motion.

## Jika ingin mengunggah ke GitHub

1. Buat repo baru terpisah (misalnya `ifas-birthday-os`).
2. Upload `index.html` ke **root** repo, bukan ZIP saja.
3. Jika kontennya aman untuk dipublikasikan, aktifkan GitHub Pages di **Settings → Pages → Deploy from a branch → main / (root)**.

**Perhatian:** isi website ini personal. GitHub Pages yang dipublikasikan dari repo publik dapat diakses orang lain. Jangan publikasikan surat dan kenangan tanpa mempertimbangkan privasi pihak terkait. Jika ingin akses terbatas, perlu metode hosting dengan autentikasi sungguhan, bukan sekadar kata sandi JavaScript.

## Catatan perubahan v1 → v2

- Tombol **Baca suratnya** langsung di halaman depan.
- Daftar isi surat dan animasi membalik kertas.
- Film reel dengan 3 frame per film, serta tiket yang bisa dibalik.
- Kotak kenangan benar-benar interaktif dengan animasi membuka tutup, enam objek, penanda koleksi, dan bonus postcard.
- Peningkatan layout mobile, fokus interaksi, dan ilustrasi CSS tanpa dependensi eksternal.
- Surat utama tetap mengikuti versi revisi, termasuk kalimat **“Kita masih temenan kan yaa, hehe..”**.

## Status

Ini versi **v2 preview yang berfungsi**, bukan versi peluncuran final. Tinjau ulang seluruh naskah sebelum hadiah dikirim. Belum diunggah ke GitHub atau dipublikasikan.

## Perubahan v2 → v3 — Original Film Stills

- Ketiga frame masing-masing film kini menampilkan **gambar cuplikan asli film** (bukan ilustrasi generik).
- Miniatur pilihan film juga menampilkan gambar adegan film.
- Ada link *Sumber foto* untuk tiap gambar, kredit sumber, serta tampilan cadangan jika gambar gagal dimuat/offline.
- Coba memuat satu sumber cadangan jika gambar utama diblokir sumbernya.
- Tetap mempertahankan tiket dua sisi, semua naskah surat, dan fitur lain dari v2.

### Catatan hak cipta dan penggunaan

Cuplikan film adalah materi berhak cipta oleh pemegang hak masing-masing, termasuk produser/distributor film. Mencantumkan sumber tidak berarti mendapatkan izin publikasi ulang. **Untuk hadiah privat**, gunakan secara terbatas; **sebelum publikasi terbuka di GitHub Pages**, periksa izin penggunaan gambar atau ganti dengan aset yang memiliki lisensi yang sesuai.

Gambar digunakan via tautan eksternal yang tersedia saat proses pembuatan, **bukan disertakan dalam ZIP**. Bila menginginkan versi sepenuhnya offline, perlu aset gambar milik pengguna atau aset yang boleh disertakan dalam paket.

**Sumber yang dirujuk:** Listal, Infobae, Film.ru, Looper, Comic Natalie, Plex (dengan fallback masing-masing).
