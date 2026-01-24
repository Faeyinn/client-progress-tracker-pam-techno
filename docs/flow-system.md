### 1. Alur Kerja Sistem (System Flow)

Dibagi menjadi tiga sisi: **Sisi Admin (PAM Techno)**, **Sisi Klien**, dan **Halaman Publik**.

---

#### **A. Flow Pembuatan Proyek (Oleh Admin)**

1. **Login:** Admin masuk ke dashboard (username/password).
2. **Input Data:** Admin membuat proyek baru dengan mengisi:
   - Nama Klien
   - Nomor WhatsApp Klien (Wajib diawali 62)
   - Nama Proyek (misal: "Web Company Profile")
   - Deadline

3. **Generate Token:** Saat tombol "Simpan" ditekan:
   - Sistem membuat data di database
   - Sistem otomatis men-generate **Unique Token** (kode acak unik, misal: `trx-8823-pam`)
   - Sistem membuat **Magic Link** (misal: `pamtechno.id/track/trx-8823-pam`)

4. **Auto-Notification:** Sistem otomatis mengirim WA ke klien:
   > _"Halo, proyek Anda telah terdaftar. Pantau progresnya di sini: [Link]"_

---

#### **B. Flow Update Proyek (Oleh Admin)**

1. **Pilih Proyek:** Admin memilih proyek dari list yang sedang berjalan.
2. **Update Status:** Admin menekan tombol "Tambah Log/Progres".
   - Input: Judul Tahapan (misal: "UI Design Selesai"), Deskripsi, dan Persentase (0-100%)

3. **Trigger WA:** Saat Admin klik "Update":
   - Database terupdate
   - Sistem memanggil API WhatsApp → Mengirim pesan notifikasi ke HP Klien secara _real-time_

---

#### **C. Flow Pengecekan via Magic Link (Oleh Klien)**

1. **Klik Link:** Klien menerima WA → Klik Magic Link.
2. **Validasi:** Sistem mengecek Token di URL.
   - Jika Token benar → Tampilkan halaman Timeline
   - Jika Token salah → Tampilkan "Data tidak ditemukan"

3. **Viewing:** Klien melihat timeline vertikal progres pengerjaan (tanpa perlu login).

---

#### **D. Flow Halaman Utama - Dual Mode (Oleh Klien)**

**Halaman:** `/` (Landing Page)

**Mode 1: Input Token Manual**

1. Klien membuka halaman utama (`/`)
2. Melihat form: **"Sudah punya token? Masukkan di sini untuk lacak."**
3. Klien memasukkan token (misal: `trx-8823-pam`)
4. Sistem validasi:
   - Jika token valid → Redirect ke `/track/[token]`
   - Jika token tidak valid → Tampilkan error "Token tidak ditemukan"

**Mode 2: Lupa Token / Link Hilang**

1. Klien klik link/tombol: **"Lupa Token / Link Hilang?"**
2. Muncul form input: **"Masukkan Nomor WhatsApp Anda"**
3. Klien mengetik nomor (misal: `08123456789` atau `628123456789`)
4. Sistem normalisasi nomor ke format `62xxx`
5. Sistem mengecek database:
   - **Jika nomor terdaftar:**
     - Sistem trigger API WhatsApp
     - Kirim pesan: _"Halo, ini link tracker proyek Anda yang diminta: [Link]"_
     - Tampilkan notifikasi di web: _"Link telah dikirim ke WhatsApp Anda. Silakan cek HP."_
   - **Jika nomor tidak terdaftar:**
     - Tampilkan pesan: _"Nomor tidak terdaftar dalam sistem kami."_

---

#### **E. Flow Feedback/Request dari Klien**

1. **Akses Halaman:** Klien membuka halaman timeline (`/track/[token]`)
2. **Scroll ke Section Feedback:** Di bawah timeline progress, ada section "Punya Feedback atau Request?"
3. **Input Feedback:** Klien menulis pesan di textarea (misal: "Mohon revisi warna logo menjadi biru")
4. **Submit:** Klien klik tombol "Kirim Feedback"
5. **Proses Backend:**
   - Sistem menyimpan feedback ke database
   - Sistem trigger API WhatsApp → Kirim notifikasi ke **Admin PAM Techno**
   - Pesan berisi: Nama Klien, Nama Proyek, dan Isi Feedback
