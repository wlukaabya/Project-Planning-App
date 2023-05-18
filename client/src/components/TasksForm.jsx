import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import UserFinder from "../apis/UserFinder";

const TasksForm = ({ id }) => {
  const {
    addTask,
    usersList,
    setUsersList,
    loggedAssignee,
    setLoggedAssignee,
    role,
    user,
    setRole,
  } = useContext(UserContext);
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [assignee, setAssignee] = useState("");
  const user_id = user.userId;

  const getUsers = async () => {
    try {
      if (role === "admin") {
        const response = await UserFinder.get("/users");
        setUsersList(response.data.results);
      } else if (role === "user") {
        setUsersList([
          { id: 1, username: "Unassigned" },
          { id: 2, username: loggedAssignee },
        ]);
      } else {
        console.log("no role defined");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async (id) => {
    try {
      const response = await UserFinder.get(`/user/${id}`);
      setRole(response.data.results.role);
      setLoggedAssignee(response.data.results.username);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      getUser(user.userId);
    }
  }, [user]);

  useEffect(() => {
    getUsers();
  }, [role, setUsersList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      addTask(result.data.results);
    } catch (error) {
      console.log("Make sure all required fields are filled");
    }
    setTask("");
    setStatus("");
    setDescription("");
    setStatus("");
    setDate("");
    setAssignee("");
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
              <option defaultValue={"Todo"}>Assign</option>
              {usersList
                ? usersList.map((item) => {
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
