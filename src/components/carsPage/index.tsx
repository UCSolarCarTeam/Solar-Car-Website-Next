import { memo, useCallback, useEffect, useMemo, useState } from "react";

import PageBullets from "@/components/Pagebullets";
import CarScreenView from "@/components/carsPage/CarScreenView";
import styles from "@/components/carsPage/index.module.scss";

const CarsPage = () => {
  const pageIds = useMemo(
    () => ({
      // eslint-disable-next-line sort-keys/sort-keys-fix, sort-keys
      Helios: {
        content: `Schulich Helios, the current project in the making by the University
        of Calgary Solar Car Team, embodies the future of renewable automotive
        technology. This vehicle, capable of theoretically reaching speeds of
        110 km/h, represents the culmination of our intensified
        efforts. Racing with four passengers to maximize points, the team aims
        for excellence at the Formula Sun Grand Prix in the summer of 2025,
        showcasing the incredible potential of solar-powered vehicles. Be sure
        to stay updated with any new developments!`,
        image: "/assets/cars/backsplash1.jpeg",
        title: "Schulich Helios",
      },
      // eslint-disable-next-line sort-keys/sort-keys-fix, sort-keys
      Elysia: {
        content: `Schulich Elysia started it’s design phase in 2016 and this catamaran
        style cruise car was completed in 2019. This design was implemented to
        improve battery cooling as well as increase aerodynamics. The Elysia
        raced in the 2019 American Solar Challenge where it took first place
        in the Multi Occupant Vehicle Class.`,
        image: "/assets/cars/backsplash2.jpeg",
        title: "Schulich Elysia",
      },
      // eslint-disable-next-line sort-keys/sort-keys-fix, sort-keys
      Delta: {
        content: `The Schulich Delta, Canada's first cruiser-class solar car, was built
      by the University of Calgary Solar Car Team from 2012 to 2015. It
      raced in the 2013 Bridgestone World Solar Challenge, finishing 8th,
      and competed in the 2015 Formula Sun Grand Prix, completing 84 laps
      with a fastest lap of 5:33.886 to finish 9th. Officially retired in
      2015, the Delta continues to inspire through educational
      demonstrations.`,
        image: "/assets/cars/backsplash3.jpeg",
        title: "Schulich Delta",
      },
      // eslint-disable-next-line sort-keys/sort-keys-fix, sort-keys
      Axiom: {
        content: `Schulich Axiom was the University of Calgary Solar Car Team's last
        Challenger class car. In 2010, it finished 6th at the Formula Sun
        Grand Prix (418.2 miles covered) and 6th again in the American Solar
        Challenge (Broken Arrow, OK to Naperville, IL) with a time of
        33:35.26, placing as the top Canadian team in both races. In 2011,
        Axiom competed in the World Solar Challenge from Darwin to Adelaide,
        covering 1,840 km and finishing 18th before being retired.`,
        image: "/assets/cars/backsplash4.jpeg",
        title: "Schulich Axiom",
      },
      // eslint-disable-next-line sort-keys/sort-keys-fix, sort-keys
      "Schulich 1": {
        content: `The Schulich I debuted at the 2007 Panasonic World Solar Challenge,
        finishing 8th and completing 2999 km in 51 hr, 43 min as the top
        Canadian team. It later competed in the 2008 North American Solar
        Challenge, finishing 6th—a record for the University of Calgary Solar
        Car Team—completing the race in 75:42.53. As the team’s second car, it
        introduced gallium arsenide solar cells, replacing the silicon cells
        used in its predecessor.`,
        image: "/assets/cars/backsplash5.jpeg",
        title: "Schulich 1",
      },
      // eslint-disable-next-line sort-keys/sort-keys-fix, sort-keys
      Solean: {
        content: `Schulich Elysia started it’s design phase in 2016 and this catamaran
        style cruise car was completed in 2019. This design was implemented to
        improve battery cooling as well as increase aerodynamics. The Elysia
        raced in the 2019 American Solar Challenge where it took first place
        in the Multi Occupant Vehicle Class.`,
        image: "/assets/cars/backsplash6.jpeg",
        title: "Schulich Solean",
      },
    }),
    [],
  );

  const [currentElement, setCurrentElement] = useState("Helios"); // Track the current page id attribute

  const handleDotClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (
            entry.target.id === "__next" ||
            entry.target.id === "__next-build-watcher" ||
            entry.target.id === "locatorjs-wrapper" ||
            entry.target.id === "clerk-components"
          ) {
            setCurrentElement("Helios");
          } else {
            setCurrentElement(entry.target.id);
          }
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // Trigger when 50% of the element is visible
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    const elements = document.querySelectorAll("[id]"); // Select all elements with an `id`
    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  return (
    <div className={styles.snapContainer}>
      <PageBullets
        currentId={currentElement}
        handleDotClick={handleDotClick}
        pageIds={Object.keys(pageIds)}
      />
      {Object.entries(pageIds).map(([id, value], index) => (
        <CarScreenView
          className={styles.snapItem}
          content={value.content}
          id={id}
          image={value.image}
          key={id}
          navbarEnabled={index === 0}
          title={value.title}
        />
      ))}
    </div>
  );
};

export default memo(CarsPage);
