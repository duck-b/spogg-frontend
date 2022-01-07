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

const UserDetail = (props) => {
    const classes = useStyles();
    const [cookies] = useCookies(['adminKey']);
    const { enqueueSnackbar } = useSnackbar();

    const [user, setUser] = useState({user_no:''});
    const [agrees, setAgrees] = useState([]);
    const [boards, setBoard] = useState([]);
    const [boardDisplay, setBoardDisplay] = useState('none');
    const [sports, setSport] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState([]);
    useEffect(()=> {
        async function fetchMyAPI(){
            let response = await fetch(`/api/admin/user/${props.match.params.userId}`);
            response = await response.json();
            setUser(response[1][0]);
            setAgrees(response[2]);
            setBoard(response[3]);
            setSport(response[4]);
            setFollowers(response[5]);
            setFollowings(response[6]);
        }
        fetchMyAPI();
    }, []);

    const handleClickBoardView = (event) =>{
        boardDisplay === 'none' ? setBoardDisplay('') : setBoardDisplay('none');
        document.getElementById('boardViewBtn').style.transform = boardDisplay === 'none' ? 'rotate(180deg)' : 'rotate(0deg)';
    }
    const [openFollower, setOpenFollower] = useState(false);
    const handleClickOpenFollower = () => {
        setOpenFollower(true);
    }
    const handleClickCloseFollower = () => {
        setOpenFollower(false);
    }
    const [openFollowing, setOpenFollowing] = useState(false);
    const handleClickOpenFollowing = () => {
        setOpenFollowing(true);
    }
    const handleClickCloseFollowing = () => {
        setOpenFollowing(false);
    }
    return(
        <>
        <Grid className={classes.root}> 
            <Paper className={classes.paper}>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={6}>
                        <div  className={classes.title}>회원 정보</div>
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
                        <Grid item container xs={12} alignItems='center' style={{marginBottom: '10px'}}>
                            <Grid>
                                <Avatar alt="User Profile Images" src={user.user_profile} />
                            </Grid>
                            <Grid>
                                <h3 className={classes.userTitle}>{user.user_name}</h3>
                            </Grid>
                        </Grid>
                        <Grid xs={12}>
                            <Table className={classes.userTable}>
                                <TableRow>
                                    <TableCell className={classes.userTableCellTitle}>회원 번호</TableCell>
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
                                    <TableCell colSpan={3} className={classes.userTableCellValue}>
                                    {sports.map((sport, i)=>( 
                                        <Chip label={`${sport.sport_name}`} key={i} color={sport.sport_favorite === 1 ? "secondary" : "primary" } className={classes.userSports} variant="outlined" size="small" onClick={() => props.history.push(`/admin/sport/${sport.sport_no}`)} />
                                    ))}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.userTableCellTitle}>팔로워</TableCell>
                                    <TableCell className={classes.userTableCellValue} onClick={handleClickOpenFollower}>{followers.length}</TableCell>
                                    <TableCell className={classes.userTableCellTitle}>팔로잉</TableCell>
                                    <TableCell className={classes.userTableCellValue} onClick={handleClickOpenFollowing}>{followings.length}</TableCell>
                                </TableRow>
                            </Table>
                            <Table className={classes.userTable}>
                                <TableRow>
                                    <TableCell className={classes.userTableCellTitle}>동의 내용</TableCell>
                                    <TableCell className={classes.userTableCellTitle}>동의 여부</TableCell>
                                    <TableCell className={classes.userTableCellTitle}>작성일시</TableCell>
                                </TableRow>
                                {agrees.map((agree, i) => (
                                <TableRow key={i}>
                                    <TableCell className={classes.userTableCellValue}>{agree.agree_name}</TableCell>
                                    <TableCell className={classes.userTableCellValue}>{agree.userAgree_status === 1 ? '여' : '부'}</TableCell>
                                    <TableCell className={classes.userTableCellValue}>{agree.updated_at}</TableCell>
                                </TableRow>
                                ))}
                            </Table>
                            {boards.length > 0 ?
                            <>
                            <Grid item container justify="space-between" alignItems="center">
                                <b>게시글 목록<span style={{fontWeight: '400', fontSize: '12px'}}> {boards.length}</span></b>
                                <IconButton aria-label="view" onClick={handleClickBoardView}>
                                    {/* {boardDisplay === "none" ? <KeyboardArrowDown /> : <KeyboardArrowUp />} */}
                                    <KeyboardArrowDown id="boardViewBtn" style={{transition: 'all ease 0.3s'}}/>
                                </IconButton>
                            </Grid>
                            <Table className={classes.userTable} style={{display: boardDisplay}}>
                                <TableRow>
                                    <TableCell className={classes.boardTableCellTitle}>번호</TableCell>
                                    <TableCell className={classes.boardTableCellTitle}>종류</TableCell>
                                    <TableCell className={classes.boardTableCellTitle}>제목</TableCell>
                                    <TableCell className={classes.boardTableCellTitle}>종목</TableCell>
                                    <TableCell className={classes.boardTableCellTitle}>작성일시</TableCell>
                                    <TableCell className={classes.boardTableCellTitle}>삭제일시</TableCell>
                                </TableRow>
                                {boards.map((board, i) => (
                                <TableRow key={i}>
                                    <TableCell className={classes.boardTableCellValue}>{board.board_no}</TableCell>
                                    <TableCell className={classes.boardTableCellValue}>{board.board_kind === 1 ? '스포츠 활동' : board.board_kind === 2 ? '상품 리뷰' :board.board_kind === 3 ? '운동 그램' : board.board_kind === 4 ? '영상 기록' : '전문가 칼럼'}</TableCell>
                                    <TableCell className={classes.boardTableCellValue}>{board.board_title}</TableCell>
                                    <TableCell className={classes.boardTableCellValue}>{board.sport_name}</TableCell>
                                    <TableCell className={classes.boardTableCellValue}>{board.created_at}</TableCell>
                                    <TableCell className={classes.boardTableCellValue}>{board.deleted_at}</TableCell>
                                </TableRow>
                                ))}
                            </Table>
                            <hr style={{borderColor: 'rgba(0, 0, 0, 0.1)'}}/>
                            </>:
                            null}
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
        <DialogMsg 
            open={openFollower}
            title="팔로워 리스트"
            handleClose={handleClickCloseFollower}
        >
            <Grid item container justify="flex-start" alignItems="center">
            {followers.map((follower, i) => (
                <Grid item container xs={4} style={{marginBottom: '15px', cursor: 'pointer'}} alignItems="center" onClick={() => window.open(`/admin/user/${follower.user_no}`)}>
                    <Avatar src={follower.user_profile} style={{display: 'inline-block'}} />
                    {follower.user_name}
                </Grid>
            ))}
            </Grid>
        </DialogMsg>
        <DialogMsg 
            open={openFollowing}
            title="팔로잉 리스트"
            handleClose={handleClickCloseFollowing}
        >
            <Grid item container justify="flex-start" alignItems="center">
            {followings.map((following, i) => (
                <Grid item container xs={4} style={{marginBottom: '15px', cursor: 'pointer'}} alignItems="center" onClick={() => window.open(`/admin/user/${following.user_no}`)}>
                    <Avatar src={following.user_profile} style={{display: 'inline-block'}} />
                    {following.user_name}
                </Grid>
            ))}
            </Grid>
        </DialogMsg>
        </>
    );
}

export default UserDetail;