# Sistem Stok Gudang Buku

Aplikasi web sederhana untuk mengelola stok buku dengan PHP dan MySQL XAMPP.

## Cara Menjalankan

1. Import database:

```bash
C:\xampp\mysql\bin\mysql.exe -u root < database/schema.sql
```

2. Jalankan PHP server dari folder proyek:

```bash
php -S 127.0.0.1:8011
```

3. Buka `http://127.0.0.1:8011`.

## Fitur

- Tambah data buku
- Edit stok masuk dan stok keluar
- Pencarian berdasarkan judul, kategori, atau rak
- Ringkasan total judul, total stok, stok rendah, dan kategori
