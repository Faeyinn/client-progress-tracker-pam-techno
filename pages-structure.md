# 📄 Struktur Halaman - Client Progress Tracker

Dokumen ini menjelaskan seluruh halaman yang dibutuhkan untuk sistem Client Progress Tracker PAM Techno.

---

## 🔐 **Sisi Admin (Private Pages)**

### 1. `/admin/login`

**Nama:** Login Admin  
**Akses:** Public (tapi redirect jika sudah login)  
**Fungsi:**

- Form login untuk admin PAM Techno
- Input: Username & Password
- Validasi autentikasi
- Redirect ke `/admin/dashboard` setelah berhasil login

**Komponen UI:**

- Form login (username, password)
- Button "Masuk"
- Error message untuk kredensial salah
- Logo PAM Techno

---

### 2. `/admin/dashboard`

**Nama:** Dashboard & List Proyek  
**Akses:** Protected (hanya admin yang sudah login)  
**Fungsi:**

- Menampilkan semua proyek dalam bentuk tabel/card
- Filter proyek berdasarkan status (On Progress / Done)
- Search proyek berdasarkan nama klien atau nama proyek
- Button "Tambah Proyek Baru" → redirect ke `/admin/projects/new`
- Klik pada proyek → redirect ke `/admin/projects/[id]`

**Komponen UI:**

- Header dengan nama admin & button logout
- Statistics cards (Total Proyek, On Progress, Done)
- Search bar & filter dropdown
- Tabel/Grid proyek dengan kolom:
  - Nama Klien
  - Nama Proyek
  - Deadline
  - Status
  - Progress (%)
  - Action buttons (View, Edit, Delete)
- Button "Tambah Proyek Baru"

**Data yang Ditampilkan:**

- List semua proyek dari database
- Persentase progress terbaru dari setiap proyek

---

### 3. `/admin/projects/new`

**Nama:** Tambah Proyek Baru  
**Akses:** Protected (hanya admin)  
**Fungsi:**

- Form untuk membuat proyek baru
- Generate unique token otomatis saat submit
- Trigger WhatsApp notification ke klien setelah proyek dibuat
- Redirect ke `/admin/projects/[id]` setelah berhasil

**Komponen UI:**

- Form dengan field:
  - Nama Klien (text input, required)
  - Nomor WhatsApp Klien (text input, required, validasi format 62xxx)
  - Nama Proyek (text input, required)
  - Deadline (date picker, required)
- Button "Simpan" & "Batal"
- Loading state saat proses submit
- Success notification setelah proyek dibuat

**Proses Backend:**

1. Validasi input
2. Generate unique token (misal: `trx-8823-pam`)
3. Simpan data ke database
4. Trigger API WhatsApp untuk kirim notifikasi ke klien
5. Return success response

---

### 4. `/admin/projects/[id]`

**Nama:** Detail Proyek & Log Timeline  
**Akses:** Protected (hanya admin)  
**Fungsi:**

- Menampilkan detail lengkap proyek
- Menampilkan semua log progress dalam bentuk timeline
- Form untuk menambah log progress baru
- Trigger WhatsApp notification saat menambah log baru
- Button untuk edit proyek & delete proyek

**Komponen UI:**

- **Section 1: Info Proyek**

  - Nama Klien
  - Nomor WhatsApp
  - Nama Proyek
  - Deadline
  - Status
  - Unique Token
  - Magic Link (dengan button copy)
  - Button "Edit Proyek" & "Hapus Proyek"

- **Section 2: Progress Timeline**

  - Timeline vertikal menampilkan semua log
  - Setiap log menampilkan:
    - Judul tahapan
    - Deskripsi
    - Persentase progress
    - Tanggal & waktu
  - Button "Tambah Log Baru"

- **Section 3: Form Tambah Log Progress**
  - Judul Tahapan (text input, required)
  - Deskripsi (textarea, required)
  - Persentase Progress (number input 0-100, required)
  - Button "Simpan Log"
  - Checkbox "Kirim notifikasi WhatsApp ke klien" (default checked)

