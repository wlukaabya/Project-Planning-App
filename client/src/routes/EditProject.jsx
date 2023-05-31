import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserFinder from "../apis/UserFinder";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { context } from "../context/context";

const EditProject = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(context);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const fetchProject = async () => {
    try {
      const response = await UserFinder.get(`/${params.id}/project`);
      const project = response.data.results;
      setTitle(project.project_title);
      setDate(project.date.split("T")[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (state.user) {
      fetchProject();
    }
  }, [state.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await UserFinder.put(`/${params.id}/project`, {
        project_title: title,
        date,
      });

      dispatch({
        type: "EDIT_PROJECT",
        payload: { data: result.data.logins },
      });
    } catch (error) {
      console.log(error);
    }
    navigate("/home");
  };

  return state.user ? (
    <div>
      <h1 className="text-center mb-3">Update Project</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            id="title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-control"
            id="date"
          />
        </div>

        <button type="submit" className="btn btn-primary mt-2">
          Update Project
        </button>
      </form>
    </div>
  ) : (
    <div>No resource found</div>
  );
};

export default EditProject;
