"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles/board/TaskModal.module.css";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faTrashCan,
  faListCheck,
  faClock,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  UserAddOutlined,
  // UserDeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { renameTask, User, joinTask } from "@/app/redux/slices/boardSlice";
import Members from "../mapped/Members";
import { useAppSelector, useAppDispatch, RootState } from "@/app/redux/store";

interface TaskModalProps {
  columnId: string;
  taskId: string;
  closeModal: () => void;
  isOpen: boolean;
  name: string;
  members: User[];
  description: string;
  dateCreation: string;
  deadline: string;
}
const TaskModal: React.FC<TaskModalProps> = ({
  taskId,
  columnId,
  closeModal,
  isOpen,
  name,
  members,
  // description,
  dateCreation,
  deadline,
}) => {
  const [isInputTitleActive, setIsInputTitleActive] = useState(false);
  const [inputTitle, setInputTitle] = useState(name || "");
  const [inputTitleError, setInputTitleError] = useState(false);
  const modalRef = useRef<HTMLInputElement | null>(null);
  const inputTitleRef = useRef(null);

  // const boards = useAppSelector((state) => state.board);
  const user = useAppSelector((state: RootState) => state.user);

  console.log(isOpen);

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
        !(modalRef.current as HTMLDivElement).contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    const handlePressEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    document.addEventListener("keydown", handlePressEscape);

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handlePressEscape);
    };
  }, [closeModal]);

  useEffect(() => {
    if (inputTitleRef.current && isInputTitleActive) {
      (inputTitleRef.current as HTMLInputElement).focus();
    }
  }, [isInputTitleActive]);

  const handleRenameTask = async () => {
    if (!inputTitle) {
      setInputTitleError(true);
    }

    try {
      setInputTitleError(false);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACKEND}/tasks/renameTask`,
        {
          method: "PATCH",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ taskId, taskName: inputTitle }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      if (data.result) {
        setIsInputTitleActive(false);
        dispatch(renameTask({ columnId, taskName: data.taskName, taskId }));
      }
    } catch (error) {
      console.error(error);
      setInputTitleError(true);
    }
  };

  const handleJoinTask = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACKEND}/tasks/joinTask`,
        {
          method: "PATCH",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ token: user.token, taskId }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      if (data.result) {
        dispatch(
          joinTask({
            taskId,
            columnId,
            taskMembers: data.taskMembers,
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const collaborators =
    members.length > 0 &&
    members.map((user, i) => {
      // console.log(user);
      const initialLetters =
        user.firstname.charAt(0).toUpperCase() +
        user.lastname.charAt(0).toUpperCase();

      return <Members key={i} initialLetters={initialLetters} />;
    });

  return (
    isOpen &&
    ReactDOM.createPortal(
      <>
        <div className={styles.overlay}></div>
        <div ref={modalRef} className={styles.modalContainer}>
          <div className={styles.top}>
            <div
              className={styles.titleContainer}
              onClick={() => setIsInputTitleActive(true)}
            >
              {isInputTitleActive ? (
                <input
                  type="text"
                  value={inputTitle}
                  ref={inputTitleRef}
                  className={`${styles.title} ${styles.input}`}
                  onBlur={handleRenameTask}
                  placeholder="Titre de la tâche"
                  onChange={(e) => setInputTitle(e.target.value)}
                  style={inputTitleError ? { borderColor: "red" } : {}}
                />
              ) : (
                <h3 className={styles.title} style={{ cursor: "pointer" }}>
                  {inputTitle}
                </h3>
              )}
            </div>

            <FontAwesomeIcon
              icon={faXmark}
              className={styles.icon}
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
            />
          </div>
          <div className={styles.main}>
            <div className={styles.left}>
              <div className={styles.sectionTitle}>
                <UserOutlined className={styles.smallIcon} />
                Membres
              </div>
              <div className={styles.membersContainer}>{collaborators}</div>
              <div className={styles.sectionTitle}>
                <FontAwesomeIcon icon={faClock} />
                Dates
              </div>
              <div>Créer le {dateCreation}</div>
              {deadline && <div>Date limite {deadline}</div>}
              <div className={styles.btnDateLimite}>
                <FontAwesomeIcon icon={faPlus} /> Ajouter une date limite
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.btnIcon} onClick={handleJoinTask}>
                <UserAddOutlined className={styles.icon} />
                {/* <UserDeleteOutlined className={styles.icon} /> */}
                Rejoindre
              </div>
              <div className={styles.btnIcon}>
                <FontAwesomeIcon icon={faListCheck} className={styles.icon} />
                Checklist
              </div>
            </div>
          </div>
          <div className={styles.bottom}>
            <div className={styles.btnIcon}>
              <FontAwesomeIcon
                icon={faTrashCan}
                style={{ color: "red" }}
                className={styles.icon}
              />{" "}
              Supprimer la tâche
            </div>
          </div>
        </div>
      </>,
      document.body
    )
  );
};

export default TaskModal;
