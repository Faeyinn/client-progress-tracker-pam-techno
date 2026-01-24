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
  Sparkles,
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
  triggerButton?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function NewProjectModal({
  onSuccess,
  triggerButton = true,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: NewProjectModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    projectName: "",
  });

  // Support both controlled and uncontrolled modes
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = controlledOnOpenChange || setInternalOpen;

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
        setIsOpen(false);
        setFormData({
          clientName: "",
          clientPhone: "",
          projectName: "",
        });
        setDate(undefined);
        onSuccess();
        toast.success("Proyek berhasil dibuat!", {
          description: "Token unik telah di-generate untuk klien.",
        });
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

  const dialogContent = (
    <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
      {/* Header with subtle background */}
      <div className="bg-foreground/[0.02] p-6 pb-4 border-b border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-foreground" />
            </div>
            Buat Proyek Baru
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Isi detail proyek di bawah ini untuk memulai tracking. Token unik
            akan di-generate otomatis.
          </DialogDescription>
        </DialogHeader>
      </div>

      <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
        <div className="space-y-4">
          {/* Client Name Input */}
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-sm font-medium">
              Nama Klien
            </Label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <Input
                id="clientName"
                placeholder="Contoh: PT. Maju Jaya"
                className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-foreground/20"
                value={formData.clientName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Client Phone Input */}
          <div className="space-y-2">
            <Label htmlFor="clientPhone" className="text-sm font-medium">
              No. WhatsApp
            </Label>
            <div className="relative group">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <Input
                id="clientPhone"
                placeholder="08xxxxxxxx"
                type="tel"
                className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-foreground/20"
                value={formData.clientPhone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Project Name Input */}
          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-sm font-medium">
              Nama Proyek
            </Label>
            <div className="relative group">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <Input
                id="projectName"
                placeholder="Contoh: Redesign Website Company Profile"
                className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-foreground/20"
                value={formData.projectName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Deadline Input */}
          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-medium">Deadline Estimasi</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-11 transition-all duration-200 hover:border-foreground/30",
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
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-foreground hover:bg-foreground/90 text-background transition-all duration-200 active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Buat Proyek
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );

  if (!triggerButton) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-foreground hover:bg-foreground/90 text-background shadow-sm transition-all duration-200 active:scale-[0.98] h-10">
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Proyek Baru</span>
          <span className="sm:hidden">Baru</span>
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
