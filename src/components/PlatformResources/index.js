import React from 'react';
import { useState, useEffect } from 'react';
import styles from './styles.module.css';

const URL = "https://platform.simplicite.io/versions.json";

export default function PlatformResources({})
{
    // Variables
    const [versions, setVersions] = useState(null);

    // Methods
    useEffect(() => {
      if (versions) {
        // After data loads and renders, attempt to refresh the TOC
        // This is a hacky solution but might work
        const event = new Event('DOMContentLoaded');
        window.document.dispatchEvent(event);
      }
    }, [versions]);

    useEffect(() => {
        fetch(URL)
            .then(response => response.json())
            .then(data => {
                let platform = data["platform"];
                let map = new Map();

                Object.entries(platform).forEach( ([v,c]) => {
                    map.set(v,c);
                });

                setVersions(map);
            })
            .catch(err => console.error(`Error fetching json at "${URL}":\n-> ${err}\n`));
    }, []);

    // Getters ~ Parsers
    function getJavaResources(vKey) {
      let java = {
        base: [],
        light: [],
        full: []
      };

      let v = versions.get(vKey); // get from map
      let resources = v["resources"]; // handle as object

      if ('doc' in resources)
        java.base.push({ name:"documentation", url:resources["doc"]["java"] });

      if ('dependencies' in resources) {
        let deps = resources["dependencies"];
        java.full.push({ name:"dependencies (full)", url:deps["java"] });
        java.light.push({ name:"dependencies (light)", url:deps["java_light"] });
      }

      if ('maven' in resources) {
        let mav = resources["maven"];
        java.base.push({ name:"maven site", url:mav["site"]});
        java.base.push({ name:"maven repo", url:mav["repository"]});
      }

      return java;
    }

    function getJSResources(vKey) {
      let js = [];

      let v = versions.get(vKey); // get from map
      let resources = v["resources"]; // handle as object

      if ('doc' in resources)
        js.push({ name:"documentation", url:resources["doc"]["js"] });

      if ('dependencies' in resources) {
        let deps = resources["dependencies"];
        js.push({ name:"dependencies", url:deps["js"] });
        js.push({ name:"licenses", url:deps["js_licenses"] });
      }

      return js;
    }

    function getAuditResources(vKey) {
      let audit = {
        light: [],
        full: []
      };

      let v = versions.get(vKey); // get from map
      let resources = v["resources"]; // handle as object

      if ('dependencies' in resources) {
        let deps = resources["dependencies"];
        audit.full.push({ name:"report (full)", url:deps["audit"] });
        audit.light.push({ name:"report (light)", url:deps["audit_light"] });
      }

      return audit;
    }

    function getDockerInfos(vKey) {
      let docker = {
        light: [],
        full: []
      };

      let v = versions.get(vKey);
      let resources = v["resources"];

      if ('docker' in resources) {
        let dck = resources["docker"];
        docker.full.push({name:dockerImageTag(dck["image"]), value:dck["image"]})
        docker.full.push({name:"registry", value:dck["info"]})
        docker.light.push({name:dockerImageTag(dck["image_light"]), value:dck["image_light"]})
        docker.light.push({name:"registry (light)", value:dck["info_light"]})
      }
      console.log(`For V${vKey}, docker is ${JSON.stringify(docker)}`);
      return docker;
    }

    function dockerImageTag(fullTag) {
      let str = ""+fullTag;
      let split = str.split("/");
      let tag = split[split.length-1].split(":");
      return tag[tag.length-1];
    }

    let cpt = 0;
    // Content
    return (
      <>
        <div className={styles.pageContainer}>
            {versions && Array.from(versions).map( ([version, data]) => (
                <React.Fragment key={version}>
                  {/* TODO: find a way to place a real anchor here */}
                  <PlatformBlock
                    id={version}
                      version={version}
                      maintenance={data["maintenance"]}
                      supportType={data["support_type"]}
                      lastDate={data["date"]}
                      release={data["version"]}
                      firstDate={data["initial_release_date"]}
                      javaResources={getJavaResources(version)}
                      jsResources={getJSResources(version)}
                      auditResources={getAuditResources(version)}
                      dockerInfo={getDockerInfos(version)}
                  />
                </React.Fragment>
            ))}
        </div>
      </>
    )
};

function PlatformBlock({
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
  const [showLight, setShowLight] = useState(true);
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
      if (supportType)
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
        <div className={styles.blockHeader}> {/* Version + releases infos */}
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
                {/* Always display base resources */}
                {javaResources.base.map((r,i) => (
                  <div key={`base-${i}`} className={styles.blockItem}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer">{r.name}</a>
                  </div>
                ))}
                {/* Additionnally display either light or full resources */}
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
                  {/* Always display everything (no light/full) */}
                  {jsResources.map((r,i) => (
                      <div key={`js-${i}`} className={styles.blockItem}>
                        <a href={r.url} target="_blank" rel="noopener noreferrer">{r.name}</a>
                      </div>
                    ))}
                  </div>
              </div>
              <div className={styles.subBlock}>
                <h3>Dependency Audit</h3>
                <div className={styles.blockItems}>
                  {/* Display either light or full resources (no base) */}
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
                    {/* Handle copy-paste versus link */}
                    {d.name}
                  </div>
                ))
                : dockerInfo.full.map((d,i) => (
                  <div
                    key={`light-${i}`}
                    className={styles.dockerItem}
                    onClick={() => handleItemClick(d.value)}
                  >
                    {/* Handle copy-paste versus link */}
                    {d.name}
                  </div>
                ))
              }
            </div>
          </div>
          <div className={styles.toggle}>
            <label className={styles.toggleSwitch}>
              <span className={styles.toggleLabel}>
                {showLight ? 'Light infos' : 'Full infos'}
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

function Anchor({
    cpt
})
{
    // TODO: redesign + proper structure
    return (
        <>
          <h2 id={`resources-section-${cpt}`}>Block n°{cpt}</h2>
        </>
    )
}