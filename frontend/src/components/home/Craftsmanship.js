import styles from './Craftsmanship.module.css';

export default function Craftsmanship() {
  const features = [
    { icon: '✦', title: '100% Handmade', desc: 'Each rug is handcrafted by skilled artisans using traditional techniques' },
    { icon: '❖', title: 'Natural Fibers', desc: 'Made with premium wool, silk, cotton, and jute for lasting quality' },
    { icon: '◈', title: 'Sustainable', desc: 'Eco-conscious production with natural dyes and ethical practices' },
    { icon: '✧', title: 'Custom Sizes', desc: 'Made to your exact specifications with per-square-foot pricing' },
  ];

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.content}>
          <p className={styles.label}>Our Promise</p>
          <h2 className={styles.title}>Crafted with Purpose, Made to Last</h2>
          <p className={styles.description}>
            We believe a carpet is more than decor — it&apos;s a foundation for everyday living.
            By blending timeless craftsmanship with responsible practices, we create handmade
            carpets that bring warmth, character, and lasting comfort into modern homes.
          </p>
        </div>
        <div className={styles.features}>
          {features.map((f, i) => (
            <div key={i} className={styles.feature}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
