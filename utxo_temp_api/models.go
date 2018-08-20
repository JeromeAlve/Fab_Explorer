package main

type UTXO struct {
	Value       float64 `json:"value"`
	TxId        string  `json:"txid"`
	BlockHeight int     `json:"block"`
	Sequence    int     `json:"sequence"`
}

type AddressUTXOs struct {
	Address string `json:"address"`
	UTXOs   []UTXO `json:"utxos"`
}

type AddressBalance struct {
	Address string  `json:"address"`
	Balance float64 `json:"balance"`
}

type AddressBalanceList []AddressBalance

func (p AddressBalanceList) Len() int           { return len(p) }
func (p AddressBalanceList) Less(i, j int) bool { return p[i].Balance < p[j].Balance }
func (p AddressBalanceList) Swap(i, j int)      { p[i], p[j] = p[j], p[i] }
