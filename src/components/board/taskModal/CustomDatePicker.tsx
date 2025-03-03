"use client";
import React, { useState, useRef } from "react";
import DatePicker, { CalendarContainer } from "react-datepicker";
import { ReactElement } from "react";
import styles from "../../../styles/board/taskModal/CustomDatePicker.module.css";
import BtnTask from "@/components/commun/BtnTask";

interface CustomDatePickerProps {
  dateLimit: Date | null;
  setDateLimit: (date: Date | null) => void;
  handleAddDateLimit: (selectedDate: Date | null) => Promise<void>;
  customInput: ReactElement;
  dateCreationTask: string;
  dateLimiteTask: string | null;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  dateLimit,
  handleAddDateLimit,
  setDateLimit,
  customInput,
  dateCreationTask,
  dateLimiteTask,
}) => {
  const [isCheckedStartDay, setIsCheckedStartDay] = useState(false);
  const [isCheckedDateLimit, setIsCheckedDateLimit] = useState(false);
  // const [closeOnSelect, setCloseOnSelect] = useState(false);
  const datePickerRef = useRef<DatePicker | null>(null);

  const isWeekday = (date: Date): boolean => {
    const day = date.getDay();
    return day !== 0;
  };

  // console.log(isCheckedStartDay, isCheckedDateLimit);

  // const calendarContainer: React.FC<{
  //   className?: string;
  //   children: ReactElement;
  // }> = ({ className, children }) => {
  //   return (
  //     <div
  //       style={{
  //         backgroundColor: "#45505A",
  //         padding: "20px",
  //         borderRadius: "10px",
  //         marginTop: "150px",
  //       }}
  //     >
  //       <div
  //         style={{
  //           display: "flex",
  //           alignItems: "center",
  //           justifyContent: "center",
  //         }}
  //       >
  //         <span style={{ fontSize: "18px", fontWeight: "600" }}>Dates</span>

  //         {/* <CrossToClose action={}/> */}
  //       </div>

  //       <div style={{ margin: "20px 0px" }}>
  //         <CalendarContainer className={className}>
  //           {children}
  //         </CalendarContainer>
  //       </div>
  //       <h5 style={{ backgroundColor: "#F0F0F0", marginBottom: "1rem" }}>
  //         Afficher la date de début
  //       </h5>

  //       <div
  //         style={{
  //           marginBottom: "1rem",
  //           display: "flex",
  //           alignItems: "center",
  //           gap: "10px",
  //         }}
  //       >
  //         <input
  //           type="checkbox"
  //           checked={isCheckedStartDay}
  //           onChange={(e) => setIsCheckedStartDay(e.target.checked)}
  //           className={styles.customCheckbox}
  //         />
  //         {dateCreationTask}
  //       </div>
  //       <h5 style={{ backgroundColor: "#F0F0F0", marginBottom: "1rem" }}>
  //         Afficher la date limite
  //       </h5>
  //       <div
  //         style={{
  //           marginBottom: "1rem",
  //           display: "flex",
  //           alignItems: "center",
  //           gap: "10px",
  //         }}
  //       >
  //         <input
  //           type="checkbox"
  //           checked={isCheckedDateLimit}
  //           onChange={(e) => setIsCheckedDateLimit(e.target.checked)}
  //           className={styles.customCheckbox}
  //         />
  //         {dateLimiteTask}
  //       </div>
  //       <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
  //         <BtnTask
  //           color="black"
  //           bgColor="#579DFF"
  //           bgColorHover="#85B8FF"
  //           text="Enregistrer"
  //           width="100%"
  //           action={() => datePickerRef.current?.setOpen(false)}
  //         />
  //         <BtnTask
  //           color="#e3e6e9"
  //           bgColor="#323940"
  //           bgColorHover="#3d454f"
  //           text="Effacer"
  //           width="100%"
  //           action={() => datePickerRef.current?.setOpen(false)}
  //         />
  //       </div>
  //     </div>
  //   );
  // };

  return (
    // <DatePicker
    //   ref={datePickerRef}
    //   selected={dateLimit}
    //   customInput={customInput}
    //   showTimeSelect
    //   timeFormat="HH:mm"
    //   popperClassName={styles.poperDate}
    //   timeIntervals={15}
    //   timeCaption="time"
    //   minDate={new Date()}
    //   filterDate={isWeekday}
    //   shouldCloseOnSelect={false}
    //   // portalId="caca"
    //   popperPlacement="left"
    //   // calendarContainer={calendarContainer}
    //   filterTime={(time) => {
    //     const now = new Date();
    //     const selectedDate = dateLimit || now;
    //     const isToday =
    //       selectedDate.getDate() === now.getDate() &&
    //       selectedDate.getMonth() === now.getMonth() &&
    //       selectedDate.getFullYear() === now.getFullYear();

    //     const hour = time.getHours();
    //     const minute = time.getMinutes();

    //     if (isToday) {
    //       return (
    //         hour > now.getHours() ||
    //         (hour === now.getHours() && minute >= now.getMinutes())
    //       );
    //     }
    //     return hour >= 7 && hour <= 20;
    //   }}
    //   onChange={(date) => {
    //     if (date) {
    //       setDateLimit(date);
    //       handleAddDateLimit(date);
    //     }
    //   }}
    // />
  );
};

export default CustomDatePicker;
