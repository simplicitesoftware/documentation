import React from "react";
// Import the original mapper
import MDXComponents from "@theme-original/MDXComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the FontAwesomeIcon component.
import { library } from "@fortawesome/fontawesome-svg-core"; // Import the library component.
import { fab } from "@fortawesome/free-brands-svg-icons"; // Import all brands icons.
import { fas } from "@fortawesome/free-solid-svg-icons"; // Import all solid icons.
import VersionsTable from "@site/src/components/VersionsTable";
import PlatformBlock from "@site/src/components/PlatformBlock";
import Roadmap from "@site/src/components/Roadmap";

library.add(fab, fas); // Add all icons to the library so you can use them without importing them individually.

export default {
  // Re-use the default mapping
  ...MDXComponents,
  FontAwesomeIcon: FontAwesomeIcon, // Make the FontAwesomeIcon component available in MDX as <icon />.
  // Map custom components
  PlatformBlock: PlatformBlock,
  VersionsTable: VersionsTable,
  Roadmap: Roadmap,
};
