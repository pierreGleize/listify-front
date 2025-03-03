import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/commun/CrossToClose.module.css";

interface CrossToCloseProps {
  action: () => void;
  fontSize: string;
}

const CrossToClose: React.FC<CrossToCloseProps> = ({ action, fontSize }) => {
  return (
    <FontAwesomeIcon
      icon={faXmark}
      style={{ fontSize }}
      className={styles.icon}
      onClick={(e) => {
        e.stopPropagation();
        action();
      }}
    />
  );
};

export default CrossToClose;
