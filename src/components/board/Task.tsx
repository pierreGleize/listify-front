"use client";
import React, { useState } from "react";
import styles from "../../styles/board/Task.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Draggable } from "@hello-pangea/dnd";
import TaskModal from "./taskModal";
import { User } from "@/app/redux/slices/boardSlice";
import TaskDate from "../commun/TaskDate";
import { Popover, Avatar } from "antd";
import Members from "../commun/Members";

interface TaskProps {
  columnId: string;
  taskId: string;
  name: string;
  index: number;
  members: User[];
  createdAt: Date;
  description: string;
  deadline: Date | null;
  startDate: Date | null;
  selectedStartDay: boolean;
  selectedDeadline: boolean;
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
  startDate,
  selectedStartDay,
  selectedDeadline,
}) => {
  const [openTaskModal, setOpenTaskModal] = useState(false);

  const closeModal = () => {
    setOpenTaskModal(false);
  };

  const collaborators =
    members.length > 0 &&
    members.map((user, i) => {
      const initialLetters =
        user.firstname.charAt(0).toUpperCase() +
        user.lastname.charAt(0).toUpperCase();

      return (
        <Members
          key={i}
          initialLetters={initialLetters}
          size="small"
          color="red"
          popHoverName={`${user.firstname} ${user.lastname}`}
        />
      );
    });

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
              <TaskDate
                isEditable={false}
                startDate={startDate}
                selectedStartDay={selectedStartDay}
                selectedDeadline={selectedDeadline}
                deadline={deadline}
              />
              {description && (
                <Popover
                  color="#282e33"
                  placement="right"
                  content={
                    <p className="popHoverContainer">
                      Contient une description
                    </p>
                  }
                >
                  <FontAwesomeIcon icon={faBars} style={{ color: "#ffffff" }} />
                </Popover>
              )}
            </div>
            {collaborators && (
              <Avatar.Group
                size="small"
                max={{
                  count: 3,
                  style: { color: "#45505A", backgroundColor: "#e3e6e9" },
                }}
              >
                {collaborators}
              </Avatar.Group>
            )}
            <TaskModal
              closeModal={closeModal}
              isOpen={openTaskModal}
              name={name}
              members={members}
              deadline={deadline}
              description={description}
              taskId={taskId}
              columnId={columnId}
              startDate={startDate}
              selectedStartDay={selectedStartDay}
              selectedDeadline={selectedDeadline}
              createdAt={createdAt}
            />
          </div>
        );
      }}
    </Draggable>
  );
};

export default Task;
