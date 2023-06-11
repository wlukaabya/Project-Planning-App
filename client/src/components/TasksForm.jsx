import React, { useContext, useEffect, useState } from "react";

import UserFinder from "../apis/UserFinder";
import { context } from "../context/context";
import "../routes/styles.css";
import ErrorModal from "./ErrorModal";

const TasksForm = ({ id, role }) => {
  const { state, dispatch } = useContext(context);

  const [task, setTask] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [assignee, setAssignee] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const user_id = state.user.id;

  const getUsers = async () => {
    dispatch({
      type: "LOAD_DATA",
      data: true,
    });
    try {
      if (state.user.roles === "admin" && state.loading === true) {
        const response = await UserFinder.get("/users");
        //setUsersList(response.data.results);
        dispatch({
          type: "USERS_LIST",
          data: response.data.results,
        });

        dispatch({
          type: "LOAD_DATA",
          data: false,
        });
      } else if (state.user.roles === "user" && state.loading === true) {
        dispatch({
          type: "USERS_LIST",
          data: [
            { id: 1, username: "Unassigned" },
            { id: 2, username: state.user.name },
          ],
        });
        dispatch({
          type: "LOAD_DATA",
          data: false,
        });
      } else {
        console.log("no role defined");
        dispatch({
          type: "LOAD_DATA",
          data: false,
        });
        return;
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: "LOAD_DATA",
        data: false,
      });
    }
  };

  useEffect(() => {
    if (state.users.length === 0) {
      getUsers();
    }
  }, [state.loading, state.users]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task || !status || !description || assignee || date) {
      setMessage("Please provide all the required fields");
      setShowModal(true);
    }
    try {
      const result = await UserFinder.post("/task", {
        project_id: id,
        task,
        status,
        description,
        assignee,
        date,
        created_by: user_id,
      });

      dispatch({
        type: "ADD_TASK",
        data: result.data.results,
      });

      setTask("");
      setStatus("");
      setDescription("");
      setStatus("");
      setDate("");
      setAssignee("");
      setShowModal(false);
    } catch (error) {
      setMessage("Make sure all required fields are filled");
    }
  };

  return (
    <div className="tasks_form">
      {showModal && (
        <ErrorModal setShowModal={setShowModal} message={message} />
      )}
      <h4>Add Task</h4>
      <form>
        <div className="form_fields">
          <div>
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
          <div>
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

          <div>
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

          <div>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-control"
              id="date"
            />
          </div>

          <div>
            <label htmlFor="status" className="form-label">
              Assignee
            </label>
            <select
              className="form-select form-select"
              id="assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            >
              <option defaultValue={"Todo"}>Assign</option>
              {state.users.length !== 0
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
          className="btn btn-primary mt-2"
          onClick={handleSubmit}
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TasksForm;
