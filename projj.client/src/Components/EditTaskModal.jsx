import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import InputBox from "./InputBox";

const EditTaskModal = ({ task, taskId, handleTaskFormChange, handleTaskUpdate }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Separate state to handle whether the isCompleted checkbox is ticked or not
  // by default when a user clicks the edit task button based on whether the task.isCompleted
  // value is true or false.
  const [isCompleted, setIsCompleted] = useState(task?.isCompleted ?? false);

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setIsCompleted(checked);
    handleTaskFormChange({
      target: {
        name: "isCompleted",
        value: checked,
      },
    });
  };

  const handleUpdateSubmit = async () => {
    console.log("Submitting update for task:", taskId);
    await handleTaskUpdate(task.id);
    onOpenChange(false);
  };

  useEffect(() => {
    setIsCompleted(task?.isCompleted ?? false);
  }, [task]);

  return (
    <div className="w-32">
      <Button onPress={onOpen} className="bg-secondary my-3 text-primary font-semibold">
        Edit task
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="bottom-center"
        backdrop="blur"
        classNames={{
          base: "bg-secondary",
          backdrop: "",
          header: "text-white",
          footer: "text-green-200",
          closeButton: "bg-white",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Task</ModalHeader>
              <ModalBody>
                <div className="mb-4">
                  <InputBox
                    inputLabel="Name"
                    name="name"
                    handleChange={handleTaskFormChange}
                    placeholderData={task.name}
                    inputType="text"
                  />
                </div>
                <div className="mb-4">
                  <InputBox
                    inputLabel="Is completed?"
                    name="isCompleted"
                    handleChange={handleCheckboxChange}
                    checked={isCompleted}
                    inputType="checkbox"
                  />
                </div>
                <div className="mb-4">
                  <InputBox
                    inputLabel="Description"
                    name="description"
                    handleChange={handleTaskFormChange}
                    placeholderData={task.description}
                    inputType="text"
                  />
                </div>
                <div className="mb-4">
                  <InputBox
                    inputLabel="Status"
                    name="status"
                    handleChange={handleTaskFormChange}
                    placeholderData={task.status}
                    inputType="text"
                  />
                </div>
                <div className="mb-4">
                  <InputBox
                    inputLabel="Priority"
                    name="priority"
                    handleChange={handleTaskFormChange}
                    placeholderData={task.priority}
                    inputType="text"
                  />
                </div>
                <div className="mb-4">
                  <InputBox
                    name="dueByDate"
                    inputLabel="Due date"
                    handleChange={handleTaskFormChange}
                    placeholderData={
                      task.dueByDate ? format(new Date(task.dueByDate), "yyyy-MM-dd") : ""
                    }
                    inputType="date"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  <div className="text-dmWhite">Close</div>
                </Button>
                <Button color="secondary" variant="faded" onPress={handleUpdateSubmit}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EditTaskModal;
