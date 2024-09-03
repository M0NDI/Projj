import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "@nextui-org/react";
import { formatDate } from "../Utils/utils";
import "../styles/Projects.css";
import AddProjectModal from "../Components/AddProjectModal";
import { getCurrentUserProjects } from "../API/ProjectApi";
import { setProjects } from "../ReduxState/projectsSlice";
import ConfirmProjectDeleteModal from "../Components/ConfirmProjectDeleteModal";

const Projects = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser.value);
  const projects = useSelector((state) => state.projects.value);

  // useCallback prevents infinite request loop that would occur if projects
  // was passed as a dependency of the useEffect that calls fetchUserProjects()
  const fetchUserProjects = useCallback(async () => {
    const result = await getCurrentUserProjects();
    if (result) {
      dispatch(setProjects(result));
    }
  }, [projects]);

  useEffect(() => {
    fetchUserProjects();
  }, []);

  return (
    <div className="flex bg-primary min-h-screen flex-col items-center pt-24 cover w-full">
      <div className="flex flex-col items-center w-10/12 min-w-1/2 p-2">
        <AddProjectModal />
        {currentUser && (
          <div className="text-secondary w-11/12 flex flex-col justify-evenly">
            <table className="project-table outline outline-primary shadow-lg shadow-red-200 outline-primary rounded border-collapse m-0 p-0 w-full table-auto">
              <thead className="bg-secondary">
                <tr className="text-primary">
                  <th></th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody className="table-body text-secondary">
                {projects?.map((item) => (
                  <>
                    <tr key={item.id}>
                      <td>
                        <ConfirmProjectDeleteModal projectName={item.name} />
                      </td>
                      <td className="text-secondary border-1 border-secondary">
                        <Link
                          className="cursor-pointer w-full flex justify-center items-center underline decoration-secondary hover:no-underline text-secondary"
                          href={`/project/${item.id}`}
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="border-1 border-secondary">{item.description}</td>
                      <td className="border-1 border-secondary">{formatDate(item.dueByDate)}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
