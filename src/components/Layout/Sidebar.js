import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  FileText,
  Users,
  Moon,
  ClipboardList,
  Clock3,
} from "lucide-react";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>🚀 TMS</div>
      <ul className={styles.menu}>
        {/* Working Time */}
        <li>
          <div
            className={styles.menuItem}
            onClick={() => toggleMenu("workingTime")}
          >
            <Calendar size={18} />
            <span>Working Time</span>
          </div>
          {openMenus.workingTime && (
            <ul className={styles.submenu}>
              <li>
                <div
                  className={styles.menuItem}
                  onClick={() => toggleMenu("leaveRequest")}
                >
                  <FileText size={16} />
                  <span>Leave Request</span>
                </div>
                {openMenus.leaveRequest && (
                  <ul className={styles.submenu}>
                    <li onClick={() => handleNavigation("/leave-requests")}>
                      My Request
                    </li>
                    <li onClick={() => handleNavigation("/leave-requests/create")}>
                      Create Request
                    </li>
                    <li onClick={() => handleNavigation("/leave-requests/received")}>
                      Received Request List
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          )}
        </li>

        {/* My Report */}
        <li>
          <div
            className={styles.menuItem}
            onClick={() => toggleMenu("myReport")}
          >
            <Users size={18} />
            <span>My Report</span>
          </div>
        </li>

        {/* Delegation */}
        <li>
          <div
            className={styles.menuItem}
            onClick={() => toggleMenu("delegation")}
          >
            <FileText size={18} />
            <span>Delegation</span>
          </div>
        </li>

        {/* Night Shift */}
        <li>
          <div
            className={styles.menuItem}
            onClick={() => toggleMenu("nightShift")}
          >
            <Moon size={18} />
            <span>Night Shift</span>
          </div>
        </li>

        {/* Report List */}
        <li>
          <div
            className={styles.menuItem}
            onClick={() => toggleMenu("reportList")}
          >
            <ClipboardList size={18} />
            <span>Report List</span>
          </div>
        </li>

        {/* Overtime */}
        <li>
          <div
            className={styles.menuItem}
            onClick={() => toggleMenu("overtime")}
          >
            <Clock3 size={18} />
            <span>Overtime</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
