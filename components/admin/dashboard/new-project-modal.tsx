"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Loader2,
  Calendar as CalendarIcon,
  User,
  Phone,
  Briefcase,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface NewProjectModalProps {
  onSuccess: () => void;
}

export function NewProjectModal({ onSuccess }: NewProjectModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    projectName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!date) {
      toast.error("Deadline proyek harus diisi");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        deadline: date.toISOString(),
      };

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setOpen(false);
        setFormData({
          clientName: "",
          clientPhone: "",
          projectName: "",
        });
        setDate(undefined);
        onSuccess(); // Refresh parent data
        toast.success("Proyek berhasil dibuat!");
      } else {
        toast.error("Gagal membuat proyek");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" />
          Proyek Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Buat Proyek Baru
          </DialogTitle>
          <DialogDescription>
            Isi detail proyek di bawah ini untuk memulai tracking. Token unik
            akan di-generate otomatis.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            {/* Client Name Input */}
            <div className="space-y-2">
              <Label htmlFor="clientName">Nama Klien</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="clientName"
                  placeholder="Contoh: PT. Maju Jaya"
                  className="pl-9"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Client Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="clientPhone">No. WhatsApp</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="clientPhone"
                  placeholder="08xxxxxxxx"
                  type="tel"
                  className="pl-9"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Project Name Input */}
            <div className="space-y-2">
              <Label htmlFor="projectName">Nama Proyek</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="projectName"
                  placeholder="Contoh: Redesign Website Company Profile"
                  className="pl-9"
                  value={formData.projectName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Deadline Input */}
            <div className="space-y-2 flex flex-col">
              <Label>Deadline Estimasi</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal pl-3",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    {date ? (
                      format(date, "PPP")
                    ) : (
                      <span>Pilih tanggal deadline</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
              className="mr-2"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Buat Proyek"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
