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
    noticeTitle: {
        margin: "0px 0px 0px 10px",
        display: "inline-block",
        transform: 'translate(0, -50%)'
    },
    noticeTable:{
        border: "2px solid rgba(224, 224, 224, 1)",
        marginBottom: '10px'
    },
    noticeProfile: {display: 'inline-block'},
    noticeSports: {margin: '0px 5px 5px 0px', cursor: 'pointer'},
    noticeTableCellTitle:{
        border: "1px solid rgba(224, 224, 224, 1)",
        textAlign: "center",
        width: "25%",
        padding: "1em",
        fontWeight: "bold",
        fontSize: "80%",
        backgroundColor: "rgba(224, 224, 224, 0.5)"
    },
    noticeTableCellValue:{
        border: "1px solid rgba(224, 224, 224, 1)",
        textAlign: "center",
        width: "25%",
        padding: "1em",
        fontSize: "80%"
    }
}));

const NoticeDetail = (props) => {
    const classes = useStyles();
    const [cookies] = useCookies(['adminKey']);
    const { enqueueSnackbar } = useSnackbar();

    const [notice, setNotice] = useState({notice_no:''});
    
    useEffect(()=> {
        async function fetchMyAPI(){
            let response = await fetch(`/api/admin/notice/${props.match.params.noticeId}`);
            response = await response.json();
            setNotice(response[0]);
        }
        fetchMyAPI();
    }, []);

    return(
        <>
        <Grid className={classes.root}> 
            <Paper className={classes.paper}>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={6}>
                        <div  className={classes.title}>공지사항 정보</div>
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
                    <Grid container xs={10} alignItems="center" className={classes.gridGroup}>
                        <Grid xs={12}>
                            <Table className={classes.noticeTable}>
                                <TableRow>
                                    <TableCell className={classes.noticeTableCellTitle}>번호</TableCell>
                                    <TableCell className={classes.noticeTableCellValue}>{notice.notice_no}</TableCell>
                                    <TableCell className={classes.noticeTableCellTitle}>제목</TableCell>
                                    <TableCell className={classes.noticeTableCellValue}>{notice.notice_title}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.noticeTableCellTitle}>내용</TableCell>
                                    <TableCell colSpan={3} className={classes.noticeTableCellValue}>{notice.notice_content}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.noticeTableCellTitle}>작성일시</TableCell>
                                    <TableCell className={classes.noticeTableCellValue}>{notice.created_at}</TableCell>
                                    <TableCell className={classes.noticeTableCellTitle}>수정일시</TableCell>
                                    <TableCell className={classes.noticeTableCellValue}>{notice.updated_at}</TableCell>
                                </TableRow>
                            </Table>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
        
        </>
    );
}

export default NoticeDetail;