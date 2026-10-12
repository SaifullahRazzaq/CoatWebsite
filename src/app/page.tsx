import Hero from "@/components/hero/Hero";
import Manifesto from "@/components/sections/Manifesto";
import ClothSection from "@/components/sections/ClothSection";
import DetailObsession from "@/components/sections/DetailObsession";
import BespokeProcess from "@/components/sections/BespokeProcess";
import Collections from "@/components/sections/Collections";
import SuitAnatomy from "@/components/sections/SuitAnatomy";
import Personalisation from "@/components/sections/Personalisation";
import Atelier from "@/components/sections/Atelier";
import Philosophy from "@/components/sections/Philosophy";
import Ceremony from "@/components/sections/Ceremony";
import Invitation from "@/components/sections/Invitation";

/**
 * The order is the film's rhythm, not a content inventory:
 * reveal, breath, material, detail, process, product, anatomy, choice,
 * people, silence, emotion, invitation. Two loud sections never sit next
 * to each other, and every pinned sequence is followed by something that
 * simply scrolls.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <ClothSection />
      <DetailObsession />
      <BespokeProcess />
      <Collections />
      <SuitAnatomy />
      <Personalisation />
      <Atelier />
      <Philosophy />
      <Ceremony />
      <Invitation />
    </>
  );
}
