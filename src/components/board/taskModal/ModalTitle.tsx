"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "../../../styles/board/taskModal/ModalTitle.module.css";
import { useAppDispatch } from "@/app/redux/store";

import { renameTask } from "@/app/redux/slices/boardSlice";
import CrossToClose from "@/components/commun/CrossToClose";

interface ModalTitleProps {
  name: string;
  taskId: string;
  columnId: string;
  closeModal: () => void;
}

const ModalTitle: React.FC<ModalTitleProps> = ({
  name,
  taskId,
  columnId,
  closeModal,
}) => {
  const [isInputTitleActive, setIsInputTitleActive] = useState(false);
  const [inputTitle, setInputTitle] = useState(name || "");
  const [inputTitleError, setInputTitleError] = useState(false);
  const inputTitleRef = useRef(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (inputTitleRef.current && isInputTitleActive) {
      (inputTitleRef.current as HTMLInputElement).focus();
    }
  }, [isInputTitleActive]);

  const handleRenameTask = async (): Promise<void> => {
    if (!inputTitle) {
      setInputTitleError(true);
      return;
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
  return (
    <div
      className={styles.titleContainer}
      onClick={() => setIsInputTitleActive(true)}
    >
      {isInputTitleActive ? (
        <input
          type="text"
          value={inputTitle}
          ref={inputTitleRef}
          className={`${styles.title}`}
          onBlur={handleRenameTask}
          placeholder="Titre de la carte"
          onChange={(e) => {
            setInputTitle(e.target.value);
            setInputTitleError(false);
          }}
          style={inputTitleError ? { borderColor: "red" } : {}}
        />
      ) : (
        <h3 className={styles.title}>{inputTitle}</h3>
      )}
      <CrossToClose action={closeModal} fontSize="25px" />
    </div>
  );
};

export default ModalTitle;
