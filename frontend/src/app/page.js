import HeroBanner from '@/components/home/HeroBanner';
import BestSellers from '@/components/home/BestSellers';
import Craftsmanship from '@/components/home/Craftsmanship';
import CategoryGrid from '@/components/home/CategoryGrid';
import DealOfWeek from '@/components/home/DealOfWeek';
import Collections from '@/components/home/Collections';

export default function Home() {
  return (
    <>
      <HeroBanner />
      <BestSellers />
      <Craftsmanship />
      <CategoryGrid />
      <DealOfWeek />
      <Collections />
    </>
  );
}
