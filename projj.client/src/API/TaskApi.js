import axios from "axios";

const baseUrl = "https://localhost:7057/api";

const addNewTask = async (projectId, taskData) => {
  try {
    const response = await axios.post(`${baseUrl}/Task/${projectId}`, taskData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding new task:", error);
    throw error;
  }
};

const getCurrentProjectTasks = async (projectId) => {
  const response = await axios.get(`${baseUrl}/Task/current-project-tasks?projectid=${projectId}`, {
    withCredentials: true,
  });
  console.log(response.data);
  return response.data;
};

const getTaskById = async (taskId) => {
  const response = await axios.get(`${baseUrl}/Task/${taskId}`, {
    withCredentials: true,
  });
  return response.data;
};

const updateTask = async (taskId, taskData) => {
  try {
    // Filter out properties with empty or null values and only send data
    // to backend for properties that user has changed.
    const filteredData = Object.keys(taskData)
      .filter((key) => taskData[key] !== null && taskData[key] !== "")
      .reduce((obj, key) => {
        obj[key] = taskData[key];
        return obj;
      }, {});

    const response = await axios.patch(`${baseUrl}/Task/${taskId}`, filteredData, {
      withCredentials: true,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating project task:", error);
    throw error;
  }
};

const deleteTaskById = async (taskId) => {
  const response = await axios.delete(`${baseUrl}/Task/${taskId}`, {
    withCredentials: true,
  });
  console.log(response.data);
  return response.data;
};

export { updateTask, addNewTask, getTaskById, getCurrentProjectTasks, deleteTaskById };