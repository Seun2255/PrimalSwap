import React, { useState } from "react";
import Grid from "@mui/material/Grid/Grid";
import Box from "@mui/material/Box/Box";
import TextField from "@mui/material/TextField/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";

function Transfer(props) {
  const { methods, user, setState, state } = props;
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

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
      <Typography variant="h3" color={"#00008B"}>
        Share tokens with friends and colleagues
      </Typography>
      <Box
        sx={{
          width: "50%",
          border: "0px solid #00008B",
          padding: "10px",
          marginTop: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid container alignItems="center" columnSpacing={3} rowSpacing={2}>
          <Grid container item md={12} justifyContent="space-between">
            <Grid item md={12} sm={12} xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                label="Address"
                onChange={(e) => setAddress(e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container item md={12} justifyContent="space-between">
            <Grid item md={12} sm={12} xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                label="Amount"
                onChange={(e) => setAmount(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      sx={{ color: "#00008B", fontWeight: "500" }}
                    >
                      PMT
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
                const value = parseInt(amount);
                methods
                  .sendToken(address, value)
                  .send({ from: user })
                  .then(function (receipt) {
                    var newState = { ...state };
                    methods
                      .balanceOf(state.account)
                      .call()
                      .then(function (result) {
                        newState.balance = result;
                        console.log(result);
                      });
                    setState(newState);
                  });
                setAddress("");
                setAmount("");
              }}
            >
              Transfer
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Transfer;
