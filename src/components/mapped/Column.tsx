"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles/mapped/Column.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faPlus,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";
import Task from "./Task";
import EmojiPicker, { Theme } from "emoji-picker-react";
import Image from "next/image";
import { renameColumn, addTask } from "@/app/redux/slices/boardSlice";
import { UseAppDispatch, useAppSelector } from "@/app/redux/store";
import { CloseOutlined } from "@ant-design/icons";
// import TaskModal from "./TaskModal";
import { RootState } from "@/app/redux/store";
import { Droppable, Draggable } from "@hello-pangea/dnd";

interface ColumnProps {
  name: string;
  tasks: { _id: string; name: string }[];
  id: string;
  index: number;
}

const Column: React.FC<ColumnProps> = ({ name, id, tasks, index }) => {
  const [inputColumnActive, setInputColumnActive] = useState(false);
  const [columntName, setColumnName] = useState("");
  const [isopenEmoji, setIsOpenEmoji] = useState(false);
  const [inputNewTaskActive, setInputNewTaskActive] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  // const [openTaskModal, setOpenTaskModal] = useState(false);
  // const [loading, setLoading] = useState(false);
  const inputColumnNameRef = useRef<HTMLInputElement | null>(null);

  // const boards = useAppSelector((state: RootState) => state.board.value);
  const currentBoardId = useAppSelector(
    (state: RootState) => state.board.currentBoardId
  );

  // const currentBoard = boards.find((board) => board._id === currentBoardId);

  // const currentColumn =
  //   currentBoard && currentBoard.columnId.find((column) => column._id === id);

  const dispatch = UseAppDispatch();

  useEffect(() => {
    if (name) {
      setColumnName(name || "");
    }
  }, [inputColumnActive, name]);

  // useEffect(() => {
  //   if (currentColumn) {
  //     setTasks(currentColumn.tasks);
  //   }
  // }, [currentColumn]);

  useEffect(() => {
    if (inputColumnActive && inputColumnNameRef.current) {
      inputColumnNameRef.current.select();
    }
  }, [inputColumnActive]);

  const handleRenameColumn = async () => {
    setInputNewTaskActive(false);
    setNewTaskName("");
    if (columntName.trim().length === 0) {
      setColumnName(name || "");
      setIsOpenEmoji(false);
      setInputColumnActive(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/boards/renameColumn",
        {
          method: "PATCH",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ columnId: id, name: columntName }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }
      if (data.result) {
        setIsOpenEmoji(false);
        setInputColumnActive(false);
        dispatch(
          renameColumn({
            boardId: currentBoardId || "",
            name: data.column.name,
            columnId: data.column._id,
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const closeModal = () => {
  //   setOpenTaskModal(false);
  // };

  const handleAddTask = async () => {
    if (newTaskName.trim().length === 0) return;

    try {
      const response = await fetch("http://localhost:3000/boards/createTask", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ columnId: id, taskName: newTaskName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (data.result) {
        dispatch(
          addTask({
            task: data.task,
            columnId: id,
            boardId: currentBoardId || "",
          })
        );
        setInputNewTaskActive(false);
        setNewTaskName("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {inputColumnActive && (
        <div className={styles.overlay} onClick={handleRenameColumn}></div>
      )}
      {inputNewTaskActive && (
        <div
          className={styles.overlay}
          onClick={() => setInputNewTaskActive(false)}
        ></div>
      )}
      <Draggable draggableId={id} index={index}>
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={styles.container}
            style={{
              border: snapshot.isDragging ? "2px solid white" : "",
              // zIndex: snapshot.isDragging ? 1000 : 10,
              // backgroundColor: snapshot.isDragging
              //   ? "rgba(255, 255, 255, 0.6)"
              //   : "red",
              ...provided.draggableProps.style,
            }}
          >
            {!inputColumnActive && (
              <div
                className={styles.top}
                onClick={() => setInputColumnActive(true)}
              >
                <span>{name}</span>

                <FontAwesomeIcon icon={faPen} />
              </div>
            )}
            {inputColumnActive && (
              <div className={`${styles.top} ${styles.active}`}>
                <input
                  type="text"
                  value={columntName}
                  ref={inputColumnNameRef}
                  onChange={(e) => setColumnName(e.target.value)}
                  autoFocus
                  placeholder="Nom de la liste"
                  className={styles.input}
                />
                <Image
                  src="/emoji-add.svg"
                  width={25}
                  height={25}
                  onClick={() => setIsOpenEmoji(!isopenEmoji)}
                  alt="Ajouter une emote au texte"
                />
                <FontAwesomeIcon
                  icon={faSquareCheck}
                  style={{ color: "#ffffff", fontSize: "25px" }}
                  onClick={handleRenameColumn}
                />
              </div>
            )}
            <EmojiPicker
              height={"100%"}
              width={"100%"}
              open={isopenEmoji}
              onEmojiClick={(e) =>
                setColumnName((prevState) => prevState + e.emoji)
              }
              theme={Theme.LIGHT}
              className={styles.emojiPicker}
            />
            <div className={styles["tasks-container"]}>
              <Droppable droppableId={id} type="task">
                {(provided) => {
                  return (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        // background: snapshot.isDraggingOver
                        //   ? "rgba(255, 255, 255, 0.1)"
                        //   : "transparent",
                        // minHeight: "10px",
                        height: "100%",
                      }}
                    >
                      {tasks.map(
                        (task: { _id: string; name: string }, index) => {
                          return (
                            <Task
                              key={task._id}
                              name={task.name}
                              id={task._id}
                              index={index}
                            />
                          );
                        }
                      )}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>

              {inputNewTaskActive && (
                <div
                  className={styles["new-task"]}
                  style={
                    inputNewTaskActive ? { border: "1px solid white" } : {}
                  }
                >
                  <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    className={styles.input}
                    autoFocus
                  />
                </div>
              )}
            </div>
            {!inputNewTaskActive ? (
              <div
                className={`${styles.bottom} ${styles.bottomActif}`}
                onClick={() => setInputNewTaskActive(true)}
              >
                <FontAwesomeIcon icon={faPlus} style={{ color: "#ffffff" }} />
                <span>Ajouter une carte</span>
              </div>
            ) : (
              <div className={styles.bottom}>
                <button
                  className={styles["btn-add_task"]}
                  onClick={handleAddTask}
                >
                  Ajouter une carte
                </button>
                <CloseOutlined
                  onClick={() => setInputNewTaskActive(false)}
                  className={styles["close-input-new_task"]}
                />
              </div>
            )}
            {/* {openTaskModal && (
          <TaskModal
          openTaskModal={openTaskModal}
          closeModal={closeModal}
          // loading={loading}
          />
          )} */}
          </div>
        )}
      </Draggable>
    </>
  );
};

export default Column;