6. **Konfirmasi:** Tampilkan notifikasi: _"Feedback Anda telah dikirim ke tim kami. Kami akan segera menghubungi Anda."_
7. **Follow Up:** Admin menerima WA → Follow up langsung ke nomor klien

---

#### **F. Flow Update Nomor WhatsApp Klien**

**Skenario:** Klien mengganti nomor WhatsApp dan tidak bisa recovery token.

**Solusi: Via Admin (Recommended)**

1. **Klien Kontak Admin:** Klien hubungi admin PAM Techno via WhatsApp/telepon untuk update nomor
2. **Admin Login:** Admin masuk ke dashboard
3. **Edit Proyek:** Admin buka `/admin/projects/[id]/edit`
4. **Update Nomor:** Admin update field "Nomor WhatsApp Klien" dengan nomor baru
5. **Konfirmasi:** Sistem tampilkan warning:
   - _"Nomor WhatsApp akan diubah. Nomor lama tidak akan bisa recovery token lagi."_
   - _"Kirim notifikasi ke nomor baru?"_ (Checkbox, default checked)
6. **Submit:** Admin klik "Simpan Perubahan"
7. **Proses Backend:**
   - Update nomor di database
   - Jika checkbox dicentang → Trigger API WhatsApp ke **nomor baru**
   - Kirim pesan: _"Halo, nomor WhatsApp Anda telah diperbarui di sistem kami. Ini link tracker proyek Anda: [Link]"_
8. **Konfirmasi:** Admin mendapat notifikasi sukses

**Catatan Keamanan:**

- Hanya admin yang bisa update nomor (mencegah abuse)
- Nomor lama otomatis tidak bisa digunakan untuk recovery
- Magic link tetap valid (token tidak berubah)

---

### 2. Kebutuhan Sistem (Requirement)

#### **A. Kebutuhan Fungsional (Fitur Wajib)**

1. **Modul Autentikasi Admin:** Login sederhana (hardcode user di database juga tidak apa-apa untuk menghemat waktu, karena yang memakai hanya internal).
2. **Modul Manajemen Proyek (CRUD):** Tambah, Edit, Hapus data proyek.
3. **Modul Log Progres:** Fitur untuk menambah history pengerjaan pada proyek tertentu.
4. **Modul Public View:** Halaman khusus yang hanya bisa diakses via Token/Link untuk menampilkan data.
5. **Modul Public Landing Page:** Halaman utama (`/`) dengan dual mode:
   - Input token manual untuk tracking
   - Recovery token via WhatsApp (lupa token)
6. **Modul Token Recovery:** Sistem untuk mengirim ulang magic link ke klien berdasarkan nomor WhatsApp.
7. **Modul Feedback Klien:** Fitur untuk klien mengirim feedback/request perubahan ke admin via WhatsApp.
8. **Modul Update Nomor WhatsApp:** Fitur untuk admin mengupdate nomor WhatsApp klien dengan notifikasi otomatis.
9. **Integrasi WhatsApp:** Fungsi otomatis yang mengirim pesan saat ada _event_ tertentu:
   - Create Project (Notifikasi proyek baru)
   - Update Progress (Notifikasi update)
   - Token Recovery (Kirim ulang link)
   - Client Feedback (Notifikasi ke admin)
   - Phone Number Update (Notifikasi ke nomor baru)

#### **B. Kebutuhan Non-Fungsional**

1. **Responsif (Mobile-First):** Halaman klien WAJIB bagus dibuka di HP, karena mereka klik link dari WhatsApp.
2. **Kecepatan:** Halaman public view harus ringan.
3. **Security:** Token harus cukup acak agar tidak bisa ditebak orang iseng (gunakan UUID atau random string kombinasi huruf angka).

---

### 3. Rancangan Database (Sederhana)

#### **Tabel 1: `users` (Untuk Admin)**

| Field      | Type        | Keterangan      |
| ---------- | ----------- | --------------- |
| `id`       | Primary Key | Auto increment  |
| `username` | String      | Username admin  |
| `password` | String      | Password (Hash) |

