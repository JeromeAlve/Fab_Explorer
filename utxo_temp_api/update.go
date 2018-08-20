package main

import (
	"strconv"
	"strings"
	"fmt"
	"os"
	"os/exec"
	"path"
	"github.com/bradfitz/slice"
)

func parseResult(rawOutput []byte) map[string][]UTXO {
	result := make(map[string][]UTXO)

	for _, m := range strings.Split(string(rawOutput[:]), ",\n") {
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

	for _, utxos := range result {
		slice.Sort(utxos[:], func(i, j int) bool {
			return utxos[i].BlockHeight > utxos[j].BlockHeight
		})
	}

	return result
}

func updateUTXOs() {
	fmt.Println("Start updating chain UTXOs")
	homeDir := os.Getenv("HOME")
	output, err := exec.Command("/bin/bash", path.Join(homeDir, "bin", "fabcli"), "gettxoutset").Output()
	if err != nil {
		fmt.Println("Update error")
		return
	}

	cache := GetCache()
	cache.Update(parseResult(output))
	fmt.Println("Finished updating chain UTXOs")
}
