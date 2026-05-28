# Sistem Stok Gudang Buku

Aplikasi web sederhana untuk mengelola stok buku. Versi live memakai Supabase REST API, sehingga bisa berjalan di Vercel tanpa XAMPP.

## Cara Menjalankan

Jalankan server static dari folder proyek:

```bash
python -m http.server 8011
```

Buka `http://127.0.0.1:8011`.

Database cloud dibuat lewat SQL di repository portfolio utama: `supabase/schema.sql`.

## Fitur

- Tambah data buku
- Edit stok masuk dan stok keluar
- Pencarian berdasarkan judul, kategori, atau rak
- Ringkasan total judul, total stok, stok rendah, dan kategori
