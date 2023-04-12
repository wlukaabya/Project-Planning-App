import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import "../NavBar.css";

function NavBarAlt({ userProjects }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav>
      <ul>
        <li>
          <a href="/home">
            <FontAwesomeIcon icon={faHome} />
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBarAlt;
