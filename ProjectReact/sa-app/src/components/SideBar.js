import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

import BadgeIcon from '@mui/icons-material/Badge';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const SideBar = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        style={{ height: "100vh", position: "fixed", width: "250px" }} // ตรึง Sidebar และกำหนดความกว้างที่ต้องการ
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ flex: 1, marginBottom: "32px" }}>
            {/* Header */}
            <div style={{ margin: "25px 0 20px 0" }}>
              <Typography style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}>
                Payroll App
              </Typography>
            </div>

            {/* Menu Items */}
            <Menu iconShape="square">
              <Link to="/Page1" className="menu-bars" style={{ textDecoration: "none", color: "#000" }}>
                <MenuItem icon={<BadgeIcon style={{ color: '#000' }} />}>รายชื่อพนักงาน</MenuItem>
              </Link>
              <Link to="/Page2" className="menu-bars" style={{ textDecoration: "none", color: "#000" }}>
                <MenuItem icon={<ApartmentIcon style={{ color: '#000' }} />}>ตั้งค่าแผนก</MenuItem>
              </Link>
              <Link to="/Page3" className="menu-bars" style={{ textDecoration: "none", color: "#000" }}>
                <MenuItem icon={<AccountBalanceIcon style={{ color: '#000' }} />}>รายการเงินเดือน</MenuItem>
              </Link>
            </Menu>
          </div>
        </div>
      </Sidebar>

      {/* Main Content */}
      <main style={{ marginLeft: "250px", padding: "16px 2px", color: "#44596e", transition: "margin-left 0.3s" }}>
        <div style={{ marginBottom: "16px" }}>
          {/* Content goes here */}
        </div>
      </main>
    </div>
  );
};

export default SideBar;
