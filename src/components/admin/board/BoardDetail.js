import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Button, Avatar, Table, TableRow, TableCell, Chip, IconButton } from '@material-ui/core';
import { Search, KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import axios from 'axios';

import { DialogMsg } from 'components/layout/admin';

const useStyles = makeStyles((theme) => ({
    root: {
        
    },
    paper: {
        padding: '10px'
    },
    title: {
        textAlign: 'center',
        margin: '20px',
        fontSize: '120%',
        fontWeight: 'bold'
    },
    buttonGroup: {
        textAlign: 'right',
        marginTop: '10px',
        marginBottom: '10px'
    },
    buttonOption: {
        marginLeft: '5px',
        width: '50px',
    },
    gridGroup: {
        padding: "1em"
    },
    userTitle: {
        margin: "0px 0px 0px 10px",
    },
    userTable:{
        border: "2px solid rgba(224, 224, 224, 1)",
        marginBottom: '10px'
    },
    userSports: {margin: '0px 5px 5px 0px', cursor: 'pointer'},
    userTableCellTitle:{
        border: "1px solid rgba(224, 224, 224, 1)",
        textAlign: "center",
        width: "25%",
        padding: "1em",
        fontWeight: "bold",
        fontSize: "80%",
        backgroundColor: "rgba(224, 224, 224, 0.5)"
    },
    userTableCellValue:{
        border: "1px solid rgba(224, 224, 224, 1)",
        textAlign: "center",
        width: "25%",
        padding: "1em",
        fontSize: "80%"
    },
    boardTableCellTitle:{
        border: "1px solid rgba(224, 224, 224, 1)",
        textAlign: "center",
        padding: "1em",
        fontWeight: "bold",
        fontSize: "80%",
        backgroundColor: "rgba(224, 224, 224, 0.5)"
    },
    boardTableCellValue:{
        border: "1px solid rgba(224, 224, 224, 1)",
        textAlign: "center",
        padding: "1em",
        fontSize: "80%"
    },
    chagePwBtn: {
        width: "100%"
    },
    gridList: {
        width: "100%",
        height: 400,
        textAlign: "center",
        borderLeft:"1px solid rgba(224, 224, 224, 1)"
    },
    imgList: {
        padding: "1.5em",
    },
    searchForm: {
        width: "100%",
        marginBottom: "10px"
    },
    addBtn: {
        width: "100%"
    },
    listTable:{
        border: "2px solid rgba(224, 224, 224, 1)",
    },
    listTableCellTitle:{
        border: "1px solid rgba(224, 224, 224, 1)",
        textAlign: "center",
        width: "20%",
        padding: "0.5em",
        fontWeight: "bold",
        fontSize: "80%",
        backgroundColor: "rgba(224, 224, 224, 0.5)"
    },
    listTableCellValue:{
        border: "1px solid rgba(224, 224, 224, 1)",
        textAlign: "center",
        width: "20%",
        padding: "0.3em",
        fontSize: "80%"
    },
    topLine: {
        borderTop: "1px solid rgba(224, 224, 224, 1)",
        paddingTop: "10px",
        marginTop: "10px"
    }
}));

const BoardDetail = (props) => {
    const classes = useStyles();
    const [cookies] = useCookies(['adminKey']);
    const { enqueueSnackbar } = useSnackbar();

    const [user, setUser] = useState({user_no:''}); 
    const [boards, setBoard] = useState([]);
    
    useEffect(()=> {
        async function fetchMyAPI(){
            let response = await fetch(`/api/admin/board/${props.match.params.boardId}`);
            response = await response.json();
            setUser(response[1][0]);
            setBoard(response[3]);
        }
        fetchMyAPI();
    }, []);

    return(
        <>
        <Grid className={classes.root}> 
            <Paper className={classes.paper}>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={6}>
                        <div  className={classes.title}>게시글 정보</div>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={10} className={classes.buttonGroup}>
                        <Button variant="contained" className={classes.buttonOption}>
                        수정
                        </Button>
                        <Button variant="contained" color="secondary" className={classes.buttonOption}>
                        삭제
                        </Button>
                    </Grid>
                </Grid>
                <Grid container justify="center">
                    <Grid container xs={10} alignItems="flex-start" className={classes.gridGroup}>
                        <Grid xs={6}>
                            <Table className={classes.userTable}>
                                <TableRow>
                                    <TableCell className={classes.userTableCellTitle}>게시글 번호</TableCell>
                                    <TableCell className={classes.userTableCellValue}>{user.user_no}</TableCell>
                                    <TableCell className={classes.userTableCellTitle}>닉네임</TableCell>
                                    <TableCell className={classes.userTableCellValue}>{user.user_name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.userTableCellTitle}>생년월일</TableCell>
                                    <TableCell className={classes.userTableCellValue}>{user.user_birth}</TableCell>
                                    <TableCell className={classes.userTableCellTitle}>성별</TableCell>
                                    <TableCell className={classes.userTableCellValue}>{user.user_gender === 1 ? '남' : '여'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.userTableCellTitle}>SNS</TableCell>
                                    <TableCell className={classes.userTableCellValue}>{user.user_sns === 1 ? '카카오' : user.user_sns === 2 ? '네이버' : '구글'}</TableCell>
                                    <TableCell className={classes.userTableCellTitle}>SNS ID</TableCell>
                                    <TableCell className={classes.userTableCellValue}>{user.user_id}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.userTableCellTitle}>E-mail</TableCell>
                                    <TableCell className={classes.userTableCellValue}>{user.user_email}</TableCell>
                                    <TableCell className={classes.userTableCellTitle}>전화번호</TableCell>
                                    <TableCell className={classes.userTableCellValue}>{user.user_phone}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.userTableCellTitle}>회원구분</TableCell>
                                    <TableCell className={classes.userTableCellValue}>{user.user_status === 1 ? '일반' : user.user_status === 2 ? '인플루언서' : '전문가'}</TableCell>
                                    <TableCell className={classes.userTableCellTitle}>가입일시</TableCell>
                                    <TableCell className={classes.userTableCellValue}>{user.created_at}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.userTableCellTitle}>선호종목</TableCell>
                                    <TableCell colSpan={3} className={classes.userTableCellValue}></TableCell>
                                </TableRow>
                            </Table>
                        </Grid>
                        <Grid xs={6}>
                            ㅅㄷㄴㅅ
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
        </>
    );
}

export default BoardDetail;