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
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Loader2, Phone, CheckCircle, ArrowRight } from "lucide-react";

export function TokenInputForm() {
  const router = useRouter();

  // Tracking State
  const [token, setToken] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [tokenError, setTokenError] = useState("");

  // Recovery State
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSendingRecovery, setIsSendingRecovery] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [recoveryError, setRecoveryError] = useState("");
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTokenError("");
    setIsValidating(true);

    try {
      const response = await fetch("/api/track/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        router.push(`/track/${token}`);
      } else {
        setTokenError(
          "Token tidak ditemukan. Periksa kembali atau gunakan fitur recovery.",
        );
      }
    } catch (err) {
      setTokenError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError("");
    setRecoverySuccess(false);
    setIsSendingRecovery(true);

    // Normalize phone number
    let normalizedPhone = phoneNumber.replace(/\D/g, "");
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = "62" + normalizedPhone.substring(1);
    } else if (!normalizedPhone.startsWith("62")) {
      normalizedPhone = "62" + normalizedPhone;
    }

    try {
      const response = await fetch("/api/track/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone }),
      });

      if (response.ok) {
        setRecoverySuccess(true);
        setPhoneNumber("");
        // Optional: Close dialog after delay
        // setTimeout(() => setShowRecoveryDialog(false), 3000);
      } else {
        const data = await response.json();
        setRecoveryError(
          data.message || "Nomor tidak terdaftar dalam sistem kami.",
        );
      }
    } catch (err) {
      setRecoveryError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSendingRecovery(false);
    }
  };

  return (
    <Card className="border-border/50 shadow-2xl shadow-primary/5 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-6 space-y-2 text-center sm:text-left">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Lacak Progress
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground/80">
          Masukkan token ID proyek Anda untuk melihat status terkini
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTokenSubmit} className="space-y-6">
          {tokenError && (
            <Alert
              variant="destructive"
              className="animate-in fade-in slide-in-from-top-2 border-destructive/50 bg-destructive/10 text-destructive"
            >
              <AlertDescription className="font-medium">
                {tokenError}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Label
              htmlFor="token"
              className="text-sm font-medium text-foreground/90 sr-only"
            >
              Token Proyek
            </Label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <Input
                id="token"
                type="text"
                placeholder="Masukkan Token ID (Contoh: trx-8823-pam)"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="pl-10 h-14 text-base bg-background/50 border-input/60 focus:border-primary focus:ring-primary/20 transition-all rounded-lg"
                required
                disabled={isValidating}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-lg"
            disabled={isValidating || !token}
          >
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sabar ya...
              </>
            ) : (
              <>
                Lacak Sekarang <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-2 pb-6 border-t border-border/40 bg-muted/20">
        <div className="text-center w-full">
          <p className="text-sm text-muted-foreground">
            Lupa token Anda?{" "}
            <Dialog
              open={showRecoveryDialog}
              onOpenChange={setShowRecoveryDialog}
            >
              <DialogTrigger asChild>
                <button className="text-primary hover:text-primary/80 font-medium hover:underline transition-all">
                  Kirim ulang via WhatsApp
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-xl">Recovery Token</DialogTitle>
                  <DialogDescription>
                    Masukkan nomor WhatsApp yang terdaftar pada proyek untuk
                    menerima link akses kembali.
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={handleRecoverySubmit}
                  className="space-y-4 mt-2"
                >
                  {recoverySuccess && (
                    <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400">
                      <CheckCircle className="h-4 w-4 stroke-current" />
                      <AlertDescription>
                        Link akses telah dikirim! Silakan periksa WhatsApp Anda.
                      </AlertDescription>
                    </Alert>
                  )}

                  {recoveryError && (
                    <Alert variant="destructive">
                      <AlertDescription>{recoveryError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="phone">Nomor WhatsApp</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="0812..."
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pl-9"
                        required
                        disabled={isSendingRecovery || recoverySuccess}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSendingRecovery || recoverySuccess}
                  >
                    {isSendingRecovery ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mengirim...
                      </>
                    ) : recoverySuccess ? (
                      "Terkirim"
                    ) : (
                      "Kirim Link Akses"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
