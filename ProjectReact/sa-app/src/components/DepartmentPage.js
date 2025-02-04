import React, { useState, useEffect } from 'react';
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

export default function DepartmentPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/departments")
      .then(res => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then(
        (result) => {
          setItems(result);
        },
        (error) => {
          setError(error.message); // จัดการข้อผิดพลาด
        }
      );
  }, []);

  const handleDelete = async (dept_id) => {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow"
    };

    try {
      const response = await fetch(`http://localhost:8080/api/v1/departments/${dept_id}`, requestOptions);
      if (!response.ok) {
        throw new Error("Failed to delete department");
      }
      // ทำการลบจาก state หลังจากลบสำเร็จ
      setItems((prevItems) => prevItems.filter(item => item.dept_id !== dept_id));
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการลบแผนก');
    }
  };

  const confirmDelete = (dept_id) => {
    // แสดงกล่องยืนยัน
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบแผนกนี้?")) {
      handleDelete(dept_id);
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
                ตั้งค่าแผนก
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Link href="/createDept">
                <Button variant="contained">เพิ่มแผนก</Button>
              </Link>
            </Box>
          </Box>

          {/* แสดงข้อความข้อผิดพลาด */}
          {error && <Typography color="error">{error}</Typography>}

          {/* ตารางแสดงข้อมูล */}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">รหัสแผนก</TableCell>
                  <TableCell align="center">ชื่อแผนก</TableCell>
                  <TableCell align="center">จำนวนพนักงานในแผนก</TableCell>
                  <TableCell align="center">Action</TableCell> {/* เพิ่ม Action */}
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((row) => (
                  <TableRow
                    key={row.dept_id} // แก้ไขเป็น dept_id
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align="center">
                      {row.dept_id}
                    </TableCell>
                    <TableCell align="center">{row.dept_name}</TableCell>
                    <TableCell align="center">{row.num_emp}</TableCell>
                    <TableCell align="center">
                      <ButtonGroup size="big" aria-label="Small button group">
                        <Button onClick={() => confirmDelete(row.dept_id)}>ลบ</Button>
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
