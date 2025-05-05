import React from 'react';
import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import PlatformBlock from '../PlatformBlock';

const URL = "https://platform.simplicite.io/versions.json";

export default function PlatformResources({})
{
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
                      dockerInfo={getDockerInfos(version)}
                  />
                </React.Fragment>
            ))}
        </div>
      </>
    )
};