import React, { RefObject } from "react";
import SectionTitle from "./SectionTitle";
import { ClockCircleOutlined } from "@ant-design/icons";
import styles from "../../../styles/board/taskModal/ModalDate.module.css";
import moment from "moment";
import PopupDate from "./PopupDate";
import { Popover } from "antd";
import TaskDate from "@/components/commun/TaskDate";

interface ModalDateProps {
  dateLimit: Date | null;
  setDateLimit: (date: Date | null) => void;
  handleUpdateDate: (
    deadlineSelected: Date | null,
    startDaySelected: Date | null,
    isDeadlineChecked: boolean,
    isStartDayChecked: boolean
  ) => Promise<void>;
  popupDateRef: RefObject<HTMLDivElement | null> | null;
  openPopupDate: boolean;
  setOpenPopupDate: (open: boolean) => void;
  dateStart: Date | null;
  setDateStart: (date: Date | null) => void;
  createdAt: Date;
  selectedStartDay: boolean;
  selectedDeadline: boolean;
  startDate: Date | null;
  deadline: Date | null;
  handleRemoveDate: () => Promise<void>;
}

const ModalDate: React.FC<ModalDateProps> = ({
  popupDateRef,
  dateLimit,
  setDateLimit,
  handleUpdateDate,
  createdAt,
  openPopupDate,
  setOpenPopupDate,
  dateStart,
  setDateStart,
  selectedStartDay,
  selectedDeadline,
  startDate,
  deadline,
  handleRemoveDate,
}) => {
  return (
    <>
      <SectionTitle icon={<ClockCircleOutlined />} title="Date" />

      <div className={styles.section}>
        <h5>Créer le {moment(createdAt).format("DD MMM .yyyy")}</h5>
        <Popover
          content={
            <PopupDate
              popupDateRef={popupDateRef}
              setOpenPopupDate={setOpenPopupDate}
              dateLimit={dateLimit}
              setDateLimit={setDateLimit}
              dateStart={dateStart}
              setDateStart={setDateStart}
              handleUpdateDate={handleUpdateDate}
              handleRemoveDate={handleRemoveDate}
              selectedStartDay={selectedStartDay}
              selectedDeadline={selectedDeadline}
              createdAt={createdAt}
            />
          }
          trigger="click"
          color="#45505A"
          placement="bottomLeft"
          open={openPopupDate}
        >
          <div>
            <TaskDate
              isEditable={true}
              startDate={startDate}
              selectedStartDay={selectedStartDay}
              selectedDeadline={selectedDeadline}
              deadline={deadline}
              openPopupDate={openPopupDate}
              setOpenPopupDate={setOpenPopupDate}
            />
          </div>
        </Popover>
      </div>
    </>
  );
};

export default ModalDate;
