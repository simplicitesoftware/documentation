import React from 'react';
import { useState, useEffect } from 'react';
import styles from './styles.module.css';

const URL = "https://platform.simplicite.io/versions.json";

export default function PlatformResources({}) {
    // Variables
    const [versions, setVersions] = useState(null);

    // Methods
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

    // Getters
    function getJavaResources(vKey)
    {
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

    function getJSResources(vKey)
    {
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

    function getAuditResources(vKey)
    {
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

    // Content
    return (
      <>
        <div className={styles.pageContainer}>
            {versions && Array.from(versions).map( ([version, data]) => (
                <React.Fragment key={version}>
                  {/* TODO: find a way to place a real anchor here */}
                  <PlatformBlock
                      version={version}
                      maintenance={data["maintenance"]}
                      supportType={data["support_type"]}
                      lastDate={data["date"]}
                      release={data["version"]}
                      firstDate={data["initial_release_date"]}
                      javaResources={getJavaResources(version)}
                      jsResources={getJSResources(version)}
                      auditResources={getAuditResources(version)}
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
    dockerInfo = {}
}) {
  const [showLight, setShowLight] = useState(true);

  function prettierDate(date) {
    let d = date;
    return d;
  }

  function prettierType(m, s) {
    return m +" - "+ s;
  }

  function handleToggle() {
    setShowLight(b => !b);
  } 
  // TODO: redesign + proper structure
  return (
    <>
      <div className={styles.block}>
        <div className={styles.type}>
          <span>{prettierType(maintenance, supportType)}</span>
        </div>
        <div className={styles.blockHeader}> {/* Version + releases infos */}
          <h1>Version {version}</h1>
          <div className={styles.releases}>
            <span className={styles.releaseItem}>Current: <b>{release}</b> on <b>{prettierDate(lastDate)}</b></span>
            {firstDate!=null &&
              <span className={styles.releaseItem}>First released on <b>{prettierDate(firstDate)}</b></span>
            }
          </div>
        </div>
        <div className={styles.blockBody}>
            <div className={styles.subBlock}>
              <h3>Java</h3>
              <div className={styles.blockItems}>
                  {/* for ITEM in "javaResources"
                        if _light_
                        else _full_ */}
                </div>
            </div>
            <div className={styles.bodyRight}>
              <div className={styles.subBlock}>
                <h3>Javascript</h3>
                <div className={styles.blockItems}>
                  {/* for ITEM in "jsResources"
                        if _light_
                        else _full_ */}
                </div>
              </div>
              <div className={styles.subBlock}>
                <h3>Dependency Audit</h3>
                <div className={styles.blockItems}>
                  {/* for ITEM in "auditResources"
                        if _light_
                        else _full_ */}
                </div>
              </div>
            </div>
        </div>
        <div className={styles.blockFooter}>
          <div className={styles.docker}>
            <h3>Docker Info:</h3>
            <div className={styles.dockerItems}>
              {/* for ITEM in "dockerInfo"
                    if _dock-light_
                    else _dock-full_ */}
            </div>
          </div>
          <div className={styles.toggle}>
            {/* Toggle UI */}
            <label className={styles.toggleSwitch}>
              <span className={styles.toggleLabel}>
                {showLight ? 'Light Version' : 'Full Version'}
              </span>
              <div className={styles.toggleContainer}>
                <input
                  type="checkbox"
                  checked={showLight}
                  onChange={handleToggleChange}
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
    version,
    maintenance
}) {
    // TODO: redesign + proper structure
    return (
        <>
          ## BLOCK {version}
          <div className={styles.anchor}> 
              {version} - {maintenance}
          </div>
        </>
    )
}