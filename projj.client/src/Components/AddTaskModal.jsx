import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import "react-datepicker/dist/react-datepicker.css";
import { addNewTask, getCurrentProjectTasks } from "../API/TaskApi";
import { toast, Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputBox from "./InputBox";

const AddTaskModal = ({ projectId, setCurrentProjectTasks, currentProjectTasks }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [addTaskFormData, setAddTaskFormData] = useState({
    name: "",
    description: "",
  });

  const handleAddTaskFormChange = (e) => {
    const { name, value } = e.target;
    setAddTaskFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      if (addTaskFormData.name === "" || addTaskFormData.description === "") {
        toast.error("Task fields cannot be empty", {
          transition: Flip,
        });
        // reset addTaskFormData properties to prevent data from previous requests
        // being used in new requests.
        setAddTaskFormData({ name: "", description: "" });
        return;
      }
      const newTask = await addNewTask(projectId, addTaskFormData);
      console.log("new task ", newTask);
      const result = await getCurrentProjectTasks(projectId);
      if (result) {
        setCurrentProjectTasks((prevState) => {
          return [...prevState, newTask];
        });
        console.log("new tasks", currentProjectTasks);
      }

      toast("Successfully created task!", {
        transition: Flip,
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-32 text-center">
      <Button onPress={onOpen} className="bg-secondary my-3 text-primary font-semibold">
        Add new task
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
          body: "text-secondary",
          footer: "",
          closeButton: "bg-white",
        }}
      >
        <form onSubmit={createTask}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-white">Add Task</ModalHeader>
                <ModalBody>
                  <div className="mb-4">
                    <InputBox
                      name="name"
                      inputLabel="Name"
                      placeholderData="Enter task name"
                      type="text"
                      handleChange={handleAddTaskFormChange}
                    />
                  </div>
                  <div className="mb-4">
                    <InputBox
                      name="description"
                      inputLabel="Description"
                      placeholderData="Enter task description"
                      inputType="text"
                      handleChange={handleAddTaskFormChange}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" variant="light" onPress={onClose}>
                    <div className="text-dmWhite">Close</div>
                  </Button>
                  <Button
                    type="submit"
                    color="secondary"
                    variant="faded"
                    onPress={() => {
                      onClose();
                    }}
                  >
                    <div className="text-dmWhite">Confirm</div>
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </div>
  );
};

export default AddTaskModal;
