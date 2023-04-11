import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserFinder from "../apis/UserFinder";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const EditProject = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const fetchProject = async () => {
    try {
      const response = await UserFinder.get(`/${params.id}/task`);
      const project = response.data.results;
      setTask(project.task);
      setStatus(project.status);
      setDate(project.date.split("T")[0]);
      setDescription(project.description);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProject();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await UserFinder.put(`/${params.id}/update`, {
        task,
        status,
        date,
        description,
        user_id: user.userId,
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
    navigate("/home");
  };

  return (
    <div>
      <h1 className="text-center mb-3">Update Project</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
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
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            id="description"
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-control"
            id="status"
          >
            <option defaultValue>Select project status</option>
            <option value="Todo">Todo</option>
            <option value="In progress">In progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-2">
          Update Project
        </button>
      </form>
    </div>
  );
};

export default EditProject;