---

#### **Tabel 2: `projects` (Menyimpan data induk proyek)**

| Field          | Type        | Keterangan                                    |
| -------------- | ----------- | --------------------------------------------- |
| `id`           | Primary Key | Auto increment                                |
| `client_name`  | String      | Nama klien                                    |
| `client_phone` | String      | Format 628xxx (Wajib)                         |
| `project_name` | String      | Nama proyek                                   |
| `unique_token` | String      | Token unik untuk magic link (Unique, Indexed) |
| `deadline`     | Date        | Deadline proyek                               |
| `status`       | String      | Status: "On Progress", "Done"                 |
| `created_at`   | Timestamp   | Waktu pembuatan                               |
| `updated_at`   | Timestamp   | Waktu update terakhir                         |

---

#### **Tabel 3: `project_logs` (Menyimpan riwayat timeline)**

| Field         | Type        | Keterangan                           |
| ------------- | ----------- | ------------------------------------ |
| `id`          | Primary Key | Auto increment                       |
| `project_id`  | Foreign Key | Relasi ke tabel projects             |
| `title`       | String      | Judul tahapan (cth: "Mockup Design") |
| `description` | Text        | Deskripsi detail                     |
| `percentage`  | Integer     | Progress 0-100                       |
| `created_at`  | Timestamp   | Waktu log dibuat                     |

---

#### **Tabel 4: `client_feedbacks` (Menyimpan feedback klien)**

| Field        | Type        | Keterangan                      |
| ------------ | ----------- | ------------------------------- |
| `id`         | Primary Key | Auto increment                  |
| `project_id` | Foreign Key | Relasi ke tabel projects        |
| `message`    | Text        | Isi feedback/request dari klien |
| `created_at` | Timestamp   | Waktu feedback dikirim          |

---

### 4. Tech Stack (Alat Perang)

| Layer                | Technology                           |
| -------------------- | ------------------------------------ |
| **Framework**        | Next.js (App Router)                 |
| **Backend/API**      | Next.js API Routes (Node.js runtime) |
| **Database**         | PostgreSQL                           |
| **ORM**              | Prisma                               |
| **Frontend Admin**   | Next.js                              |
| **Frontend Client**  | Next.js (Public page)                |
| **Styling**          | Tailwind CSS                         |
| **WhatsApp Gateway** | **Fonnte**                           |
| **Authentication**   | NextAuth.js (opsional)               |
| **Deployment**       | Vercel                               |

---

### 5. Struktur Halaman (Page Structure)

#### **Sisi Admin**

```
/admin
├── /login                    → Login Admin
├── /dashboard                → Dashboard & List Proyek
└── /projects
    ├── /new                  → Tambah Proyek Baru
    └── /[id]                 → Detail Proyek & Log Timeline
        └── /edit             → Edit Proyek
```

#### **Sisi Klien (Public)**

```
/
├── /                         → Landing Page (Dual Mode: Input Token + Recovery)
└── /track
    └── /[token]              → Public View Timeline Proyek
```

---

### 6. API Endpoints (Rencana)

| Method | Endpoint                      | Deskripsi                          |
| ------ | ----------------------------- | ---------------------------------- |
| POST   | `/api/auth/login`             | Login admin                        |
| POST   | `/api/auth/logout`            | Logout admin                       |
| GET    | `/api/projects`               | Get semua proyek (admin)           |
| POST   | `/api/projects`               | Create proyek baru                 |
| GET    | `/api/projects/[id]`          | Get detail proyek by ID            |
| PUT    | `/api/projects/[id]`          | Update proyek                      |
| DELETE | `/api/projects/[id]`          | Delete proyek                      |
| POST   | `/api/projects/[id]/logs`     | Tambah log progress                |
| GET    | `/api/track/[token]`          | Get proyek by token (public)       |
| POST   | `/api/track/validate`         | Validasi token manual              |
| POST   | `/api/track/recovery`         | Recovery token via WhatsApp        |
| POST   | `/api/track/[token]/feedback` | Kirim feedback dari klien ke admin |
| POST   | `/api/whatsapp/send`          | Trigger kirim pesan WhatsApp       |
