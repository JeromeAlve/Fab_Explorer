package main

import (
	"sync"
	"sort"
	"sync/atomic"
	"fmt"
)

type Cache struct {
	Balance       sync.Map
	UTXOs         sync.Map
	Ranking       sync.Map
	TotalAddrNum  atomic.Value
	CoinMarketCap atomic.Value
}

var (
	instance *Cache
	once     sync.Once
)

func GetCache() *Cache {
	once.Do(func() {
		instance = new(Cache)
	})
	return instance
}

func (cache *Cache) Update(latestUTXOs map[string][]UTXO) {
	cache.Clean(latestUTXOs)
	cache.TotalAddrNum.Store(len(latestUTXOs))
	var marketCap float64 = 0
	var rankList AddressBalanceList

	for address, utxos := range latestUTXOs {
		cache.UTXOs.Store(address, utxos)
		var balance float64 = 0

		for _, utxo := range utxos {
			balance += utxo.Value
		}

		marketCap += balance
		cache.Balance.Store(address, balance)
		rankList = append(rankList, AddressBalance{address, balance})
	}
	cache.CoinMarketCap.Store(marketCap)
	sort.Sort(sort.Reverse(rankList))
	for rank, addrBalance := range rankList {
		cache.Ranking.Store(rank, addrBalance)
	}
}

func (cache *Cache) Clean(latestUTXOs map[string][]UTXO) {
	fmt.Println("Cleaning up cache")
	cache.Balance.Range(func(key, value interface{}) bool {
		if _, ok := latestUTXOs[key.(string)]; !ok {
			cache.Balance.Delete(key)
			cache.UTXOs.Delete(key)
		}
		return true
	})
}

func (cache *Cache) GetBalance(k string) (float64, bool) {
	if v, ok := cache.Balance.Load(k); !ok {
		return -1, false
	} else {
		return v.(float64), true
	}
}

func (cache *Cache) GetUTXOs(k string) ([]UTXO, bool) {
	if v, ok := cache.UTXOs.Load(k); !ok {
		return []UTXO{}, false
	} else {
		return v.([]UTXO), true
	}
}

func (cache *Cache) GetRanking(start, end int) (AddressBalanceList, bool) {
	totalAddrNum := cache.TotalAddrNum.Load().(int)
	fmt.Printf("Requested ranking from %d to %d, total address number is %d\n", start, end, totalAddrNum)
	if start > totalAddrNum || start > end {
		return AddressBalanceList{}, false
	}

	var result AddressBalanceList
	for i := start; i < end && i < totalAddrNum; i++ {
		rank, ok := cache.Ranking.Load(i)
		if !ok {
			continue
		}
		result = append(result, rank.(AddressBalance))
	}

	return result, true
}
