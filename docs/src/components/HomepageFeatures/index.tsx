import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import { TypedDateInput } from "react-typed-date";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

type FeatureItem = {
  title: string;
  description: React.ReactNode;
  code?: string;
};

function Feature({ title, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4", styles.feature)}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <div className={styles.featureContent}>{description}</div>
      </div>
    </div>
  );
}

const Popover = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const popoverRef = useRef(null);
  const triggerRef = useRef(null);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={triggerRef}
        onClick={toggleVisibility}
        className={styles.popoverTrigger}
        aria-haspopup="true"
        aria-expanded={isVisible}
        aria-controls="popover-content"
      >
        {children}
      </button>
      {isVisible && (
        <div
          id="popover-content"
          ref={popoverRef}
          role="dialog"
          aria-modal="true"
          className={styles.popoverContent}
        >
          {content}
        </div>
      )}
    </div>
  );
};

function ReactDayPickerPopover({ date, setDate }): React.ReactNode {
  return (
    <Popover
      content={<DayPicker mode="single" selected={date} onSelect={setDate} />}
    >
      📆
    </Popover>
  );
}

export default function HomepageFeatures(): React.ReactNode {
  const [date, setDate] = useState(new Date());
  const [dateTime, setDateTime] = useState(new Date());
  const [dateTimeSeconds, setDateTimeSeconds] = useState(new Date());

  const FeatureList: FeatureItem[] = [
    {
      title: "Native (No Styling)",
      description: (
        <TypedDateInput
          id="date-no-styling"
          value={date}
          onChange={setDate}
          className="unstyled-input"
        />
      ),
    },
    {
      title: "Custom CSS",
      description: (
        <TypedDateInput
          id="date-custom-css"
          value={date}
          onChange={setDate}
          className={styles.dateCustomCss}
        />
      ),
    },
    {
      title: "Tailwind CSS",
      description: (
        <TypedDateInput
          id="date-tailwind"
          value={date}
          onChange={setDate}
          className="px-2 py-2 border border-gray-300 rounded-md w-40 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      ),
    },
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>

        <div className={styles.divider}>
          <Heading as="h3" className={styles.sectionTitle}>
            Time Support
          </Heading>
          <TypedDateInput
            format="MM/DD/YYYY HH:mm:ss"
            value={dateTimeSeconds}
            onChange={setDateTimeSeconds}
            className={styles.dateCustomCss}
          />
        </div>

        <div className={styles.divider}>
          <Heading as="h2" className={styles.sectionTitle}>
            Integration Examples
          </Heading>
          <p className={styles.sectionDescription}>
            Use TypedDateInput in combination with other libraries which
            implement a calendar picker
          </p>
        </div>

        <div className={clsx("row", styles.centeredRow)}>
          <div className={clsx("col col--10", styles.centeredFeature)}>
            <Feature
              title="+ React Day Picker"
              description={
                <div className={styles.dayPickerExample}>
                  <TypedDateInput
                    value={date}
                    onChange={setDate}
                    className={styles.dateInput}
                  />
                  <ReactDayPickerPopover date={date} setDate={setDate} />
                </div>
              }
            />
          </div>
        </div>
        <div style={{ height: "350px" }} />
      </div>
    </section>
  );
}
