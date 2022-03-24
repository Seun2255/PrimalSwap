import React, { useEffect, useState } from "react";
import PrimalContract from "./contracts/Primal.json";
import getWeb3 from "./getWeb3";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./components/theme";
import "./App.css";
import NavBar from "./components/navbar";
import Swap from "./components/swapModal";
import Transfer from "./components/transfer";
import Stake from "./components/stake";
import BottomNavigation from "@mui/material/BottomNavigation";
import Paper from "@mui/material/Paper";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box/Box";
import CurrencyExchange from "@mui/icons-material/CurrencyExchangeOutlined";
import SendOutlined from "@mui/icons-material/SendOutlined";
import Token from "@mui/icons-material/TokenOutlined";
import "./react-loader-css/react-spinner-loader.css";
import { Bars } from "react-loader-spinner";

function App() {
  const [state, setState] = useState({
    account: "",
    ethBalance: "",
    methods: {},
  });
  const [value, setValue] = useState(0);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      const ethBalance = await web3.eth.getBalance(account);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PrimalContract.networks[networkId];
      const instance = new web3.eth.Contract(
        PrimalContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      const x = await instance.methods.balanceOf(account).call();
      setState({
        account,
        ethBalance,
        send: web3.eth.sendTransaction,
        methods: instance.methods,
        tokenBalance: x,
        getEthBalance: web3.eth.getBalance,
      });
    };
    getData().then(() => {
      setTimeout(() => {
        setLoader(false);
      }, 3000);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <NavBar address={state.account} />
      {loader ? (
        <Box
          sx={{
            width: "100%",
            height: "95%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bars height={200} width={200} color="#00008B" />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "95%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {value === 2 && (
            <Stake
              methods={state.methods}
              address={state.account}
              setState={(state) => setState(state)}
              state={state}
            />
          )}
          {value === 0 && (
            <Swap
              ethBalance={state.ethBalance}
              balance={state.tokenBalance}
              methods={state.methods}
              address={state.account}
              send={state.send}
              setState={(state) => setState(state)}
              getEthBalance={state.getEthBalance}
              state={state}
            />
          )}
          {value === 1 && (
            <Transfer
              methods={state.methods}
              user={state.account}
              setState={(state) => setState(state)}
              state={state}
            />
          )}
        </Box>
      )}
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Swap" icon={<CurrencyExchange />} />
          <BottomNavigationAction label="Transfer" icon={<SendOutlined />} />
          <BottomNavigationAction label="Stake" icon={<Token />} />
        </BottomNavigation>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
