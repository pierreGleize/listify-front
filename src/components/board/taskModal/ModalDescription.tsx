import React, { useState } from "react";
import styles from "../../../styles/board/taskModal/ModalDescription.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Tiptap from "./TipTap";
import DOMPurify from "dompurify";

interface ModalDescriptionProps {
  description: string;
  taskId: string;
  columnId: string;
}

const ModalDescription: React.FC<ModalDescriptionProps> = ({
  description,
  taskId,
  columnId,
}) => {
  const [isDescriptionActive, setIsDescriptionActive] = useState(false);

  const handleCloseDescription = (): void => {
    setIsDescriptionActive(false);
  };

  const sanitizedHtml = DOMPurify.sanitize(description);
  return (
    <>
      <div className={styles.sectionTitle}>
        <FontAwesomeIcon icon={faBars} className={styles.smallIcon} />
        Description
      </div>
      <div className={styles.section}>
        {description.trim().length === 0 && !isDescriptionActive && (
          <div
            className={styles.description}
            onClick={() => setIsDescriptionActive(true)}
          >
            Ajouter une description...
          </div>
        )}
        {description && !isDescriptionActive && (
          <div
            className={styles.description}
            onClick={() => setIsDescriptionActive(true)}
          >
            <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
          </div>
        )}
        {isDescriptionActive && (
          <Tiptap
            closeDescription={handleCloseDescription}
            taskId={taskId}
            columnId={columnId}
            description={description}
          />
        )}
      </div>
    </>
  );
};

export default ModalDescription;
