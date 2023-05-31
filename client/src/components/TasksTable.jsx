import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../context/UserContext";
import { useParams } from "react-router-dom";
import UserFinder from "../apis/UserFinder";
import TaskEdit from "./TaskEdit";
import ConfirmModal from "./ConfirmModal";
import ErrorModal from "./ErrorModal";
import { context } from "../context/context";

const TasksTable = () => {
  const { state, dispatch } = useContext(context);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(null);
  const [message, setMessage] = useState("");
  const [unAuthStatus, setUnAuthStatus] = useState(false);

  const params = useParams();

  const handleDelete = async (id) => {
    try {
      const result = await UserFinder.delete(`/${id}/tasks`);
      dispatch({
        type: "DELETE_TASK",
        id,
      });
    } catch (error) {
      setMessage(error.response.data.message);
      setUnAuthStatus(true);
    }
  };

  const renderModal = (pickedId) => {
    setShowModal(true);
    setId(pickedId);
  };

  return state.tasks ? (
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
          {state.tasks.map((item) => (
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
                  onClick={() => renderModal(item.id)}
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
      {selectedTask && (
        <TaskEdit
          params={params}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
        />
      )}
      {showModal && (
        <ConfirmModal
          id={id}
          setShowModal={setShowModal}
          deleteProject={handleDelete}
        />
      )}
      {unAuthStatus && (
        <ErrorModal setShowModal={setUnAuthStatus} message={message} />
      )}
    </div>
  ) : (
    <div>No resource found</div>
  );
};

export default TasksTable;
