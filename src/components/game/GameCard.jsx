import React from "react";
import clarendon from "../../assets/clarendonpark.png";
import { Link } from "react-router-dom";
import { Card, CardMedia, Container, Typography } from "@mui/material";

export default function GameCard(props) {
  const { gameDate, location, opponent, weekName } = props;
  return (
    <Container sx={{ padding: 1, width: 300 }}>
      <Link to={`/game/${gameDate}`} style={{ textDecoration: "none" }}>
        <Card>
          <CardMedia
            sx={{ height: 140 }}
            src={clarendon}
            title="clarendon"
            component="img"
          />
          <Typography gutterBottom variant="h5" component="div">
            {gameDate} {location}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {weekName} vs {opponent}
          </Typography>
        </Card>
      </Link>
    </Container>
  );
}
