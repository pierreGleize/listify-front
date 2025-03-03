"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles/board/Column.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faPlus,
  faSquareCheck,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import Task from "./Task";
import EmojiPicker, { Theme } from "emoji-picker-react";
import Image from "next/image";
import {
  renameColumn,
  addTask,
  deleteColumn,
} from "@/app/redux/slices/boardSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/store";
import { CloseOutlined } from "@ant-design/icons";
import { RootState } from "@/app/redux/store";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { User } from "@/app/redux/slices/boardSlice";

interface ColumnProps {
  name: string;
  tasks: {
    _id: string;
    name: string;
    members: User[];
    createdAt: Date;
    description: string;
    deadline: Date | null;
    startDate: Date | null;
    selectedStartDay: boolean;
    selectedDeadline: boolean;
  }[];
  id: string;
  index: number;
}

const Column: React.FC<ColumnProps> = ({ name, id, tasks, index }) => {
  const [inputColumnActive, setInputColumnActive] = useState(false);
  const [columntName, setColumnName] = useState("");
  const [isopenEmoji, setIsOpenEmoji] = useState(false);
  const [inputNewTaskActive, setInputNewTaskActive] = useState(false);
  const [inputNewTask, setInputNewTask] = useState("");
  const [inputNewTaskError, setInputNewTaskError] = useState(false);

  const inputColumnNameRef = useRef<HTMLInputElement | null>(null);

  const currentBoardId = useAppSelector(
    (state: RootState) => state.board.currentBoardId
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (name) {
      setColumnName(name || "");
    }
  }, [inputColumnActive, name]);

  useEffect(() => {
    if (inputColumnActive && inputColumnNameRef.current) {
      inputColumnNameRef.current.select();
    }
  }, [inputColumnActive]);

  const handleRenameColumn = async () => {
    setInputNewTaskActive(false);
    setInputNewTask("");
    if (columntName.trim().length === 0) {
      setColumnName(name || "");
      setIsOpenEmoji(false);
      setInputColumnActive(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACKEND}/columns/renameColumn`,
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

  const handleAddTask = async () => {
    if (inputNewTask.trim().length === 0) {
      setInputNewTaskError(true);
      return;
    }

    try {
      setInputNewTaskError(false);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACKEND}/tasks/createTask`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ columnId: id, taskName: inputNewTask }),
        }
      );

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
        setInputNewTask("");
      }
    } catch (error) {
      console.error(error);
      setInputNewTaskError(true);
    }
  };

  const handleDeleteColumn = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACKEND}/columns/deleteAnColumn`,
        {
          method: "DELETE",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ boardId: currentBoardId, columnId: id }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      if (data.result) {
        dispatch(deleteColumn({ columnId: id }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <div
          style={{
            display: "center",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onClick={handleDeleteColumn}
        >
          <FontAwesomeIcon
            icon={faTrashCan}
            style={{ color: "red", marginRight: "10px" }}
          />
          Supprimer la liste
        </div>
      ),
      key: 1,
    },
  ];

  const handleCloseNewTask = (): void => {
    setInputNewTaskActive(false);
    setInputNewTask("");
    setInputNewTaskError(false);
  };

  return (
    <>
      {inputColumnActive && (
        <div className={styles.overlay} onClick={handleRenameColumn}></div>
      )}
      {inputNewTaskActive && (
        <div className={styles.overlay} onClick={handleCloseNewTask}></div>
      )}
      <Draggable draggableId={id} index={index}>
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div
              style={{
                border: snapshot.isDragging ? "2px solid white" : "",
              }}
              className={styles.container}
            >
              {!inputColumnActive && (
                <div className={styles.topContainer}>
                  <div
                    className={styles.top}
                    onClick={() => setInputColumnActive(true)}
                  >
                    <span>{name}</span>
                  </div>
                  <Dropdown
                    menu={{ items }}
                    trigger={["click"]}
                    placement="bottom"
                  >
                    <div className={styles.icon}>
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </div>
                  </Dropdown>
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
                style={{ zIndex: "10" }}
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
                          minHeight: "10px",
                        }}
                      >
                        {tasks.map(
                          (
                            task: {
                              _id: string;
                              name: string;
                              members: User[];
                              createdAt: Date;
                              description: string;
                              deadline: Date | null;
                              startDate: Date | null;
                              selectedStartDay: boolean;
                              selectedDeadline: boolean;
                            },
                            index
                          ) => {
                            return (
                              <Task
                                key={task._id}
                                name={task.name}
                                taskId={task._id}
                                index={index}
                                members={task.members}
                                createdAt={task.createdAt}
                                description={task.description}
                                deadline={task.deadline}
                                columnId={id}
                                startDate={task.startDate}
                                selectedStartDay={task.selectedStartDay}
                                selectedDeadline={task.selectedDeadline}
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
                    style={inputNewTaskError ? { border: "2px solid red" } : {}}
                  >
                    <input
                      type="text"
                      value={inputNewTask}
                      onChange={(e) => {
                        setInputNewTask(e.target.value);
                        setInputNewTaskError(false);
                      }}
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
            </div>
          </div>
        )}
      </Draggable>
    </>
  );
};

export default Column;
