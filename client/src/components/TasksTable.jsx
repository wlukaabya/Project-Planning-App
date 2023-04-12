import React, { useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../context/UserContext";
import { useParams } from "react-router-dom";
import UserFinder from "../apis/UserFinder";

const TasksTable = (props) => {
  const { tasks, setTasks } = useContext(UserContext);
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

  return tasks ? (
    <div className=" container table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
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

              <td>
                <button className="btn btn-sm btn-outline-danger">
                  <FontAwesomeIcon icon={faTrash} />
                </button>{" "}
                <button className="btn btn-sm btn-outline-secondary">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div>No resource found</div>
  );
};

export default TasksTable;
