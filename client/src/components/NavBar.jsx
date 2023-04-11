import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import "../NavBar.css";

function NavBar({ userProjects }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav>
      <ul>
        <li>
          <a href="/signIn">
            <FontAwesomeIcon icon={faHome} />
          </a>
        </li>
        <li>
          <a href="" onClick={handleLogout}>
            Log out
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
