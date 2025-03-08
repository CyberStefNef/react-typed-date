import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs">
            Get Started
          </Link>
          <Link
            className="button button--outline button--lg button--secondary"
            to="https://github.com/CyberStefNef/react-typed-date"
            style={{ marginLeft: "1rem" }}
          >
            GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Home | ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <div className={styles.introduction}>
          <div className="container">
            <div className="row">
              <div className="col col--8 col--offset-2">
                <Heading as="h2" className={styles.sectionHeading}>
                  A Better Way to Handle Dates
                </Heading>
                <p className={styles.sectionDescription}>
                  TypedDateInput provides a strongly-typed, customizable date
                  input component for React applications. It's easy to
                  integrate, style, and extend for your specific needs.
                </p>
              </div>
            </div>
          </div>
        </div>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
