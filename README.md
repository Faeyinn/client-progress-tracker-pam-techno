# 🚀 Client Progress Tracker - PAM Techno

Sistem tracking progress proyek untuk klien dengan notifikasi WhatsApp otomatis.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)

---

## 📋 Deskripsi

Client Progress Tracker adalah aplikasi web modern yang memungkinkan PAM Techno untuk:

- Mengelola proyek klien dengan mudah
- Memberikan akses real-time tracking kepada klien
- Mengirim notifikasi WhatsApp otomatis untuk setiap update
- Menerima feedback dari klien langsung melalui sistem

---

## ✨ Fitur Utama

### 🔐 Sisi Admin

- ✅ **Dashboard Interaktif** - Lihat semua proyek dalam satu tampilan
- ✅ **Manajemen Proyek** - CRUD proyek dengan mudah
- ✅ **Timeline Progress** - Catat setiap tahapan pengerjaan
- ✅ **Auto-Generate Token** - Token unik untuk setiap proyek
- ✅ **Magic Link** - Link tracking yang bisa langsung dibagikan
- ✅ **WhatsApp Notification** - Notifikasi otomatis ke klien

### 🌐 Sisi Klien (Public)

- ✅ **Token Tracking** - Input token untuk melihat progress
- ✅ **Token Recovery** - Kirim ulang link via WhatsApp
- ✅ **Timeline View** - Lihat progress dalam timeline visual
- ✅ **Feedback System** - Kirim feedback langsung ke admin
- ✅ **Mobile-First** - Optimized untuk akses via HP

---

## 🎨 UI/UX Highlights

### Design System

- **Modern Gradient Backgrounds** - Blue-Indigo gradient theme
- **Glassmorphism Effects** - Translucent cards dengan backdrop blur
- **Smooth Animations** - Micro-interactions untuk UX yang lebih baik
- **Colored Shadows** - Depth dengan shadow effects
- **Responsive Design** - Perfect di semua ukuran layar

### Components (shadcn/ui)

Menggunakan 14 komponen shadcn/ui yang telah dikustomisasi:

- Button, Input, Label, Textarea
- Card, Badge, Alert, Dialog
- Table, Select, Dropdown Menu
- Progress, Separator, Tabs

---

## 🛠️ Tech Stack

| Layer             | Technology              |
| ----------------- | ----------------------- |
| **Framework**     | Next.js 15 (App Router) |
| **Language**      | TypeScript              |
| **Styling**       | Tailwind CSS            |
| **UI Components** | shadcn/ui               |
| **Database**      | PostgreSQL              |
| **ORM**           | Prisma                  |
| **WhatsApp API**  | Fonnte                  |
| **Deployment**    | Vercel                  |

---

## 📁 Struktur Halaman

### Admin Pages (Protected)

```
/admin/login              → Login admin
/admin/dashboard          → Dashboard & list proyek
/admin/projects/new       → Tambah proyek baru
/admin/projects/[id]      → Detail proyek & timeline
/admin/projects/[id]/edit → Edit proyek
```

### Public Pages

```
/                         → Landing page (dual mode)
/track/[token]           → Public timeline view
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) atau npm
- PostgreSQL database

### Installation

1. **Clone repository**

```bash
git clone <repository-url>
cd client-progress-tracker
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
```

Edit `.env` dan isi:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
FONNTE_API_KEY="your-fonnte-api-key"
```

4. **Setup database**

```bash
pnpm prisma generate
pnpm prisma db push
pnpm prisma db seed  # Optional: seed admin user
```

5. **Run development server**

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 📱 API Endpoints

### Authentication

- `POST /api/auth/login` - Login admin
- `POST /api/auth/logout` - Logout admin

### Projects (Admin)

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get project detail
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Project Logs

- `GET /api/projects/[id]/logs` - Get project logs
- `POST /api/projects/[id]/logs` - Add log

### Public Tracking

- `GET /api/track/[token]` - Get project by token
- `POST /api/track/validate` - Validate token
- `POST /api/track/recovery` - Recovery token via WA
- `POST /api/track/[token]/feedback` - Send feedback

---

## 📊 Database Schema

### Tables

1. **users** - Admin users
2. **projects** - Project data
3. **project_logs** - Progress timeline
4. **client_feedbacks** - Client feedback

Lihat `prisma/schema.prisma` untuk detail lengkap.

---

## 🔔 WhatsApp Integration

Sistem menggunakan Fonnte API untuk mengirim notifikasi otomatis:

### Trigger Points:

1. **Create Project** → Kirim magic link ke klien
2. **Update Progress** → Notifikasi update ke klien
3. **Token Recovery** → Kirim ulang link
4. **Client Feedback** → Notifikasi ke admin
5. **Phone Update** → Notifikasi ke nomor baru

---

## 📸 Screenshots

Lihat `UI-PREVIEW.md` untuk preview visual semua halaman.

---

## 🎯 Roadmap

### Phase 1: UI Development ✅

- [x] Slicing semua halaman
- [x] Responsive design
- [x] Component integration

### Phase 2: Backend Development 🔲

- [ ] API routes implementation
- [ ] Database integration
- [ ] Authentication system

### Phase 3: WhatsApp Integration 🔲

- [ ] Fonnte API setup
- [ ] Auto-notification system
- [ ] Message templates

### Phase 4: Testing & Deployment 🔲

- [ ] Unit testing
- [ ] Integration testing
- [ ] Production deployment

---

## 📝 Documentation

- [Flow System](./flow-system.md) - Alur kerja sistem lengkap
- [Pages Structure](./pages-structure.md) - Struktur halaman detail
- [UI Slicing Summary](./UI-SLICING-SUMMARY.md) - Summary UI yang telah dibuat
- [UI Preview](./UI-PREVIEW.md) - Preview visual halaman
- [Project Structure](./PROJECT-STRUCTURE.md) - Struktur project lengkap

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

**PAM Techno Development Team**

- UI/UX Design: ✅ Complete
- Frontend Development: ✅ Complete
- Backend Development: 🔲 In Progress
- Integration: 🔲 Pending

---

## 📞 Support

Untuk bantuan atau pertanyaan:

- Email: support@pamtechno.id
- WhatsApp: +62xxx-xxxx-xxxx

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Fonnte](https://fonnte.com/) - WhatsApp API Gateway

---

**Built with ❤️ by PAM Techno**

_Last Updated: January 9, 2026_
