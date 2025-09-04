import React from 'react';
import { useState, useEffect } from 'react';
import styles from './styles.module.css';

export default function PlatformBlock({
    version,
    maintenance,
    supportType,
    lastDate,
    release,
    firstDate,
    javaResources,
    jsResources,
    auditResources,
    dockerInfo
})
{
  const [showLight, setShowLight] = useState(false);
  const [copied, setCopied] = useState('');
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied('');
      }, 2000);
    }
  }, [copied]);

  function handleItemClick(value) {
    if (value.startsWith("https://"))
      window.open(value, "_blank");
    else {
      navigator.clipboard.writeText(value)
        .then(() => {
          setCopied("Copied to clipboard!");
        })
        .catch(err => {
          console.error("Failed to copy: ",err);
          setCopied('Failed to copy');
        })
    }
  }

  function prettierDate(date) {
    if (!date) return 'N/A';

    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return date; // Return original if parsing fails

        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const month = months[d.getMonth()];
        const day = d.getDate();
        const year = d.getFullYear();

        return `${month} ${day} of ${year}`;
    } catch (e) {
        console.error('Error formatting date:', e);
        return date; // Return original on error
    }
  }

  function prettierType(m, s) {
    let res;
    switch (m) {
      case "active":
        switch (s) {
          case "shortterm":
            res = "☑️ Short Term";
            break;
          case "longterm":
            res = "☑️ Long Term";
            break;
          default:
            res = "✅ Current";
            break;
        }
        break;
      case "alpha":
        res = "🚧 Alpha";
        break;
      case "beta":
        res = "🚧 Beta";
        break;
      case "expired":
        res = "❌ Expired";
        break;
      default:
        res = "Unknown Support";
        break;
    }
    return res;
  }

  function getClassName(maintenance, supportType) {
    if (maintenance == "active") {
      if (supportType != "N/A")
        return supportType;
      return maintenance;
    }
    else
      return maintenance;
  }

  function handleToggle() {
    setShowLight(b => !b);
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <div id={version} className={`${styles.block} ${styles[getClassName(maintenance,supportType)]}`}>
        <div className={styles.type}>
          <span>{prettierType(maintenance, supportType)}</span>
        </div>
        <button
          onClick={scrollToTop}
          className={styles.backToTopButton}
        >
          ↑
        </button>
        <div className={styles.blockHeader}>
          <h1>Version {version}</h1>
          <div className={styles.releases}>
            <span className={styles.releaseItem}>Current: <b>{release}</b> on <b>{prettierDate(lastDate)}</b> </span>
            {firstDate!=null &&
              <span className={styles.releaseItem}>First released on <b>{prettierDate(firstDate)}</b></span>
            }
          </div>
        </div>
        <div className={styles.blockBody}>
            <div className={styles.subBlock}>
              <h3>Java</h3>
              <div className={styles.blockItems}>
                {javaResources.base.map((r,i) => (
                  <div key={`base-${i}`} className={styles.blockItem}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer">{r.name}</a>
                  </div>
                ))}
                {showLight
                  ? javaResources.light.map((r,i) => (
                    <div key={`light-${i}`} className={styles.blockItem}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer">{r.name}</a>
                    </div>
                  ))
                  : javaResources.full.map((r,i) => (
                    <div key={`full-${i}`} className={styles.blockItem}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer">{r.name}</a>
                    </div>
                  ))
                }
              </div>
            </div>
            <div className={styles.bodyRight}>
              <div className={styles.subBlock}>
                <h3>Javascript</h3>
                <div className={styles.blockItems}>
                  {jsResources.base.map((r,i) => (
                      <div key={`js-${i}`} className={styles.blockItem}>
                        <a href={r.url} target="_blank" rel="noopener noreferrer">{r.name}</a>
                      </div>
                    ))}
                  </div>
              </div>
              <div className={styles.subBlock}>
                <h3>Dependency Audit</h3>
                <div className={styles.blockItems}>
                  {showLight
                    ? auditResources.light.map((r,i) => (
                      <div key={`light-${i}`} className={styles.blockItem}>
                        <a href={r.url} target="_blank" rel="noopener noreferrer">{r.name}</a>
                      </div>
                    ))
                    : auditResources.full.map((r,i) => (
                      <div key={`full-${i}`} className={styles.blockItem}>
                        <a href={r.url} target="_blank" rel="noopener noreferrer">{r.name}</a>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
        </div>
        <div className={styles.blockFooter}>
          <div className={styles.docker}>
            <h3>Docker Info: {copied && <span className={styles.copiedText}>{copied}</span>}</h3>
            <div className={styles.dockerItems}>
              {showLight
                ? dockerInfo.light.map((d,i) => (
                  <div
                    key={`light-${i}`}
                    className={styles.dockerItem}
                    onClick={() => handleItemClick(d.value)}
                  >
                    {d.name}
                  </div>
                ))
                : dockerInfo.full.map((d,i) => (
                  <div
                    key={`light-${i}`}
                    className={styles.dockerItem}
                    onClick={() => handleItemClick(d.value)}
                  >
                    {d.name}
                  </div>
                ))
              }
            </div>
          </div>
          <div className={styles.toggle}>
            <label className={styles.toggleSwitch}>
              <span className={styles.toggleLabel}>
                {(showLight ? 'Light' : 'Full') + " version"}
              </span>
              <div className={styles.toggleContainer}>
                <input
                  type="checkbox"
                  checked={showLight}
                  onChange={handleToggle}
                />
                <span className={styles.toggleSlider}></span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </>
  )
}