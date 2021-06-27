import React, { useState, useEffect } from "react";
import "./CoinInput.scss";

export default function CoinInput({ title, coins, onChange }) {
  const [coin, setCoin] = useState(coins[0]);
  const [value, setValue] = useState("");

  const changeCoin = name => {
    let newCoin = coins.filter(coin => coin.name === name)[0];
    setCoin(newCoin);
  };

  // Trigger onChange for any value/coin change
  useEffect(() => {
    if (coin) {
      onChange({
        ...coin,
        value: value
      });
    }
  }, [coin, value, onChange]);

  // Reset value on coin change
  useEffect(() => {
    setValue("");
  }, [coin]);

  return (
    <div className="coin-input">
      {coins && coins.length > 0 && (
        <>
          <p className="header">
            {title}{" "}
            <span
              onClick={() => {
                setValue(coin.balance);
              }}
            >
              (Max {coin.balance})
            </span>
          </p>
          <div className="input-container">
            <input
              type="number"
              max={coin.balance}
              min={0}
              value={value}
              placeholder={0}
              onChange={e => {
                setValue(e.nativeEvent.target.value);
              }}
            />
            <select
              id="coin-select"
              onChange={e => {
                changeCoin(e.nativeEvent.target.value);
              }}
            >
              {coins.map(({ name }) => (
                <option value={name} key={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
}
