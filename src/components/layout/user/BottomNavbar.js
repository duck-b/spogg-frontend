import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles  } from '@material-ui/core/styles';
import { BottomNavigation, BottomNavigationAction, Grid } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faComments, faRunning, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { useSnackbar } from 'notistack';

const Layout = (props) => {
    const { enqueueSnackbar } = useSnackbar();
    
    const [value, setValue] = useState(
        props.page === 'main' ? 0 :
         props.page === 'board' ? 1 :
        //   props.page === 'goods' ? 2 : 
            props.page === 'etc' ? 3 : -1
    );
    const useStyles = makeStyles((theme) => ({
        root: {
            position:'fixed',
            bottom:0,
            alignSelf:'flex-end',
            width: '100%',
            zIndex: '1500'
        },
        selectedHome: {
            color: value === 0 ? '#5093FF' : 'rgba(0, 0, 0, 0.12)',
            padding: '5px'
        },
        selectedBoard: {
            color: value === 1 ? '#5093FF' : 'rgba(0, 0, 0, 0.12)',
            padding: '5px'
        },
        selectedGoods: {
            // color: value === 2 ? '#5093FF' : 'rgba(0, 0, 0, 0.12)',
            color: 'rgba(0, 0, 0, 0.12)',
            padding: '5px'
        },
        selectedEtc: {
            color: value === 3 ? '#5093FF' : 'rgba(0, 0, 0, 0.12)',
            padding: '5px'
        }
    }));
    const classes = useStyles();
    const handleClickNotReady = () => {
        enqueueSnackbar(`준비중 입니다.`, {variant: 'warning'});
    }
    return(
        <Grid container>
            <Grid item xs={12} sm={8} md={5} lg={4} xl={3} className={classes.root}>
            <BottomNavigation
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels
                className="bottomNavbar"
            >
                <BottomNavigationAction onClick={()=> props.history.replace('/')} label="Home" className={classes.selectedHome} icon={<FontAwesomeIcon style={{marginBottom: "3px"}} icon={faHome} size="lg" />}/>
                <BottomNavigationAction onClick={()=> props.history.replace('/board')} label="커뮤니티" className={classes.selectedBoard} icon={<FontAwesomeIcon style={{marginBottom: "3px"}} icon={faComments} size="lg" />} />
                {/* <BottomNavigationAction onClick={()=> props.history.replace('/goods')} label="스토어" className={classes.selectedGoods} icon={<FontAwesomeIcon style={{marginBottom: "3px"}} icon={faRunning} size="lg" />} /> */}
                <BottomNavigationAction onClick={handleClickNotReady} label="스토어" className={classes.selectedGoods} icon={<FontAwesomeIcon style={{marginBottom: "3px"}} icon={faRunning} size="lg" />} />
                <BottomNavigationAction onClick={()=> props.history.replace('/etc')} label="더보기" className={classes.selectedEtc} icon={<FontAwesomeIcon style={{marginBottom: "3px"}} icon={faEllipsisH} size="lg" />}/>
            </BottomNavigation>
            </Grid>
        </Grid>
    );
}

export default withRouter(Layout);