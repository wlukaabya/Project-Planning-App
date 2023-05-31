import React, { useContext, useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import UserFinder from "../apis/UserFinder";
import ConfirmModal from "./ConfirmModal";
import ErrorModal from "./ErrorModal";
import { context } from "../context/context";

const AdminPage = () => {
  const { state, dispatch } = useContext(context);

  let navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [id, setId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tasksAvailableStatus, setTasksAvailableStatus] = useState(false);

  const getProjects = async () => {
    dispatch({
      type: "LOAD_DATA",
      data: true,
    });
    try {
      if (state.loading === true) {
        const projects = await UserFinder.get("/project");

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
      console.log(error);
      dispatch({
        type: "LOAD_DATA",
        data: false,
      });
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

  const handleProjects = (e) => {
    e.preventDefault();
    navigate("/add");
  };

  const deleteProject = async (id) => {
    try {
      const result = await UserFinder.delete(`/${id}`);
      if (result.data.status) {
        dispatch({
          type: "DELETE_PROJECT",
          id: id,
        });
      } else {
        setMessage(result.data.message);
        setTasksAvailableStatus(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/${id}/update`);
  };

  const renderModal = (e, id) => {
    e.stopPropagation();
    setShowModal(true);
    setId(id);
  };

  return (
    <>
      <div>
        {showModal && (
          <ConfirmModal
            setShowModal={setShowModal}
            id={id}
            deleteProject={deleteProject}
          />
        )}
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

      {state.projects.length ? (
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

                    <div className="d-flex justify-content-between mt-2">
                      <button
                        className="btn btn-danger"
                        onClick={(e) => renderModal(e, project.id)}
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
          {tasksAvailableStatus && (
            <ErrorModal
              message={message}
              setShowModal={setTasksAvailableStatus}
            />
          )}
        </div>
      ) : (
        <div>No projects found</div>
      )}
    </>
  );
};

export default AdminPage;
