import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Link from '@docusaurus/Link';
import Heading from "@theme/Heading";
import styles from "./index.module.css";

// Import SVGs from your svg directory
import TutorialIcon from '@site/static/img/tutorial.svg';
import DocsIcon from '@site/static/img/docs.svg';
import ReleasesIcon from '@site/static/img/releases.svg';
import ForumIcon from '@site/static/img/forum.svg';
import GithubIcon from '@site/static/img/github.svg';
import TrialIcon from '@site/static/img/trial.svg';

// Replace the Icons object with your imported SVGs
const Icons = {
  tutorial: <TutorialIcon className={styles.icon} />,
  docs: <DocsIcon className={styles.icon} />,
  releases: <ReleasesIcon className={styles.icon} />,
  forum: <ForumIcon className={styles.icon} />,
  github: <GithubIcon className={styles.icon} />,
  trial: <TrialIcon className={styles.icon} />
};

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

function DocSection({ title, description, link, icon }) {
  return (
    <div className={styles.docSection}>
      <Link to={link} className={styles.docLink}>
        <div className={styles.docHeader}>
          <span className={styles.docIcon}>{icon}</span>
          <h3>{title}</h3>
        </div>
        <p>{description}</p>
      </Link>
    </div>
  );
}

function ResourceLink({ title, description, href, icon }) {
  return (
    <a href={href} target="_blank" className={styles.resourceLink}>
      <div className={styles.resourceHeader}>
        <span className={styles.resourceIcon}>{icon}</span>
        <h4>{title}</h4>
      </div>
      <p>{description}</p>
    </a>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Documentation for Simplicité Platform"
    >
      
      <main className={styles.mainContent}>
        <div className="container">
          {/* Introduction */}
          <section className={styles.intro}>
            <h2>Welcome to Simplicité Documentation</h2>
            <p>
              Simplicité is a low-code platform that empowers developers to build enterprise applications.
              Get started with our comprehensive documentation, tutorials, and resources.
            </p>
          </section>

          {/* Main Documentation Sections */}
          <div className={styles.docGrid}>
            <DocSection
              title="Getting Started"
              description="New to Simplicité? Start here with our step-by-step tutorial."
              link="./docs/category/1-getting-started"
              icon={Icons.tutorial}
            />
            <DocSection
              title="Documentation"
              description="Detailed technical documentation and configuration guides."
              link="./docs/category/simplicité-configuration-objects"
              icon={Icons.docs}
            />
            <DocSection
              title="Release Notes"
              description="Latest updates, changes, and improvements."
              link="./docs/category/release-notes"
              icon={Icons.releases}
            />
          </div>

          {/* Additional Resources */}
          <section className={styles.resources}>
            <h2>Additional Resources</h2>
            <div className={styles.resourceGrid}>
              <ResourceLink
                title="Community Forum"
                description="Get help from the Simplicité community"
                href="https://community.simplicite.io"
                icon={Icons.forum}
              />
              <ResourceLink
                title="GitHub"
                description="Access example projects and implementations"
                href="https://github.com/simplicitesoftware/"
                icon={Icons.github}
              />
              <ResourceLink
                title="Get Trial Access"
                description="Try Simplicité with a one-month trial instance"
                href="https://simplicitesoftware.com/contact/"
                icon={Icons.trial}
              />
            </div>
          </section>

          {/* Professional Training */}
          <section className={styles.training}>
            <h2>Professional Training</h2>
            <p>
              Enhance your Simplicité expertise with our professional training programs 
              and certification paths. From beginner to advanced levels, we offer 
              guided training sessions and certification programs.
            </p>
            <Link to="https://www.simplicite.fr/contact" target="_blank" className={styles.trainingLink}>
              Learn more about training →
            </Link>
          </section>
        </div>
      </main>
    </Layout>
  );
}
