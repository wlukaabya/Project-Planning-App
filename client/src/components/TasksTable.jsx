import React, { useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../context/UserContext";
import { useParams } from "react-router-dom";
import UserFinder from "../apis/UserFinder";
import TaskEdit from "./TaskEdit";

const TasksTable = (props) => {
  const { tasks, setTasks, setSelectedTask, selectedTask } =
    useContext(UserContext);
  const params = useParams();

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await UserFinder.get(`/${params.id}/tasks`);
        setTasks(response.data.tasks);
      } catch (error) {
        console.log(Error);
      }
    };
    getTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await UserFinder.delete(`/${id}/tasks`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return tasks ? (
    <div className=" container table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Assignee</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.task}</td>
              <td>{item.description}</td>
              <td>
                <span
                  className={`badge ${
                    item.status === "Todo"
                      ? "bg-danger"
                      : item.status === "Done"
                      ? "bg-success"
                      : "bg-warning"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td>{item.assignee}</td>
              <td>{item.date.split("T")[0]}</td>

              <td>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(item.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>{" "}
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setSelectedTask(item)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedTask && <TaskEdit params={params} />}
    </div>
  ) : (
    <div>No resource found</div>
  );
};

export default TasksTable;
