import React from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";

import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface IDATA {
  main: {
    temp_min: number;
    temp_max: number;
  };
  weather: [{ id: string }];
}

interface ITEMP {
  today: IDATA;
  tomorrow: IDATA;
  afterTomorrow: IDATA;
}

function TableDisplay({ dataOpenWeather }: { dataOpenWeather: ITEMP }) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const d = new Date();
  let today = weekday[d.getDay()];
  let tomorrow = weekday[d.getDay() + 1];
  let afterTomorrow = weekday[d.getDay() + 2];
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">{today}</TableCell>
            <TableCell align="center">{tomorrow}</TableCell>
            <TableCell align="right">{afterTomorrow}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell align="left" component="th" scope="row">
              <i
                className={`wi wi-icon-${dataOpenWeather.today.weather[0].id}`}
              />
            </TableCell>
            <TableCell align="center" component="th" scope="row">
              {" "}
              <i
                className={`wi wi-icon-${dataOpenWeather.tomorrow.weather[0].id}`}
              />
            </TableCell>
            <TableCell align="right" component="th" scope="row">
              <i
                className={`wi wi-icon-${dataOpenWeather.afterTomorrow.weather[0].id}`}
              />
            </TableCell>
          </TableRow>
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell align="left" component="th" scope="row">
              {Math.round(dataOpenWeather.today.main.temp_min - 273)}
            </TableCell>
            <TableCell align="center" component="th" scope="row">
              {Math.round(dataOpenWeather.tomorrow.main.temp_min - 273)}
            </TableCell>
            <TableCell align="right" component="th" scope="row">
              {Math.round(dataOpenWeather.afterTomorrow.main.temp_min - 273)}
            </TableCell>
          </TableRow>
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell align="left" component="th" scope="row">
              {Math.round(dataOpenWeather.today.main.temp_max - 273)}
            </TableCell>
            <TableCell align="center" component="th" scope="row">
              {Math.round(dataOpenWeather.tomorrow.main.temp_max - 273)}
            </TableCell>
            <TableCell align="right" component="th" scope="row">
              {Math.round(dataOpenWeather.afterTomorrow.main.temp_max - 273)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableDisplay;
