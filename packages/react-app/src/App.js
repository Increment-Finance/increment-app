import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Button, Slider } from "antd";
import { Layout, Form, Input, Row, Col } from "antd";
import TradingViewWidget, { Themes } from "react-tradingview-widget";
import { Descriptions } from "antd";
import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "@ethersproject/providers";
import { useQuery } from "@apollo/react-hooks";
import useWeb3Modal from "./hooks/useWeb3Modal";
import { addresses, abis } from "@project/contracts";
import GET_TRANSFERS from "./graphql/subgraph";
import { Header, WalletButton } from "./components";

import "./App.scss";
import "antd/dist/antd.css";

// async function readOnChainData() {
//   // Should replace with the end-user wallet, e.g. Metamask
//   const defaultProvider = getDefaultProvider();
//   // Create an instance of an ethers.js Contract
//   // Read more about ethers.js on https://docs.ethers.io/v5/api/contract/contract/
//   const ceaErc20 = new Contract(
//     addresses.ceaErc20,
//     abis.erc20,
//     defaultProvider
//   );
//   // A pre-defined address that owns some CEAERC20 tokens
//   const tokenBalance = await ceaErc20.balanceOf(
//     "0x3f8CB69d9c0ED01923F11c829BaE4D9a4CB6c82C"
//   );
//   console.log({ tokenBalance: tokenBalance.toString() });
// }

function App() {
  const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [userAddress, setUserAddress] = useState(null);

  useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, error, data]);

  useEffect(() => {
    const signer = provider?.getSigner();
    if (signer) {
      signer
        .getAddress()
        .then(address => {
          setUserAddress(address);
        })
        .catch(err => {
          console.log("Couldn't get signer", err);
        });
    }
  }, [provider]);

  return (
    <Layout>
      <Router>
        <Header
          address={userAddress}
          provider={provider}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
        />
        <Route path="/" exact>
          <div className="market-container">
            <Descriptions title="">
              <Descriptions.Item label="My Balance">0.00</Descriptions.Item>
            </Descriptions>
            <Button type="primary" shape="round" size={10}>
              BUY/LONG
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" shape="round" size={10}>
              SELL/SHORT
            </Button>
            <Row gutter={[40, 16]}>
              <Col span={6} />
              <Col span={6} />
              <Col span={6} />
              <Col span={6} />

              <Col span={6} />
              <Col span={6} />
              <Col span={6} />
              <Col span={6} />
            </Row>
            <Form>
              <Form.Item
                label="Collateral"
                name="username"
                rules={[{ message: "Please input your username!" }]}
              >
                <Input placeholder="0.00" suffix="USDC" />
              </Form.Item>

              <Form.Item
                label="Position"
                name="password"
                rules={[{ message: "Please input your password!" }]}
              >
                <Input placeholder="0.00" suffix="EURO" />
              </Form.Item>

              <Form.Item>
                <Slider
                  defaultValue={3}
                  disabled={false}
                  max={10}
                  marginTop={64}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
            <TradingViewWidget
              symbol="FX:EURUSD"
              theme={Themes.DARK}
              locale="fr"
              dateRange={12}
              width={800}
              height={400}
            />
          </div>
        </Route>
        <Route path="/dashboard"></Route>
      </Router>
    </Layout>
  );
}

export default App;
