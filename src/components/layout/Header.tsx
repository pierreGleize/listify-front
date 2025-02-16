"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "../../styles/layout/Header.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector, useAppDispatch } from "@/app/redux/store";
import { renameBoard } from "@/app/redux/slices/boardSlice";
import {
  addBoardToFavorite,
  removeBoardFromFavorite,
} from "@/app/redux/slices/userSlice";
import Members from "../mapped/Members";

const Header = () => {
  const [isActiveInput, setIsActiveInput] = useState(false);
  const [inputName, setInputName] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const spanRef = useRef<HTMLSpanElement | null>(null);

  const boards = useAppSelector((state) => state.board);
  const user = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const currentBoard = boards.value.find(
    (element) => element._id === boards.currentBoardId
  );

  useEffect(() => {
    setInputName(currentBoard?.name || "Tableau");
  }, [currentBoard, isActiveInput]);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      const spanWidth = spanRef.current.offsetWidth;
      inputRef.current.style.width = `${spanWidth}px`;
    }
  }, [inputName, isActiveInput]);

  useEffect(() => {
    if (isActiveInput && inputRef.current) {
      inputRef.current.select();
    }
  }, [isActiveInput]);

  const handleUpdateName = async () => {
    setIsActiveInput(false);

    if (inputName.trim().length === 0) {
      setInputName(currentBoard?.name || "Tableau");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACKEND}/boards/renameBoard`,
        {
          method: "PATCH",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ boardId: currentBoard?._id, name: inputName }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Une erreur est survenue lors de la modification du tableau"
        );
      }

      const data = await response.json();

      if (data.result) {
        dispatch(
          renameBoard({
            name: data.board.name,
            boardId: data.board._id,
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddBoardToFavorite = async () => {
    const UrlToFetch = user.favoriteBoards.includes(currentBoard?._id || "")
      ? "removeBoardFromFavorite"
      : "addBoardToFavorite";
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACKEND}/users/${UrlToFetch}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            token: user.token,
            boardId: currentBoard?._id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (data.result && data.addFavorite) {
        dispatch(addBoardToFavorite(currentBoard?._id || ""));
      } else if (data.result && !data.addFavorite) {
        dispatch(removeBoardFromFavorite(currentBoard?._id || ""));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const collaborators = currentBoard?.userId.map((user, i) => {
    const initialLetters =
      user.firstname.charAt(0).toUpperCase() +
      user.lastname.charAt(0).toUpperCase();

    return <Members key={i} initialLetters={initialLetters} />;
  });

  return (
    <div className={styles["header-container"]}>
      <div className={styles["title-container"]}>
        <Link href={"/home"}>
          <h2 className={styles["header-title"]}>Listify</h2>
        </Link>
      </div>
      <div className={styles["info-container"]}>
        <div className={styles["left-container"]}>
          {isActiveInput ? (
            <div className={`${styles["board-name"]} ${styles.active}`}>
              <span ref={spanRef} className={styles.hiddenSpan}>
                {inputName}
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                autoFocus
                className={styles.input}
                onBlur={handleUpdateName}
              />
            </div>
          ) : (
            <div
              className={styles["board-name"]}
              onClick={() => setIsActiveInput(true)}
            >
              <h3 className={styles.title}>
                {currentBoard ? currentBoard.name : "Tableau"}
              </h3>
            </div>
          )}
          <div
            className={styles["icon-container"]}
            onClick={handleAddBoardToFavorite}
          >
            <FontAwesomeIcon
              icon={faStar}
              style={
                user.favoriteBoards &&
                user.favoriteBoards.includes(currentBoard?._id || "")
                  ? { color: "yellow" }
                  : { color: "#ffffff" }
              }
              className={styles.icon}
            />
          </div>
        </div>

        <div className={styles["right-container"]}>
          <div className={styles["members-container"]}>{collaborators}</div>
          <button className={styles["btn-addMembers"]}>
            <FontAwesomeIcon icon={faPlus} style={{ color: "#ffffff" }} />
            Inviter un collaborateur
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
