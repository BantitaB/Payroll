package main

import (
	"context"
	"log"
	"net/http"
	"payrollproject/internal/config"
	"payrollproject/internal/handlers"
	"payrollproject/internal/payroll"
	"time"

	"github.com/gin-gonic/gin"
)

// TimeoutMiddleware sets a timeout for the request context
func TimeoutMiddleware(timeout time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c.Request.Context(), timeout)
		defer cancel()

		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}

// CORSMiddleware handles CORS
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}

		c.Next()
	}
}

func main() {
	// Load config
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Connect to the database
	db, err := payroll.NewPostgresPayrollDB(cfg.GetConnectionString())
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Create an instance of the payroll system
	bs := payroll.NewPayrollSystem(db)
	h := handlers.NewPayrollHandler(bs)

	// Set Gin to Release mode
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	// Use middleware
	r.Use(TimeoutMiddleware(10 * time.Second))
	r.Use(CORSMiddleware())

	// API v1 group
	v1 := r.Group("/api/v1")
	{
		// Route for departments API
		v1.GET("/departments", h.GetAllDepartmentsHandler) // Fetch all departments
		v1.GET("/employees", h.GetAllEmployeesHandler)
		v1.GET("/payrolls", h.GetAllPayrollHandler)
		v1.POST("/departments", h.AddDepartmentHandler) // Add new department
		v1.POST("/employees", h.AddEmployeeHandler)
		v1.POST("/payrolls", h.AddPayrollHandler)
	}

	// Start the server
	if err := r.Run(":" + cfg.AppPort); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
