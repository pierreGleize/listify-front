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
// import { DndContext, closestCorners } from "@dnd-kit/core";
// import {
//   SortableContext,
//   arrayMove,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import Droppable from "../dndKit/Droppable";
// import Draggable from "../dndKit/Draggable";

interface ColumnProps {
  name: string;
  // tasks: [];
  id: string;
}

const Column: React.FC<ColumnProps> = ({
  name,
  id,
  //  tasks
}) => {
  const [inputColumnActive, setInputColumnActive] = useState(false);
  const [columntName, setColumnName] = useState("");
  const [isopenEmoji, setIsOpenEmoji] = useState(false);
  const [inputNewTaskActive, setInputNewTaskActive] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  // const [openTaskModal, setOpenTaskModal] = useState(false);
  // const [loading, setLoading] = useState(false);
  const inputColumnNameRef = useRef<HTMLInputElement | null>(null);

  const boards = useAppSelector((state: RootState) => state.board.value);
  const currentBoardId = useAppSelector(
    (state: RootState) => state.board.currentBoardId
  );

  const currentBoard = boards.find((board) => board._id === currentBoardId);

  const currentColumn =
    currentBoard && currentBoard.columnId.find((column) => column._id === id);

  // const [tasks, setTasks] = useState(currentColumn?.tasks || []);

  // const handleDragEnd = (event) => {
  //   const { active, over } = event;
  //   if (!over) return;

  //   const sourceColumnId = active.data.current.columnId;
  //   const destinationColumnId = over.id;

  //   if (sourceColumnId === destinationColumnId) {
  //     // Réorganisation des tâches dans la même colonne
  //     const oldIndex = tasks.findIndex((task) => task._id === active.id);
  //     const newIndex = tasks.findIndex((task) => task._id === over.id);

  //     if (oldIndex !== newIndex) {
  //       const newTasks = arrayMove(tasks, oldIndex, newIndex);
  //       setTasks(newTasks);
  //     }
  //   } else {
  //     // Déplacement d'une tâche vers une autre colonne
  //     // dispatch(moveTask({ taskId: active.id, fromColumn: sourceColumnId, toColumn: destinationColumnId }));
  //   }
  // };

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
        "http://localhost:3001/boards/renameColumn",
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
      const response = await fetch("http://localhost:3001/boards/createTask", {
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
      <div className={styles.container}>
        {/* <DndContext
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          <Droppable id={id}> */}
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
          {/* <SortableContext
                items={tasks.map((task) => task._id)}
                strategy={verticalListSortingStrategy}
              > */}
          {currentColumn &&
            currentColumn.tasks.map((task) => {
              return <Task key={task._id} name={task.name} id={task._id} />;
              // <Draggable key={task._id} id={task._id} columnId={id}>

              {
                /* </Draggable> */
              }
            })}

          {inputNewTaskActive && (
            <div
              className={styles["new-task"]}
              style={inputNewTaskActive ? { border: "1px solid white" } : {}}
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
          {/* </SortableContext> */}
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
            <button className={styles["btn-add_task"]} onClick={handleAddTask}>
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
        {/* </Droppable>
        </DndContext>{" "} */}
      </div>
    </>
  );
};

export default Column;
