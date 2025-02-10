"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import EmojiPicker, { Theme } from "emoji-picker-react";
import Image from "next/image";
import Column from "../mapped/Column";
import { addColumn, moveTask } from "@/app/redux/slices/boardSlice";
import { UseAppDispatch } from "@/app/redux/store";
import { useAppSelector } from "@/app/redux/store";
import styles from "../../styles/board/BoardsView.module.css";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

const BoardsView = () => {
  const [isAddColumnActive, setIsAddColumnActive] = useState(false);
  const [isopenEmoji, setIsOpenEmoji] = useState(false);

  const [newColumnName, setNewColumnName] = useState("");

  const boards = useAppSelector((state) => state.board);
  const currentBoardId = useAppSelector((state) => state.board.currentBoardId);
  const activeBoard = boards.value.find(
    (element) => element._id === currentBoardId
  );

  const dispatch = UseAppDispatch();

  const handleAddColumn = async () => {
    if (newColumnName.trim().length === 0) return;

    setIsOpenEmoji(false);

    try {
      if (!activeBoard) return;

      const response = await fetch(
        "http://localhost:3001/boards/createColumn",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            columnName: newColumnName,
            boardId: activeBoard._id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error();
      }
      const data = await response.json();

      if (data.result) {
        setIsOpenEmoji(false);
        setNewColumnName("");
        setIsAddColumnActive(false);
        dispatch(
          addColumn({ column: data.newColumn, boardId: activeBoard._id })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    dispatch(
      moveTask({
        sourceColumnId: source.droppableId,
        destinationColumnId: destination.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
        taskId: draggableId,
      })
    );
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        {activeBoard &&
          activeBoard.columnId.map(
            (column: {
              name: string;
              _id: string;
              tasks: { name: string; _id: string }[];
            }) => (
              <Column
                key={column._id}
                name={column.name}
                tasks={column.tasks}
                id={column._id}
              />
            )
          )}
      </DragDropContext>

      {!isAddColumnActive ? (
        <button
          className={styles["add_column"]}
          onClick={() => setIsAddColumnActive(true)}
        >
          <FontAwesomeIcon icon={faPlus} style={{ color: "#ffffff" }} />
          Ajouter une liste
        </button>
      ) : (
        <>
          <div
            className={styles.overlay}
            onClick={() => setIsAddColumnActive(false)}
          ></div>
          <div className={styles["add_column_active"]}>
            <div className={styles["input-container"]}>
              <input
                type="text"
                placeholder="Nom de la nouvelle liste"
                className={styles.input}
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                autoFocus
              />
              <Image
                src="/emoji-add.svg"
                width={25}
                height={25}
                onClick={() => setIsOpenEmoji(!isopenEmoji)}
                alt="Ajouter une emote au texte"
                style={{ cursor: "pointer" }}
              />
            </div>

            <EmojiPicker
              height={"100%"}
              width={"100%"}
              open={isopenEmoji}
              onEmojiClick={(e) =>
                setNewColumnName((prevState) => prevState + e.emoji)
              }
              theme={Theme.LIGHT}
              className={styles.emojiPicker}
            />
            <div className={styles["add_column_active_bottom"]}>
              <button
                className={styles["btn-add_column"]}
                onClick={handleAddColumn}
              >
                Ajouter une liste
              </button>
              <FontAwesomeIcon
                icon={faXmark}
                style={{ color: "#ffffff" }}
                className={styles.icon}
                onClick={() => setIsAddColumnActive(false)}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BoardsView;
