import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "react-query";
import React, { useMemo, useState } from "react";
import { queryClient } from "../../App";
import putAtBat from "../../api/putAtBat";

export default function RecordAtBat(props) {
  const { msTime, gameDate, username, season } = props;
  const [inning, setInning] = useState();
  const [atBatResult, setAtBatResult] = useState();
  const [rbi, setRbi] = useState(0);
  const [runScored, setRunScored] = useState(false);

  const handleSubmit = async () => {
    const resp = await putAtBat(
      gameDate,
      msTime,
      atBatResult,
      runScored,
      rbi,
      inning,
      username,
      season
    );
    return resp;
  };

  const mutation = useMutation(handleSubmit, {
    onSuccess: () => {
      queryClient.invalidateQueries("at-bats");
    },
  });

  const reachedBase = useMemo(() => {
    if (
      atBatResult === "1B" ||
      atBatResult === "2B" ||
      atBatResult === "3B" ||
      atBatResult === "BB" ||
      atBatResult === "FC"
    ) {
      return true;
    }
    return false;
  }, [atBatResult]);

  const handleRunScoredChange = (event) => {
    setRunScored(event.target.checked);
  };

  const handleInningChange = (event) => {
    setInning(event.target.value);
  };

  const handleRbiChange = (event) => {
    console.log(event.target.value);
    setRbi(event.target.value);
  };

  return (
    <Container sx={{ padding: 2 }}>
      <Typography variant="h7">Record an At-Bat</Typography>
      <Grid container justifyContent="center" rowSpacing={3}>
        <Grid item container xs={12}>
          <TextField
            id="filled-number"
            label="Inning"
            type="number"
            value={inning}
            onChange={handleInningChange}
            InputLabelProps={{
              shrink: true,
            }}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item container xs={12}>
          <FormControl fullWidth>
            <InputLabel id="at-bat-select-label">At-Bat Result</InputLabel>
            <Select
              labelId="at-bat-select-label"
              id="at-bat-select"
              value={atBatResult}
              label="At-Bat Result"
              onChange={(e) => setAtBatResult(e.target.value)}
              variant="standard"
            >
              <MenuItem value={"1B"}>Single</MenuItem>
              <MenuItem value={"2B"}>Double</MenuItem>
              <MenuItem value={"3B"}>Triple</MenuItem>
              <MenuItem value={"HR"}>Home Run</MenuItem>
              <MenuItem value={"BB"}>Walk</MenuItem>
              <MenuItem value={"G"}>Ground Out</MenuItem>
              <MenuItem value={"F"}>Fly Out</MenuItem>
              <MenuItem value={"SF"}>Sacrafice Fly</MenuItem>
              <MenuItem value={"L"}>Line Out</MenuItem>
              <MenuItem value={"FC"}>Fielder's Choice</MenuItem>
              <MenuItem value={"K"}>Strike Out</MenuItem>
            </Select>

            <Box sx={{ paddingTop: 1 }}>
              <Grid item container xs={6}>
                <TextField
                  id="RBIs"
                  label="RBIs"
                  type="number"
                  value={rbi}
                  onChange={handleRbiChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="standard"
                />
              </Grid>
              {reachedBase && (
                <Grid item container xs={6}>
                  <FormControlLabel
                    label="Run Scored"
                    sx={{ paddingTop: 1 }}
                    control={
                      <Checkbox
                        checked={runScored}
                        onChange={handleRunScoredChange}
                      />
                    }
                  />
                </Grid>
              )}
            </Box>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button onClick={mutation.mutate} variant="contained">
            submit
          </Button>
          {mutation.isLoading && (
            <Alert severity="info">
              Submitting... <LinearProgress />
            </Alert>
          )}
          {mutation.isError && (
            <Alert severity="error">Error Submitting At-Bat</Alert>
          )}
          {mutation.isSuccess && <Alert severity="success">Success!</Alert>}
        </Grid>
      </Grid>
    </Container>
  );
}
