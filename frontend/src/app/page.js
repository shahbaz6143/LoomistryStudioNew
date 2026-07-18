import HeroBanner from '@/components/home/HeroBanner';
import BestSellers from '@/components/home/BestSellers';
import CategoryGrid from '@/components/home/CategoryGrid';
import DealOfWeek from '@/components/home/DealOfWeek';
import Collections from '@/components/home/Collections';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.home}>
      <HeroBanner />
      <BestSellers />
      <DealOfWeek />
      <CategoryGrid />
      <Collections />
    </div>
  );
}
