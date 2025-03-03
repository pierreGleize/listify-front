import BtnTask from "@/components/commun/BtnTask";
import React, { RefObject, useState, forwardRef, useEffect } from "react";
import styles from "../../../styles/board/taskModal/PopupDate.module.css";
import CrossToClose from "@/components/commun/CrossToClose";
import DatePicker from "react-datepicker";
import moment from "moment";

interface PopupDateProps {
  popupDateRef: RefObject<HTMLDivElement | null> | null;
  setOpenPopupActionDate?: (open: boolean) => void;
  dateLimit: Date | null;
  setDateLimit: (date: Date | null) => void;
  handleUpdateDate: (
    deadlineSelected: Date | null,
    startDaySelected: Date | null,
    isDeadlineChecked: boolean,
    isStartDayChecked: boolean
  ) => Promise<void>;
  dateStart: Date | null;
  setDateStart: (date: Date | null) => void;
  selectedDeadline: boolean;
  selectedStartDay: boolean;
  createdAt: Date;
  setOpenPopupDate: (open: boolean) => void;
  handleRemoveDate: () => Promise<void>;
}

const PopupDate: React.FC<PopupDateProps> = ({
  popupDateRef,
  setOpenPopupActionDate,
  dateLimit,
  dateStart,
  setDateStart,
  setDateLimit,
  handleUpdateDate,
  selectedDeadline,
  selectedStartDay,
  createdAt,
  setOpenPopupDate,
  handleRemoveDate,
}) => {
  const [checkedStartDay, setCheckedStartDay] = useState(selectedStartDay);
  const [checkedDateLimit, setCheckedDateLimit] = useState(selectedDeadline);

  useEffect(() => {
    setCheckedStartDay(selectedStartDay);
    setCheckedDateLimit(selectedDeadline);
  }, [selectedStartDay, selectedDeadline]);

  // const isWeekday = (date: Date): boolean => {
  //   const day = date.getDay();
  //   return day !== 0;
  // };

  const CustomInput = forwardRef<
    HTMLButtonElement,
    {
      value?: string;
      onClick?: () => void;
      className?: string;
      disabled: boolean;
      defaultString: boolean;
    }
  >(({ value, onClick, className, disabled, defaultString }, ref) => {
    return (
      <button
        className={className}
        onClick={onClick}
        ref={ref}
        disabled={disabled}
      >
        {defaultString ? "DD/MM/YYYY : HH/mm" : value}
      </button>
    );
  });
  CustomInput.displayName = "CustomInput";

  return (
    <div ref={popupDateRef} className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Dates</span>

        <CrossToClose
          fontSize="18px"
          action={() => {
            setOpenPopupDate(false);
            if (setOpenPopupActionDate) {
              setOpenPopupActionDate(false);
            }
          }}
        />
      </div>

      <h5 className={styles.sectionTitle}>Afficher la date de début</h5>

      <div className={styles.section}>
        <input
          type="checkbox"
          checked={checkedStartDay}
          onChange={(e) => {
            setCheckedStartDay(e.target.checked);
            if (!checkedStartDay) {
              setDateStart(dateStart ?? new Date(createdAt));
            } else {
              setDateStart(null);
            }
          }}
          className={styles.customCheckbox}
        />
        <DatePicker
          selected={dateStart ?? new Date(createdAt)}
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="d/MM/YYYY HH:mm"
          customInput={
            <CustomInput
              className={styles.customInput}
              disabled={!checkedStartDay}
              defaultString={false}
            />
          }
          disabled={!checkedStartDay}
          timeIntervals={15}
          timeCaption="time"
          // filterDate={isWeekday}
          popperPlacement="top"
          onChange={(date) => {
            if (date) {
              setDateStart(date);
            }
          }}
        />
      </div>
      <h5 className={styles.sectionTitle}>Afficher la date limite</h5>
      <div className={styles.section}>
        <input
          type="checkbox"
          checked={checkedDateLimit}
          onChange={(e) => {
            setCheckedDateLimit(e.target.checked);
            if (!checkedDateLimit) {
              setDateLimit(
                moment(dateStart ?? new Date())
                  .add(1, "days")
                  .toDate()
              );
            } else {
              setDateLimit(null);
            }
          }}
          className={styles.customCheckbox}
        />
        <DatePicker
          selected={dateLimit ?? moment(new Date()).add(1, "days").toDate()}
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="d/MM/YYYY HH:mm"
          customInput={
            <CustomInput
              className={styles.customInput}
              disabled={!checkedDateLimit}
              defaultString={!checkedDateLimit}
            />
          }
          disabled={!checkedDateLimit}
          timeIntervals={15}
          timeCaption="time"
          minDate={dateStart ?? moment(new Date()).add(1, "days").toDate()}
          // filterDate={isWeekday}
          popperPlacement="top"
          // filterTime={(time) => {
          //   const now = new Date();
          //   const selectedDate = dateLimit || now;
          //   const isToday =
          //     selectedDate.getDate() === now.getDate() &&
          //     selectedDate.getMonth() === now.getMonth() &&
          //     selectedDate.getFullYear() === now.getFullYear();

          //   const hour = time.getHours();
          //   const minute = time.getMinutes();

          //   if (isToday) {
          //     return (
          //       hour > now.getHours() ||
          //       (hour === now.getHours() && minute >= now.getMinutes())
          //     );
          //   }
          //   return hour >= 7 && hour <= 20;
          // }}
          onChange={(date) => {
            if (date) {
              setDateLimit(date);
            }
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <BtnTask
          color="black"
          bgColor="#579DFF"
          bgColorHover="#85B8FF"
          text="Enregistrer"
          width="100%"
          action={() =>
            handleUpdateDate(
              dateStart,
              dateLimit,
              checkedStartDay,
              checkedDateLimit
            )
          }
        />
        <BtnTask
          color="#e3e6e9"
          bgColor="#323940"
          bgColorHover="#3d454f"
          text="Effacer"
          width="100%"
          action={() => handleRemoveDate()}
        />
      </div>
    </div>
  );
};

export default PopupDate;
