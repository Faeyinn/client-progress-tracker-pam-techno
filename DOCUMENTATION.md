# Dokumentasi Teknis Sistem Client Progress Tracker

## Gambaran Umum Sistem (System Overview)
Platform ini adalah sistem berbasis web yang dirancang untuk memantau progres proyek klien secara real-time. Sistem ini membantu tim PAM Techno mengelola proyek dan memberikan akses tracking yang transparan kepada klien melalui "Magic Link" berbasis token dan notifikasi WhatsApp. Nilai bisnis utamanya adalah meningkatkan kepercayaan klien melalui transparansi dan efisiensi komunikasi progres proyek.

## User Stories

### Admin (Tim PAM Techno)
1. Sebagai **Admin**, saya ingin **login ke dashboard** agar **dapat mengelola sistem dengan aman**.
2. Sebagai **Admin**, saya ingin **membuat proyek baru** agar **klien terdaftar dalam sistem**.
3. Sebagai **Admin**, saya ingin **mengupdate status dan log progres proyek** agar **klien mengetahui perkembangan terbaru**.
4. Sebagai **Admin**, saya ingin **menerima notifikasi feedback klien** agar **dapat merespons permintaan klien dengan cepat**.
5. Sebagai **Admin**, saya ingin **mengelola data proyek (Edit/Delete)** agar **informasi tetap akurat**.

### Klien
1. Sebagai **Klien**, saya ingin **menerima notifikasi WhatsApp** saat proyek dimulai atau diupdate agar **saya selalu terinformasi**.
2. Sebagai **Klien**, saya ingin **mengakses timeline progres melalui link** agar **dapat memantau tanpa perlu login**.
3. Sebagai **Klien**, saya ingin **mengirimkan feedback** agar **tim pengembang mengetahui masukan saya**.
4. Sebagai **Klien**, saya ingin **meminta link tracker kembali jika hilang** agar **tetap bisa memantau proyek**.

## Fase 1: Perencanaan (Planning)

### 1.1 Tujuan Website
1.  **Transparansi Real-time**: Menyediakan informasi progres proyek yang akurat dan terkini bagi klien.
2.  **Efisiensi Komunikasi**: Mengurangi kebutuhan update manual berulang melalui chat dengan notifikasi otomatis.
3.  **Sentralisasi Data**: Mengelola seluruh data proyek dan feedback dalam satu platform terintegrasi.
4.  **Kemudahan Akses**: Memungkinkan klien memantau proyek tanpa proses registrasi atau login yang rumit (Magic Link).

### 1.2 Fitur Utama
*   **Admin Dashboard**: Manajemen proyek (CRUD) dan visualisasi status keseluruhan.
*   **Timeline Progres (Project Logs)**: Pencatatan detail tahapan pengerjaan dengan persentase penyelesaian.
*   **Magic Link Tracking**: Akses publik aman menggunakan token unik untuk setiap proyek.
*   **Notifikasi WhatsApp Otomatis** (via Fonnte): Pengiriman pesan otomatis untuk update progres, pendaftaran awal, dan recovery link.
*   **Sistem Feedback**: Formulir bagi klien untuk mengirim masukan langsung dari halaman tracking.
*   **Token Recovery**: Fitur pemulihan akses link tracking menggunakan nomor WhatsApp terdaftar.

### 1.3 Tech Stack
*   **Frontend**: Next.js (App Router), React, Tailwind CSS, shadcn/ui.
    *   *Alasan*: Performa tinggi dengan SSR/RSC, pengembangan cepat dengan komponen UI modern.
*   **Backend**: Next.js API Routes.
    *   *Alasan*: Arsitektur menyatu dengan frontend (fullstack), memudahkan maintenance.
*   **Database**: PostgreSQL.
    *   *Alasan*: Relasional, kuat, dan skalabel untuk data terstruktur.
*   **ORM**: Prisma.
    *   *Alasan*: Type-safety yang baik dengan TypeScript dan kemudahan migrasi database.
*   **Deployment**: Vercel (Support Next.js native).
*   **Third-party Service**: Fonnte (WhatsApp Gateway API).

## Fase 2: Desain Sistem (System Design)

### 2.1 User Flow Diagram
**Skenario: Update Progres Proyek**
1.  **Admin** login ke dashboard dan memilih proyek yang aktif.
2.  **Admin** mengisi form "Log Progres" (Judul, Deskripsi, Persentase).
3.  **Sistem** menyimpan data ke database.
4.  **Sistem** secara otomatis memanggil API Fonnte untuk mengirim pesan WhatsApp ke nomor Klien.
5.  **Klien** menerima notifikasi WhatsApp berisi link tracking.
6.  **Klien** mengklik link dan diarahkan ke halaman timeline progres terbaru.

**Skenario: Token Recovery (Lupa Link)**
1.  **Klien** membuka halaman utama website.
2.  **Klien** memilih menu "Lupa Token / Link Hilang".
3.  **Klien** memasukkan nomor WhatsApp.
4.  **Sistem** memvalidasi nomor dengan database.
5.  **Sistem** mengirimkan Magic Link kembali ke WhatsApp Klien jika nomor valid.

### 2.2 Entity-Relationship Diagram (ERD)

**Tabel: User (Admin)**
*   `id` (PK): String (CUID)
*   `username`: String (Unique)
*   `password`: String
*   `createdAt`, `updatedAt`

**Tabel: Project**
*   `id` (PK): String (CUID)
*   `clientName`: String
*   `clientPhone`: String
*   `projectName`: String
*   `uniqueToken`: String (Unique, Indexed)
*   `deadline`: DateTime
*   `status`: String (Default: "On Progress")
*   `createdAt`, `updatedAt`
*   *Relasi*: One-to-Many ke `ProjectLog`, One-to-Many ke `ClientFeedback`

**Tabel: ProjectLog**
*   `id` (PK): String (CUID)
*   `projectId` (FK): String
*   `title`: String
*   `description`: String
*   `percentage`: Int
*   `createdAt`

**Tabel: ClientFeedback**
*   `id` (PK): String (CUID)
*   `projectId` (FK): String
*   `message`: String
*   `createdAt`

### 2.3 API Design (Backend)

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| **Auth** | | |
| POST | `/api/auth/login` | Otentikasi admin (Session Cookie) |
| POST | `/api/auth/logout` | Mengakhiri sesi admin |
| **Projects** | | |
| GET | `/api/projects` | Mengambil daftar semua proyek |
| POST | `/api/projects` | Membuat proyek baru & Generate Token |
| GET | `/api/projects/[id]` | Detail proyek spesifik |
| PUT | `/api/projects/[id]` | Update data proyek |
| DELETE | `/api/projects/[id]` | Hapus proyek |
| **Logs & Feedback** | | |
| GET | `/api/projects/[id]/logs` | Mengambil history progres |
| POST | `/api/projects/[id]/logs` | Menambah log baru & Trigger WA |
| GET | `/api/projects/[id]/feedbacks` | Mengambil feedback klien |
| **Public Tracking** | | |
| GET | `/api/track/[token]` | Validasi & Get Data Proyek via Token |
| POST | `/api/track/recovery` | Kirim ulang token via WA |
| POST | `/api/track/[token]/feedback` | Submit feedback dari klien |
