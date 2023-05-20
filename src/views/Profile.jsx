import jwtDecode from "jwt-decode";
import React from "react";
import { useMemo } from "react";
import { Container, Grid, Typography } from "@mui/material";
import { ContactMail, Person } from "@mui/icons-material";
import { userStore } from "../state/UserState";
import PlayerStats from "../components/stats/PlayerStats";

export default function Profile() {
  const { id_token } = userStore((state) => state.tokens);
  //const userGroups = useMemo(() => getUserGroups(id_token), [id_token]);
  const decodedToken = useMemo(() => jwtDecode(id_token), [id_token]);
  return (
    <Container>
      <Grid
        container
        spacing={1}
        justifyContent="flex-start"
        sx={{ padding: 2 }}
      >
        <Grid item xs={2}>
          <Person color="primary" fontSize="large" />
        </Grid>
        <Grid item xs={10} textAlign="left">
          <Typography variant="h6">
            {decodedToken["cognito:username"]}
          </Typography>
        </Grid>

        <Grid item xs={2}>
          <ContactMail color="primary" fontSize="large" />
        </Grid>
        <Grid item xs={10} textAlign="left">
          <Typography variant="h6">{decodedToken.email}</Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <PlayerStats />
      </Grid>
    </Container>
  );
}
