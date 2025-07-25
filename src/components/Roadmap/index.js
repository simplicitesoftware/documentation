import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";

const SRC_JSON = "/roadmap.json"; // located in documentation/static/

export default function Roadmap({}) {
  const [data, setData] = useState(null);
  const [collapsedVersions, setCollapsedVersions] = useState(new Set());

  /*
   * Fetching the local "roadmap.json" file for generation data
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(SRC_JSON);
        const jsonData = await response.json();

        console.log("===== FETCHED ROADMAP LOCAL JSON =====");
        console.log(
          `generation_date: ${jsonData.generation_date}\nlines: ${jsonData.lines}\ncols: ${jsonData.cols}`
        );
        console.log("======================================");

        setData(jsonData);
      } catch (err) {
        console.error("Error during JSON loading:", err);
      }
    };

    fetchData();
  }, []);

  const toggleVersion = (version) => {
    setCollapsedVersions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(version)) {
        newSet.delete(version);
      } else {
        newSet.add(version);
      }
      return newSet;
    });
  };

  function sortVersions(versions) {
    return [...versions].sort((a, b) => {
      const parseVersion = (v) => {
        const cleaned = v.replace("v", "");
        return cleaned.split(".").map(Number);
      };

      const aNum = parseVersion(a);
      const bNum = parseVersion(b);

      for (let i = 0; i < Math.max(aNum.length, bNum.length); i++) {
        const an = aNum[i] || 0;
        const bn = bNum[i] || 0;

        if (an !== bn) return bn - an;
      }

      return 0;
    });
  }

  function groupItemsByVersion(tableData) {
    const groupedItems = {};
    // OOF this is ugly
    tableData.forEach((versionData) => {
      versionData.forEach((typeData) => {
        typeData.forEach((item) => {
          const version = item.prdChgVrsId__prdVrsNumber;

          if (!groupedItems[version]) groupedItems[version] = [];

          groupedItems[version].push(item);
        });
      });
    });

    return groupedItems;
  }

  const getTypeHeaderClass = (type) => {
    const classMap = {
      FEATURE: styles.typeHeaderFeature,
      ENHANCEMENT: styles.typeHeaderEnhancement,
      TECHNICAL: styles.typeHeaderTechnical,
      MAKER: styles.typeHeaderMaker,
      DEPRECATION: styles.typeHeaderDeprecation,
    };
    return `${styles.typeHeader} ${classMap[type] || styles.typeHeaderDefault}`;
  };

  const getVersionRowHeights = () => {
    const heights = {};

    sortedVersions.forEach((version) => {
      let maxItems = 0;

      data.cols.forEach((col) => {
        const itemCount =
          itemsByVersion[version]?.filter((item) => item.prdChgType === col)
            .length || 0;
        maxItems = Math.max(maxItems, itemCount);
      });

      const cardHeight = 85; // Augmenter de 80 à 85px
      const gap = 6; // Augmenter le gap de 4 à 6px
      const padding = 16;

      heights[version] = collapsedVersions.has(version)
        ? sortedVersions[sortedVersions.length - 1] === version
          ? 30
          : 0
        : maxItems > 0
        ? maxItems * cardHeight + (maxItems - 1) * gap + padding
        : 60;
    });

    return heights;
  };

  // If no data found then return empty page
  if (!data) return <>No data was found...</>;

  const sortedVersions = sortVersions(data.lines);
  const itemsByVersion = groupItemsByVersion(data.table);
  const versionHeights = getVersionRowHeights();

  console.log("Items groupés par version:", itemsByVersion);
  console.log("Hauteurs calculées:", versionHeights);

  return (
    <>
      <div className={styles.roadmapHeader}>
        Last update: {data.generation_date} {/* Use a 'prettier' method */}
      </div>
      <div className={styles.roadmapContainer}>
        {/* Colonne Version */}
        <div className={styles.versionColumn}>
          {/* Header Version */}
          <div className={styles.versionHeader}>-</div>

          {/* Contenu versions */}
          <div className={styles.versionContent}>
            {sortedVersions.map((version, idx) => (
              <div
                key={idx}
                className={styles.versionCell}
                style={{ height: `${versionHeights[version]}px` }}
                onClick={() => toggleVersion(version)}
              >
                <span className={styles.versionText}>{version}</span>
                <span className={styles.versionChevron}>
                  {collapsedVersions.has(version) ? "\u2B9E" : "\u2B9F"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Colonnes Types */}
        {data.cols.map((col, colIndex) => (
          <div
            key={colIndex}
            className={styles.typeColumn + getTypeHeaderClass(col)}
          >
            {/* Header Type */}
            <div className={getTypeHeaderClass(col)}>{col}</div>

            {/* Contenu par version */}
            <div className={styles.typeContent}>
              {sortedVersions.map((version, versionIndex) => (
                <div
                  key={versionIndex}
                  className={styles.typeCell}
                  style={{ height: `${versionHeights[version]}px` }}
                >
                  {!collapsedVersions.has(version) &&
                    itemsByVersion[version]
                      ?.filter((item) => item.prdChgType === col)
                      .map((item, itemIndex) => (
                        <FeatureCard key={itemIndex} item={item} />
                      ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const FeatureCard = ({ item }) => {
  const hasReleaseNote =
    item.prdChgReleaseNote && item.prdChgReleaseNote.trim() !== "";
  const showPortalLink = item.prdChgTicket && item.prdChgTicket.trim() !== "";
  const portalUrl = `https://portal.simplicite.fr?f=PrdChange%3B${item.row_id}`;

  const getPropertyLabel = (prop) => {
    const labels = {
      backported: "Backported",
      origin: "Origin",
      ticket: "R&D",
    };
    return labels[prop];
  };

  const getPropertyText = (prop) => {
    const textMap = {
      backported: "Backport",
      origin: "Origin",
      ticket: "R&D",
    };
    return textMap[prop];
  };

  const handleCardClick = () => {
    if (hasReleaseNote) {
      window.open(item.prdChgReleaseNote, "_blank");
    }
  };

  const handlePropertyClick = (val) => {
    // If URL then open in _blank
    if (val && val.startsWith("https://")) window.open(val, "_blank");
  };

  const renderPropertyText = (property, value) => {
    if (!value || property === "releaseNote") return null;

    let text = getPropertyText(property);
    const label = getPropertyLabel(property);
    const isUrl =
      value.startsWith &&
      (value.startsWith("http://") || value.startsWith("https://"));

    // Pour le backport, inclure la version dans le texte
    if (property === "backported") {
      text = `${value}`;
    }

    const className = `${styles.propertyTag} ${
      isUrl ? styles.propertyTagClickable : styles.propertyTagDefault
    } ${property === "ticket" ? styles.simpliciteTeamViz : ""}`;

    return (
      <span
        key={property}
        title={`${label}: ${value}`}
        onClick={() => handlePropertyClick(value)}
        className={className}
      >
        {text}
      </span>
    );
  };

  const renderPortalLink = () => {
    if (!showPortalLink) return null;

    return (
      <span
        key="portal"
        title={`Voir dans le portal: ${item.prdChgCode}`}
        onClick={() => window.open(portalUrl, "_blank")}
        className={`${styles.propertyTag} ${styles.propertyTagClickable} ${styles.simpliciteTeamViz}`}
      >
        Portal
      </span>
    );
  };

  return (
    <div
      className={`${styles.featureCard} ${
        hasReleaseNote ? styles.featureCardClickable : ""
      }`}
      onClick={handleCardClick}
    >
      {/* Bouton Release Note si présent */}
      {hasReleaseNote && (
        <div
          className={styles.releaseNotePastille}
          title={`Voir les release notes: ${item.prdChgCode}`}
        >
          Release Note
        </div>
      )}

      {/* Titre : Emoji + Nom */}
      <div className={styles.cardTitle}>
        <span>{item.prdChgEmoji}</span>
        <span>{item.prdChgName}</span>
      </div>

      {/* Propriétés - seulement si au moins une existe */}
      {(item.prdChgReleaseNote ||
        item.prdChgBackportVrsId__prdVrsNumber ||
        item.prdChgOrigin ||
        item.prdChgTicket) && (
        <div className={styles.cardProperties}>
          {renderPropertyText(
            "backported",
            item.prdChgBackportVrsId__prdVrsNumber
          )}
          {renderPropertyText("origin", item.prdChgOrigin)}
          {renderPropertyText("ticket", item.prdChgTicket)}
          {renderPortalLink()}
        </div>
      )}
    </div>
  );
};
