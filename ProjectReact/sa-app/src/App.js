import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import SideBar from "./components/SideBar";
import EmployeePage from './components/EmployeePage';
import DepartmentPage from './components/DepartmentPage';
import SalaryPage from './components/PayrollPage';
import EmployeeCreate from './components/EmployeeCreate';
import DepartmentCreate from './components/DepartmentCreate';
import PayrollCreate from './components/PayrollCreate';

function App() {
  return (
    <div className="App" style={{ display: "flex" }}>
      {/* Sidebar will always be visible */}
      <SideBar />
      <div style={{ marginLeft: "10px", padding: "16px", flex: 1 }}>
        <Routes>
          {/* Default route to redirect to EmployeePage */}
          <Route path="/" element={<Navigate to="/Page1" />} />
          <Route path="/createEmp" element={<EmployeeCreate />} />
          <Route path="/createDept" element={<DepartmentCreate />} />
          <Route path="/createPayroll" element={<PayrollCreate />} />
          <Route path="/Page1" element={<EmployeePage />} />
          <Route path="/Page2" element={<DepartmentPage />} />
          <Route path="/Page3" element={<SalaryPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
