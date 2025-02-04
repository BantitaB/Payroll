import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';

export default function CreatePayroll() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [payMonth, setPayMonth] = useState('');
  const [payDate, setPayDate] = useState('');
  const [baseSalary, setBaseSalary] = useState(0);
  const [commission, setCommission] = useState(0);
  const [overtime, setOvertime] = useState(0);
  const [totalAdditions, setTotalAdditions] = useState(0);
  const [totalDeductions, setTotalDeductions] = useState(0);
  const [netSalary, setNetSalary] = useState(0);
  const [tax, setTax] = useState(0);
  const navigate = useNavigate();

  // Fetching employees on component mount
  useEffect(() => {
    fetch("http://localhost:8080/api/v1/employees")
      .then(res => res.json())
      .then(result => {
        setEmployees(result);
      });
  }, []);

  // Handling employee selection
  const handleEmployeeSelect = (e) => {
    const emp = employees.find(emp => emp.emp_id === e.target.value);
    setSelectedEmp(emp);
    setBaseSalary(emp ? emp.base_salary : 0);
  };

  // Calculate total additions
  const calculateTotalAdditions = () => {
    const total = commission + overtime;
    setTotalAdditions(total);
    return total;
  };

  // Calculate tax based on annual salary
  const calculateTax = (annualSalary) => {
    const personalDeduction = 60000;
    const personalExpense = Math.min(annualSalary * 0.5, 100000);
    const net = annualSalary - personalDeduction - personalExpense;

    let taxAmount = 0;
    if (net > 0) {
      if (net <= 150000) {
        taxAmount = 0; // No tax
      } else if (net <= 300000) {
        taxAmount = (net - 150000) * 0.05; // 5% tax
      } else {
        taxAmount = (net - 300000) * 0.1 + (150000 * 0.05); // 10% tax for exceeding
      }
    }
    return taxAmount;
  };

  // Calculate net salary
  const calculateNetSalary = () => {
    const total = calculateTotalAdditions();
    const calculatedNetSalary = baseSalary + total - totalDeductions;

    // Calculate annual salary
    const annualSalary = baseSalary * 12;

    // Calculate tax
    const taxAmount = calculateTax(annualSalary);

    // Update state
    setNetSalary(calculatedNetSalary - taxAmount / 12); // Subtract tax from net salary
    setTax(taxAmount / 12); // Monthly tax
  };

  // Update net salary on relevant state changes
  useEffect(() => {
    calculateNetSalary();
  }, [baseSalary, commission, overtime, totalDeductions]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const payrollData = {
      emp_id: selectedEmp ? selectedEmp.emp_id : null,
      pay_month: payMonth,
      pay_date: payDate,
      base_salary: baseSalary,
      total_additions: totalAdditions,
      total_deductions: totalDeductions,
      net_salary: netSalary,
      tax_amount: tax // ส่ง tax_amount ไปยัง backend
    };
  
    try {
      const response = await fetch('http://localhost:8080/api/v1/payrolls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payrollData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add payroll');
      }
  
      const data = await response.json();
      console.log('Payroll added:', data);
      alert('บันทึกข้อมูลเงินเดือนสำเร็จ!'); // Alert เมื่อลงทะเบียนสำเร็จ
      // อาจจะทำการเปลี่ยนเส้นทางหรือแสดงผลตามที่คุณต้องการ
    } catch (error) {
      console.error('Error:', error);
      alert('ไม่สามารถบันทึกข้อมูลเงินเดือนได้: ' + error.message); // Alert เมื่อลงทะเบียนไม่สำเร็จ
    }
  };


  // Handle cancel action
  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ p: 2 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            สร้างรายการคำนวณเงินเดือน
          </Typography>

          <TextField
            select
            label="เลือกพนักงาน"
            value={selectedEmp ? selectedEmp.emp_id : ''}
            onChange={handleEmployeeSelect}
            fullWidth
          >
            {employees.map(emp => (
              <MenuItem key={emp.emp_id} value={emp.emp_id}>
                {emp.emp_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="รอบเดือน"
            value={payMonth}
            onChange={(e) => setPayMonth(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />

          <TextField
            label="วันที่ต้องจ่าย"
            value={payDate}
            onChange={(e) => setPayDate(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />

          <Typography variant="body1" sx={{ mt: 2 }}>
            ฐานเงินเดือน: {baseSalary}
          </Typography>

          <TextField
            label="ภาษี"
            type="number"
            value={tax}
            InputProps={{ readOnly: true }} // Make it read-only
            fullWidth
            sx={{ mt: 2 }}
          />

          <TextField
            label="ค่าคอมมิชชั่น"
            type="number"
            value={commission}
            onChange={(e) => setCommission(parseFloat(e.target.value) || 0)}
            fullWidth
            sx={{ mt: 2 }}
          />

          <TextField
            label="ค่าล่วงเวลา"
            type="number"
            value={overtime}
            onChange={(e) => setOvertime(parseFloat(e.target.value) || 0)}
            fullWidth
            sx={{ mt: 2 }}
          />

          <TextField
            label="จำนวนการเพิ่มเติม"
            type="number"
            value={totalAdditions}
            InputProps={{ readOnly: true }}
            fullWidth
            sx={{ mt: 2 }}
          />

          <TextField
            label="จำนวนการหัก"
            type="number"
            value={totalDeductions}
            onChange={(e) => setTotalDeductions(parseFloat(e.target.value) || 0)}
            fullWidth
            sx={{ mt: 2 }}
          />

          <Button variant="contained" onClick={calculateNetSalary} sx={{ mt: 2 }}>
            คำนวณเงินเดือนสุทธิ
          </Button>
          
          <Typography variant="body1" sx={{ mt: 2 }}>
            เงินเดือนสุทธิ: {netSalary}
          </Typography>

          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
            บันทึก
          </Button>
          <Button variant="outlined" onClick={handleCancel} sx={{ mt: 2, ml: 1 }}>
            ยกเลิก
          </Button>
        </Paper>
      </Container>
    </React.Fragment>
  );
}
