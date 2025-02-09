import React from "react";
import styles from "../../styles/mapped/Task.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faBars } from "@fortawesome/free-solid-svg-icons";

interface TaskProps {
  name: string;
  id: string;
}

const Task: React.FC<TaskProps> = ({ name, id }) => {
  return (
    <div className={styles.container}>
      <span>{name}</span>
      <div className={styles.tasks}>
        <div className={styles["date-container"]}>
          <FontAwesomeIcon icon={faCalendar} style={{ color: "black" }} />
          <span>11/01/2025</span>
          <span>-</span>
          <span>11/18/2025</span>
        </div>
        <FontAwesomeIcon icon={faBars} style={{ color: "#ffffff" }} />
        <span>{id}</span>
      </div>
    </div>
  );
};

export default Task;
