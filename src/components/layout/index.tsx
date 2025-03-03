"use client";
import React, { useState } from "react";
import styles from "../../styles/layout/HomeLayout.module.css";
import Header from "./Header";
import Sidebar from "./Sidebar";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toogleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className={styles.container}>
      <Header />
      <Sidebar toogleSidebar={toogleSidebar} isSidebarOpen={isSidebarOpen} />

      <div
        className={styles.main}
        style={{
          marginLeft: isSidebarOpen ? "250px" : "0px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default HomeLayout;
