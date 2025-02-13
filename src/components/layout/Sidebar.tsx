"use client";
import React, { useRef, useEffect, useState } from "react";
import styles from "../../styles/layout/Sidebar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPlus,
  faEllipsisVertical,
  faTrashCan,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useAppSelector, useAppDispatch } from "@/app/redux/store";
import {
  addAnBoard,
  selectedBoard,
  deleteAnBoard,
} from "@/app/redux/slices/boardSlice";
import {
  addBoardToFavorite,
  removeBoardFromFavorite,
} from "@/app/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import type { MenuProps } from "antd";
import { Dropdown, message } from "antd";

interface SidebarProps {
  toogleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ toogleSidebar, isSidebarOpen }) => {
  const [boardIdToDelete, setBoardIdToDelete] = useState("");

  const boards = useAppSelector((state) => state.board.value);
  const currentBoardId = useAppSelector((state) => state.board.currentBoardId);
  const user = useAppSelector((state) => state.user);

  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useAppDispatch();
  const router = useRouter();

  // Référence pour stocker la position du scroll
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Restaurer la position après le rendu du composant
  useEffect(() => {
    const savedPosition = sessionStorage.getItem("scrollPosition");
    if (savedPosition && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = parseInt(savedPosition, 10);
    }

    return () => {
      scrollContainerRef.current = null;
    };
  }, [currentBoardId]);

  // Naviguer vers un tableau au click
  const handleNavigateToAnotherBoard = (boardId: string) => {
    if (scrollContainerRef.current) {
      sessionStorage.setItem(
        "scrollPosition",
        scrollContainerRef.current.scrollTop.toString()
      );
    }
    dispatch(selectedBoard(boardId));
    router.push(`/board/${boardId}`);
  };

  // Céer un nouveau tableau
  const createNewBoard = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACKEND}/boards/createBoard`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ token: user.token }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      if (data.result) {
        dispatch(addAnBoard(data.boardUser));
        dispatch(selectedBoard(data.boardUser._id));
        router.push(`/board/${data.boardUser._id}`);
        // handleNavigateToAnotherBoard(data.boardUser._id);
        scrollContainerRef.current?.scrollTo(0, 0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Supprimer un tableau
  const deleteBoard = async () => {
    if (currentBoardId === null) return;

    let index: number = 0;

    let nextBoard = null;

    if (boardIdToDelete !== currentBoardId) {
      const currentBoardIndex = boards.findIndex(
        (element) => element._id === currentBoardId
      );
      nextBoard = boards[currentBoardIndex];
    } else {
      const indexBoard = boards.findIndex(
        (element) => element._id === boardIdToDelete
      );

      const numbersOfBoards = boards.length;

      if (indexBoard === 0 && numbersOfBoards >= 1) {
        index = 1;
      } else if (indexBoard > 0 && numbersOfBoards >= indexBoard) {
        index = indexBoard - 1;
      } else {
        router.push("/board");
      }

      nextBoard = boards[index];
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACKEND}/boards/deleteBoard/${boardIdToDelete}/${user.token}`,
        {
          method: "DELETE",
          headers: { "Content-type": "application/json" },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        errorMessage(data.message);
        throw new Error(data.message);
      }

      if (data.result) {
        if (data.numberOfBoards === 0) {
          router.push("/board");
        } else {
          // successMessage();
          dispatch(selectedBoard(nextBoard._id));
          router.push(`/board/${nextBoard._id}`);
        }
        dispatch(deleteAnBoard(boardIdToDelete));
        setBoardIdToDelete("");
      }
    } catch (error) {
      setBoardIdToDelete("");
      console.error(error);
    }
  };

  // Ajouter un tableau au favoris
  const handleAddBoardToFavorite = async (boardId: string) => {
    if (!boardId) return;
    const UrlToFetch =
      user.favoriteBoards && user.favoriteBoards.includes(boardId)
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
            boardId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        errorMessage(data.message);
        throw new Error(data.message);
      }

      if (data.result && data.addFavorite) {
        dispatch(addBoardToFavorite(boardId));
      } else if (data.result && !data.addFavorite) {
        dispatch(removeBoardFromFavorite(boardId));
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
          onClick={deleteBoard}
        >
          <FontAwesomeIcon
            icon={faTrashCan}
            style={{ color: "red", marginRight: "10px" }}
          />
          Supprimer le tableau
        </div>
      ),
      key: 1,
    },
  ];

  // const successMessage = () => {
  //   messageApi.open({
  //     type: "success",
  //     content: "Votre tableau a bien été supprimé !",
  //   });
  // };

  const errorMessage = (message: string) => {
    messageApi.open({
      type: "error",
      content: message || "Une erreur s'est produite",
    });
  };

  return (
    <div
      className={styles.container}
      style={isSidebarOpen ? { left: "0px" } : { left: "-250px" }}
    >
      <h3 className={styles.title}>
        Espace de travail de <span>{`${user.firstname} ${user.lastname}`}</span>
      </h3>
      <h3 className={styles["board-title"]}>Vos tableaux</h3>

      <div className={styles["boards-container"]} ref={scrollContainerRef}>
        {boards.length > 0 &&
          [...boards]
            .sort((a, b) => {
              const aIsFavorite =
                user.favoriteBoards && user.favoriteBoards.includes(a._id);
              const bIsFavorite =
                user.favoriteBoards && user.favoriteBoards.includes(b._id);
              return (bIsFavorite ? 1 : 0) - (aIsFavorite ? 1 : 0);
            })
            .map((element) => (
              <div
                className={styles.board}
                key={element._id}
                style={
                  currentBoardId === element._id
                    ? {
                        backgroundColor: "#194f57",
                      }
                    : {}
                }
              >
                <span
                  style={{ width: "100%", padding: "10px" }}
                  onClick={() => handleNavigateToAnotherBoard(element._id)}
                >
                  {element.name}
                </span>
                <FontAwesomeIcon
                  icon={faStar}
                  style={
                    user.favoriteBoards &&
                    user.favoriteBoards.includes(element._id || "")
                      ? { color: "yellow" }
                      : { color: "#ffffff" }
                  }
                  className={styles.icon}
                  onClick={() => handleAddBoardToFavorite(element._id)}
                />
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <div onClick={() => setBoardIdToDelete(element._id)}>
                    <FontAwesomeIcon
                      icon={faEllipsisVertical}
                      className={styles.icon}
                    />
                  </div>
                </Dropdown>
                {contextHolder}
              </div>
            ))}
      </div>

      <button className={styles["btn-add-board"]} onClick={createNewBoard}>
        <FontAwesomeIcon icon={faPlus} />
        Créer un nouveau tableau
      </button>

      <FontAwesomeIcon
        icon={isSidebarOpen ? faChevronLeft : faChevronRight}
        className={styles.iconOpen}
        onClick={() => toogleSidebar()}
        style={isSidebarOpen ? { right: "-28px" } : { right: "-40px" }}
      />
    </div>
  );
};

export default Sidebar;
