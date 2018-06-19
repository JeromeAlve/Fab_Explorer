package main

import (
	"github.com/gin-gonic/gin"
	"time"
	"os"
	"os/signal"
	"net/http"
	"log"
	"context"
	"os/exec"
	"strings"
	"strconv"
	"runtime"
	"sync"
	"path"
	"github.com/json-iterator/go"
	"github.com/gin-contrib/cors"
	"fmt"
	"sort"
)

var (
	newUTXOs     = make(chan map[string][]UTXO)
	_            = jsoniter.ConfigCompatibleWithStandardLibrary
	currentUTXOs sync.Map
)

type UTXO struct {
	Value       float64 `json:"value"`
	TxId        string  `json:"txid"`
	BlockHeight int     `json:"block"`
	Sequence    int     `json:"sequence"`
}

func updateUTXOs() {
	fmt.Println("Start updating chain UTXOs")
	result := make(map[string][]UTXO)
	homeDir := os.Getenv("HOME")
	output, err := exec.Command("/bin/bash", path.Join(homeDir, "bin", "fabcli"), "gettxoutset").Output()
	if err != nil {
		fmt.Println("Update error")
		return
	}

	for _, m := range strings.Split(string(output[:]), ",\n") {
		if strings.Contains(m, "{") || strings.Contains(m, "}") {
			continue
		}

		utxoString := strings.Split(m, ": ")
		utxoDetail := strings.Split(utxoString[1], ", ")

		blockHeight, _ := strconv.Atoi(utxoDetail[0][1:])
		txid := utxoDetail[1]
		sequence, _ := strconv.Atoi(utxoDetail[2])
		address := utxoDetail[3]
		value, _ := strconv.Atoi(utxoDetail[4][:len(utxoDetail[4])-1])

		if _, ok := result[address]; !ok {
			result[address] = []UTXO{}
		}

		if value == 0 {
			continue
		}

		result[address] = append(result[address], UTXO{
			Value:       float64(value) / 100000000,
			TxId:        txid,
			BlockHeight: blockHeight,
			Sequence:    sequence,
		})
	}

	newUTXOs <- result
	fmt.Println("Finished updating chain UTXOs")
}

func getAddressBalance(c *gin.Context) {
	address := c.Param("address")
	balance, ok := currentUTXOs.Load("balance")
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "no result found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"address": address,
		"balance": balance.(map[string]float64)[address],
	})
}

func getAddressUTXOs(c *gin.Context) {
	address := c.Param("address")
	utxos, ok := currentUTXOs.Load("utxos")
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "no result found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"address": address,
		"utxos":   utxos.(map[string][]UTXO)[address],
	})
}

func getTopBalanceAddresses(c *gin.Context) {
	rank, ok := currentUTXOs.Load("rank")
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "no result found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"result": rank,
	})
}

func saveResult(result map[string][]UTXO) {
	addressBalance := make(map[string]float64)
	var rankList PairList

	for address, utxos := range result {
		if _, ok := addressBalance[address]; !ok {
			addressBalance[address] = 0
		}

		for _, utxo := range utxos {
			addressBalance[address] += utxo.Value
		}

		rankList = append(rankList, Pair{address, addressBalance[address]})
	}

	sort.Sort(sort.Reverse(rankList))

	currentUTXOs.Store("rank", rankList)
	currentUTXOs.Store("balance", addressBalance)
	currentUTXOs.Store("utxos", result)
}

func main() {
	// Setup GO runtime to utilize multiple cores
	runtime.GOMAXPROCS(runtime.NumCPU())

	// Setup system signal detection for gracefully exit
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt, os.Kill)

	// Start periodic update for UTXOs
	go updateUTXOs()
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
		case latestUTXOs := <-newUTXOs:
			saveResult(latestUTXOs)
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
