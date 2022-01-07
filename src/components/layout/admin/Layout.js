import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { Menu, Header } from './';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: '0px',
    backgroundColor: '#f5f5f5'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  content: {
    padding: theme.spacing(2),
    marginLeft: '18%',
    marginTop: '3.5em'
  }
}));
const AdminLayout = (props) => {
  const classes = useStyles();
  return(
    <div className={classes.root}>
      <Grid container Spacing={3}>
        <Grid item xs={2}>
          <Menu page={props.page} logout={props.logout}/>
        </Grid>
        <Grid item xs={12}>
          <Header page={props.page} login={props.login}/>
          <div className={classes.content} >
            {props.children}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default AdminLayout;