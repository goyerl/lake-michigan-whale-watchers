import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { userStore } from "../../state/UserState";
import { getUsername } from "../../utils/getUsername";
import getMyStats from "../../api/getMyStats";
import { useQuery } from "react-query";

export default function PlayerStats() {
  const { id_token } = userStore((state) => state.tokens);
  const username = getUsername(id_token);

  const getStats = () => {
    return getMyStats(username);
  };

  const myStats = useQuery({
    queryFn: getStats,
    queryKey: ["my-stats"],
  });

  console.log(myStats.data);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Season</TableCell>
            <TableCell>AVG</TableCell>
            <TableCell>OBP</TableCell>
            <TableCell>SLG</TableCell>
            <TableCell>Runs</TableCell>
            <TableCell>RBI</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {myStats.isSuccess && (
            <>
              {myStats.data.seasons.map((season) => (
                <TableRow
                  key={season.seasonName}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {season.seasonName}
                  </TableCell>
                  <TableCell>{Number(season.avg).toFixed(3)}</TableCell>
                  <TableCell>{Number(season.obp).toFixed(3)}</TableCell>
                  <TableCell>{Number(season.slg).toFixed(3)}</TableCell>
                  <TableCell>{season.runs}</TableCell>
                  <TableCell>{season.rbi}</TableCell>
                </TableRow>
              ))}
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Total
                </TableCell>
                <TableCell>
                  {Number(myStats.data.total.avg).toFixed(3)}
                </TableCell>
                <TableCell>
                  {Number(myStats.data.total.obp).toFixed(3)}
                </TableCell>
                <TableCell>
                  {Number(myStats.data.total.slg).toFixed(3)}
                </TableCell>
                <TableCell>{myStats.data.total.runs}</TableCell>
                <TableCell>{myStats.data.total.rbi}</TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
