import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid/Grid";
import Box from "@mui/material/Box/Box";
import TextField from "@mui/material/TextField/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function Stake(props) {
  const { setState, state } = props;
  const { methods, address } = {
    methods: state.methods,
    address: state.account,
  };
  const [input, setInput] = useState("");
  const [data, setData] = useState({
    userStake: "$0",
    totalStake: "$0",
    stakeHolders: 0,
    rewardTimeLeft: 0,
    rewardDue: false,
    isStakeHolder: { 0: "cat", 1: "dog" },
  });

  const getData = async () => {
    const newData = {
      userStake: await methods.stakeAmount(address).call(),
      totalStake: await methods.totalStakes().call(),
      stakeHolders: await methods.getStakeHoldersNumber().call(),
      isStakeHolder: await methods.isStakeholder(address).call(),
    };
    if (newData.isStakeHolder["0"]) {
      newData["rewardTimeLeft"] = await methods.rewardTimeLeft(address).call();
      newData["rewardDue"] = await methods.rewardReady(address).call();
    }
    newData.userStake = (newData.userStake / 10 ** 18).toFixed(0);
    newData.totalStake = (newData.totalStake / 10 ** 18).toFixed(0);
    setData(newData);
  };

  const mediaQuery = window.matchMedia("(max-width: 600px)");

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
        paddingTop: "15px",
      }}
    >
      <Typography
        variant={mediaQuery.matches ? "h6" : "h4"}
        style={{ color: "#00008B", marginBottom: "5px" }}
      >
        Stake tokens and earn weekly
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
                required
                fullWidth
                id="outlined-required"
                label="Amount"
                size="small"
                onChange={(e) => setInput(e.target.value)}
              />
            </Grid>
          </Grid>
          {input !== "" && (
            <Grid container item md={12} justifyContent="space-between">
              <Grid item md={12} sm={12} xs={12}>
                <Typography
                  style={{
                    color: "green",
                  }}
                >
                  You will get a reward of {Number(input) / 100} PRI every week
                </Typography>
              </Grid>
            </Grid>
          )}
          <Grid container item md={12}>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#00008B",
                color: "white",
                width: "100%",
              }}
              onClick={() => {
                const _stake = Number(input);
                methods
                  .createStake(_stake)
                  .send({ from: address })
                  .then(function (receipt) {
                    var newState = { ...state };
                    methods
                      .balanceOf(state.account)
                      .call()
                      .then(function (result) {
                        newState.balance = result;
                      });
                    setState(newState);
                    getData();
                  });
              }}
            >
              Stake
            </Button>
          </Grid>
        </Grid>
      </Box>
      {data.isStakeHolder["0"] && (
        <Typography
          variant="h5"
          style={{
            color: "#00008B",
            marginBottom: "18px",
            marginTop: "30px",
          }}
        >
          your Stake : {data.userStake} PRI
        </Typography>
      )}
      {data.isStakeHolder["0"] && (
        <Typography
          variant="h5"
          style={{ color: "#00008B", marginBottom: "40px" }}
        >
          Reward due in{" "}
          {data.rewardTimeLeft > 10
            ? data.rewardTimeLeft / 10
            : data.rewardTimeLeft}{" "}
          {data.rewardTimeLeft > 7 ? "hrs" : "days"}
        </Typography>
      )}
      <Typography
        variant="h5"
        style={{ color: "#00008B", marginBottom: "18px" }}
      >
        Number of Stakeholders : {data.stakeHolders}
      </Typography>
      <Typography
        variant={mediaQuery.matches ? "h6" : "h5"}
        style={{ color: "#00008B", marginBottom: "18px" }}
      >
        Total PMT staked(All users) : {data.totalStake} PRI
      </Typography>
      <Typography
        variant="h3"
        style={{ color: "#00008B", marginBottom: "0px", marginTop: "20px" }}
      >
        Claim Rewards
      </Typography>
      {data.isStakeHolder["0"] && (
        <Typography
          style={{
            color: "green",
            marginBottom: "18px",
          }}
          variant="subtitle1"
        >
          reward : {data.userStake / 100} PRI
        </Typography>
      )}
      <Button
        variant="contained"
        style={{
          backgroundColor: data.rewardDue ? "#00008B" : "#2d2d38",
          color: "white",
          width: "30%",
          marginBottom: "50px",
        }}
        disabled={!data.rewardDue}
        onClick={async () => {
          methods
            .claimReward()
            .send({ from: address })
            .then(function (receipt) {
              var newState = { ...state };
              methods
                .balanceOf(state.account)
                .call()
                .then(function (result) {
                  newState.balance = result;
                });
              setState(newState);
              getData();
            });
        }}
      >
        Claim
      </Button>
    </Box>
  );
}

export default Stake;
