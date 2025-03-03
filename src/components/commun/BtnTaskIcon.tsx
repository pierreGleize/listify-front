import React from "react";
import styles from "../../styles/commun/BtnTaskIcon.module.css";

interface BtnTaskIcon {
  title: string;
  icon: React.ReactNode;
  action?: () => void | Promise<void>;
  width?: string;
}

const BtnTaskIcon: React.FC<BtnTaskIcon> = ({
  title,
  icon,
  action,
  width = "auto",
}) => {
  return (
    <div
      className={styles.btnIcon}
      onClick={() => action && action()}
      style={{ width }}
    >
      {icon}
      {title}
    </div>
  );
};

export default BtnTaskIcon;
