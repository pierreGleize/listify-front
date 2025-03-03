import React from "react";
import styles from "../../../styles/board/taskModal/SectionTitle.module.css";

interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ icon, title }) => {
  return (
    <div className={styles.sectionTitle}>
      {icon} {title}
    </div>
  );
};

export default SectionTitle;