**Proses Backend (Tambah Log):**

1. Validasi input
2. Simpan log ke database
3. Update persentase progress proyek
4. Trigger API WhatsApp untuk kirim notifikasi update ke klien
5. Refresh timeline

---

### 5. `/admin/projects/[id]/edit`

**Nama:** Edit Proyek  
**Akses:** Protected (hanya admin)  
**Fungsi:**

- Form untuk mengedit data proyek yang sudah ada
- Update data proyek di database
- Redirect ke `/admin/projects/[id]` setelah berhasil

**Komponen UI:**

- Form dengan field (pre-filled dengan data existing):
  - Nama Klien (text input, required)
  - Nomor WhatsApp Klien (text input, required, validasi format 62xxx)
  - Nama Proyek (text input, required)
  - Deadline (date picker, required)
  - Status (dropdown: On Progress / Done)
- Button "Simpan Perubahan" & "Batal"
- Loading state saat proses submit
- Success notification setelah berhasil update

**Catatan:**

- Unique token TIDAK bisa diubah
- Jika nomor WhatsApp diubah:
  - Tampilkan warning modal konfirmasi:
    - _"Nomor WhatsApp akan diubah. Nomor lama tidak akan bisa recovery token lagi."_
  - Checkbox: "Kirim notifikasi ke nomor baru?" (default checked)
  - Jika dicentang, sistem akan kirim WhatsApp ke nomor baru dengan magic link

**Proses Backend (Update Nomor WA):**

1. Validasi nomor baru (format 62xxx)
2. Update nomor di database
3. Jika checkbox notifikasi dicentang:
   - Trigger API WhatsApp ke nomor baru
   - Kirim pesan: _"Halo, nomor WhatsApp Anda telah diperbarui di sistem kami. Ini link tracker proyek Anda: [Link]"_
4. Return success response

---

## 🌐 **Sisi Klien (Public Pages)**

### 6. `/` (Landing Page)

**Nama:** Landing Page - Dual Mode  
**Akses:** Public  
**Fungsi:**

- Halaman utama untuk klien
- Menyediakan 2 cara untuk tracking proyek:
  1. **Input Token Manual** - Klien memasukkan token yang dimiliki
  2. **Recovery Token** - Klien request ulang link via WhatsApp

**Komponen UI:**

**Section 1: Hero**

- Logo PAM Techno
- Headline: "Pantau Progress Proyek Anda"
- Subheadline: "Lacak perkembangan proyek secara real-time"

**Section 2: Mode 1 - Input Token Manual**

- Label: "Sudah punya token? Masukkan di sini untuk lacak."
- Text input untuk token
- Button "Lacak Proyek"
- Error message jika token tidak valid

**Section 3: Mode 2 - Recovery Token**

- Link/Button: "Lupa Token / Link Hilang?"
- Saat diklik, muncul modal/form:
  - Label: "Masukkan Nomor WhatsApp Anda"
  - Text input untuk nomor WhatsApp
  - Button "Kirim Link"
  - Success message: "Link telah dikirim ke WhatsApp Anda. Silakan cek HP."
  - Error message: "Nomor tidak terdaftar dalam sistem kami."

**Proses Backend:**

**Mode 1 (Validasi Token):**

1. User input token
2. Validasi token di database
3. Jika valid → redirect ke `/track/[token]`
4. Jika tidak valid → tampilkan error

**Mode 2 (Recovery Token):**

1. User input nomor WhatsApp
2. Normalisasi nomor ke format 62xxx
3. Cek nomor di database
4. Jika terdaftar:
   - Trigger API WhatsApp
   - Kirim pesan dengan magic link
   - Tampilkan success message
5. Jika tidak terdaftar → tampilkan error

**Design Notes:**

