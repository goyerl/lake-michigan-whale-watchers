import React from "react";
import { Container, Grid } from "@mui/material";
import GameCard from "../components/game/GameCard";

export default function Home() {
  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={4} lg={3}>
          <GameCard
            gameDate="05-30-23"
            location="Wish Field"
            opponent="Some losers"
            weekName="TBD"
          />
        </Grid>
      </Grid>
    </Container>
  );
}
