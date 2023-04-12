import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import UserFinder from "../apis/UserFinder";

const TasksForm = ({ id }) => {
  const { tasks, setTasks, addTask } = useContext(UserContext);
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await UserFinder.post("/task", {
        project_id: id,
        task,
        status,
        description,
      });
      addTask(result.data.results);
    } catch (error) {
      console.log(error);
    }
    setTask("");
    setStatus("");
    setDescription("");
  };

  return (
    <div className="container">
      <h1>Tasks</h1>
      <form>
        <div className="row g-3">
          <div className="col">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              type="text"
              className="form-control"
              id="title"
              placeholder="Enter title"
            />
          </div>
          <div className="col">
            <label htmlFor="status" className="form-label">
              Task status
            </label>
            <select
              className="form-select form-select"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option defaultValue={"Todo"}>Choose Status</option>
              <option value="Todo">Todo</option>
              <option value="In-progress">In-progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="col">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              id="description"
              rows="3"
              placeholder="Enter description"
            ></textarea>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TasksForm;
