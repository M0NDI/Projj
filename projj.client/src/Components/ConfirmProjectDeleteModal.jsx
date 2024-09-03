import React from "react";
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
import { getCurrentUserProjects, deleteProject } from "../API/ProjectApi";
import { setProjects } from "../ReduxState/projectsSlice";
import { toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";

const ConfirmProjectDeleteModal = ({ projectName }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const dispatch = useDispatch();

  const removeProject = async () => {
    const result = await deleteProject(projectName);

    if (result) {
      const updatedProjectsList = await getCurrentUserProjects();
      if (updatedProjectsList) {
        console.log("CURRENT USER PROJECTS: ", updatedProjectsList);
        dispatch(setProjects(updatedProjectsList));
      }
    }

    toast(
      <div>
        Successfully deleted project with name of{" "}
        <span style={{ color: "red" }}>{projectName}</span>
      </div>,
      {
        transition: Flip,
      }
    );
  };

  return (
    <div className="flex justify-center items-center">
      <div
        onClick={onOpen}
        className="cursor-pointer p-1 m-2 w-8 h-8 flex items-center justify-center rounded-full hover:outline outline-secondary outline-8 hover:scale-x-75 hover:scale-y-75 transition-all duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="red"
          viewBox="0 0 16 16"
          width="16"
          height="16"
        >
          <path d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L6.94 8 4.97 9.97a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215L8 9.06l1.97 1.97a.749.749 0 0 0 1.275-.326.749.749 0 0 0-.215-.734L9.06 8l1.97-1.97a.749.749 0 0 0-.326-1.275.749.749 0 0 0-.734.215L8 6.94Z"></path>
        </svg>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="bottom-center"
        backdrop="blur"
        classNames={{
          base: "bg-secondary",
          backdrop: "",
          header: "text-green-900",
          body: "text-primary",
          footer: "text-green-200",
          closeButton: "bg-white",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white">Delete project</ModalHeader>
              <ModalBody>
                <div className="text-dmWhite">
                  Are you sure you want to delete this project with name
                  <p className="text-green-300">"{projectName}"</p>
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
                    removeProject(removeProject);
                  }}
                >
                  <div className="text-dmWhite">Confirm</div>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ConfirmProjectDeleteModal;
