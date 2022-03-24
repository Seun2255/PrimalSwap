import React from "react";
import Grid from "@mui/material/Grid/Grid";
import Box from "@mui/material/Box";

function NavBar(props) {
  const { address } = props;

  const mediaQuery = window.matchMedia("(max-width: 600px)");

  return (
    <Box
      sx={{
        height: "5%",
        backgroundColor: "#00008B",
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent={mediaQuery.matches ? "center" : "space-between"}
        alignItems="center"
        style={{ color: "white", padding: "0 5px" }}
      >
        <Grid item>PrimalSwap</Grid>
        {!mediaQuery.matches && <Grid item>{address}</Grid>}
      </Grid>
    </Box>
  );
}

export default NavBar;
