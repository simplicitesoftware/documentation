import React from 'react';
import { useState } from 'react';
import styles from './styles.module.css';

export default function PlatformBlock({ 
  version, 
  maintenance = '',
  supportType = '',
  releaseVersion = '',
  releaseDate = '',
  javaResources = [],
  jsResources = [],
  auditResources = [],
  dockerInfo = {},
  packages = []
}) {
  const [copyMessage, setCopyMessage] = useState('');

  // Helper function to format maintenance status
  const prettyMaintenance = (m, st) => {
    switch (m) {
      case 'alpha':
        return '🚧 Alpha';
      case 'active':
        switch (st) {
          case 'shortterm':
            return '☑️ Short Term';
          case 'longterm':
            return '☑️ LTS';
          default:
            return '✅ Current';
        }
      case 'expired':
        return '❌ Expired';
      default:
        return m+"-"+st;
    }
  };

  const blockClass = (m, st) => {
    if (m === 'alpha' || m==='expired') return m;
    else if (m==='active') {
      if (st === 'shortterm' || st === 'longterm') return 'maintained';
      else return 'active';
    } else
      return m+"-"+st;
  }

  const dockerAction = (value, isUrl) => {
    if (isUrl) {
      window.open(value, '_blank', 'noopener,noreferrer');
    } else {
      navigator.clipboard.writeText(value)
        .then(() => {
          setCopyMessage(`Copied to clipboard`);
          setTimeout(() => setCopyMessage(''), 2000);
        }).catch(err => {
          console.error('Failed to copy: ', err);
          setTimeout(() => setCopyMessage(''), 2000);
        });
    }
  }

  return (
    <>
      <div className={`${styles.platformBlock} ${styles[blockClass(maintenance, supportType)]} ${styles[version<=4.0?"outdated":""]}`}>
        <div className={styles.blockHeader}>
          <span className={styles.title}>Version {version}</span>
          <span className={styles.maintenance}>{prettyMaintenance(maintenance,supportType)}</span>
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
          {/* Docker Info Section -> improved functionnalities */}
          {Object.keys(dockerInfo).length > 0 && (
            <div className={styles.dockerSection}>
              <div className={styles.dockerInfos}>
                <span className={styles.dockerTitle}>Docker:</span>
                {copyMessage && <span className={styles.copyMessage}>{copyMessage}</span>}
              </div>
              <div className={styles.dockerTags}>
                {dockerInfo.image && (
                  <div className={styles.dockerTagItem}>
                    <button className={styles.dockerTag}
                      onClick={() => dockerAction(dockerInfo.image, false)}
                      title="Click to copy to clipboard"
                    >
                      {dockerInfo.image.split(':')[1]}
                    </button>
                    {dockerInfo.info && (
                      <button className={styles.dockerTag}
                        onClick={() => dockerAction(dockerInfo.info, true)}
                        title="View in registry"
                      >
                        registry
                      </button>
                    )}
                    </div>
                )}
              </div>
            </div>)}
          <div className={styles.packageLinks}>
          <span className={styles.packTitle}>Packages:</span>
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