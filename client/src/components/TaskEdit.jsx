import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import UserFinder from "../apis/UserFinder";

const TaskEdit = ({ params }) => {
  const { selectedTask, handleTaskUpdate, handleTaskCancel } =
    useContext(UserContext);
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  let id = selectedTask.id;

  const getTasks = async () => {
    try {
      const results = await UserFinder.get(`/${id}/task`);
      console.log(results.data.results);
      setTask(results.data.results.task);
      setStatus(results.data.results.status);
      setDescription(results.data.results.description);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await UserFinder.put(`/${selectedTask.id}/tasks`, {
        project_id: params.id,
        task,
        status,
        description,
      });
      handleTaskUpdate(response.data.results);
      handleTaskCancel();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {selectedTask && (
        <form>
          <div className="row g-3">
            <div className="col">
              <label htmlFor="title" className="form-label">
                Task
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
            className="btn btn-warning"
            onClick={handleSubmit}
          >
            Edit Task
          </button>
        </form>
      )}
    </div>
  );
};

export default TaskEdit;
