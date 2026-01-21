import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { UploadSection } from "@/components/sections/upload-section";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <UploadSection />
    </>
  );
}
