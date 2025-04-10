import React from 'react';
import styles from './styles.module.css';

export default function PlatformBlock({ 
  version, 
  maintenance = '',
  releaseVersion = '',
  releaseDate = '',
  javaResources = [],
  jsResources = [],
  auditResources = [],
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
            <div className={styles.javaBlock}>
              <b>Java:</b>
              {javaResources.map((resource, index) => (
                <a key={index} href={resource.url} target="_blank" rel="noopener noreferrer">
                  {resource.name}
                </a>
              ))}
            </div>
            <div className={styles.rightBlock}>
              <div className={styles.jsBlock}>
                <b>JavaScript:</b>
                {jsResources.map((resource, index) => (
                  <a key={index} href={resource.url} target="_blank" rel="noopener noreferrer">
                    {resource.name}
                  </a>
                ))}
              </div>
              <div className={styles.auditBlock}>
                <b>Dependency Audit:</b>
                {auditResources.map((resource, index) => (
                  <a key={index} href={resource.url} target="_blank" rel="noopener noreferrer">
                    {resource.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.dockerInfos}>
            <span className={styles.dockTitle}>Docker Tags:</span>
            {dockerTags.map((tag) => (
              <span className={styles.dockTag}>
                {tag}
              </span>
            ))}
            {/* TODO: link to registry-ui OR copy to clipboard */}
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