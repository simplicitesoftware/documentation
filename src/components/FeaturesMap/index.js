import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles.module.css";

import { Transformer, builtInPlugins } from "markmap-lib";
import * as markmap from "markmap-view";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { useHistory } from "@docusaurus/router";

const SRC_MD = "/features_map.md"; // located in documentation/static/

export default function FeaturesMap() {
  const svgRef = useRef(null);
  const [error, setError] = useState(null);
  const history = useHistory();
  const { withBaseUrl } = useBaseUrlUtils();

  const transformer = useMemo(() => {
    // Include built-in plugins so headings/lists are converted to a mindmap structure.
    return new Transformer([...builtInPlugins]);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    let mm = null;
    const controller = new AbortController();

    const run = async () => {
      try {
        setError(null);

        const res = await fetch(SRC_MD, { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to load ${SRC_MD} (${res.status})`);

        const markdown = await res.text();

        const { root, features } = transformer.transform(markdown);
        const assets = transformer.getUsedAssets(features);

        if (assets?.styles) await markmap.loadCSS(assets.styles);

        if (assets?.scripts) {
          // Plugins may need access to the markmap module.
          await markmap.loadJS(assets.scripts, {
            getMarkmap: () => markmap,
          });
        }

        mm = markmap.Markmap.create(
          svgRef.current,
          {
            autoFit: true,
            colorFreezeLevel: 4,
            duration: 250,
            initialExpandLevel: 3
          },
          root
        );

        await mm.fit();
      } catch (e) {
        // Ignore abort errors.
        if (e?.name === "AbortError") return;
        setError(e?.message ?? String(e));
      }
    };

    run();

    return () => {
      controller.abort();
      mm?.destroy?.();
    };
  }, [transformer]);

  // Navigate when user clicks a node label containing <span data-doc="..."/>.
  // markmap-lib keeps the inline HTML in node.content, so we also fallback to parsing
  // `data-doc="..."` from the D3 datum when the DOM element doesn't expose it.
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const onClick = (event) => {
      try {
        const target = event.target;
        if (!(target instanceof Element)) return;

        // 1) If markmap renders HTML nodes, use the real DOM attribute.
        const docEl = target.closest?.("[data-doc]");
        const docPath = docEl?.getAttribute("data-doc");

        let navPath = docPath;

        // 2) Fallback: extract from the node content we put into markmap-lib.
        if (!navPath) {
          let el = target;
          while (el) {
            const datum = el.__data__;
            const content =
              typeof datum?.data?.content === "string"
                ? datum.data.content
                : typeof datum?.content === "string"
                  ? datum.content
                  : null;

            if (content) {
              const m = content.match(/data-doc="([^"]+)"/);
              navPath = m?.[1];
              if (navPath) break;
            }

            el = el.parentElement;
          }
        }

        if (!navPath) return;

        event.preventDefault();
        event.stopPropagation();

        const rel = navPath.replace(/^\//, "");
        if (typeof history?.push !== "function") return;
        history.push(withBaseUrl(rel));
      } catch (e) {
        // Avoid uncaught runtime errors if something unexpected happens
        // during DOM traversal or routing.
        console.error("[FeaturesMap] click handler error:", e);
      }
    };

    svgEl.addEventListener("click", onClick);
    return () => svgEl.removeEventListener("click", onClick);
  }, [history, withBaseUrl]);

  return (
    <div className={styles.wrapper}>
      {error ? (
        <div className={styles.hint}>
          <strong>Unable to render features map:</strong> {error}
        </div>
      ) : null}
      <svg ref={svgRef} className={styles.svg} id="features-map-markmap" />
    </div>
  );
}

