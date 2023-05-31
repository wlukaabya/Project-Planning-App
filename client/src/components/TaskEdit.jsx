import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import UserFinder from "../apis/UserFinder";
import ErrorModal from "./ErrorModal";
import { context } from "../context/context";

const TaskEdit = ({ params, selectedTask, setSelectedTask }) => {
  const { state, dispatch } = useContext(context);

  const [task, setTask] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [assignee, setAssignee] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  let id = selectedTask.id;

  const getTasks = async () => {
    try {
      const results = await UserFinder.get(`/${id}/task`);
      setTask(results.data.results.task);
      setStatus(results.data.results.status);
      setDescription(results.data.results.description);
      setDate(results.data.results.date.split("T")[0]);
      setAssignee(results.data.results.assignee);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task || !description || !date || !status) {
      setShowModal(true);
      setMessage("Please enter values in the empty fields");
    }
    try {
      const response = await UserFinder.put(`/${selectedTask.id}/tasks`, {
        project_id: params.id,
        task,
        status,
        description,
        date,
        assignee,
      });
      dispatch({
        type: "EDIT_TASK",
        data: response.data.results,
      });
      setSelectedTask(null);
    } catch (error) {
      console.log(error);
      setShowModal(true);
      setMessage("You are not authorised to perform this action");
    }
  };

  const handleCancel = () => {
    setSelectedTask(null);
  };

  return (
    <div>
      {message && <ErrorModal setShowModal={setShowModal} message={message} />}
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

            <div className="col">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-control"
                id="date"
              />
            </div>

            <div className="col">
              <label htmlFor="status" className="form-label">
                Assignee
              </label>
              <select
                className="form-select form-select"
                id="assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              >
                <option defaultValue={"Todo"}>Choose User</option>
                {state.users
                  ? state.users.map((item) => {
                      return (
                        <option value={item.username} key={item.id}>
                          {item.username}
                        </option>
                      );
                    })
                  : ""}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-warning "
            onClick={handleSubmit}
          >
            Edit Task
          </button>
          <button className="btn btn-danger " onClick={handleCancel}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default TaskEdit;
