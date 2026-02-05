import React, { useState } from "react";
import styles from "./SettingsLayout.module.css";
import PersonalInfo from "../../../components/Settings/UserSettings/PersonalInfo";
import SocialLinksPage from "../../../components/Settings/UserSettings/SocialLinksPage";
import LoginDetails from "../../../components/Settings/UserSettings/LoginDetailsPage";
import SideBar from "../../../components/SideBar/SideBar";
import NavBar from "../../../components/NavBar/NavBar";


function USettings() {
  const [activeTab, setActiveTab] = useState("personalInfo");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  
  return (
    <div className={styles.layout}>
      {/* NavBar with hamburger */}
      <NavBar>
    
      </NavBar>

      <div className={styles.mainSection}>
        {/* Sidebar toggled on mobile */}
        <SideBar
          className={isSidebarOpen ? "MobileSidebarOpen" : ""}
          closeSidebar={() => setIsSidebarOpen(false)}
        />

        <div className={styles.settingsContainer}>
          <header className={styles.header}>
            <h1 className={styles.title}>Settings</h1>
          </header>

          <section className={styles.section}>
            <div className={styles.personalInfoHeader}>
              <span
                className={`${styles.navLink} ${
                  activeTab === "personalInfo" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("personalInfo")}
              >
                Personal Information
              </span>
              <span
                className={`${styles.navLink} ${
                  activeTab === "socialLinks" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("socialLinks")}
              >
                Social Links
              </span>
              <span
                className={`${styles.navLink} ${
                  activeTab === "team" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("team")}
              >
                Login Details
              </span>
            </div>
          </section>

          <div className={styles.divider} />

          {activeTab === "personalInfo" && <PersonalInfo />}
          {activeTab === "socialLinks" && <SocialLinksPage />}
          {activeTab === "team" && <LoginDetails />}
        </div>
      </div>

      {/* Optional overlay for closing sidebar on mobile */}
      {isSidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default USettings;
