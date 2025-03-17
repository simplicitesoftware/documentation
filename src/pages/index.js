import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import Heading from '@theme/Heading';
import styles from './index.module.css';


function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <div className={styles.homepage}>
      <div className={styles.grid}>
        <div className={styles.gridCol}>
          <h2 id="what-youll-find-here">What you'll find here</h2>
          <p>Simplicité is a low-code platform and this is its documentation. This site targets developers using the platform and aspires to be your single entrypoint to the Simplicité experience. If you just want to take a glimpse at the technology, please refer to the video demo of the platform <a href="https://simplicite.fr/demo-video-plateforme/">available on our commercial website</a>.</p>
          <p>There are two main parts:</p>
          <ul>
            <li>the tutorial,</li>
            <li>the technical documentation.</li>
          </ul>
          {/* ... rest of the content ... */}
        </div>
        
        <div className={styles.gridColImg}>
          {/* SVG content */}
        </div>
        
        {/* ... rest of the sections ... */}
      </div>
    </div>
    </Layout>
  );
}
