import React from "react";
import styles from "../../styles/mapped/Members.module.css";

interface MembersProps {
  initialLetters: string;
}

const Members: React.FC<MembersProps> = ({ initialLetters }) => {
  return <span className={styles.member}>{initialLetters}</span>;
};

export default Members;
