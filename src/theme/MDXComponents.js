import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the FontAwesomeIcon component.
import { library } from '@fortawesome/fontawesome-svg-core'; // Import the library component.
import { fab } from '@fortawesome/free-brands-svg-icons'; // Import all brands icons.
import { fas } from '@fortawesome/free-solid-svg-icons'; // Import all solid icons.
import PlatformBlock from '@site/src/components/PlatformBlock';
import PlatformResources from '@site/src/components/PlatformResources';

library.add(fab, fas); // Add all icons to the library so you can use them without importing them individually.

export default {
  // Re-use the default mapping
  ...MDXComponents,
  FontAwesomeIcon: FontAwesomeIcon, // Make the FontAwesomeIcon component available in MDX as <icon />.
  // Map custom components
  PlatformResources: PlatformResources,
  PlatformBlock: PlatformBlock, // simplify the platform block creation rather than having it in "create_markdown.py" ...
};