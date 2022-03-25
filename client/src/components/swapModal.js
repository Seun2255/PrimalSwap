import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid/Grid";
import Box from "@mui/material/Box/Box";
import TextField from "@mui/material/TextField/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

function Swap(props) {
  var { methods, address, setState, state, getEthBalance } = props;
  const [input, setInput] = useState("");
  const [buy, setBuy] = useState(true);
  const [balance, setBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);

  const toFixed_norounding = (n, p) => {
    var result = n.toFixed(p);
    return result <= n ? result : (result - Math.pow(0.1, p)).toFixed(p);
  };
  const output = buy
    ? Number(input)
      ? Number(input) * 1000
      : ""
    : Number(input)
    ? Number(input) / 1000
    : "";

  const getData = async () => {
    var tempBalance = await methods.balanceOf(address).call();
    var tempEthBalance = await getEthBalance(address);

    tempBalance = tempBalance / 10 ** 18;
    tempBalance = toFixed_norounding(tempBalance, 3);
    tempEthBalance = tempEthBalance / 10 ** 18;
    tempEthBalance = toFixed_norounding(tempEthBalance, 3);

    setBalance(tempBalance);
    setEthBalance(tempEthBalance);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                onChange={(e) => setInput(Number(e.target.value))}
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
                  ? methods
                      .buyTokens()
                      .send({ from: address, value: Number(input) * 10 ** 18 })
                      .then(function () {
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
                        setInput(0);
                        getData();
                      })
                  : methods
                      .sellToken(Number(input))
                      .send({ from: address })
                      .then(function () {
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
                        setInput(0);
                        getData();
                      });
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
