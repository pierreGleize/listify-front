"use client";
import React, { useState } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/commun/TaskDate.module.css";
import { Popover } from "antd";
import moment from "moment";

interface TaskDateProps {
  startDate: Date | null;
  selectedStartDay: boolean;
  selectedDeadline: boolean;
  deadline: Date | null;
  isEditable: boolean;
  openPopupDate?: boolean;
  setOpenPopupDate?: (open: boolean) => void;
}

const TaskDate: React.FC<TaskDateProps> = ({
  startDate,
  deadline,
  selectedStartDay,
  selectedDeadline,
  isEditable,
  openPopupDate,
  setOpenPopupDate,
}) => {
  const [isHovered, setIsHovored] = useState(false);

  if (!selectedStartDay && !selectedDeadline) {
    return null;
  }

  const dateStartFormated = moment(startDate).format("DD MMM. YYYY");
  const dateHourStartFormated = moment(startDate).format(
    "DD MMM. YYYY à HH:mm"
  );

  const dateLimiteFormated = moment(deadline).format("DD MMM. YYYY, HH:mm");

  const isDatePassed =
    startDate && deadline && moment(startDate).isAfter(deadline);

  const dateColorStyle =
    selectedStartDay && !selectedDeadline
      ? {
          backgroundColor: isHovered ? "#667481" : "#45505A",
        }
      : isDatePassed
      ? { backgroundColor: "red", color: "#e3e6e9" }
      : { backgroundColor: "#7df960", color: "black" };

  const content = (
    <p className="popHoverContainer">
      {isDatePassed
        ? "Cette carte est en retard !"
        : "Cette carte est en cours"}
    </p>
  );

  const dateElement = (
    <div
      className={styles["date-container"]}
      style={dateColorStyle}
      onMouseEnter={() => {
        if (selectedStartDay && !selectedDeadline && isEditable)
          setIsHovored(true);
      }}
      onMouseLeave={() => {
        if (selectedStartDay && !selectedDeadline && isEditable)
          setIsHovored(false);
      }}
      onClick={() => {
        if (isEditable && setOpenPopupDate) setOpenPopupDate(!openPopupDate);
      }}
    >
      {!isEditable && <ClockCircleOutlined style={dateColorStyle} />}
      {selectedStartDay && !selectedDeadline && (
        <span>Commencé le {dateHourStartFormated}</span>
      )}
      {!selectedStartDay && selectedDeadline && (
        <span>{dateLimiteFormated}</span>
      )}
      {selectedStartDay && selectedDeadline && (
        <span>
          {dateStartFormated} - {dateLimiteFormated}
        </span>
      )}
      {isEditable && (
        <FontAwesomeIcon
          icon={faChevronDown}
          style={{
            ...dateColorStyle,
            transition: "background-color 0.3s ease",
          }}
        />
      )}
    </div>
  );

  return selectedStartDay && !selectedDeadline ? (
    dateElement
  ) : (
    <Popover content={content} placement="right" color="#282e33">
      {dateElement}
    </Popover>
  );
};

export default TaskDate;
