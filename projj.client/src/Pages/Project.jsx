import React, { useEffect, useState } from "react";
import { getProjectById } from "../API/ProjectApi";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { updateProjectData } from "../API/ProjectApi";
import { getCurrentProjectTasks, updateTask, getTaskById } from "../API/TaskApi";
import { toast, Flip } from "react-toastify";
import TextareaAutosize from "react-textarea-autosize";
import { formatDate } from "../Utils/utils";
import "../styles/Project.css";
import AddTaskModal from "../Components/AddTaskModal";
import EditTaskModal from "../Components/EditTaskModal";
import ConfirmTaskDeleteModal from "../Components/ConfirmTaskDeleteModal";

const Project = () => {
  const { projectId } = useParams();

  const [singleProject, setSingleProject] = useState([]);
  const [currentProjectTasks, setCurrentProjectTasks] = useState([]);
  const [projectProgressPercentage, setProjectProgressPercentage] = useState(0);

  const [projectFormData, setProjectFormData] = useState({
    name: "",
    description: "",
    status: "",
    dueByDate: "",
  });

  const [taskFormData, setTaskFormData] = useState({
    name: "",
    isCompleted: null,
    description: "",
    status: "",
    priority: "",
    dueByDate: "",
  });

  const handleProjectFormChange = (e) => {
    const { name, value } = e.target;
    setProjectFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTaskFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTaskFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const fetchProjectById = async (projectId) => {
    const response = await getProjectById(projectId);
    setSingleProject(response);
    console.log("single project", singleProject);
    setProjectFormData({
      name: response.name,
      description: response.description,
      status: response.status,
      progress: response.progress,
      dueByDate: response.dueByDate ? format(new Date(response.dueByDate), "yyyy-MM-dd") : "",
    });
    return response;
  };

  const fetchProjectTasks = async () => {
    const response = await getCurrentProjectTasks(projectId);
    console.log("Fetched Project Tasks:", response);
    if (response) {
      setCurrentProjectTasks(response);
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProjectData(
        projectId,
        projectFormData.name,
        projectFormData.description,
        projectFormData.status,
        projectFormData.dueByDate
      );
      toast.success("Project updated successfully!");
      return response;
    } catch (error) {
      toast.error("Error updating project: " + error.message);
    }
  };

  const handleTaskUpdate = async (taskId) => {
    try {
      const taskBeingUpdated = await getTaskById(taskId);

      const formattedTaskData = {
        ...taskFormData,
        dueByDate: taskFormData.dueByDate && new Date(taskFormData.dueByDate).toISOString(),
      };
      const updatedTask = await updateTask(taskId, formattedTaskData);

      toast.success(
        <div>
          Successfully updated task with pre-update name of{" "}
          <span style={{ color: "red" }}>{taskBeingUpdated.name.substring(0, 20)}</span>
          ...
        </div>,
        {
          transition: Flip,
        }
      );

      setCurrentProjectTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );

      // Reset task form data after update to prevent user from using data from
      // previous field update request when clicking edit task and clicking confirm without
      // inputting new data. Prevents accidental task updates.
      setTaskFormData("name", "");
      setTaskFormData("isCompleted", null);
      setTaskFormData("description", "");
      setTaskFormData("status", "");
      setTaskFormData("priority", "");
      setTaskFormData("dueByDate", "");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleTaskFormSubmit = (e) => {
    e.preventDefault();
    handleTaskUpdate(taskId, taskFormData);
  };

  useEffect(() => {
    fetchProjectById(projectId);
    fetchProjectTasks(projectId);
  }, []);

  useEffect(() => {
    // calculate progress of the amount of tasks completed in the project as a percentage
    const handleSetProjectProgressPercentage = async () => {
      const project = await getProjectById(projectId);
      if (project.tasks) {
        let taskArrayLength = project.tasks.length;
        let completedTaskCount = 0;
        project.tasks.map((task) => {
          if (task.isCompleted === true) {
            completedTaskCount++;
          }
        });

        const completedTaskPercentage = (completedTaskCount / taskArrayLength) * 100;
        setProjectProgressPercentage(completedTaskPercentage);
        console.log("TESTING: ", projectProgressPercentage);
      }
    };

    handleSetProjectProgressPercentage();
  }, [currentProjectTasks]);

  return (
    <div className="bg-primary flex flex-col m-auto w-screen bg-cover pt-24">
      <h1 className="m-auto text-4xl mt-12 mb-4 text-secondary">Project</h1>
      <form
        onSubmit={handleUpdateProject}
        className="outline outline-secondary rounded-3xl w-10/12 m-auto"
      >
        <div className="project-props flex w-full justify-evenly">
          <div className="text-center text-black">
            <div className="text-secondary font-bold">Name</div>
            <div className="text-tertiary mb-4 mt-4">
              <input
                name="name"
                onChange={handleProjectFormChange}
                value={projectFormData.name}
                className="text-center w-48 bg-transparent outline outline-secondary rounded focus:outline-secondary"
              />
            </div>
          </div>
          <div className="text-center text-black">
            <div className="text-secondary font-bold">Description</div>
            <div className="text-tertiary">
              <div className="text-tertiary mb-4 mt-4">
                <input
                  name="description"
                  onChange={handleProjectFormChange}
                  value={projectFormData.description}
                  className="text-center w-48 bg-transparent outline outline-secondary rounded focus:outline-secondary"
                />
              </div>
            </div>
          </div>
          <div className="text-center text-black">
            <div className="text-secondary font-bold">Status</div>
            <div className="text-tertiary">
              <div className="text-tertiary mb-4 mt-4">
                <input
                  name="status"
                  onChange={handleProjectFormChange}
                  value={projectFormData.status}
                  className="text-center w-48 bg-transparent outline outline-secondary rounded focus:outline-secondary"
                />
              </div>
            </div>
          </div>
          <div className="text-center text-black">
            <div className="text-secondary font-bold">Progress</div>
            <div className="text-tertiary">
              <div className="max-w-48 m-auto text-tertiary mb-4 mt-4 bg-teal-500">
                {isNaN(projectProgressPercentage)
                  ? "There are no tasks"
                  : projectProgressPercentage.toFixed(2) + "%"}
              </div>
            </div>
          </div>
          <div className="text-center text-black">
            <div className="text-secondary font-bold">Start Date</div>
            <div className="text-tertiary">
              <div className="text-tertiary mb-4 mt-4">{formatDate(singleProject.startDate)}</div>
            </div>
          </div>
          <div className="text-center text-black">
            <div className="text-secondary font-bold">Due Date</div>
            <div className="text-tertiary">
              <div className="text-tertiary mb-4 mt-4">
                <input
                  name="dueByDate"
                  onChange={handleProjectFormChange}
                  type="date"
                  value={projectFormData.dueByDate}
                  className="text-center w-48 bg-transparent outline outline-secondary rounded focus:outline-secondary"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button className="hidden">Submit</button>
          </div>
        </div>
      </form>

      {/* --------------- TASKS --------------- */}
      <h1 className="m-auto text-4xl mt-12 mb-4 text-secondary">Tasks</h1>

      <div className="w-10/12 m-auto">
        <AddTaskModal
          projectId={projectId}
          setCurrentProjectTasks={setCurrentProjectTasks}
          currentProjectTasks={currentProjectTasks}
        />
      </div>
      {currentProjectTasks.length > 0 ? (
        <form onSubmit={handleTaskFormSubmit} className="w-10/12 m-auto text-tertiary">
          {currentProjectTasks &&
            currentProjectTasks.map((task) => (
              <div className="flex" key={task.id}>
                <div className="m-auto">
                  <ConfirmTaskDeleteModal
                    task={task}
                    taskId={task.id}
                    projectId={projectId}
                    setCurrentProjectTasks={setCurrentProjectTasks}
                  />
                </div>
                <div
                  className={
                    !task.isCompleted
                      ? "project-props outline outline-secondary rounded-3xl mt-3 mb-3 flex flex-wrap w-full justify-evenly"
                      : "project-props text-tertiary bg-teal-400 rounded-3xl mt-3 mb-3 flex flex-wrap w-full justify-evenly scale-x-95 scaly-y-95 duration-300"
                  }
                >
                  <div className="flex flex-col text-center text-tertiary">
                    <div className="text-secondary font-bold">Name</div>
                    <TextareaAutosize
                      className="text-center text-tertiary m-4 bg-transparent"
                      minRows={1}
                      maxRows={6}
                      value={task.name}
                    />
                  </div>
                  <div className="flex flex-col text-center text-tertiary">
                    <div className="text-secondary font-bold">Completed?</div>
                    <div className="text-center text-tertiary m-4 bg-transparent">
                      {task?.isCompleted?.toString() ?? "undefined"}
                    </div>
                  </div>
                  <div className="flex flex-col text-center text-tertiary">
                    <div className="text-secondary font-bold">Description</div>
                    <TextareaAutosize
                      className="text-center text-tertiary m-4 bg-transparent"
                      minRows={1}
                      maxRows={6}
                      value={task.description}
                    />
                  </div>
                  <div className="flex flex-col text-center text-tertiary">
                    <div className="text-secondary font-bold">Status</div>
                    <TextareaAutosize
                      className="text-center text-tertiary m-4 bg-transparent"
                      minRows={1}
                      maxRows={6}
                      value={task.status}
                    />
                  </div>
                  <div className="flex flex-col text-center text-tertiary">
                    <div className="text-secondary font-bold">Priority</div>
                    <div className="text-center text-tertiary m-4 bg-transparent">
                      {task.priority}
                    </div>
                  </div>
                  <div className="flex flex-col text-center text-tertiary">
                    <div className="text-secondary font-bold">Due Date</div>
                    <div className="text-tertiary m-4">
                      {task.dueByDate ? format(new Date(task.dueByDate), "dd-MM-yyyy") : ""}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button className="hidden">Submit</button>
                  </div>
                </div>
                <div className="flex text-center items-center">
                  <EditTaskModal
                    task={task}
                    taskId={task.id}
                    handleTaskFormChange={handleTaskFormChange}
                    taskFormData={taskFormData}
                    handleTaskUpdate={handleTaskUpdate}
                  />
                </div>
              </div>
            ))}
        </form>
      ) : (
        <div className="mt-12 mb-12 text-2xl text-secondary font-semibold text-center">
          There are no tasks for this project. Click "Add new task" to build your task list!
        </div>
      )}
    </div>
  );
};

export default Project;
