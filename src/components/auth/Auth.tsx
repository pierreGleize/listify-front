"use client";
import Image from "next/image";
import React, { useState } from "react";
import styles from "../../styles//auth/Auth.module.css";
import Login from "@/components/auth/Login";
import Signup from "@/components/auth/Signup";

const Auth = () => {
  const [activeSection, setActiveSection] = useState("login");

  const handleSection = (name: string) => {
    setActiveSection(name);
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Listify</h1>
      <Image
        width={500}
        height={500}
        src="/auth2.png"
        alt="Image de présentation"
        className={styles.image}
      />
      <div className={styles.authContainer}>
        {activeSection === "login" ? (
          <Login handleSection={handleSection} />
        ) : (
          <Signup handleSection={handleSection} />
        )}
      </div>
    </div>
  );
};

export default Auth;
