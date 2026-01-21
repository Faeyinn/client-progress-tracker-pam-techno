import { HeroSection } from "@/components/landing/hero-section";
import { TokenInputForm } from "@/components/landing/token-input-form";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-background overflow-hidden relative selection:bg-primary/10">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 lg:gap-8 items-center z-10">
        {/* Left Side: Hero content */}
        <div className="flex flex-col items-center lg:items-start space-y-6 text-center lg:text-left order-first p-4">
          <HeroSection />
        </div>

        {/* Right Side: Action Card */}
        <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto space-y-6">
          <TokenInputForm />
          <LandingFooter />
        </div>
      </div>
    </div>
  );
}