- **Mobile-first design** (karena diakses dari WhatsApp)
- Clean & simple UI
- Fast loading time
- Responsive untuk semua device

---

### 7. `/track/[token]`

**Nama:** Public View Timeline Proyek  
**Akses:** Public (dengan validasi token)  
**Fungsi:**

- Menampilkan timeline progress proyek untuk klien
- Diakses via magic link atau input token manual
- Klien bisa melihat progress dan mengirim feedback

**Komponen UI:**

**Section 1: Header Proyek**

- Logo PAM Techno
- Nama Proyek
- Nama Klien
- Deadline
- Overall Progress Bar (persentase keseluruhan)

**Section 2: Timeline Progress**

- Timeline vertikal dengan semua log progress
- Setiap item timeline menampilkan:
  - Icon/Badge persentase
  - Judul tahapan
  - Deskripsi detail
  - Tanggal & waktu update
  - Progress bar individual (jika diperlukan)
- Timeline diurutkan dari yang terbaru ke terlama

**Section 3: Feedback & Request (NEW)**

- Heading: "Punya Feedback atau Request?"
- Subheading: "Sampaikan kepada kami jika ada yang ingin Anda ubah atau tanyakan"
- Textarea untuk input feedback (placeholder: "Tulis feedback atau request Anda di sini...")
- Character counter (max 500 karakter)
- Button "Kirim Feedback"
- Loading state saat submit
- Success message: "Feedback Anda telah dikirim ke tim kami. Kami akan segera menghubungi Anda."

**Section 4: Footer**

- Contact info PAM Techno
- Button "Hubungi Kami" (WhatsApp)

**Proses Backend:**

**Load Page:**

1. Ambil token dari URL parameter
2. Validasi token di database
3. Jika valid:
   - Fetch data proyek
   - Fetch semua log progress
   - Render halaman
4. Jika tidak valid → tampilkan "Data tidak ditemukan"

**Submit Feedback:**

1. Validasi input (tidak boleh kosong, max 500 karakter)
2. Simpan feedback ke database (opsional)
3. Trigger API WhatsApp ke admin PAM Techno
4. Pesan berisi:
   - _"🔔 Feedback Baru dari Klien"_
   - _"Klien: [Nama Klien]"_
   - _"Proyek: [Nama Proyek]"_
   - _"Pesan: [Isi Feedback]"_
   - _"Nomor Klien: [Nomor WA]"_
5. Return success response

**Design Notes:**

- **Mobile-first design** (prioritas utama)
- Timeline yang mudah dibaca
- Feedback form yang mudah diakses
- Loading state yang smooth
- Auto-refresh jika ada update baru (optional: polling atau websocket)
- Responsive untuk semua device

---

## 🎨 **Design Guidelines**

### Color Palette

- Primary: Sesuai branding PAM Techno
- Secondary: Untuk accent & highlights
- Success: Green untuk status berhasil
- Error: Red untuk error messages
- Neutral: Gray scale untuk text & backgrounds

### Typography

- Heading: Bold, clear, readable
- Body: Clean sans-serif font
- Mobile: Minimum 16px untuk readability

### Responsiveness

- **Admin Pages:** Desktop-first (tapi tetap responsive)
- **Public Pages:** Mobile-first (prioritas utama)

### Components

- Buttons: Clear CTA dengan loading states
- Forms: Validasi real-time
- Notifications: Toast/alert untuk feedback
- Modals: Untuk confirmations & forms
- Timeline: Vertical timeline component

---

## 🔗 **Navigation Flow**

### Admin Flow

```
Login → Dashboard → [Pilih Proyek] → Detail Proyek
                  ↓
              Tambah Proyek Baru → Detail Proyek
                                        ↓
                                   Edit Proyek → Detail Proyek
```

### Client Flow

```
Landing Page → Input Token → Timeline Proyek
            ↓
         Recovery Token → Cek WhatsApp → Klik Magic Link → Timeline Proyek
```

