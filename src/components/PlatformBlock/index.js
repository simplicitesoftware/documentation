import React from 'react';
import styles from './styles.module.css';

export default function PlatformBlock({ 
  version, 
  maintenance = '',
  releaseVersion = '',
  releaseDate = '',
  docResources = [],
  mavenResources = [],
  dockerTags = [],
  packages = []
}) {
  // Helper function to format maintenance status
  const prettyMaintenance = (status) => {
    const icons = {
      'alpha': '🚧 Alpha',
      'active': '✅ Current',
      'shortterm': '☑️ Short Term (STS)',
      'longterm': '☑️ Long Term (LTS)',
      'expired': '❌ Expired',
    };
    return icons[status] || status;
  };

  return (
    <>
      <div className={styles.ghostMdAnchor} id={version}>
        <h2>{version}</h2>
      </div>
      <div className={`${styles.platformBlock} ${styles[maintenance]} ${styles[version<=4.0?"outdated":""]}`}>
        <div className={styles.blockHeader}>
          <span className={styles.title}>Version {version}</span>
          <span className={styles.maintenance}>{prettyMaintenance(maintenance)}</span>
        </div>
        <div className={styles.blockBody}>
          <span className={styles.comment}>
            Current revision <span className={styles.b}>{releaseVersion}</span>, 
            released <span className={styles.b}>{releaseDate}</span>
          </span>
          <div className={styles.blockLinks}>
            <div className={styles.docLinks}>
              {docResources.map((doc, index) => (
                <a key={index} href={doc.url} target="_blank" rel="noopener noreferrer">
                  {doc.name} doc
                </a>
              ))}
            </div>
            <div className={styles.mavLinks}>
              {mavenResources.map((maven, index) => (
                <a key={index} href={maven.url} target="_blank" rel="noopener noreferrer">
                  maven {maven.name}
                </a>
              ))}
            </div>
          </div>
          <div className={styles.dockerInfos}>
            <span className={styles.dockTitle}>Docker Tags:</span>
            {dockerTags.map((tag) => (
              <span className={styles.dockTag}>
                {tag}
              </span>
            ))}
          </div>
          <div className={styles.packageLinks}>
          <span className={styles.packTitle}>Packages <span className={styles.packInfo}>(auth required)</span>:</span>
            {packages.map((pkg, index) => (
              <a key={index} href={pkg.url} target="_blank" rel="noopener noreferrer">
                {pkg.target}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}