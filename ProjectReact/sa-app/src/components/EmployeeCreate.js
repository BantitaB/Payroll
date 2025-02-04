import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export default function EmployeeCreate() {
  const [empId, setEmpId] = useState('');
  const [empName, setEmpName] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [deptId, setDeptId] = useState('');
  const [deptName, setDeptName] = useState('');
  const [departments, setDepartments] = useState({});  // เก็บข้อมูลแผนกจาก API
  const [positionName, setPositionName] = useState('');
  const [baseSalary, setSalary] = useState('');
  const [bankAccount, setBank] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const navigate = useNavigate();

  // ใช้ useEffect ดึงข้อมูลแผนกจาก API
  useEffect(() => {
    fetch("http://localhost:8080/api/v1/departments")
      .then(response => response.json())
      .then(data => {
        const departmentData = {};
        data.forEach(department => {
          departmentData[department.dept_id] = department.dept_name;
        });
        setDepartments(departmentData);  // เก็บข้อมูลแผนกทั้งหมดใน state
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });
  }, []);

  // ฟังก์ชันสำหรับดึงชื่อแผนกตามรหัสแผนก
  const handleDeptIdChange = (e) => {
    const id = e.target.value;
    setDeptId(id);

    // ตรวจสอบรหัสแผนกและแสดงชื่อแผนก
    if (departments[id]) {
      setDeptName(departments[id]);
    } else {
      setDeptName('');  // ถ้ารหัสแผนกไม่ถูกต้อง ให้แสดงค่าว่าง
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "emp_id": parseInt(empId),           // Ensure it's an integer
      "emp_name": empName,
      "phone_number": phoneNumber,
      "dept_id": parseInt(deptId),         // แปลงเป็น integer
      "position_name": positionName,
      "base_salary": parseFloat(baseSalary), // Ensure it's a float
      "bank_account": bankAccount,
      "account_num": accountNum
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:8080/api/v1/employees", requestOptions)
      .then((response) => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text); });
        }
        return response.json();
      })
      .then((result) => {
        alert(`เพิ่มพนักงานสำเร็จ!`);
        navigate("/Page1");
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(`เกิดข้อผิดพลาดในการเพิ่มพนักงาน: ${error.message}`);
      });
  }

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5" gutterBottom component="div">
          สร้างรายชื่อพนักงาน
        </Typography>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom component="div">
            ข้อมูลส่วนตัวพนักงาน
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="emp_id"
                label="รหัสพนักงาน"
                variant="outlined"
                fullWidth
                required
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="emp_name"
                label="ชื่อพนักงาน"
                variant="outlined"
                fullWidth
                required
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="phone_number"
                label="เบอร์โทรศัพท์"
                variant="outlined"
                fullWidth
                value={phoneNumber}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>
          </Grid>
          <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
            ข้อมูลพนักงาน
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="dept_id"
                label="รหัสแผนก"
                variant="outlined"
                fullWidth
                required
                value={deptId}
                onChange={handleDeptIdChange}  // ใช้ฟังก์ชัน handleDeptIdChange
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="dept_name"
                label="ชื่อแผนก"
                variant="outlined"
                fullWidth
                value={deptName}  // แสดงชื่อแผนกที่สัมพันธ์กับ dept_id
                disabled  // ไม่อนุญาตให้แก้ไข
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="position_name"
                label="ชื่อตำแหน่ง"
                variant="outlined"
                fullWidth
                value={positionName}
                onChange={(e) => setPositionName(e.target.value)}
              />
            </Grid>
          </Grid>
          <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
            ข้อมูลเงินเดือน
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="base_salary"
                label="เงินเดือน"
                variant="outlined"
                fullWidth
                required
                value={baseSalary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="bank_account"
                label="บัญชีธนาคาร"
                variant="outlined"
                fullWidth
                required
                value={bankAccount}
                onChange={(e) => setBank(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="account_num"
                label="เลขบัญชีธนาคาร"
                variant="outlined"
                fullWidth
                required
                value={accountNum}
                onChange={(e) => setAccountNum(e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Button variant="outlined" fullWidth onClick={handleCancel}>
                ยกเลิก
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant="contained" fullWidth type="submit">
                ยืนยัน
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </React.Fragment>
  );
}
