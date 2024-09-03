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
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import { addNewProject, getCurrentUserProjects } from "../API/ProjectApi";
import { setProjects } from "../ReduxState/projectsSlice";
import { toast, Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputBox from "./InputBox";

const AddProjectModal = () => {
  const dispatch = useDispatch();

  const date = new Date();
  const isoDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [addProjectFormData, setAddProjectFormData] = useState({
    name: "",
    description: "",
    dueByDate: "",
  });

  const handleAddProjectFormChange = (e) => {
    const { name, value } = e.target;
    setAddProjectFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const createProject = async () => {
    try {
      // Check if any input field is empty
      if (
        addProjectFormData.name.trim().length === 0 ||
        addProjectFormData.description.trim().length === 0 ||
        addProjectFormData.dueByDate.trim().length === 0
      ) {
        toast.error("Fields cannot be empty", {
          transition: Flip,
        });
        // Leaving one field empty on create project attempt throws the toast error,
        // but if on the second try, you leave another field empty instead, the code would
        // execute with the value of the empty field from the last attempt in the currently empty field.
        // Reset state values after each error to avoid this.
        setAddProjectFormData({
          name: "",
          description: "",
          dueByDate: isoDate,
        });
        return;
      }

      const projectData = {
        name: addProjectFormData.name,
        description: addProjectFormData.description,
        dueByDate: addProjectFormData.dueByDate,
      };

      await addNewProject(projectData);
      // Fetch the updated projects list
      const result = await getCurrentUserProjects();
      if (result) {
        dispatch(setProjects(result));
      }

      toast.success("Successfully created project!");
    } catch (error) {
      toast.error(error.message, {
        transition: Flip,
      });
    }
  };

  return (
    <div className="w-11/12">
      <div className="flex justify-start">
        <Button onPress={onOpen} className="bg-secondary my-3 text-primary font-semibold">
          Add new project
        </Button>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="bottom-center"
        backdrop="blur"
        classNames={{
          base: "bg-secondary",
          backdrop: "",
          header: "text-white",
          footer: "",
          closeButton: "bg-white",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add Project</ModalHeader>
              <ModalBody>
                <div className="mb-4">
                  <InputBox
                    name="name"
                    inputLabel="Project name"
                    type="text"
                    placeholderData="Enter your project name"
                    handleChange={handleAddProjectFormChange}
                  />
                </div>
                <div className="mb-4">
                  <InputBox
                    name="description"
                    inputLabel="Project description"
                    placeholderData="Write a description for your project"
                    handleChange={handleAddProjectFormChange}
                    inputType="text"
                  />
                </div>
                <div className="mb-4">
                  <InputBox
                    name="dueByDate"
                    inputLabel="Due date"
                    handleChange={handleAddProjectFormChange}
                    placeholderData={
                      addProjectFormData.dueByDate
                        ? format(new Date(addProjectFormData.dueByDate), "yyyy-MM-dd")
                        : ""
                    }
                    inputType="date"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  type="submit"
                  color="secondary"
                  variant="faded"
                  onPress={() => {
                    createProject();
                    onClose();
                  }}
                >
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

export default AddProjectModal;
