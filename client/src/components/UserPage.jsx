import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import UserFinder from "../apis/UserFinder";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { context } from "../context/context";

const UserPage = () => {
  const { state, dispatch } = useContext(context);

  let navigate = useNavigate();
  const [message, setMessage] = useState("");

  const getProjects = async () => {
    dispatch({
      type: "LOAD_DATA",
      data: true,
    });
    try {
      if (state.loading === true) {
        const projects = await UserFinder.get(`projects/${state.user.name}`);

        dispatch({
          type: "LOAD_PROJECTS",
          data: projects.data.results,
        });
        dispatch({
          type: "LOAD_DATA",
          data: false,
        });
      }
    } catch (error) {
      dispatch({
        type: "LOAD_DATA",
        data: false,
      });
      console.log("awaiting loggedAssignee");
    }
  };

  useEffect(() => {
    if (state.projects.length === 0) {
      getProjects();
    }
    if (state.tasks.length !== 0) {
      dispatch({
        type: "LOAD_TASKS",
        data: [],
      });
    }
  }, [state.loading, state.projects]);

  return (
    <>
      <div>
        <NavBar />
        <div className="d-flex justify-content-between mt-3 container">
          <h3>
            <small className="muted">Welcome User</small>
          </h3>
          <h1 className="text-center text-secondary mb-3">
            User Assigned Projects
          </h1>
        </div>
      </div>

      {state.projects ? (
        <div className="container">
          <div className=" mb-2">
            <h1 className="text-info">Project List</h1>
          </div>

          <div className="row">
            {state.projects.map((project) => (
              <div className="col-lg-6 " key={project.id}>
                <div
                  className="card mb-4 bg-success"
                  onClick={() => navigate(`/${project.id}/tasks`)}
                >
                  <div className="card-body">
                    <div className="card-title d-flex justify-content-between">
                      <h3> {project.project_title} </h3>
                      <div>{project.date.split("T")[0]}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {<div className="text-danger">{message}</div>}
        </div>
      ) : (
        <div>No projects found</div>
      )}
    </>
  );
};

export default UserPage;
