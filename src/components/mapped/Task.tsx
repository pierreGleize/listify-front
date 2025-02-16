"use client";
import React, { useState } from "react";
import styles from "../../styles/mapped/Task.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faBars } from "@fortawesome/free-solid-svg-icons";
import { Draggable } from "@hello-pangea/dnd";
import TaskModal from "../board/TaskModal";
import { User } from "@/app/redux/slices/boardSlice";
import moment from "moment";

interface TaskProps {
  columnId: string;
  taskId: string;
  name: string;
  index: number;
  members: User[];
  createdAt: Date;
  description: string;
  deadline: Date;
}

const Task: React.FC<TaskProps> = ({
  columnId,
  taskId,
  name,
  index,
  members,
  createdAt,
  description,
  deadline,
}) => {
  const [openTaskModal, setOpenTaskModal] = useState(false);

  // console.log(openTaskModal);

  const closeModal = () => {
    setOpenTaskModal(false);
  };

  const dateCreationTask = moment(createdAt)
    .format("DD MM YYYY")
    .replaceAll(" ", "/");

  const dateLimiteTask =
    deadline && moment(deadline).format("DD MM YYYY").replaceAll(" ", "/");

  return (
    <Draggable draggableId={taskId} index={index}>
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
            onClick={() => setOpenTaskModal(true)}
          >
            <span>{name}</span>
            <div className={styles.tasks}>
              <div className={styles["date-container"]}>
                <FontAwesomeIcon icon={faCalendar} style={{ color: "black" }} />
                <span>{dateCreationTask}</span>
                <span>-</span>
                <span>{dateLimiteTask}</span>
              </div>
              <FontAwesomeIcon icon={faBars} style={{ color: "#ffffff" }} />
              <span>{taskId}</span>
            </div>

            <TaskModal
              closeModal={closeModal}
              isOpen={openTaskModal}
              name={name}
              members={members}
              dateCreation={dateCreationTask}
              description={description}
              deadline={dateLimiteTask}
              taskId={taskId}
              columnId={columnId}
            />
          </div>
        );
      }}
    </Draggable>
  );
};

export default Task;
