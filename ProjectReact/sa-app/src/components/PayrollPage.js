import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
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
import { useNavigate } from 'react-router-dom';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/payrolls")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((result) => {
        setPayrolls(result); // เก็บข้อมูลทั้งหมดที่ได้รับใน state
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, []);

  const handleCreatePayroll = () => {
    navigate('/createPayroll'); // ไปยังหน้าสร้างเงินเดือน
  };

  const handleStatusChange = (payroll_id, newStatus) => {
    // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงสถานะ (status)
    console.log(`Payroll ID: ${payroll_id}, New Status: ${newStatus}`);
    // คุณสามารถอัปเดตสถานะในฐานข้อมูลหรือใน state ที่นี่
  };

  const handleDeletePayroll = (payroll_id) => {
  // ยืนยันการลบ
  const confirmDelete = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลเงินเดือนนี้?");
  if (!confirmDelete) {
    return; // ถ้าไม่ยืนยัน ให้หยุดการลบ
  }

  fetch(`http://localhost:8080/api/v1/payrolls/${payroll_id}`, {
    method: 'DELETE',
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to delete payroll");
      }
      // อัปเดต state หลังการลบ
      setPayrolls((prevPayrolls) => prevPayrolls.filter(payroll => payroll.payroll_id !== payroll_id));
    })
    .catch((error) => {
      console.error("Delete error:", error);
    });
};


  const getSelectStyles = (status) => {
    return {
      backgroundColor: status === "ทำรายการแล้ว" ? "lightgreen" : "white",
    };
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          รายการคำนวณเงินเดือน
        </Typography>

        <Button variant="contained" onClick={handleCreatePayroll} sx={{ mb: 2, float: 'right' }}>
          สร้างรายการเงินเดือน
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ชื่อพนักงาน</TableCell>
                <TableCell>เดือน</TableCell>
                <TableCell>วันที่ต้องจ่าย</TableCell>
                <TableCell>ฐานเงินเดือน</TableCell>
                <TableCell>จำนวนการเพิ่มเติม</TableCell>
                <TableCell>จำนวนการหัก</TableCell>
                <TableCell>เงินเดือนสุทธิ</TableCell>
                <TableCell>สถานะ</TableCell>
                <TableCell>การจัดการ</TableCell> {/* คอลัมน์ใหม่สำหรับปุ่มลบ */}
              </TableRow>
            </TableHead>
            <TableBody>
              {payrolls.map((payroll) => (
                <TableRow key={payroll.payroll_id}>
                  <TableCell>{payroll.emp_id}</TableCell> {/* สมมุติว่าชื่อพนักงานอยู่ใน emp_id */}
                  <TableCell>{payroll.pay_month}</TableCell>
                  <TableCell>{payroll.pay_date}</TableCell>
                  <TableCell>{payroll.base_salary}</TableCell>
                  <TableCell>{payroll.total_additions}</TableCell>
                  <TableCell>{payroll.total_deductions}</TableCell>
                  <TableCell>{payroll.net_salary}</TableCell>
                  <TableCell>
                    <FormControl variant="outlined" size="small">
                      <Select
                        defaultValue="ยังไม่ทำรายการ"
                        onChange={(e) => handleStatusChange(payroll.payroll_id, e.target.value)}
                        sx={getSelectStyles(payroll.status)} // ใช้ฟังก์ชันนี้เพื่อปรับสี
                      >
                        <MenuItem value="ทำรายการแล้ว">ทำรายการแล้ว</MenuItem>
                        <MenuItem value="ยังไม่ทำรายการ">ยังไม่ทำรายการ</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeletePayroll(payroll.payroll_id)}
                    >
                      ลบ
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </React.Fragment>
  );
}
