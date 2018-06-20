package main

import (
	"github.com/gin-gonic/gin"
	"time"
	"os"
	"os/signal"
	"net/http"
	"log"
	"context"
	"runtime"
	"github.com/json-iterator/go"
	"github.com/gin-contrib/cors"
)

var _ = jsoniter.ConfigCompatibleWithStandardLibrary

func main() {
	// Setup GO runtime to utilize multiple cores
	runtime.GOMAXPROCS(runtime.NumCPU())

	// Setup system signal detection for gracefully exit
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt, os.Kill)

	// Start periodic update for UTXOs
	updateUTXOs()
	timer := time.NewTicker(60 * time.Second)

	// Setup GIN for responding API requests
	gin.SetMode(gin.ReleaseMode)
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	router := gin.Default()
	router.Use(cors.New(config))
	router.GET("/balance/:address", getAddressBalance)
	router.GET("/transactions/:address", getAddressUTXOs)
	router.GET("/top-addresses", getTopBalanceAddresses)
	router.GET("/transactions", getAddressesUTXOs)
	router.GET("/market-cap", getCoinMarketCap)

	// Setup server instance
	server := &http.Server{
		Addr:    ":8666",
		Handler: router,
	}

	go func() {
		// service connections
		if err := server.ListenAndServe(); err != nil {
			log.Printf("listen: %s\n", err)
		}
	}()

	// Select between UTXO update and system exit signal
runner:
	for {
		select {
		case <-quit:
			break runner
		case <-timer.C:
			go updateUTXOs()
		}
	}

	// Gracefully exit
	timer.Stop()
	log.Println("Shutdown Server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown:", err)
	}
	log.Println("Server exiting")
}
