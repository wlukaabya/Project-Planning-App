import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import UserFinder from "../apis/UserFinder";

import { context } from "../context/context";

const AddProject = () => {
  const { state, dispatch } = useContext(context);
  let navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await UserFinder.post("/project", {
        project_title: title,
        date,
      });

      dispatch({
        type: "ADD_PROJECT",
        data: response.data.results,
      });

      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  };
  return state.user ? (
    <div className="container ">
      <h1 className="text-center">Add Project</h1>
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
