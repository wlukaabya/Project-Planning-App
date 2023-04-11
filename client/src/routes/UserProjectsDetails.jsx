import React, { useEffect, useContext } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import UserFinder from "../apis/UserFinder";
import NavBar from "../components/NavBar";
import { UserContext } from "../context/UserContext";

const UserProjectsDetails = (props) => {
  const { user, setUser, userProjects, setUserProjects } =
    useContext(UserContext);
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
      const response = await UserFinder.get(`/${user.userId}`);
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

  const deleteProject = async (id) => {
    const result = await UserFinder.delete(`/${id}`);
    window.location.reload();
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
                  <div className="card mb-4 bg-success">
                    <div className="card-body">
                      <div className="card-title d-flex justify-content-between">
                        <h3>{project.project_name} </h3>
                        <div>{project.project_date.split("T")[0]}</div>
                      </div>
                      <div className="card-text">
                        {project.project_description}
                      </div>
                      <div className="card-text">
                        Status: {project.project_status}
                      </div>
                      <div className="d-flex justify-content-between mt-2">
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteProject(project.project_id)}
                        >
                          Delete
                        </button>{" "}
                        <button
                          className="btn btn-warning"
                          onClick={() =>
                            navigate(`/${project.project_id}/update`)
                          }
                        >
                          Edit Project
                        </button>{" "}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
