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

    data.lines.forEach((version) => {
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
        ? data.lines[data.lines.length - 1] === version
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
            {data.lines.map((version, idx) => (
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
              {data.lines.map((version, versionIndex) => (
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
  const portalUrl = `https://portal.simplicite.fr?f=PrdChange%3B${item.row_id}`;

  const getPropertyTitle = (prop,value) => getPropertyText(prop,null)+ " : "+value;

  const getPropertyText = (prop,value) => {
    const textMap = {
      backported: "Backported until ",
      origin: "Origin",
      ticket: "R&D",
      portal: "Portal"
    };
    
    return prop=="backported" && value!=null ? value : textMap[prop];
  };

  const handleCardClick = () => {
    if (hasReleaseNote) {
      window.open(item.prdChgReleaseNote, "_blank");
    }
  };

  const renderProperty = (property, value) => {
    if (!value || property === "releaseNote") return null;

    let text = getPropertyText(property,value);
    const title = getPropertyTitle(property,value);
    const isUrl = value.startsWith && (value.startsWith("http://") || value.startsWith("https://"));
    const Tag = isUrl ? 'a' : 'span';

    const className = `${styles.propertyTag} ${property=="ticket" || property=="portal" ? styles.simpliciteTeamViz : ""}`;

    return (
      <Tag
        key={property}
        title={title}
        href={isUrl ? value : undefined}
        onClick={isUrl ? (e=>e.stopPropagation()) : undefined}
        target={isUrl ? "_blank" : undefined}
        className={className}
      >
        {text}
      </Tag>
    );
  };

  return (
    <div
      className={`${styles.featureCard} ${
        hasReleaseNote ? styles.featureCardClickable : ""
      }`}
    >
      {/* Bouton Release Note si présent */}
      {hasReleaseNote && (
        <a
          className={styles.releaseNotePastille}
          title={`Voir les release notes: ${item.prdChgCode}`}
          href={item.prdChgReleaseNote}
          target="_blank"
        >
          Release Note
        </a>
      )}

      {/* Titre : Emoji + Nom */}
      <div className={styles.cardTitle}>
        <span>{item.prdChgEmoji}</span>
        <span>{item.prdChgName}</span>
      </div>

      {/* Propriétés - seulement si au moins une existe */}
      {/*(item.prdChgReleaseNote ||
        item.prdChgBackportVrsId__prdVrsNumber ||
        item.prdChgOrigin ||
        item.prdChgTicket) &&*/ (
        <div className={styles.cardProperties}>
          {renderProperty("backported",item.prdChgBackportVrsId__prdVrsNumber)}
          {renderProperty("origin", item.prdChgOrigin)}
          {renderProperty("ticket", item.prdChgTicket)}
          {renderProperty("portal", portalUrl)}
        </div>
      )}
    </div>
  );
};
