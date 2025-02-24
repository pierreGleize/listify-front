import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface DraggableProps {
  id: string;
  columnId: string;
  children: React.ReactNode;
}

const Draggable: React.FC<DraggableProps> = ({ id, children, columnId }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: { columnId },
  });
  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

export default Draggable;
