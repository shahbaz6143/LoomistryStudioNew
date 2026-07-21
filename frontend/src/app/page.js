import HeroBanner from '@/components/home/HeroBanner';
import ShopByRoom from '@/components/home/ShopByRoom';
import NewCollections from '@/components/home/NewCollections';
import BestSellers from '@/components/home/BestSellers';
import Craftsmanship from '@/components/home/Craftsmanship';
import DealOfWeek from '@/components/home/DealOfWeek';
import Collections from '@/components/home/Collections';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function Home() {
  return (
    <>
      <HeroBanner />
      <ShopByRoom />
      <ScrollReveal>
        <NewCollections />
      </ScrollReveal>
      <ScrollReveal>
        <BestSellers />
      </ScrollReveal>
      <ScrollReveal>
        <Craftsmanship />
      </ScrollReveal>
      <ScrollReveal>
        <DealOfWeek />
      </ScrollReveal>
      <ScrollReveal>
        <Collections />
      </ScrollReveal>
    </>
  );
}
