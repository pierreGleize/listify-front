import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface DroppableProps {
  id: string;
  children: React.ReactNode;
}

const Droppable: React.FC<DroppableProps> = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef}>{children}</div>;
};

export default Droppable;
