package payroll

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	_ "github.com/lib/pq"
)

// Department represents the department structure
type Department struct {
	DeptID   int    `json:"dept_id"`
	DeptName string `json:"dept_name"`
	NumEmp   int    `json:"num_emp"` // Optional field for completeness
}

// Employee struct
type Employee struct {
	EmployeeID   int     `json:"emp_id"`
	EmpName      string  `json:"emp_name"`
	PhoneNumber  string  `json:"phone_number"`
	DeptID       int     `json:"dept_id"`
	DeptName     string  `json:"dept_name"`
	PositionName string  `json:"position_name"`
	BaseSalary   float64 `json:"base_salary"`
	BankAccount  string  `json:"bank_account"`
	AccountNum   string  `json:"account_num"`
}

// Payroll struct
type Payroll struct {
	PayrollID       int     `json:"payroll_id"`
	EmpID           int     `json:"emp_id"`
	PayMonth        string  `json:"pay_month"`
	PayDate         string  `json:"pay_date"`
	BaseSalary      float64 `json:"base_salary"`
	TaxAmount       float64 `json:"tax_amount"`
	TotalAdditions  float64 `json:"total_additions"`
	TotalDeductions float64 `json:"total_deductions"`
	NetSalary       float64 `json:"net_salary"`
}

// PayrollDatabase defines the interface for interacting with the payroll database
type PayrollDatabase interface {
	GetAllEmployees(ctx context.Context) ([]Employee, error)
	GetAllDepartments(ctx context.Context) ([]Department, error)
	AddDepartment(ctx context.Context, dept Department) error
	AddEmployee(ctx context.Context, emp Employee) error
	AddPayroll(ctx context.Context, payroll Payroll) error
	GetAllPayrolls(ctx context.Context) ([]Payroll, error)
	Close() error
}

// PostgresPayrollDB is the struct for interacting with the PostgreSQL database
type PostgresPayrollDB struct {
	db *sql.DB
}

// NewPostgresPayrollDB initializes a new PostgresPayrollDB
func NewPostgresPayrollDB(connStr string) (*PostgresPayrollDB, error) {
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %v", err)
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(10)
	db.SetConnMaxLifetime(5 * time.Minute)

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %v", err)
	}

	return &PostgresPayrollDB{db: db}, nil
}

// GetAllEmployees retrieves all employees from the payroll database
func (pdb *PostgresPayrollDB) GetAllEmployees(ctx context.Context) ([]Employee, error) {
	rows, err := pdb.db.QueryContext(ctx, `
        SELECT e.emp_id, e.emp_name, e.phone_number, e.dept_id, d.dept_name, e.position_name, e.base_salary, e.bank_account, e.account_num 
        FROM employees e 
        JOIN departments d ON e.dept_id = d.dept_id 
        ORDER BY e.emp_id ASC`)
	if err != nil {
		return nil, fmt.Errorf("failed to query employees: %v", err)
	}
	defer rows.Close()

	var employees []Employee
	for rows.Next() {
		var emp Employee
		if err := rows.Scan(&emp.EmployeeID, &emp.EmpName, &emp.PhoneNumber, &emp.DeptID, &emp.DeptName, &emp.PositionName, &emp.BaseSalary, &emp.BankAccount, &emp.AccountNum); err != nil {
			return nil, fmt.Errorf("failed to scan employee data: %v", err)
		}
		employees = append(employees, emp)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over employees: %v", err)
	}
	return employees, nil
}

// GetAllDepartments retrieves all departments from the database
func (pdb *PostgresPayrollDB) GetAllDepartments(ctx context.Context) ([]Department, error) {
	rows, err := pdb.db.QueryContext(ctx, "SELECT dept_id, dept_name, num_emp FROM departments ORDER BY dept_id ASC")
	if err != nil {
		return nil, fmt.Errorf("failed to query departments: %v", err)
	}
	defer rows.Close()

	var departments []Department
	for rows.Next() {
		var dept Department
		if err := rows.Scan(&dept.DeptID, &dept.DeptName, &dept.NumEmp); err != nil {
			return nil, fmt.Errorf("failed to scan department data: %v", err)
		}
		departments = append(departments, dept)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over departments: %v", err)
	}
	return departments, nil
}

// AddDepartment adds a new department to the payroll system
func (pdb *PostgresPayrollDB) AddDepartment(ctx context.Context, dept Department) error {
	_, err := pdb.db.ExecContext(ctx, "INSERT INTO departments (dept_id, dept_name) VALUES ($1, $2)", dept.DeptID, dept.DeptName)
	return err
}

