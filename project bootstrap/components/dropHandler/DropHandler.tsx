import React, { ReactNode, useState } from "react";
import { useDrop } from "react-dnd";
import Accordion, { AccordionItem } from "../bootstrap/Accordion";
import Select from "../bootstrap/forms/Select";
import Input from "../bootstrap/forms/Input";

import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from "../bootstrap/Modal";
import Button from "../bootstrap/Button";
import Spinner from "../bootstrap/Spinner";

interface DropHandlerProps {
  environment: string;
  environmentId: any;
  children: ReactNode;
  stageChange: (draggedBranchId: any, targetBranchId: any) => void;
  isLoading: boolean;
}

const DropHandler: React.FC<DropHandlerProps> = ({
  environment,
  environmentId,
  children,
  stageChange,
  isLoading,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "LIST_ITEM",
    drop: (item: { branchId: number }) => {
      setIsStageModalOpen(true);
      setDraggedBranchId(item.branchId);
      setTargetBranchId(environmentId);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [isStageModalOpen, setIsStageModalOpen] = useState<boolean>(false);
  const [draggedBranchId, setDraggedBranchId] = useState<any>(null);
  const [targetBranchId, setTargetBranchId] = useState<any>(null);

  const handleStageChange = async (draggedBranchId: any, targetBranchId: any) => {
    if (draggedBranchId && targetBranchId) {
      stageChange(draggedBranchId, targetBranchId);
      setIsStageModalOpen(false);
    }
  };

  return (
    <div key={environment} ref={drop} style={{ background: isOver ? "lightgray" : "grey" }}>
      <Accordion key={environment} id={`acc${environment}-shadow-2`} shadow="none" isFlush={true}>
        <AccordionItem activeItem={false} id={`accor${environment}-shadow-2`} title={environment}>
          {children}
        </AccordionItem>
      </Accordion>

      <Modal
        id="{String}"
        titleId="{String}"
        isOpen={isStageModalOpen}
        setIsOpen={setIsStageModalOpen}
        isStaticBackdrop={true}
        isScrollable={false}
        isCentered={false}
        size="lg"
        fullScreen="md"
        isAnimation={true}
      >
        <ModalHeader className="{String}" setIsOpen={setIsStageModalOpen}>
          <ModalTitle id="{String}">Are you sure you want to Change Stage?</ModalTitle>
        </ModalHeader>
        <ModalBody className="{String}">
          Before using Staging branches, you need to setup your production branch by Drag & Dropping
          a branch to Production. Staging branches are used to test your new features, with the
          production data.
        </ModalBody>
        <ModalFooter className="{String}">
          <Button
            color="danger"
            isLight
            onClick={() => {
              setIsStageModalOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            color="success"
            onClick={() => {
              handleStageChange(draggedBranchId, targetBranchId);
            }}
          >
            {isLoading ? <Spinner size="1.2rem" /> : "Stage Change"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default DropHandler;
