import React from "react";
import { styled } from "@mui/material/styles";
import {
  ButtonBase,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import getSchedule from "../api/getSchedule";
import wishField from "../assets/wish_field.jpg";
import { useQuery } from "react-query";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

export default function Schedule() {
  const schedule = useQuery({
    queryFn: getSchedule,
    queryKey: ["schedule"],
  });
  return (
    <Container sx={{ maxWidth: 500, padding: 3 }}>
      {schedule.isSuccess && (
        <>
          <Stack spacing={1}>
            {schedule.data.map((game) => (
              <Link
                to={`/game/${game.date}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <Paper
                  sx={{
                    p: 2,
                    margin: "auto",
                    flexGrow: 1,
                    width: "100%",
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "#1A2027" : "#fff",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={2}>
                      <ButtonBase sx={{ width: 128, height: 128 }}>
                        <Img alt="complex" src={wishField} />
                      </ButtonBase>
                    </Grid>
                    <Grid item xs={12} sm container alignItems="center">
                      <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                          <Typography
                            gutterBottom
                            variant="subtitle1"
                            component="div"
                          >
                            {game.date}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            vs {game.opponent}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Link>
            ))}
          </Stack>
        </>
      )}
    </Container>
  );
}
