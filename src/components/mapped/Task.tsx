import React from "react";
import styles from "../../styles/mapped/Task.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faBars } from "@fortawesome/free-solid-svg-icons";
import { Draggable } from "@hello-pangea/dnd";

interface TaskProps {
  name: string;
  id: string;
  index: number;
}

const Task: React.FC<TaskProps> = ({ name, id, index }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            className={styles.container}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              border: snapshot.isDragging ? "2px solid white" : "",
              zIndex: snapshot.isDragging ? 1000 : 10,
              ...provided.draggableProps.style,
            }}
          >
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
      }}
    </Draggable>
  );
};

export default Task;
