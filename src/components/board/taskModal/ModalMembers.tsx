import React from "react";
import { Popover, Avatar } from "antd";
import Members from "../../commun/Members";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../styles/board/taskModal/ModalMembers.module.css";
import { User } from "@/app/redux/slices/boardSlice";
import { UserOutlined } from "@ant-design/icons";
import SectionTitle from "./SectionTitle";

interface ModalMembersProps {
  members: User[];
}

const ModalMembers: React.FC<ModalMembersProps> = ({ members }) => {
  const collaborators =
    members.length > 0 &&
    members.map((user, i) => {
      const initialLetters =
        user.firstname.charAt(0).toUpperCase() +
        user.lastname.charAt(0).toUpperCase();

      return (
        <Members
          key={i}
          initialLetters={initialLetters}
          size="large"
          color="red"
          popHoverName={`${user.firstname} ${user.lastname}`}
        />
      );
    });
  const popContent = (
    <div className={styles.popContainer}>
      <div className={styles.popTitle}>Membres</div>
      <div>
        <input
          type="text"
          placeholder="Ajouter un membre"
          className={styles.popInput}
        />
      </div>
      <div>
        <div className={styles.popUnderTitle}>Liste des membres</div>
        <div className={styles.popMembersContainer}>
          {members.length === 0
            ? "Aucun membre n'est associé à cette carte"
            : members.map((user, i) => {
                const initialLetters =
                  user.firstname.charAt(0).toUpperCase() +
                  user.lastname.charAt(0).toUpperCase();

                return (
                  <div key={i} className={styles.popMembers}>
                    <Members
                      initialLetters={initialLetters}
                      size="small"
                      color="red"
                      popHoverName={null}
                    />
                    {`${user.firstname} 
                       ${user.lastname}`}
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
  return (
    <>
      <SectionTitle icon={<UserOutlined />} title="Membres" />
      <div className={styles.section}>
        <div className={styles.membersContainer}>
          <Popover
            content={popContent}
            getPopupContainer={(triggerNode) =>
              triggerNode.parentElement || document.body
            }
            trigger="click"
            placement="right"
            color="#282e33"
          >
            <FontAwesomeIcon icon={faPlus} className={styles.btnJoin} />
          </Popover>
          <Avatar.Group
            shape="circle"
            max={{
              count: 3,
              style: { color: "#45505A", backgroundColor: "#e3e6e9" },
            }}
          >
            {collaborators}
          </Avatar.Group>
        </div>
      </div>
    </>
  );
};

export default ModalMembers;
