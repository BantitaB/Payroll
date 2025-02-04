import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from '@mui/material/Link';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/employees');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (emp_id) => {
    // แสดงการยืนยันก่อนลบ
    const confirmDelete = window.confirm('คุณแน่ใจหรือว่าต้องการลบพนักงานนี้?');
    if (!confirmDelete) {
      return; // หากผู้ใช้ไม่ยืนยัน ให้หยุดการทำงาน
    }
  
    const requestOptions = {
      method: 'DELETE',
      redirect: 'follow'
    };
  
    try {
      const response = await fetch(`http://localhost:8080/api/v1/employees/${emp_id}`, requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // รีเฟรชข้อมูลพนักงานหลังจากลบสำเร็จ
      setEmployees((prevEmployees) => prevEmployees.filter(emp => emp.emp_id !== emp_id));
      console.log(`Employee with ID ${emp_id} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ p: 2 }}>
        <Paper sx={{ p: 2 }}>
          <Box display="flex">
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                รายชื่อพนักงาน
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Link href="/createEmp">
                <Button variant="contained">เพิ่มรายชื่อพนักงาน</Button>
              </Link>
            </Box>
          </Box>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">รหัสพนักงาน</TableCell>
                  <TableCell align="center">ชื่อพนักงาน</TableCell>
                  <TableCell align="center">เบอร์โทรศัพท์</TableCell>
                  <TableCell align="center">แผนก</TableCell>
                  <TableCell align="center">ตำแหน่ง</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow
                    key={emp.emp_id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align="center">
                      {emp.emp_id}
                    </TableCell>
                    <TableCell align="center">{emp.emp_name}</TableCell>
                    <TableCell align="center">{emp.phone_number}</TableCell>
                    <TableCell align="center">{emp.dept_name}</TableCell>
                    <TableCell align="center">{emp.position_name}</TableCell>
                    <TableCell align="center">
                      <ButtonGroup size="big" aria-label="Small button group">
                        {/* ปุ่มลบ */}
                        <Button onClick={() => handleDelete(emp.emp_id)}>ลบ</Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </React.Fragment>
  );
}
