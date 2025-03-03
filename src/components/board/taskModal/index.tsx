"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "../../../styles/board/taskModal/index.module.css";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import {
  User,
  updateDate,
  deleteTask,
  removeDate,
} from "@/app/redux/slices/boardSlice";
import { useAppDispatch } from "@/app/redux/store";
import ModalTitle from "./ModalTitle";
import ModalMembers from "./ModalMembers";
import ModalDate from "./ModalDate";
import ModalDescription from "./ModalDescription";
import ModalActions from "./ModalActions";
import BtnTaskIcon from "@/components/commun/BtnTaskIcon";

interface TaskModalProps {
  columnId: string;
  taskId: string;
  closeModal: () => void;
  isOpen: boolean;
  name: string;
  members: User[];
  description: string;
  deadline: Date | null;
  startDate: Date | null;
  selectedStartDay: boolean;
  selectedDeadline: boolean;
  createdAt: Date;
}

const TaskModal: React.FC<TaskModalProps> = ({
  taskId,
  columnId,
  closeModal,
  isOpen,
  name,
  members,
  description,
  deadline,
  startDate,
  createdAt,
  selectedStartDay,
  selectedDeadline,
}) => {
  const [dateLimit, setDateLimit] = useState(
    deadline ? new Date(deadline) : null
  );

  const [dateStart, setDateStart] = useState(
    startDate ? new Date(startDate) : null
  );

  const [openPopupActionDate, setOpenPopupActionDate] = useState(false);
  const [openPopupDate, setOpenPopupDate] = useState(false);

  const modalRef = useRef<HTMLInputElement | null>(null);
  const popupDateRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !(modalRef.current as HTMLDivElement).contains(event.target as Node) &&
        popupDateRef &&
        !popupDateRef.current?.contains(event.target as Node)
      ) {
        closeModal();
        setOpenPopupActionDate(false);
        setOpenPopupDate(false);
      }
    };

    const handlePressEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
        setOpenPopupActionDate(false);
        setOpenPopupDate(false);
      }
    };
    document.addEventListener("keydown", handlePressEscape);

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handlePressEscape);
    };
  }, [closeModal]);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       // modalRef.current &&
  //       // !(modalRef.current as HTMLDivElement).contains(event.target as Node) &&
  //       //
  //       popupDateRef &&
  //       !popupDateRef.current?.contains(event.target as Node)
  //     ) {
  //       setOpenPopupActionDate(false);
  //       setOpenPopupDate(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [openPopupDate, openPopupActionDate]);

  const handleUpdateDate = async (
    startDaySelected: Date | null,
    deadlineSelected: Date | null,
    isStartDayChecked: boolean,
    isDeadlineChecked: boolean
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACKEND}/tasks/updateDate`,
        {
          method: "PATCH",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            deadlineSelected,
            startDaySelected,
            isDeadlineChecked,
            isStartDayChecked,
            taskId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (data.result) {
        dispatch(
          updateDate({
            deadline: data.deadline,
            startDate: data.startDate,
            selectedStartDay: data.selectedStartDay,
            selectedDeadline: data.selectedDeadline,
            columnId,
            taskId: data.taskId,
          })
        );
        setOpenPopupActionDate(false);
        setOpenPopupDate(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACKEND}/tasks/deleteTask`,
        {
          method: "DELETE",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ taskId, columnId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }
      if (data.result) {
        dispatch(deleteTask({ columnId, taskId }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveDate = async (): Promise<void> => {
    if (!columnId && !taskId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACKEND}/tasks/removeDate`,
        {
          method: "PATCH",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ taskId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }
      if (data.result) {
        dispatch(removeDate({ columnId, taskId: data.taskId }));
        setOpenPopupDate(false);
        setOpenPopupActionDate(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    isOpen &&
    ReactDOM.createPortal(
      <>
        <div className={styles.overlay}></div>
        <div ref={modalRef} className={styles.modalContainer}>
          <div className={styles.modalEnglobe}>
            <div className={styles.top}>
              <ModalTitle
                name={name}
                taskId={taskId}
                columnId={columnId}
                closeModal={closeModal}
              />
            </div>
            <div className={styles.main}>
              <div className={styles.left}>
                <ModalMembers members={members} />
                <ModalDate
                  createdAt={createdAt}
                  dateLimit={dateLimit}
                  setDateLimit={setDateLimit}
                  handleUpdateDate={handleUpdateDate}
                  popupDateRef={popupDateRef}
                  openPopupDate={openPopupDate}
                  setOpenPopupDate={setOpenPopupDate}
                  dateStart={dateStart}
                  setDateStart={setDateStart}
                  selectedStartDay={selectedStartDay}
                  selectedDeadline={selectedDeadline}
                  startDate={startDate}
                  deadline={deadline}
                  handleRemoveDate={handleRemoveDate}
                />
                <ModalDescription
                  description={description}
                  taskId={taskId}
                  columnId={columnId}
                />
              </div>
              <div className={styles.right}>
                <ModalActions
                  members={members}
                  taskId={taskId}
                  columnId={columnId}
                  dateLimit={dateLimit}
                  setDateLimit={setDateLimit}
                  handleUpdateDate={handleUpdateDate}
                  createdAt={createdAt}
                  popupDateRef={popupDateRef}
                  openPopupActionDate={openPopupActionDate}
                  setOpenPopupActionDate={setOpenPopupActionDate}
                  setOpenPopupDate={setOpenPopupDate}
                  dateStart={dateStart}
                  setDateStart={setDateStart}
                  selectedStartDay={selectedStartDay}
                  selectedDeadline={selectedDeadline}
                  handleRemoveDate={handleRemoveDate}
                />
              </div>
            </div>
          </div>

          <div className={styles.bottom}>
            <BtnTaskIcon
              title="Supprimer la tâche"
              icon={
                <FontAwesomeIcon
                  icon={faTrashCan}
                  style={{ color: "red" }}
                  className={styles.icon}
                />
              }
              action={handleDeleteTask}
              width="auto"
            />
            {/* <div className={styles.btnIcon} onClick={handleDeleteTask}>
             {" "}
              Supprimer la tâche
            </div> */}
          </div>
        </div>
      </>,
      document.body
    )
  );
};

export default TaskModal;
