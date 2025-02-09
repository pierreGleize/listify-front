import React from "react";
import { Button, Modal } from "antd";
import styles from "../../styles/mapped/TaskModal.module.css";
import { CloseOutlined } from "@ant-design/icons";

interface TaskModalProps {
  openTaskModal: boolean;
  closeModal: () => void;
  //   loading: boolean;
}

const TaskModal: React.FC<TaskModalProps> = ({
  openTaskModal,
  closeModal,
  //   loading,
}) => {
  return (
    <Modal
      title={<p style={{ color: "white" }}>Loading Modal</p>}
      //   centered={true}
      className={styles["task-modal"]}
      width={"60%"}
      closeIcon={<CloseOutlined style={{ color: "white" }} />}
      //   loading={loading}
      styles={{
        content: {
          background: "#194f57",
          color: "white",
          borderRadius: "10px",
        },
        header: { background: "#194f57", color: "white" },
        footer: { background: "#194f57", borderTop: "none" },
      }}
      footer={<Button type="primary">Confirmer</Button>}
      //   loading={loading}
      open={openTaskModal}
      onCancel={closeModal}
    >
      <div>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </div>
    </Modal>
  );
};

export default TaskModal;
