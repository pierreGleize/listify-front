"use client";
import React, { RefObject } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import { UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { ClockCircleOutlined } from "@ant-design/icons";
import BtnTaskIcon from "@/components/commun/BtnTaskIcon";
import { joinTask, User } from "@/app/redux/slices/boardSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/app/redux/store";
import styles from "../../../styles/board/taskModal/ModalActions.module.css";
import PopupDate from "./PopupDate";
import { Popover } from "antd";

interface ModalActionsProps {
  taskId: string;
  columnId: string;
  members: User[];
  dateLimit: Date | null;
  setDateLimit: (date: Date | null) => void;
  handleUpdateDate: (
    deadlineSelected: Date | null,
    startDaySelected: Date | null,
    isDeadlineChecked: boolean,
    isStartDayChecked: boolean
  ) => Promise<void>;
  popupDateRef: RefObject<HTMLDivElement | null> | null;
  openPopupActionDate: boolean;
  setOpenPopupActionDate: (open: boolean) => void;
  dateStart: Date | null;
  setDateStart: (date: Date | null) => void;
  createdAt: Date;
  selectedStartDay: boolean;
  selectedDeadline: boolean;
  setOpenPopupDate: (open: boolean) => void;
  handleRemoveDate: () => Promise<void>;
}

const ModalActions: React.FC<ModalActionsProps> = ({
  taskId,
  members,
  columnId,
  popupDateRef,
  dateLimit,
  setDateLimit,
  handleUpdateDate,
  createdAt,
  openPopupActionDate,
  setOpenPopupActionDate,
  dateStart,
  setDateStart,
  selectedStartDay,
  selectedDeadline,
  handleRemoveDate,
  setOpenPopupDate,
}) => {
  const user = useAppSelector((state: RootState) => state.user);

  const dispatch = useAppDispatch();

  const handleJoinTask = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BACKEND}/tasks/joinTask`,
        {
          method: "PATCH",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ token: user.token, taskId }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      if (data.result) {
        dispatch(
          joinTask({
            taskId,
            columnId,
            taskMembers: data.taskMembers,
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isMemberJoin = members.some((member) => member.email === user.email);
  return (
    <>
      <BtnTaskIcon
        title={isMemberJoin ? "Quitter" : "Rejoindre"}
        icon={
          isMemberJoin ? (
            <UserDeleteOutlined className={styles.icon} />
          ) : (
            <UserAddOutlined className={styles.icon} />
          )
        }
        action={handleJoinTask}
        width="120px"
      />
      <BtnTaskIcon
        title="Checklist"
        icon={<FontAwesomeIcon icon={faListCheck} className={styles.icon} />}
        width="120px"
      />

      <Popover
        content={
          <PopupDate
            popupDateRef={popupDateRef}
            setOpenPopupActionDate={setOpenPopupActionDate}
            dateLimit={dateLimit}
            setDateLimit={setDateLimit}
            dateStart={dateStart}
            setDateStart={setDateStart}
            handleUpdateDate={handleUpdateDate}
            selectedStartDay={selectedStartDay}
            selectedDeadline={selectedDeadline}
            createdAt={createdAt}
            handleRemoveDate={handleRemoveDate}
            setOpenPopupDate={setOpenPopupDate}
          />
        }
        trigger="click"
        color="#45505A"
        placement="left"
        open={openPopupActionDate}
      >
        <div>
          <BtnTaskIcon
            title="Dates"
            icon={<ClockCircleOutlined className={styles.icon} />}
            action={() => setOpenPopupActionDate(!openPopupActionDate)}
            width="120px"
          />
        </div>
      </Popover>
    </>
  );
};

export default ModalActions;
