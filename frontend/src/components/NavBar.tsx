import React, { useState } from "react";
import styles from "./NavBar.module.css";

interface NavBarProps {
  onNavigationChange?: (nav: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ onNavigationChange }) => {
  const [navigation, setNavigation] = useState<string>("Expenses");

  const handleNavClick = (nav: string) => {
    setNavigation(nav);
    onNavigationChange?.(nav);
  };

  return (
    <nav className={styles.navBar}>
      <div className={styles.navBarContent}>
        <h1>Budget Tracker</h1>
        <div className={styles.navItems}>
          <p
            className={styles.navItem}
            onClick={() => handleNavClick("Expenses")}
          >
            Expenses
          </p>
          <p
            className={styles.navItem}
            onClick={() => handleNavClick("Categories")}
          >
            Categories
          </p>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
