package router

import (
	"server/middleware"

	"github.com/gin-gonic/gin"
)

// Setup configures all the routes for the application
func Setup(engine *gin.Engine) {
	// Add middleware
	engine.Use(middleware.Cors())
	engine.Use(middleware.Logger())
	engine.Use(gin.Recovery())

	// Health check endpoint
	engine.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	// API v1 routes
	// api := r.Group("/api/v1")
	// {
	// 	// HAProxy related endpoints
	// 	haproxy := api.Group("/haproxy")
	// 	{
	// 		haproxy.GET("/status", controller.HAProxyStatus)
	// 		haproxy.GET("/config", controller.HAProxyGetConfig)
	// 		haproxy.POST("/config", controller.HAProxyUpdateConfig)
	// 		haproxy.POST("/restart", controller.HAProxyRestart)
	// 		haproxy.POST("/start", controller.HAProxyStart)
	// 		haproxy.POST("/stop", controller.HAProxyStop)
	// 	}

	// 	// Engine related endpoints
	// 	engine := api.Group("/engine")
	// 	{
	// 		engine.GET("/status", controller.EngineStatus)
	// 		engine.GET("/config", controller.EngineGetConfig)
	// 		engine.POST("/config", controller.EngineUpdateConfig)
	// 		engine.POST("/restart", controller.EngineRestart)
	// 		engine.POST("/start", controller.EngineStart)
	// 		engine.POST("/stop", controller.EngineStop)
	// 	}

	// 	// Configuration related endpoints
	// 	config := api.Group("/config")
	// 	{
	// 		config.GET("", controller.GetConfig)
	// 		config.POST("", controller.UpdateConfig)
	// 	}
	// }
}
