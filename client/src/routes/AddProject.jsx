import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import UserFinder from "../apis/UserFinder";
import NavBar from "../components/NavBar";

const AddProject = () => {
  let navigate = useNavigate();
  let params = useParams();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user_id = params.id;
    try {
      const response = await UserFinder.post("/task", {
        user_id,
        task: title,
        date,
        description,
        status,
      });

      navigate("/signIn");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container ">
      <NavBar />
      <h1 className="text-center">Add Project Portal</h1>
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
        <button type="submit" className="btn btn-primary">
          Add Project
        </button>
      </form>
    </div>
  );
};

export default AddProject;
