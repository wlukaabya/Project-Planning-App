import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import UserFinder from "../apis/UserFinder";
import { UserContext } from "../context/UserContext";

const AddProject = () => {
  const { user } = useContext(UserContext);
  let navigate = useNavigate();
  let params = useParams();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user_id = params.id;
    try {
      const response = await UserFinder.post("/project", {
        user_id,
        project_title: title,
        date,
      });
      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  };

  return user ? (
    <div className="container ">
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

        <button type="submit" className="btn btn-primary">
          Add Project
        </button>
      </form>
    </div>
  ) : (
    <div>No resource found</div>
  );
};

export default AddProject;