---

## 📱 **WhatsApp Integration Points**

### 1. Create Project

**Trigger:** Saat admin membuat proyek baru  
**Recipient:** Klien (nomor WhatsApp yang diinput)  
**Message:**

```
Halo [Nama Klien],

Proyek Anda "[Nama Proyek]" telah terdaftar di sistem kami.

Pantau progress proyek Anda di sini:
https://pamtechno.id/track/[token]

Terima kasih,
PAM Techno
```

### 2. Update Progress

**Trigger:** Saat admin menambah log progress baru  
**Recipient:** Klien  
**Message:**

```
Update Progress Proyek "[Nama Proyek]"

[Judul Tahapan]
Progress: [Persentase]%

Lihat detail lengkap:
https://pamtechno.id/track/[token]

PAM Techno
```

### 3. Token Recovery

**Trigger:** Saat klien request ulang link via landing page  
**Recipient:** Klien  
**Message:**

```
Halo [Nama Klien],

Ini link tracker proyek Anda yang diminta:
https://pamtechno.id/track/[token]

Proyek: [Nama Proyek]

PAM Techno
```

### 4. Client Feedback

**Trigger:** Saat klien mengirim feedback dari halaman timeline  
**Recipient:** Admin PAM Techno  
**Message:**

```
🔔 Feedback Baru dari Klien

Klien: [Nama Klien]
Proyek: [Nama Proyek]

Pesan:
[Isi Feedback]

Nomor Klien: [Nomor WA]

---
Silakan follow up langsung ke klien.
```

### 5. Phone Number Update

**Trigger:** Saat admin mengupdate nomor WhatsApp klien  
**Recipient:** Klien (nomor baru)  
**Message:**

```
Halo [Nama Klien],

Nomor WhatsApp Anda telah diperbarui di sistem kami.

Ini link tracker proyek Anda:
https://pamtechno.id/track/[token]

Proyek: [Nama Proyek]

PAM Techno
```

---

## ✅ **Checklist Implementasi**

### Phase 1: Setup & Authentication

- [ ] Setup Next.js project dengan App Router
- [ ] Setup Prisma & PostgreSQL
- [ ] Implementasi authentication (NextAuth.js atau custom)
- [ ] Create `/admin/login` page

### Phase 2: Admin Pages

- [ ] Create `/admin/dashboard` page
- [ ] Create `/admin/projects/new` page
- [ ] Create `/admin/projects/[id]` page
- [ ] Create `/admin/projects/[id]/edit` page
- [ ] Implementasi CRUD operations

### Phase 3: Public Pages

- [ ] Create `/` landing page (dual mode)
- [ ] Create `/track/[token]` page
- [ ] Implementasi token validation

### Phase 4: WhatsApp Integration

- [ ] Setup Fonnte API
- [ ] Implementasi auto-notification untuk create project
- [ ] Implementasi auto-notification untuk update progress
- [ ] Implementasi token recovery via WhatsApp
- [ ] Implementasi client feedback feature
- [ ] Implementasi phone number update notification

### Phase 5: Polish & Deploy

- [ ] UI/UX refinement
- [ ] Mobile responsiveness testing
- [ ] Performance optimization
- [ ] Deploy to Vercel
- [ ] Testing end-to-end

---

## 📊 **Summary**

| Kategori     | Jumlah Halaman |
| ------------ | -------------- |
| Admin Pages  | 5              |
| Public Pages | 2              |
| **Total**    | **7 halaman**  |

**Total API Endpoints:** 13 endpoints (lihat `flow-system.md`)

**New Features Added:**

- ✅ Client Feedback System
- ✅ Phone Number Update with Notification
- ✅ Enhanced Admin Edit Flow

---

**Dibuat:** 2026-01-09  
**Project:** Client Progress Tracker - PAM Techno  
**Tech Stack:** Next.js, Prisma, PostgreSQL, Tailwind CSS, Fonnte
