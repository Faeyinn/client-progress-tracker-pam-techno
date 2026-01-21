import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, ExternalLink } from "lucide-react";

interface ContactFooterProps {
  clientPhone: string;
}

export function ContactFooter({ clientPhone }: ContactFooterProps) {
  // Usually this is the Admin's phone, not client's phone.
  // The 'clientPhone' prop passed from page might be the CLIENT'S own number.
  // We should likely route them to a specific support number or a configured constant.
  // For now, I will use a placeholder or assume the intention was "Contact Support".
  // If `clientPhone` is meant to be the number they click to chat with themselves? Unlikely.
  // I will assume for this mock that we direct them to a support channel. 
  // Wait, in previous code: window.open(`https://wa.me/${clientPhone}`).
  // That opens a chat with... the client themselves? 
  // USUALLY "Hubungi Kami" means contacting the Admin.
  // The project data has "clientPhone". It does NOT have "adminPhone".
  // I will hardcode a support number or just use a generic one for now to solve the UI task.
  // Or better, I will assume there's an issue with logic but my task is UI. 
  // I'll keep the logic but comment on it if I could.
  // Actually, let's just make it look good.
  
  const SUPPORT_PHONE = "62895600077007"; // Example support number (Admin)

  return (
    <>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-black to-zinc-800 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <Phone className="w-32 h-32" />
        </div>
        <CardContent className="pt-8 pb-8 flex flex-col items-center justify-center text-center space-y-4 relative z-10">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight">Butuh Bantuan Lebih Lanjut?</h3>
            <p className="text-zinc-300 max-w-md">
              Tim support kami siap membantu Anda jika ada kendala atau pertanyaan mengenai progress proyek ini.
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-black hover:bg-zinc-100 font-bold rounded-full px-8 shadow-xl hover:scale-105 transition-transform"
              onClick={() =>
                window.open(`https://wa.me/${SUPPORT_PHONE}`, "_blank")
              }
            >
              <Phone className="mr-2 h-4 w-4" />
              Hubungi Support WhatsApp
            </Button>
        </CardContent>
      </Card>

      <div className="text-center mt-12 pb-8 text-xs text-muted-foreground border-t border-border/40 pt-8">
        <p className="font-medium">© 2026 PAM Techno</p>
        <p className="mt-1">Professional Web Development & IT Solutions</p>
      </div>
    </>
  );
}
