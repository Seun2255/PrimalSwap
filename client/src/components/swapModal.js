import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid/Grid";
import Box from "@mui/material/Box/Box";
import TextField from "@mui/material/TextField/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

function Swap(props) {
  var { methods, address, send, setState, state, getEthBalance } = props;
  const [input, setInput] = useState("");
  const [buy, setBuy] = useState(true);
  const [balance, setBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  console.log(methods);
  const output = buy
    ? parseInt(input)
      ? parseInt(input) * 1000
      : ""
    : parseInt(input)
    ? parseInt(input) / 1000
    : "";

  const sendEther = () => {
    send({
      from: address,
      to: "0xDf76d3703201CDE68D3904DBc04AcdA40A617Fd2",
      value: parseInt(input) * 10 ** 18,
    }).then(function (receipt) {
      var newState = { ...state };
      methods
        .balanceOf(state.account)
        .call()
        .then(function (result) {
          newState.balance = result;
        });
      state.getEthBalance(state.account).then(function (result) {
        newState.ethBalance = result;
      });
      setState(newState);
    });
  };

  const getData = async () => {
    var tempBalance = await methods.balanceOf(address).call();
    var tempEthBalance = await getEthBalance(address);

    tempBalance = (tempBalance / 10 ** 18).toFixed(3);
    tempEthBalance = (tempEthBalance / 10 ** 18).toFixed(3);

    setBalance(tempBalance);
    setEthBalance(tempEthBalance);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ButtonGroup>
        <Button
          onClick={() => setBuy(true)}
          style={{
            backgroundColor: buy ? "#00008B" : "white",
            color: buy ? "white" : "#00008B",
          }}
        >
          Buy
        </Button>
        <Button
          onClick={() => setBuy(false)}
          style={{
            backgroundColor: buy ? "white" : "#00008B",
            color: buy ? "#00008B" : "white",
          }}
        >
          Sell
        </Button>
      </ButtonGroup>
      <Box
        sx={{
          width: "50%",
          border: "1px solid #00008B",
          padding: "10px",
          marginTop: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid container alignItems="center" columnSpacing={3} rowSpacing={2}>
          <Grid container item md={12} justifyContent="space-between">
            <Grid item>Input</Grid>
            <Grid item>Balance: {buy ? ethBalance : balance}</Grid>
            <Grid item md={12} sm={12} xs={12} lg={12} xl={12}>
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                onChange={(e) => setInput(parseInt(e.target.value))}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      sx={{ color: "#00008B", fontWeight: "500" }}
                    >
                      {buy ? "ETH" : "PRI"}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Grid container item md={12} justifyContent="space-between">
            <Grid item>Output</Grid>
            <Grid item>Balance: {buy ? balance : ethBalance}</Grid>
            <Grid item md={12} sm={12} xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                disabled
                value={output}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      style={{ color: "#00008B", fontWeight: "700" }}
                    >
                      {buy ? "PRI" : "ETH"}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Grid container item md={12}>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#00008B",
                color: "white",
                width: "100%",
              }}
              onClick={() => {
                buy
                  ? sendEther()
                  : methods
                      .sellToken(parseInt(input))
                      .send({ from: address })
                      .then(function (receipt) {
                        var newState = { ...state };
                        methods
                          .balanceOf(state.account)
                          .call()
                          .then(function (result) {
                            newState.balance = result;
                          });
                        state
                          .getEthBalance(state.account)
                          .then(function (result) {
                            newState.ethBalance = result;
                          });
                        setState(newState);
                      });
                getData();
              }}
            >
              Swap
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Swap;
