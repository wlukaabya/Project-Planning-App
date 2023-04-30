import React, { useContext, useEffect, useState } from "react";
import NavBar from "./NavBar";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import UserFinder from "../apis/UserFinder";

const AdminPage = () => {
  const { user, role, userProjects, setUserProjects } = useContext(UserContext);
  let navigate = useNavigate();
  const [message, setMessage] = useState("");

  const getProjects = async () => {
    try {
      const projects = await UserFinder.get("/project");
      setUserProjects(projects.data.results);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProjects();
  }, []);

  const handleProjects = (e) => {
    e.preventDefault();
    navigate("/add");
  };

  const deleteProject = async (e, id) => {
    e.stopPropagation();
    try {
      const result = await UserFinder.delete(`/${id}`);
      if (result.data.status) {
        window.location.reload();
      } else {
        setMessage(result.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/${id}/update`);
  };

  return (
    <>
      <div>
        <NavBar />
        <div className="d-flex justify-content-between mt-3 container">
          <h3>
            <small className="muted">You are loggedin as Administrator</small>
          </h3>
          <h1 className="text-center text-secondary mb-3">
            Administrator projects
          </h1>
          <button className="btn btn-primary" onClick={handleProjects}>
            Add Project
          </button>
        </div>
      </div>

      {userProjects ? (
        <div className="container">
          <div className=" mb-2">
            <h1 className="text-info">Project List</h1>
          </div>

          <div className="row">
            {userProjects.map((project) => (
              <div className="col-lg-6 bg-light" key={project.id}>
                <div
                  className="card mb-4 bg-success"
                  onClick={() => navigate(`/${project.id}/tasks`)}
                >
                  <div className="card-body">
                    <div className="card-title d-flex justify-content-between">
                      <h3> {project.project_title} </h3>
                      <div>{project.date.split("T")[0]}</div>
                    </div>

                    <div className="d-flex justify-content-between mt-2">
                      <button
                        className="btn btn-danger"
                        onClick={(e) => deleteProject(e, project.id)}
                      >
                        Delete
                      </button>{" "}
                      <button
                        className="btn btn-warning"
                        onClick={(e) => handleEdit(e, project.id)}
                      >
                        Edit Project
                      </button>{" "}
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

export default AdminPage;