import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate

export default function DepartmentCreate() {
  const [deptId, setDeptId] = useState('');
  const [deptName, setDeptName] = useState('');
  const navigate = useNavigate(); // สร้าง instance ของ useNavigate

  const handleSubmit = (event) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "dept_id": parseInt(deptId),
      "dept_name": deptName
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:8080/api/v1/departments", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText); // ตรวจสอบสถานะการตอบกลับ
        }
        return response.json();
      })
      .then((result) => {
        // ตรวจสอบว่าการเพิ่มแผนกสำเร็จหรือไม่
        if (result.num_emp !== undefined) { // ตรวจสอบว่ามีข้อมูล num_emp ในผลลัพธ์หรือไม่
          alert(`เพิ่มแผนกสำเร็จ! รหัสแผนก: ${result.dept_id}, ชื่อแผนก: ${result.dept_name}, จำนวนพนักงาน: ${result.num_emp}`);
          navigate("/Page2"); // นำทางไปยังหน้า /Page2
        } else {
          alert(`ไม่สามารถเพิ่มแผนกได้: ${result.message || 'ไม่ทราบเหตุผล'}`); // แสดงข้อความเมื่อไม่สามารถเพิ่มได้
        }
      })
      .catch((error) => {
        console.error(error);
        alert(`เกิดข้อผิดพลาดในการเพิ่มแผนก: ${error.message}`); // แสดงข้อความเมื่อเกิดข้อผิดพลาด
      });
  }

  const handleCancel = () => {
    navigate(-1); // ย้อนกลับไปหน้าเดิม
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom component="div">
          ตั้งค่าแผนก
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="dept_id"
                label="รหัสแผนก"
                variant="outlined"
                fullWidth
                required
                value={deptId}
                onChange={(e) => setDeptId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="dept_name"
                label="ชื่อแผนก"
                variant="outlined"
                fullWidth
                required
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
              />
            </Grid>
          </Grid>

          {/* เพิ่มปุ่มยกเลิกและยืนยัน */}
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
