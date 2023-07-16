import React from "react";
import {
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getUsername } from "../../utils/getUsername";
import getMyAtBats from "../../api/getMyAtBats";
import { queryClient } from "../../App";
import { useMutation, useQuery } from "react-query";
import { DeleteForever } from "@mui/icons-material";
import { deleteAtBat } from "../../api/deleteAtBat";

export default function MyAtBats(props) {
  const { id_token, gameDate } = props;
  const username = getUsername(id_token);

  const getAtBats = () => {
    return getMyAtBats(gameDate, username);
  };

  const myAtBats = useQuery({
    queryFn: getAtBats,
    queryKey: ["at-bats"],
  });

  const handleDelete = useMutation({
    mutationFn: (atBat) => {
      return deleteAtBat(atBat);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("at-bats");
    },
  });

  if (myAtBats.isSuccess) {
    return (
      <>
        {myAtBats.data.length >= 1 && (
          <Grid item xs={12} md={6} lg={4} sx={{ padding: 2 }}>
            <TableContainer component={Paper}>
              <TableHead>
                <TableRow>
                  <TableCell>Inning</TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    At-Bat Result
                  </TableCell>
                  <TableCell>RBI</TableCell>
                  <TableCell>Scored</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myAtBats.data.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.inning}
                    </TableCell>
                    <TableCell align="right">
                      {row.atBatResult.toUpperCase()}
                    </TableCell>
                    <TableCell align="right">{row.rbi}</TableCell>
                    <TableCell align="right">
                      {row.runScored ? <>Y</> : <>N</>}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          handleDelete.mutate({
                            gameDate: row.gameDate,
                            id: row.id,
                          })
                        }
                      >
                        <DeleteForever />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableContainer>
          </Grid>
        )}
      </>
    );
  }
  return (
    <Grid item>
      <LinearProgress />
    </Grid>
  );
}
