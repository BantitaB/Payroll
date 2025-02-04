package handlers

import (
	"net/http"
	"strconv"

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

// DeleteDepartmentHandler deletes a department
func (h *PayrollHandler) DeleteDepartmentHandler(c *gin.Context) {
	deptIDStr := c.Param("dept_id")
	deptID, err := strconv.Atoi(deptIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid department ID"})
		return
	}
	if err := h.ps.DeleteDepartment(c.Request.Context(), deptID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

// DeleteDepartmentHandler deletes a department
func (h *PayrollHandler) DeleteEmployeeHandler(c *gin.Context) {
	empIDStr := c.Param("emp_id")
	emp_id, err := strconv.Atoi(empIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid employee ID"})
		return
	}
	if err := h.ps.DeleteEmployee(c.Request.Context(), emp_id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
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
