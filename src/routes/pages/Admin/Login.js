import React, { useState } from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import { Input, InputLabel, FormControl, Grid, Button, Box, InputAdornment, IconButton } from '@material-ui/core';
import { AccountCircle, Lock, Visibility, VisibilityOff } from '@material-ui/icons';

import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';

//https://iamhosseindhv.com/notistack/demos#maximum-snackbars : messages
const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(18)
    },
    margin: {
        margin: theme.spacing(1),
    },
    textRight: {
        textAlign: "right"
    },
    textCenter: {
        textAlign: "center"
    }
}));

const Login = (props) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [ , setCookie ] = useCookies(['adminKey'])

    const [values, setValues] = useState({
        id: '',
        pw: '',
        commentKR: 0
    });
    const handleChange = (prop) => (event) => {
        const checkKR = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
        if(checkKR.test(event.target.value)){
            if(!values.commentKR){
                enqueueSnackbar(`한글은 입력이 불가능합니다.`, { variant: 'error'});
                setValues({ ...values, commentKR: 1 });
            }else{
                return false;
            }
        }else{
            setValues({ ...values, [prop]: event.target.value });
        }
    };

    const handleClickLogin = async() => {
        let response = await fetch("/api/admin/login", {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                id: values.id,
                pw: values.pw,
                showPassword: false
            })
        })
        let res = await response.json();
        if(res.result === 1){
            enqueueSnackbar(`로그인 되었습니다.`, { variant: 'success'});
            setCookie('adminKey', res.adminKey, {path: '/admin'});
            setValues({id: "", pw: ""});
            props.history.push('/admin');
        }else{
            enqueueSnackbar(`ID와 Password를 확인해 주세요.`, { variant: 'error'});
        }
    }
    const handleKeyPress = (event) => {
        if(event.key === "Enter"){
            handleClickLogin();
        }
    }
    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    return (
        <Grid
            className={classes.root}
            container
            alignItems="center"
            justify="center"
            direction="column"
        >
            <Box boxShadow={3} borderRadius="borderRadius" p={5} style={{backgroundColor: '#ffffff'}}>
                <h2 className={classes.textCenter}>Administrator</h2>
                <div className={classes.margin}>
                    <Grid container alignItems="flex-end">
                        <Grid item xs={1}>
                            <AccountCircle />
                        </Grid>
                        <Grid xs={11}>
                            <FormControl className={classes.margin} style={{width: "100%"}}>
                                <InputLabel htmlFor="adminId">Admin ID</InputLabel>
                                <Input
                                    id="adminId"
                                    type="text"
                                    value={values.id}
                                    onChange={handleChange('id')}
                                    
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </div>
                <div className={classes.margin}>
                    <Grid container alignItems="flex-end">
                        <Grid item xs={1}>
                            <Lock />
                        </Grid>
                        <Grid xs={11}>
                            <FormControl className={classes.margin} style={{width: "100%"}}>
                                <InputLabel htmlFor="pw">Password</InputLabel>
                                <Input
                                    id="pw"
                                    type={values.showPassword ? 'text' : 'password'}
                                    value={values.pw}
                                    onChange={handleChange('pw')}
                                    onKeyPress={handleKeyPress}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            >
                                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </div>
                <div className={clsx(classes.margin, classes.textRight)}>
                    <Button variant="contained" color="primary" onClick={handleClickLogin}>
                        Login
                    </Button>
                </div>
            </Box>
        </Grid>
    );
};

export default Login;
