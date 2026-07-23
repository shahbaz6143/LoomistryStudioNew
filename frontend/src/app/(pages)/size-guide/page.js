import styles from './page.module.css';

export const metadata = { title: 'Rug Size Guide' };

export default function SizeGuidePage() {
  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Rug Size Guide</h1>
      <p className={styles.subtitle}>Find the perfect rug size for every room. Use our visual guide to choose the right dimensions.</p>

      {/* Room Diagrams */}
      <section className={styles.section}>
        <h2>Living Room</h2>
        <div className={styles.roomGrid}>
          <div className={styles.sizeCard}>
            <div className={styles.diagram}>
              <div className={styles.room}>
                <div className={styles.sofa} />
                <div className={styles.rug} style={{ width: '45%', height: '35%' }} />
              </div>
            </div>
            <h3>5×7 ft</h3>
            <p>Small living area. Front legs of sofa on the rug.</p>
          </div>
          <div className={styles.sizeCard}>
            <div className={styles.diagram}>
              <div className={styles.room}>
                <div className={styles.sofa} />
                <div className={styles.rug} style={{ width: '60%', height: '45%' }} />
              </div>
            </div>
            <h3>6×9 ft</h3>
            <p>Medium room. Anchors seating area nicely.</p>
          </div>
          <div className={styles.sizeCard}>
            <div className={styles.diagram}>
              <div className={styles.room}>
                <div className={styles.sofa} />
                <div className={styles.rug} style={{ width: '80%', height: '60%' }} />
              </div>
            </div>
            <h3>8×10 ft</h3>
            <p>Large room. All furniture sits on the rug.</p>
          </div>
          <div className={styles.sizeCard}>
            <div className={styles.diagram}>
              <div className={styles.room}>
                <div className={styles.sofa} />
                <div className={styles.rug} style={{ width: '90%', height: '70%' }} />
              </div>
            </div>
            <h3>9×12 ft</h3>
            <p>Spacious room. Full coverage with generous borders.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Bedroom</h2>
        <div className={styles.roomGrid}>
          <div className={styles.sizeCard}>
            <div className={styles.diagram}>
              <div className={styles.room}>
                <div className={styles.bed} />
                <div className={styles.rug} style={{ width: '35%', height: '55%', left: '5%' }} />
              </div>
            </div>
            <h3>Runner (2.5×8 ft)</h3>
            <p>Place on either side of the bed.</p>
          </div>
          <div className={styles.sizeCard}>
            <div className={styles.diagram}>
              <div className={styles.room}>
                <div className={styles.bed} />
                <div className={styles.rug} style={{ width: '70%', height: '60%' }} />
              </div>
            </div>
            <h3>6×9 ft</h3>
            <p>Extends under and around the bed.</p>
          </div>
          <div className={styles.sizeCard}>
            <div className={styles.diagram}>
              <div className={styles.room}>
                <div className={styles.bed} />
                <div className={styles.rug} style={{ width: '85%', height: '70%' }} />
              </div>
            </div>
            <h3>8×10 ft</h3>
            <p>King bed. Full coverage on all sides.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Dining Room</h2>
        <div className={styles.roomGrid}>
          <div className={styles.sizeCard}>
            <div className={styles.diagram}>
              <div className={styles.room}>
                <div className={styles.table} />
                <div className={styles.rug} style={{ width: '70%', height: '55%' }} />
              </div>
            </div>
            <h3>6×9 ft</h3>
            <p>4-seater table. Chairs stay on rug when pulled out.</p>
          </div>
          <div className={styles.sizeCard}>
            <div className={styles.diagram}>
              <div className={styles.room}>
                <div className={styles.table} style={{ width: '35%' }} />
                <div className={styles.rug} style={{ width: '85%', height: '65%' }} />
              </div>
            </div>
            <h3>8×10 ft</h3>
            <p>6-8 seater table. Comfortable space all around.</p>
          </div>
        </div>
      </section>

      {/* Quick Reference */}
      <section className={styles.section}>
        <h2>Quick Size Reference</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Size (ft)</th>
                <th>Size (cm)</th>
                <th>Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>3×5</td><td>90×150</td><td>Entryway, bedside, accent</td></tr>
              <tr><td>4×6</td><td>120×180</td><td>Small room, under coffee table</td></tr>
              <tr><td>5×7</td><td>150×210</td><td>Medium living room, bedroom</td></tr>
              <tr><td>6×9</td><td>180×270</td><td>Living room, dining (4 seater)</td></tr>
              <tr><td>8×10</td><td>240×300</td><td>Large room, dining (6-8 seater)</td></tr>
              <tr><td>9×12</td><td>270×360</td><td>Spacious room, open plan</td></tr>
              <tr><td>2.5×8</td><td>75×240</td><td>Hallway runner, bedside</td></tr>
              <tr><td>2.5×10</td><td>75×300</td><td>Long hallway, kitchen</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Tips */}
      <section className={styles.section}>
        <h2>Sizing Tips</h2>
        <div className={styles.tips}>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>📐</span>
            <h4>Measure First</h4>
            <p>Always measure your space before ordering. Leave 12-18 inches of floor visible around the rug edges.</p>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>🛋️</span>
            <h4>Furniture Placement</h4>
            <p>Either all furniture legs on the rug, or just the front legs. Avoid having only a small portion on the rug.</p>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>📏</span>
            <h4>Custom Sizes</h4>
            <p>Can't find your perfect size? We offer custom sizing. <a href="/custom-rugs">Request a custom rug →</a></p>
          </div>
        </div>
      </section>
    </div>
  );
}
