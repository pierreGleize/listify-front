"use client";
import React, { useState } from "react";
import styles from "../../styles/commun/BtnTask.module.css";
interface BtnTaskProps {
  color: string;
  bgColor: string;
  bgColorHover: string;
  action?: () => void | Promise<void>;
  text: string;
  width?: string;
}

const BtnTask: React.FC<BtnTaskProps> = ({
  color,
  bgColor,
  bgColorHover,
  text,
  action,
  width = "auto",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      className={styles.btnContainer}
      style={{
        color,
        backgroundColor: isHovered ? bgColorHover : bgColor,
        width,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={action}
    >
      {text}
    </button>
  );
};

export default BtnTask;