// AddEmployee adds a new employee to the payroll system
func (pdb *PostgresPayrollDB) AddEmployee(ctx context.Context, emp Employee) error {
	_, err := pdb.db.ExecContext(ctx, `
        INSERT INTO employees (
            emp_id, 
            emp_name, 
            phone_number, 
            dept_id, 
            position_name, 
            base_salary, 
            bank_account, 
            account_num
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8
        )`,
		emp.EmployeeID,
		emp.EmpName,
		emp.PhoneNumber,
		emp.DeptID,
		emp.PositionName,
		emp.BaseSalary,
		emp.BankAccount,
		emp.AccountNum)

	if err != nil {
		return fmt.Errorf("failed to add employee: %v", err)
	}
	return nil
}

// AddPayroll adds a new payroll record to the database
func (pdb *PostgresPayrollDB) AddPayroll(ctx context.Context, payroll Payroll) error {
	_, err := pdb.db.ExecContext(ctx, `
    INSERT INTO payroll (
        emp_id, 
        pay_month, 
        pay_date, 
        base_salary, 
        tax_amount,  -- เพิ่ม tax_amount ที่นี่
        total_additions, 
        total_deductions, 
        net_salary
    ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
    )`,
		payroll.EmpID,
		payroll.PayMonth,
		payroll.PayDate,
		payroll.BaseSalary,
		payroll.TaxAmount, // ส่ง tax_amount
		payroll.TotalAdditions,
		payroll.TotalDeductions,
		payroll.NetSalary)

	return err
}

// GetAllPayrolls retrieves all payroll records from the database
func (pdb *PostgresPayrollDB) GetAllPayrolls(ctx context.Context) ([]Payroll, error) {
	rows, err := pdb.db.QueryContext(ctx, `
        SELECT 
            payroll_id, 
            emp_id, 
            pay_month, 
            pay_date, 
            base_salary, 
            tax_amount, 
            total_additions, 
            total_deductions, 
            net_salary 
        FROM payroll 
        ORDER BY payroll_id ASC`)
	if err != nil {
		return nil, fmt.Errorf("failed to query payroll: %v", err)
	}
	defer rows.Close()

	var payrolls []Payroll
	for rows.Next() {
		var payroll Payroll
		if err := rows.Scan(&payroll.PayrollID, &payroll.EmpID, &payroll.PayMonth, &payroll.PayDate, &payroll.BaseSalary, &payroll.TaxAmount, &payroll.TotalAdditions, &payroll.TotalDeductions, &payroll.NetSalary); err != nil {
			return nil, fmt.Errorf("failed to scan payroll data: %v", err)
		}
		payrolls = append(payrolls, payroll)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over payrolls: %v", err)
	}
	return payrolls, nil
}

// Close closes the database connection
func (pdb *PostgresPayrollDB) Close() error {
	return pdb.db.Close()
}

// PayrollSystem represents the main payroll system
type PayrollSystem struct {
	db PayrollDatabase
}

// NewPayrollSystem creates a new PayrollSystem instance
func NewPayrollSystem(db PayrollDatabase) *PayrollSystem {
	return &PayrollSystem{db: db}
}

// GetAllEmployees retrieves all employees from the payroll system
func (ps *PayrollSystem) GetAllEmployees(ctx context.Context) ([]Employee, error) {
	return ps.db.GetAllEmployees(ctx)
}

// GetAllDepartments retrieves all departments from the payroll system
func (ps *PayrollSystem) GetAllDepartments(ctx context.Context) ([]Department, error) {
	return ps.db.GetAllDepartments(ctx)
}

// AddDepartment adds a new department to the payroll system
func (ps *PayrollSystem) AddDepartment(ctx context.Context, dept Department) error {
	return ps.db.AddDepartment(ctx, dept)
}

// AddEmployee adds a new employee to the payroll system
func (ps *PayrollSystem) AddEmployee(ctx context.Context, emp Employee) error {
	return ps.db.AddEmployee(ctx, emp)
}

// AddPayroll adds a new payroll entry to the payroll system
func (ps *PayrollSystem) AddPayroll(ctx context.Context, payroll Payroll) error {
	return ps.db.AddPayroll(ctx, payroll)
}

// GetAllPayrolls retrieves all payroll records from the payroll system
func (ps *PayrollSystem) GetAllPayrolls(ctx context.Context) ([]Payroll, error) {
	return ps.db.GetAllPayrolls(ctx)
}

// Close closes the payroll system and its database connection
func (ps *PayrollSystem) Close() error {
	return ps.db.Close()
}
