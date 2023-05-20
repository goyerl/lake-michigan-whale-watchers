import React from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, LinearProgress, Typography } from "@mui/material";
import getGameDetails from "../api/getGame";
import RecordAtBat from "../components/game/RecordAtBat";
import { userStore } from "../state/UserState";
import MyAtBats from "../components/game/MyAtBats";
import { getUsername } from "../utils/getUsername";
import { useQuery } from "react-query";

export default function Game() {
  const { gameDate } = useParams();
  const { id_token } = userStore((state) => state.tokens);

  const gameDetails = () => {
    return getGameDetails(gameDate);
  };
  const query = useQuery({
    queryFn: gameDetails,
    queryKey: ["game"],
  });

  // const currentTime = Date.now();
  if (query.isSuccess) {
    const game = query.data[0];
    return (
      <Box sx={{ padding: 5 }}>
        <Grid container direction="row" justifyContent="center">
          <Grid
            item
            container
            xs={6}
            md={3}
            sx={{ justifyContent: "flex-start" }}
          >
            <Typography variant="h5">Date:</Typography>
          </Grid>
          <Grid
            item
            container
            xs={6}
            md={3}
            sx={{ justifyContent: "flex-start" }}
          >
            <Typography variant="h5">{game.date}</Typography>
          </Grid>
          <Grid
            item
            container
            xs={6}
            md={3}
            sx={{ justifyContent: "flex-start" }}
          >
            <Typography variant="h5">Time:</Typography>
          </Grid>
          <Grid
            item
            container
            xs={6}
            md={3}
            sx={{ justifyContent: "flex-start" }}
          >
            <Typography variant="h5">{game.time}</Typography>
          </Grid>

          <Grid
            item
            container
            xs={6}
            md={3}
            sx={{ justifyContent: "flex-start" }}
          >
            <Typography variant="h5">Week:</Typography>
          </Grid>
          <Grid
            item
            container
            xs={6}
            md={3}
            sx={{ justifyContent: "flex-start" }}
          >
            <Typography variant="h5">{game.weekName}</Typography>
          </Grid>
          <Grid
            item
            container
            xs={6}
            md={3}
            sx={{ justifyContent: "flex-start" }}
          >
            <Typography variant="h5">Opponent:</Typography>
          </Grid>
          <Grid
            item
            container
            xs={6}
            md={3}
            sx={{ justifyContent: "flex-start" }}
          >
            <Typography variant="h5">{game.opponent}</Typography>
          </Grid>

          {id_token && (
            <>
              <MyAtBats gameDate={gameDate} id_token={id_token} />

              <Grid item xs={12} md={6} lg={4} sx={{ padding: 2 }}>
                <RecordAtBat
                  msTime={game.msTime}
                  gameDate={gameDate}
                  username={getUsername(id_token)}
                  season={game.season}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    );
  }
  return (
    <Box sx={{ padding: 5 }}>
      <LinearProgress />
    </Box>
  );
}
