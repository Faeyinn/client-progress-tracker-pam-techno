"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  User,
  Phone,
  FolderKanban,
  Calendar,
  CheckCircle,
} from "lucide-react";

export function NewProjectForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    client_name: "",
    client_phone: "",
    project_name: "",
    deadline: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "client_phone") {
      let phone = value.replace(/\D/g, "");
      if (phone.startsWith("0")) {
        phone = "62" + phone.substring(1);
      } else if (!phone.startsWith("62")) {
        phone = "62" + phone;
      }
      setFormData({ ...formData, [name]: phone });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.client_phone.startsWith("62")) {
      setError("Nomor WhatsApp harus diawali dengan 62");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/admin/projects/${data.id}`);
        }, 1500);
      } else {
        setError(data.message || "Gagal membuat proyek");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Proyek berhasil dibuat! Notifikasi WhatsApp telah dikirim ke klien.
            Mengalihkan...
          </AlertDescription>
        </Alert>
      )}

      <Card className="border border-gray-200 shadow-lg bg-white">
        <CardHeader>
          <CardTitle>Informasi Proyek</CardTitle>
          <CardDescription>
            Isi form di bawah untuk membuat proyek baru. Token unik akan
            di-generate otomatis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert
                variant="destructive"
                className="animate-in fade-in slide-in-from-top-2"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="client_name" className="text-base font-semibold">
                Nama Klien <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="client_name"
                  name="client_name"
                  type="text"
                  placeholder="Contoh: PT. Maju Jaya"
                  value={formData.client_name}
                  onChange={handleChange}
                  className="pl-10 h-12"
                  required
                  disabled={isLoading || success}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_phone" className="text-base font-semibold">
                Nomor WhatsApp Klien <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="client_phone"
                  name="client_phone"
                  type="tel"
                  placeholder="628123456789"
                  value={formData.client_phone}
                  onChange={handleChange}
                  className="pl-10 h-12"
                  required
                  disabled={isLoading || success}
                />
              </div>
              <p className="text-sm text-gray-500">
                Format: 628xxxxxxxxxx (diawali dengan 62)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_name" className="text-base font-semibold">
                Nama Proyek <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <FolderKanban className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="project_name"
                  name="project_name"
                  type="text"
                  placeholder="Contoh: Website Company Profile"
                  value={formData.project_name}
                  onChange={handleChange}
                  className="pl-10 h-12"
                  required
                  disabled={isLoading || success}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-base font-semibold">
                Deadline <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="pl-10 h-12"
                  required
                  disabled={isLoading || success}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 h-12 bg-sky-500 hover:bg-sky-600 text-white shadow-md hover:shadow-lg transition-all duration-200 text-base font-semibold"
                disabled={isLoading || success}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Membuat Proyek...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Berhasil!
                  </>
                ) : (
                  "Simpan Proyek"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 text-base font-semibold"
                disabled={isLoading || success}
                onClick={() => router.push("/admin/dashboard")}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6 border-0 shadow-lg bg-blue-50/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 font-bold">ℹ</span>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">
                Yang akan terjadi setelah proyek dibuat:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Sistem akan membuat token unik untuk proyek ini</li>
                <li>Magic link akan di-generate otomatis</li>
                <li>
                  Notifikasi WhatsApp akan dikirim ke klien dengan link tracking
                </li>
                <li>Anda akan diarahkan ke halaman detail proyek</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
