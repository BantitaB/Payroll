package handlers

import (
	"net/http"

	"payrollproject/internal/payroll"

	"github.com/gin-gonic/gin"
)

// PayrollHandler handles payroll-related requests
type PayrollHandler struct {
	ps *payroll.PayrollSystem
}

// NewPayrollHandler creates a new PayrollHandler instance
func NewPayrollHandler(ps *payroll.PayrollSystem) *PayrollHandler {
	return &PayrollHandler{ps: ps}
}

// AddDepartmentHandler adds a new department
func (h *PayrollHandler) AddDepartmentHandler(c *gin.Context) {
	var dept payroll.Department
	if err := c.ShouldBindJSON(&dept); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.ps.AddDepartment(c.Request.Context(), dept); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, dept)
}

// GetAllDepartmentsHandler fetches all departments
func (h *PayrollHandler) GetAllDepartmentsHandler(c *gin.Context) {
	departments, err := h.ps.GetAllDepartments(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, departments)
}

// AddEmployeeHandler adds a new employee
func (h *PayrollHandler) AddEmployeeHandler(c *gin.Context) {
	var emp payroll.Employee
	if err := c.ShouldBindJSON(&emp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.ps.AddEmployee(c.Request.Context(), emp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, emp)
}

// GetAllEmployeesHandler fetches all employees
func (h *PayrollHandler) GetAllEmployeesHandler(c *gin.Context) {
	employees, err := h.ps.GetAllEmployees(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, employees)
}

// AddPayrollHandler adds a new payroll record
func (h *PayrollHandler) AddPayrollHandler(c *gin.Context) {
	var payrollRecord payroll.Payroll
	if err := c.ShouldBindJSON(&payrollRecord); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.ps.AddPayroll(c.Request.Context(), payrollRecord); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, payrollRecord)
}

// GetAllPayrollHandler retrieves all payroll records
func (h *PayrollHandler) GetAllPayrollHandler(c *gin.Context) {
	payrolls, err := h.ps.GetAllPayrolls(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, payrolls)
}
