import styles from '../pages.module.css';

export const metadata = { title: 'Rug Care Guide' };

export default function CareGuidePage() {
  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Rug Care Guide</h1>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>General Care Tips</h2>
          <ul>
            <li><strong>Vacuum regularly</strong> — at least once a week (avoid fringe areas)</li>
            <li><strong>Rotate your rug</strong> every 6 months to ensure even wear</li>
            <li><strong>Avoid direct sunlight</strong> — prolonged exposure can fade colors</li>
            <li>Use a <strong>rug pad</strong> to prevent slipping and extend rug life</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Spot Cleaning</h2>
          <ol>
            <li>Blot spills immediately with a clean, dry cloth (don't rub!)</li>
            <li>Mix mild soap with lukewarm water</li>
            <li>Gently dab the stained area with the solution</li>
            <li>Blot dry with a clean towel</li>
            <li>Allow to air dry completely — avoid using a hairdryer or heater</li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2>Professional Cleaning</h2>
          <p>We recommend professional cleaning every <strong>12–18 months</strong> depending on foot traffic. Always use a cleaner experienced with handmade rugs.</p>
        </section>

        <section className={styles.section}>
          <h2>Material-Specific Care</h2>
          <ul>
            <li><strong>Wool:</strong> Naturally stain-resistant. Vacuum regularly, spot clean as needed.</li>
            <li><strong>Silk:</strong> Very delicate. Professional cleaning only. Avoid heavy furniture.</li>
            <li><strong>Cotton:</strong> Machine washable for small rugs. Air dry flat.</li>
            <li><strong>Jute:</strong> Avoid moisture. Vacuum only. Blot spills immediately.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Storage</h2>
          <p>If storing your rug, roll it (never fold) with a moth repellent inside. Store in a cool, dry place wrapped in breathable fabric — not plastic.</p>
        </section>
      </div>
    </div>
  );
}
