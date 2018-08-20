package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"fmt"
	"strconv"
)

func getAddressBalance(c *gin.Context) {
	address := c.Param("address")
	cache := GetCache()
	balance, ok := cache.GetBalance(address)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("no result found for address %s", address),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"address": address,
		"balance": balance,
	})
}

func getAddressUTXOs(c *gin.Context) {
	address := c.Param("address")
	cache := GetCache()
	utxos, ok := cache.GetUTXOs(address)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("no result found for address %s", address),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"address": address,
		"utxos":   utxos,
	})
}

func getAddressesUTXOs(c *gin.Context) {
	query := c.Request.URL.Query()
	addresses, ok := query["address"]
	if !ok {
		c.JSON(404, gin.H{
			"error": "please specify the addresses you need to retrieve",
		})
		return
	}

	cache := GetCache()
	result := gin.H{}
	result["result"] = []AddressUTXOs{}

	for _, address := range addresses {
		if txs, ok := cache.GetUTXOs(address); !ok {
			result["result"] = append(
				result["result"].([]AddressUTXOs),
				AddressUTXOs{address, []UTXO{}},
			)
		} else {
			result["result"] = append(result["result"].([]AddressUTXOs), AddressUTXOs{address, txs})
		}
	}

	result["status"] = "success"
	c.JSON(200, result)
}

func getCoinMarketCap(c *gin.Context) {
	cache := GetCache()
	marketCap := cache.CoinMarketCap.Load().(float64)
	c.JSON(200, gin.H{
		"marketCap": marketCap,
	})
}

func getTopBalanceAddresses(c *gin.Context) {
	startQuery := c.Request.URL.Query().Get("start")
	endQuery := c.Request.URL.Query().Get("end")
	start := 0
	end := 0

	if startQuery == "" {
		start = 0
	} else {
		start, _ = strconv.Atoi(startQuery)
	}

	if endQuery == "" {
		end = start + 10
	} else {
		end, _ = strconv.Atoi(endQuery)
	}

	cache := GetCache()
	rank, ok := cache.GetRanking(start, end)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("rank request %s to %s is out of range", startQuery, endQuery),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"totalAddrNum": cache.TotalAddrNum.Load(),
		"result":       rank,
		"status":       "success",
	})
}
