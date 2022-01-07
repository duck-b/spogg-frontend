import React from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Breadcrumbs, Link, Typography, Box, Avatar, Grid } from '@material-ui/core';
import { NavigateNext } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
    root: {
      width: '82%',
      backgroundColor: '#546e7a',
      paddingTop: '1.5em',
      paddingBottom: '0.5em',      
      marginLeft: '18%',
      color: '#FFFFFF',
      position: 'fixed',
      zIndex: '1200'
    },
    admin:{
        paddingLeft: '2em',
    },
    adminName: {
        marginLeft: '7px'
    },
    avatar:{
        color: '#FFFFFF',
        backgroundColor: '#3f51b5',
        marginTop: '-0.5em'
    },
    list: {
        float: 'right',
        paddingRight: '2em',
        color: '#FFFFFF'
    },
    url: {
        cursor: "pointer"
    }
  }));

const Header = (props) => {
    const classes = useStyles();
    
    return (
        <Box className={classes.root} boxShadow={3}>
            <Grid container>
                <Grid container xs={2} className={classes.admin}>
                    <Grid>
                        <Avatar className={classes.avatar}>{props.login.status === 1 ? "Su" : "Ad"}</Avatar>
                    </Grid>
                    <Grid className={classes.adminName}>
                        {props.login.id}
                    </Grid>
                </Grid>
                <Grid xs={10}>
                    <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" className={classes.list}>
                        {
                        props.page[0].title ?
                        <Link color="inherit" className={classes.url} onClick={() => props.history.push('/admin')} >
                            대시보드
                        </Link>:
                        <Typography>대시보드</Typography>
                        }
                        {
                        props.page[0].title?
                            props.page[1].title?
                                <Link color="inherit" className={classes.url} onClick={() => props.history.push(props.page[0].url)}>
                                    {props.page[0].title} 목록
                                </Link>:
                                <Typography>{props.page[0].title} 목록</Typography>:
                            null
                        }
                        {
                        props.page[1].title ?
                        <Typography>{props.page[0].title} {props.page[1].title}</Typography>:
                        null
                        }                 
                    </Breadcrumbs>
                </Grid>
            </Grid>
        </Box>
    );
}

export default withRouter(Header);