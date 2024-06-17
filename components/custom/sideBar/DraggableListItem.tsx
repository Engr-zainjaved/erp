import { useEffect, useRef, useState } from "react";
import Spinner from "../../bootstrap/Spinner";
import Icon from "../../icon/Icon";
import { useDrag, useDrop } from "react-dnd";
import { useRouter } from "next/router";
import useWebSocket from "../../../hooks/useWebSocket";

const DraggableListItem = ({
  branch,
  onDrop,
  onClick,
  isSelected,
  currentStatus,
}: {
  branch: any;
  onDragEnd: any;
  onDrop: any;
  onClick: any;
  onDrag: any;
  isSelected: boolean;
  webSocketStatusData?: any;
  currentStatus?: string;
}) => {
  const router = useRouter();
  const { branchName } = router.query;

  const [{ isDragging }, drag, preview] = useDrag({
    type: "LIST_ITEM",
    item: { branchId: branch.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      drag(ref.current);
    }
  }, [drag]);

  const [{ isOver }, drop] = useDrop({
    accept: "LIST_ITEM",
    drop: (item: { branchId: number }) => {
      if (item.branchId !== branch.id) {
        onDrop(item.branchId);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  drop(ref);

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case "in_progress":
        return <Spinner color="success" isSmall />;
      case "success":
      case "build_succeed":
        return <Icon icon="RadioButtonChecked" color="success" />;
      case "error":
        return <Icon icon="RadioButtonChecked" color="danger" />;
      case "dropped":
      case "expired":
        return <Icon icon="RadioButtonChecked" color="light" />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={ref}
      onClick={() => onClick(branch.id)}
      style={{
        fontWeight: branch.name === branchName ? "bold" : "regular",
        cursor: "pointer",
        height: "30px",
        background: isSelected ? "grey" : "black",
        borderBottom: "1px solid white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 17px",
      }}
    >
      <div>{branch.name}</div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginRight: "5px" }}>{branch?.version}</div>

        {getStatusIcon(currentStatus)}
      </div>
    </div>
  );
};

export default DraggableListItem;
