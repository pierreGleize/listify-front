"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import OrderedList from "@tiptap/extension-ordered-list";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faUnderline,
  faList,
  faHeading,
  faListOl,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../../../styles/board/taskModal/Tiptap.module.css";
import { useAppDispatch } from "@/app/redux/store";
import { updateDescription } from "@/app/redux/slices/boardSlice";
import BtnTask from "../../commun/BtnTask";

const extensions = [
  StarterKit.configure({
    heading: false,
  }),
  Underline,
  OrderedList,
  Heading.configure({
    levels: [1, 2, 3],
  }),
];

interface TipTapProps {
  closeDescription: () => void;
  taskId: string;
  columnId: string;
  description: string;
}

const Tiptap: React.FC<TipTapProps> = ({
  closeDescription,
  taskId,
  columnId,
  description,
}) => {
  const [content, setContent] = useState(description || "");
  const dispatch = useAppDispatch();

  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  const handleCancelTheEntry = (): void => {
    if (
      content.trim() === "<p></p>" ||
      content.trim() === "<h1></h1>" ||
      content.trim() === "<h2></h2>" ||
      content.trim() === "<h3></h3>"
    ) {
      setContent("");
    } else {
      setContent(description);
    }

    closeDescription();
  };

  const handleUpdateDescription = async (): Promise<void> => {
    if (!taskId || !columnId) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACKEND}/tasks/updateDescription`,
        {
          method: "PATCH",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ description: content, taskId }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      if (data.result) {
        closeDescription();
        dispatch(
          updateDescription({
            columnId,
            description: data.task.description,
            taskId: data.task._id,
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Barre d'outils */}
      <div className={styles.addBorderFocus}>
        <div className={styles.toolKit}>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${styles.btnIcon} ${
              editor.isActive("bold") ? styles.active : ""
            }`}
          >
            <FontAwesomeIcon icon={faBold} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${styles.btnIcon} ${
              editor.isActive("italic") ? styles.active : ""
            }`}
          >
            <FontAwesomeIcon icon={faItalic} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`${styles.btnIcon} ${
              editor.isActive("underline") ? styles.active : ""
            }`}
          >
            <FontAwesomeIcon icon={faUnderline} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${styles.btnIcon} ${
              editor.isActive("bulletList") ? styles.active : ""
            }`}
          >
            <FontAwesomeIcon icon={faList} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${styles.btnIcon} ${
              editor.isActive("orderedList") ? styles.active : ""
            }`}
          >
            <FontAwesomeIcon icon={faListOl} />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`${
              editor.isActive("heading", { level: 1 }) ? styles.active : ""
            } ${styles.btnIcon}`}
          >
            <FontAwesomeIcon icon={faHeading} />1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`${
              editor.isActive("heading", { level: 2 }) ? styles.active : ""
            } ${styles.btnIcon}`}
          >
            <FontAwesomeIcon icon={faHeading} />2
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`${
              editor.isActive("heading", { level: 3 }) ? styles.active : ""
            } ${styles.btnIcon}`}
          >
            <FontAwesomeIcon icon={faHeading} />3
          </button>
        </div>
        <EditorContent editor={editor} />
      </div>

      <button className={styles.btnSubmit} onClick={handleUpdateDescription}>
        Sauvegarder
      </button>
      <BtnTask
        color="#e3e6e9"
        bgColor="#45505A"
        bgColorHover="#667481"
        text="Anuller"
        action={handleCancelTheEntry}
      />
    </div>
  );
};

export default Tiptap;
