import React, {useContext} from 'react'
import { Card, CardHeader, CardContent, Typography, Grid, Divider } from '@material-ui/core';
import Form from './Form/Form'
import List from './List/List'
import { GlobalContext } from '../../context/GlobalState';
import InfoCard from '../InfoCard';
import useStyles from './style'
const Main = () => {
    const classes = useStyles()
    const {balance} = useContext(GlobalContext)
    return (
       <Card className={classes.root}>
           <CardHeader title="Expense Tracker" subheader="Powered via Speechly"/>
           <CardContent>
               <Typography variant="h5" align="center">Total Balance: ${balance}</Typography>
               <Typography variant="subtitle1" style={{ lineHeight: '1.5em', marginTop: '20px' }}>
                    <InfoCard />
                </Typography>
               <Divider className={classes.divider}/>
               <Form/>
           </CardContent>
           <CardContent className={classes.cartContent}>
               <Grid container spacing={2}>
                   <Grid item xs={12}>
                       <List/>
                   </Grid>
               </Grid>
           </CardContent>
       </Card>
    )
}

export default Main
