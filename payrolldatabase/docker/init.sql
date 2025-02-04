-- Create Departments Table
CREATE TABLE Departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(255) NOT NULL,
    num_emp INT DEFAULT 0
);

-- Create Employees table
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    emp_name VARCHAR(100),
    phone_number VARCHAR(20),
    dept_id INT REFERENCES Departments(dept_id) ON DELETE CASCADE,
    position_name VARCHAR(100),
    base_salary DECIMAL(10, 2),
    bank_account VARCHAR(100),
    account_num VARCHAR(20)
);

-- Create Payroll table
CREATE TABLE payroll (
    payroll_id SERIAL PRIMARY KEY,
    emp_id INT REFERENCES employees(emp_id) ON DELETE CASCADE,
    pay_month VARCHAR(20),
    pay_date VARCHAR(20),
    base_salary DECIMAL(10, 2),
    tax_amount DECIMAL(10, 2),
    total_additions DECIMAL(10, 2),
    total_deductions DECIMAL(10, 2),
    net_salary DECIMAL(10, 2)
);


CREATE TABLE addition (
    addition_id SERIAL PRIMARY KEY,
    emp_id INT REFERENCES employees(emp_id) ON DELETE CASCADE,
    overtime DECIMAL(10, 2),
    commission DECIMAL(10, 2),
    total_additions DECIMAL(10, 2)
);

CREATE TABLE deduction (
    deduction_id SERIAL PRIMARY KEY,
    emp_id INT REFERENCES employees(emp_id) ON DELETE CASCADE,
    absent_late DECIMAL(10, 2),
    other_deduction DECIMAL(10, 2),
    total_deductions DECIMAL(10, 2)
);

CREATE TABLE IF NOT EXISTS taxcalculation (
    calculate_id SERIAL PRIMARY KEY,
    payroll_id BIGINT REFERENCES payroll(payroll_id) ON DELETE CASCADE,
    emp_id BIGINT REFERENCES employees(emp_id) ON DELETE CASCADE,
    annual_salary DECIMAL(10, 2),
    annual_social_security DECIMAL(10, 2) DEFAULT 9000,
    deduct_personal_expenses DECIMAL(10, 2) DEFAULT 100000,
    personal_deduct DECIMAL(10, 2) DEFAULT 60000,
    taxable_income DECIMAL(10, 2),
    tax DECIMAL(10, 2),
    tax_amount DECIMAL(10, 2)
);

-- Insert Data into Departments
INSERT INTO
    Departments (dept_id, dept_name, num_emp)
VALUES
    (1001, 'Marketing', 0),
    (1002, 'Sales', 0),
    (1003, 'Human Resources', 0);

CREATE OR REPLACE FUNCTION increment_num_emp() RETURNS TRIGGER AS $$ 
BEGIN
    -- เพิ่มจำนวนพนักงานในแผนกเมื่อมีการเพิ่มพนักงาน
    UPDATE Departments
    SET num_emp = num_emp + 1
    WHERE dept_id = NEW.dept_id;

    RETURN NEW;
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_num_emp
AFTER INSERT ON employees
FOR EACH ROW EXECUTE FUNCTION increment_num_emp();

CREATE OR REPLACE FUNCTION decrement_num_emp() RETURNS TRIGGER AS $$ 
BEGIN
    -- ลดจำนวนพนักงานในแผนกเมื่อพนักงานถูกลบ
    UPDATE Departments
    SET num_emp = num_emp - 1
    WHERE dept_id = OLD.dept_id;

    RETURN OLD;
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decrement_num_emp
AFTER DELETE ON employees
FOR EACH ROW EXECUTE FUNCTION decrement_num_emp();

-- Insert employee data
INSERT INTO
    employees (
        emp_id,
        emp_name,
        phone_number,
        dept_id,
        position_name,
        base_salary,
        bank_account,
        account_num
    )
VALUES
    (
        1,
        'นายสมชาย',
        '0812345678',
        1001,
        'Marketing Manager',
        30000,
        'Kasikorn Bank',
        '1234567890'
    ),
    (
        2,
        'นางสาวสาวิตรี',
        '0823456789',
        1002,
        'Sales',
        22000,
        'Bangkok Bank',
        '0987654321'
    ),
    (
        3,
        'นายบ่าว',
        '0834567890',
        1003,
        'Human Resources',
        25000,
        'Krungsri Bank',
        '5678901234'
    );