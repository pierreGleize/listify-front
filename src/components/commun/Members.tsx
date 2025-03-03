import React from "react";
import { Avatar, Popover } from "antd";
import type { AvatarSize } from "antd/es/avatar/AvatarContext";

interface MembersProps {
  initialLetters: string;
  size: AvatarSize;
  color: string;
  popHoverName: string | null;
}

const Members: React.FC<MembersProps> = ({
  initialLetters = "AZ",
  size = "large",
  color = "red",
  popHoverName = null,
}) => {
  return (
    <Avatar
      style={{ backgroundColor: color, verticalAlign: "middle" }}
      size={size}
      gap={5}
    >
      {popHoverName ? (
        <Popover
          color="#282e33"
          content={<p className="popHoverContainer">{popHoverName}</p>}
          placement="right"
        >
          {initialLetters}
        </Popover>
      ) : (
        initialLetters
      )}
    </Avatar>
  );
};

export default Members;
