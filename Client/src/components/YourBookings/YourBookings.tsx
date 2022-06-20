import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { selectUser } from "../../slices/userSlice";
import { createReservation, fetchOwnReservations, selectOwnReservations } from "../../slices/reservationSlice";
import { useAppSelector, useAppDispatch } from "../../hooks";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from 'moment'
import Button from '@mui/material/Button';


export default function YourBookings() {
  const loggedInUser = useAppSelector(selectUser);
  const location = useLocation();
  const dispatch = useAppDispatch()
  const reservations = useAppSelector(selectOwnReservations)

 


  useEffect(() => {

    if (!loggedInUser) return
    
    if (loggedInUser && loggedInUser.roles.includes("tenant") )  {

    dispatch(
      createReservation({
        bookable: ( location.state as any ).bookableId,
        from: new Date(( location.state as any ).fromDate),
        to: new Date(( location.state as any ).toDate),
      })
    )
  }

  }, [])

  useEffect(() => {
    
   dispatch(fetchOwnReservations())

    
  
  }, [dispatch]) 

  console.log( reservations );
  
  
  if (!loggedInUser) {
    return <Navigate to="/login" state={{ from: location, reservationData: location.state }} />;
  } else if (!loggedInUser.roles.includes("tenant")) {
    return <Navigate to="/paymentProvider" state={{ from: location, reservationData: location.state }} />;
  }
 
  
  
  

  return ( 
   
    <TableContainer style={{height: "100%", overflow: "auto"}} component={Paper} >
      <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{fontWeight: "bold"}}>Where</TableCell>
            <TableCell style={{fontWeight: "bold"}} align="center">When</TableCell>
            <TableCell style={{fontWeight: "bold"}} align="center">What</TableCell>
            <TableCell style={{fontWeight: "bold"}} align="center">How much</TableCell>
            <TableCell style={{fontWeight: "bold"}} align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow
              key={reservation._id as string}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell >
                <p style={{fontWeight: "bold"}}>{reservation.bookable.spaceId.name}</p>
                <p>{reservation.bookable.spaceId.address.formattedAddress}</p>
              </TableCell>
               <TableCell align="right"><p> from: {reservation.from.toString().slice(0, -8).replace("T", " ")}</p>
               <p> To: {reservation.to.toString().slice(0, -8).replace("T", " ")}</p></TableCell>
              <TableCell align="right"><p>{reservation.bookable.name}</p>
              <p>Type: {reservation.bookable.type}</p></TableCell>
              <TableCell align="right">{ Number(Math.abs(moment(reservation.from).diff(moment(reservation.to), "hours", true)) *
                    (reservation.bookable.hourlyRate / 100)).toFixed(2)}€</TableCell>
              <TableCell align="right"> <Button variant="text">Cancel Reservation</Button></TableCell> 
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  
  );
}
