import React, { useEffect, useContext, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import UserFinder from "../apis/UserFinder";
import NavBar from "../components/NavBar";
import { UserContext } from "../context/UserContext";

const UserProjectsDetails = (props) => {
  const {
    user,
    setUser,
    userProjects,
    setUserProjects,
    deleteIndiactor,
    setDeleteIndicator,
  } = useContext(UserContext);
  const [message, setMessage] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      try {
        const decoded = jwt_decode(token);
        const { userId, roles } = decoded;
        setUser({ userId, roles });
      } catch (err) {
        navigate("/");
      }
    }
  }, []);

  const getUserProjects = async () => {
    try {
      const response = await UserFinder.get("/project");
      //const response = await UserFinder.get(`/${user.userId}`);
      setUserProjects(response.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      getUserProjects();
    }
  }, [user]);

  const handleProjects = (e) => {
    e.preventDefault();

    navigate(`/${userProjects[0].id}/add`);
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

  return userProjects.length > 0 ? (
    <div className="container">
      <NavBar userProjects={userProjects} />

      <div>
        <div className="d-flex justify-content-between mt-3">
          <h3>
            <small className="muted">
              Welcome{" "}
              <em className="text-secondary">{userProjects[0].email}</em>
            </small>
          </h3>
          <h1 className="text-center text-secondary mb-3">
            {userProjects[0].username}'s projects
          </h1>
          <button className="btn btn-primary" onClick={handleProjects}>
            Add Project
          </button>
        </div>

        {userProjects[0].project_id ? (
          <div className="container">
            <div className=" mb-2">
              <h1 className="text-info">Project List</h1>
            </div>

            <div className="row">
              {userProjects.map((project) => (
                <div className="col-lg-6 bg-light" key={project.project_id}>
                  <div
                    className="card mb-4 bg-success"
                    onClick={() => navigate(`/${project.project_id}/tasks`)}
                  >
                    <div className="card-body">
                      <div className="card-title d-flex justify-content-between">
                        <h3>{project.project_name} </h3>
                        <div>{project.project_date.split("T")[0]}</div>
                      </div>

                      <div className="d-flex justify-content-between mt-2">
                        <button
                          className="btn btn-danger"
                          onClick={(e) => deleteProject(e, project.project_id)}
                        >
                          Delete
                        </button>{" "}
                        <button
                          className="btn btn-warning"
                          onClick={(e) => handleEdit(e, project.project_id)}
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
      </div>
    </div>
  ) : (
    <div>loading....</div>
  );
};

export default UserProjectsDetails;
