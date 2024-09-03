import axios from "axios";

const baseUrl = "https://localhost:7057/api";

const getCurrentUserProjects = async () => {
  const response = await axios.get(`${baseUrl}/Project/current-user-projects`, {
    withCredentials: true,
  });
  return response.data;
};

const getProjectById = async (projectId) => {
  const response = await axios.get(`${baseUrl}/Project/${projectId}`, {
    withCredentials: true,
  });
  return response.data;
};

const addNewProject = async (projectData) => {
  try {
    const response = await axios.post(`${baseUrl}/Project`, projectData, {
      withCredentials: true,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding new project:", error);
    throw error;
  }
};

const updateProjectData = async (
  projectId,
  name = "",
  description = "",
  status = "",
  dueByDate = ""
) => {
  try {
    const response = await axios.patch(
      `${baseUrl}/Project/${projectId}`,
      {
        name,
        description,
        status,
        dueByDate,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

const deleteProject = async (projectName) => {
  const result = await axios.delete(`https://localhost:7057/api/Project/${projectName}`, {
    withCredentials: true,
  });
  console.log(result);
  return result;
};

export { updateProjectData, getProjectById, addNewProject, getCurrentUserProjects, deleteProject };
