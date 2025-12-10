import React from "react";
import styles from "./NavBar.module.css";

interface NavBarProps {
  currentView: string;
  onNavigationChange: (nav: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentView, onNavigationChange }) => {
  return (
    <nav className={styles.navBar}>
      <div className={styles.navBarContent}>
        <h1>Budget Tracker</h1>
        <div className={styles.navItems}>
          <p
            className={`${styles.navItem} ${
              currentView === "Expenses" ? styles.navItemActive : ""
            }`}
            onClick={() => onNavigationChange("Expenses")}
          >
            Expenses
          </p>
          <p
            className={`${styles.navItem} ${
              currentView === "Categories" ? styles.navItemActive : ""
            }`}
            onClick={() => onNavigationChange("Categories")}
          >
            Categories
          </p>
          <p
            className={`${styles.navItem} ${
              currentView === "Analysis" ? styles.navItemActive : ""
            }`}
            onClick={() => onNavigationChange("Analysis")}
          >
            Analysis
          </p>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
