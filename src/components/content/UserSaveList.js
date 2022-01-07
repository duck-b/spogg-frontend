import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Avatar, Grid, Paper, CircularProgress } from '@material-ui/core';
import MuiTab from '@material-ui/core/Tab';
import MuiTabs from '@material-ui/core/Tabs';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ContentPlay from 'components/content/ContentPlay';
import ContentCard from 'components/content/ContentCard';
import ContentListHarfText from 'components/content/ContentListHarfText';
import DialogComment from 'components/layout/user/DialogComment';
import ContentComment from 'components/content/ContentComment';

const useStyles = makeStyles({
    root: {
      flexGrow: 1,
      borderRadius: '0px',
      boxShadow: 'none',
      marginBottom: '10px'
    },
    tabs: {
        boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.15)',
    }
});

const Tab = withStyles({
    root:{
        fontSize: '14px',
        '&$selected': {
            color: '#5093FF'
        }
    },
    selected:{}
})(MuiTab);

const Tabs = withStyles({
    indicator: {
        backgroundColor: '#5093FF'
    }
})(MuiTabs);

const UserSaveList = (props) => {
    const [cookies] = useCookies('userKey');
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const [boardSelected, setBoardSelected] = useState(0);
    
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadBoardList(boardSelected);
        setTimeout(() => {
            setLoading(false);
        },[800]);
    }, []);

    const handleChange = (event, newValue) => {
        if(newValue !== boardSelected){
            setLoading(true);
            loadBoardList(newValue);
            setBoardSelected(newValue);
            setTimeout(()=>{
                setLoading(false);
            },[800])
        }
    };
    const [user, setUser] = useState(0);
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const [boardComment, setBoardComment] = useState(0);
    const [comments, setComments] = useState([
        {
            boardComment_no: '',
            user_no: '',
            user_profile: '',
            user_name: '',
            boardComment_content: '',
            boardRecomment_no: '',
            deleted_at: '',
            created_at: ''
        }
    ]);
    const [recomment, setRecomment] = useState({recommentNo: 0, recommentUser: 0, recommentUserName: ''});
    const handleClickOpen = (board_no) => {
        setBoardComment(board_no)
        window.history.pushState(null, null, '');
        const loadComment = async() => {
            const config = {
                headers: {
                    "content-type": "application/json"
                }
            };
            await axios.get(`/api/comment/${board_no}`, config).then((response)=>{
                setComments(response.data);
            }); 
        }
        loadComment();
        setOpen(true);
    };

    const loadBoardList = async(boardKind) => {
        const config = {
            headers: {
                "content-type": "application/json"
            }
        };
        let url;
        if(boardKind === 0){
            url = `/api/userPage/boardPlay/${cookies.userKey}`;
        }else if(boardKind === 1){
            url = `/api/userPage/boardGram/${cookies.userKey}`;
        }else if(boardKind === 2){
            url = `/api/userPage/boardColumn/${cookies.userKey}`;
        }
        await axios.get(url, config).then((response)=>{
            let dt = response.data.values;
            let loadValues = [];
            if(boardKind === 0){
                for(let i = 0; i < dt.length; i++){
                    loadValues.push({
                        boardNo: dt[i].board_no,
                        boardTitle: dt.board_title,
                        userNo: dt[i].user_no,
                        userProfile: dt[i].user_profile,
                        userName: dt[i].user_name,
                        sportNo: dt[i].sport_no,
                        sportName: dt[i].sport_name,
                        createdAt: dt[i].created_at,
                        userFollow: dt[i].user_follow,
                        thisUser: Number(dt[i].this_user),
                        boardDetail: []
                    });
                    let boardHashtag = dt[i].board_hashtag.split('|');
                    let boardGoodsInfo = dt[i].boardGoods_info.split('|');
                    let boardGoodsX = dt[i].boardGoods_x.split('|');
                    let boardGoodsY = dt[i].boardGoods_y.split('|');
                    let thisGoods = dt[i].goods_no.split('|');
                    let thisGoodsName = dt[i].goods_name.split('|');
                    let thisGoodsImage = dt[i].thisGoods_image.split('|');
                    for(let j = 0; j < dt[i].boardDetail_num.split('|').length; j++){
                        loadValues[i].boardDetail.push({
                            boardDetailNo: dt[i].boardDetail_num.split('|')[j],
                            boardDetailContent: dt[i].boardDetail_content.split('|')[j],
                            boardImage: dt[i].board_img.split('|')[j],
                            boardHashtag: boardHashtag[j] ? boardHashtag[j].split(',') : [],
                            boardGoods: [],
                            thisGoods: [],
                        })
                        for(let k = 0; k < boardGoodsX[j].split(',').length; k++){
                            loadValues[i].boardDetail[j].boardGoods.push({
                                x: boardGoodsX[j].split(',')[k], 
                                y: boardGoodsY[j].split(',')[k], 
                                info: boardGoodsInfo[j].split(',')[k],
                                no: thisGoods[j].split(',')[k], 
                                name: thisGoodsName[j].split(',')[k], 
                                image: thisGoodsImage[j].split(',')[k]
                            })
                        }
                    }
                }
            }else if(boardKind === 1){
                loadValues = dt;
                setUser(response.data.user);
            }else if(boardKind === 2){
                for(let i = 0; i < dt.length; i++){
                    loadValues.push({
                        boardNo: dt[i].board_no,
                        boardTitle: dt[i].board_title,
                        userNo: dt[i].user_no,
                        userProfile: dt[i].user_profile,
                        userName: dt[i].user_name,
                        sportNo: dt[i].sport_no,
                        sportName: dt[i].sport_name,
                        createdAt: dt[i].created_at,
                        boardCountLike: dt[i].boardCount_like,
                        boardCountSave: dt[i].boardCount_save,
                        boardCountView: dt[i].boardCount_view,
                        boardRating: dt[i].boardRating_count ? (dt[i].boardRating_rating/dt[i].boardRating_count).toPrecision(2) : '-',
                        boardDetail: []
                    });
                    let boardHashtag = dt[i].board_hashtag.split('|');
                    let boardGoodsInfo = dt[i].boardGoods_info.split('|');
                    let boardGoodsX = dt[i].boardGoods_x.split('|');
                    let boardGoodsY = dt[i].boardGoods_y.split('|');
                    let thisGoods = dt[i].goods_no.split('|');
                    let thisGoodsName = dt[i].goods_name.split('|');
                    let thisGoodsImage = dt[i].thisGoods_image.split('|');
                    for(let j = 0; j < dt[i].boardDetail_num.split('|').length; j++){
                        loadValues[i].boardDetail.push({
                            boardDetailNo: dt[i].boardDetail_num.split('|')[j],
                            boardDetailContent: dt[i].boardDetail_content.split('|')[j],
                            boardImage: dt[i].board_img.split('|')[j],
                            boardHashtag: boardHashtag[j] ? boardHashtag[j].split(',') : [],
                            boardGoods: [],
                            thisGoods: [],
                        })
                        for(let k = 0; k < boardGoodsX[j].split(',').length; k++){
                            loadValues[i].boardDetail[j].boardGoods.push({
                                x: boardGoodsX[j].split(',')[k], 
                                y: boardGoodsY[j].split(',')[k], 
                                info: boardGoodsInfo[j].split(',')[k],
                                no: thisGoods[j].split(',')[k], 
                                name: thisGoodsName[j].split(',')[k], 
                                image: thisGoodsImage[j].split(',')[k]
                            })
                        }
                    }
                }
            }
            setBoards(loadValues);
        })
    }
    const handleClickCardValue = (key, value) => {
        if(value === 'board_like' || value === 'board_save'){
            const saveCount = async() => {
                const data = {
                    boardNo: boards[key].board_no, 
                    countKind: value,
                    countValue: !boards[key][value],
                    userKey: cookies.userKey
                }
                const config = {
                    headers: {
                        "content-type": "application/json"
                    }
                };
                await axios.post("/api/board/count", data, config).then((response) =>{
                    if(response.data.result === 0){
                        enqueueSnackbar(`로그인이 필요합니다.`, 
                        {   
                            variant: 'warning', 
                            action: <div className="alret_action">
                                <button 
                                    onClick={() => props.history.push({pathname: `/user/login`, state: `${props.history.location.pathname}`})}
                                >로그인
                                </button>
                            </div>
                        })
                        return false;
                    }else{
                        let changeValue = [...boards];
                        changeValue[key][value] = !changeValue[key][value] ? true : false;
                        if(value === 'board_like'){
                            changeValue[key].boardCount_like = changeValue[key][value] ? changeValue[key].boardCount_like+1 : changeValue[key].boardCount_like-1;
                            enqueueSnackbar(`해당 게시글${changeValue[key][value] ? '을 좋아합니다.' : ' 좋아요를 취소합니다.'}`, { variant: 'info'});
                        }else if(value === 'board_save'){
                            changeValue[key].boardCount_save = changeValue[key][value] ? changeValue[key].boardCount_save+1 : changeValue[key].boardCount_save-1;
                            enqueueSnackbar(`해당 게시글${changeValue[key][value] ? '을 저장하였습니다.' : ' 저장을 취소합니다.'}`, { variant: 'info'});
                        }
                        setBoards(changeValue);
                    }
                });
            }
            saveCount();
        }else if(value === 'board_delete'){
            const deleteBoard = async() => {
                const data = {
                    boardNo: boards[key].board_no, 
                    userKey: cookies.userKey
                }
                const config = {
                    headers: {
                        "content-type": "application/json"
                    }
                };
                await axios.post("/api/board/delete", data, config).then((response) =>{
                    if(response.data.result === 0){
                        enqueueSnackbar(`Error 관리자에게 문의해주세요.`, 
                        {   
                            variant: 'Error', 
                        })
                        return false;
                    }else{
                        let changeValue = [...boards];
                        changeValue.splice(key ,1);    
                        setBoards(changeValue);
                    }
                });
            }
            deleteBoard();
        }else if(value === 'user_follow'){
            const followUser = async() => {
                const data = {
                    followUser: boards[key].user_no,
                    followerUser: cookies.userKey,
                    follow: boards[key].user_follow ? 'delete' : 'insert'
                }
                const config = {
                    headers: {
                        "content-type": "application/json"
                    }
                };
                await axios.post("/api/user/follow", data, config).then((response) =>{
                    if(response.data.result === 1){
                        if(!boards[key].user_follow){
                            enqueueSnackbar(`${boards[key].user_name}님을 팔로우 하였습니다.`, { variant: 'info'});
                            let changeValue = [...boards];
                            changeValue[key].user_follow = new Date();    
                            setBoards(changeValue);
                        }else{
                            enqueueSnackbar(`${boards[key].user_name}님을 팔로우 취소 하였습니다.`, { variant: 'info'});
                            let changeValue = [...boards];
                            changeValue[key].user_follow = null;    
                            setBoards(changeValue);
                        }                    
                    }else{
                        enqueueSnackbar(`로그인이 필요합니다.`, 
                        {   
                            variant: 'warning', 
                            action: <div className="alret_action">
                                <button 
                                    onClick={() => props.history.push({pathname: `/user/login`, state: `${props.history.location.pathname}`})}
                                >로그인
                                </button>
                            </div>
                        })
                        return false;
                    }
                });
            }
            followUser();
        }else{
            let changeValue = [...boards];
            changeValue[key][value] = !changeValue[key][value] ? true : false;
            setBoards(changeValue);
        }
    }
    
    const handleChangeSort = (event) => {
        let sortBoards = [...boards];
        setLoading(true)
        setTimeout(() => {
            if(event.target.value === '0'){
                sortBoards.sort(function(a, b){
                    return a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0;
                })    
            }else if(event.target.value === '1'){
                sortBoards.sort(function(a, b){
                    return a.boardTitle < b.boardTitle ? -1 : a.boardTitle > b.boardTitle ? 1 : 0;
                })
            }else if(event.target.value === '2'){
                sortBoards.sort(function(a, b){
                    return a.boardCountView < b.boardCountView ? 1 : a.boardCountView > b.boardCountView ? -1 : 0;
                })
            }else if(event.target.value === '3'){
                sortBoards.sort(function(a, b){
                    return a.boardRating < b.boardRating ? 1 : a.boardRating > b.boardRating ? -1 : 0;
                })
            }
            setBoards(sortBoards);
            setLoading(false);
        }, [500])
    }
    const handleClickFollow = async(key) => {
        const data = {
            followUser: boards[key].userNo,
            followerUser: cookies.userKey,
            follow: boards[key].userFollow ? 'delete' : 'insert'
        }
        const config = {
            headers: {
                "content-type": "application/json"
            }
        };
        await axios.post("/api/user/follow", data, config).then((response) =>{
            if(response.data.result === 1){
                if(!boards[key].userFollow){
                    enqueueSnackbar(`${boards[key].userName}님을 팔로우 하였습니다.`, { variant: 'info'});
                    let changeValue = [...boards];
                    for(let k = 0; k<changeValue.length; k++){
                        if(changeValue[k].userNo === changeValue[key].userNo){
                            changeValue[k].userFollow = new Date();
                        }    
                    }
                    setBoards(changeValue);
                }else{
                    enqueueSnackbar(`${boards[key].userName}님을 팔로우 취소 하였습니다.`, { variant: 'info'});
                    let changeValue = [...boards];
                    for(let k = 0; k<changeValue.length; k++){
                        if(changeValue[k].userNo === changeValue[key].userNo){
                            changeValue[k].userFollow = null;
                        }    
                    }
                    setBoards(changeValue);
                }                    
            }else{
                enqueueSnackbar(`로그인이 필요합니다.`, 
                {   
                    variant: 'warning', 
                    action: <div className="alret_action">
                        <button 
                            onClick={() => props.history.push({pathname: `/user/login`, state: `${props.history.location.pathname}`})}
                        >로그인
                        </button>
                    </div>
                })
                return false;
            }
        });
    }
    const handleClickDelete = async(key) => {
        const data = {
            boardNo: boards[key].boardNo,
            userKey: cookies.userKey
        }
        const config = {
            headers: {
                "content-type": "application/json"
            }
        };
        await axios.post("/api/board/delete", data, config).then((response) =>{
            if(response.data.result === 0){
                enqueueSnackbar(`Error 관리자에 문의해주세요.`, 
                {   
                    variant: 'Error', 
                })
                return false;
            }else{
                let changeValue = [...boards];
                changeValue.splice(key ,1);    
                setBoards(changeValue);
            }
        });
    }
    return(
        <>
            <Paper className={classes.root}>
                <Tabs
                    value={boardSelected}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                    variant="fullWidth"
                    className={classes.tabs}
                >
                    <Tab label="스포츠 활동" disabled={loading} className={classes.tab}/>
                    <Tab label="운동 그램" disabled={loading} className={classes.tab}/>
                    <Tab label="전문가 칼럼" disabled={loading} className={classes.tab}/>                    
                </Tabs>
            </Paper> 
            {boards[0] ? 
            <Grid className="board_sort" style={{margin: '0px 20px 20px 0px'}}>
                <select onChange={handleChangeSort}>
                    <option value={0} selected>최신순</option>
                    <option value={1}>제목순</option>
                    {boardSelected === 2 ?
                    <>
                    <option value={2}>조회순</option>
                    <option value={3}>별점순</option>
                    </>
                    :null}
                </select>
            </Grid> :
            null}
            {!loading ?
                boards[0] ?
                    boardSelected === 0 ?
            <div className='board_list'>
                {boards.map((board, i) => (
                    <ContentPlay 
                        value={board} 
                        contentKey={i} 
                        handleClickFollow={handleClickFollow}
                        handleClickDelete={handleClickDelete}
                    />
                ))}
            </div> : boardSelected === 1 ?
            <div className='board_list'>
                {boards.map((board, i) => (
                    <ContentCard 
                        handleClickOpen={() => handleClickOpen(board.board_no)} 
                        value={board} 
                        user={user}
                        contentKey={i} 
                        handleClickCardValue={handleClickCardValue}
                    />
                ))}
            </div> :
            <div className='board_list'>
                {boards.map((board, i) => (
                    <ContentListHarfText 
                        value={board} 
                        contentKey={i} 
                    />
                ))}
            </div>
                : <div className="user_board_loading">게시글이 없습니다.</div>
            :
            <div className="user_board_loading">
                <CircularProgress />
            </div>
            }
            <DialogComment 
                open={open}
                handleClose={handleClose}
                handleOpen={() => setOpen(true)}
                boardComment_boardNo={boardComment}
                user={user}
                commentCount={comments.length}
                recomment={recomment}
                setRecomment={setRecomment}
                setComments={setComments}
            >
                {comments.map((comment, i)=>(
                    <ContentComment 
                        comment={comment} 
                        comments={comments} 
                        setComments={setComments} 
                        commentKey={i} 
                        user={user} 
                        recomment={recomment} 
                        setRecomment={setRecomment}
                    />
                ))}
            </DialogComment>
        </>
    );
}

export default withRouter(UserSaveList);