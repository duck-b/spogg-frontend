import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Avatar, Grid, Paper, CircularProgress, Divider } from '@material-ui/core';
import MuiTab from '@material-ui/core/Tab';
import MuiTabs from '@material-ui/core/Tabs';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar, faStarHalfAlt as fasStarHalfAlt } from '@fortawesome/free-solid-svg-icons';

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

const UserCommentList = (props) => {
    const [cookies] = useCookies('userKey');
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const [boardSelected, setBoardSelected] = useState(0);
    
    const [comments, setComments] = useState([]);
    const [boardKind, setBoardKind] = useState(1)
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        loadCommentList(1);
        setTimeout(() => {
            setLoading(false);
        },[800]);
    }, []);

    const handleChange = (event, newValue) => {
        let changeBoardKind = 0;
        if(newValue === 0){
            changeBoardKind = 1;
        }else if(newValue === 1){
            changeBoardKind = 3;
        }else if(newValue === 2){
            changeBoardKind = 5;
        }
        if(newValue !== boardSelected){
            setLoading(true);
            setBoardKind(changeBoardKind);
            loadCommentList(changeBoardKind);
            setBoardSelected(newValue);
            setTimeout(() => {
                setLoading(false);
            },[800]);
        }
    };

    const loadCommentList = async(boardKind) => {
        const config = {
            headers: {
                "content-type": "application/json"
            }
        };
        let url = `/api/userPage/boardComment/${cookies.userKey}/${boardKind}`;
        await axios.get(url, config).then((response)=>{
            let loadComments = response.data.values ? response.data.values : [];
            setComments(loadComments);
        })
    }
    const handleClickComment = (boardNo) => {
        if(boardKind !== 3){
            props.history.push(`/board/${boardKind}/${boardNo}`)
        }
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
            {!loading ?
                comments[0] ?
                    comments.map((comment, i) => (
                <>
                    <div className="user_comment_list" onClick={() => handleClickComment(comment.board_no)}>
                        <Grid item container justify="space-between">
                            <Grid item xs={8}>
                                <div className="content">{!comment.deleted_at ? comment.boardComment_content : '삭제된 댓글입니다.'}</div>
                                <div className="title">└ {comment.board_title}</div>
                            </Grid>
                            <Grid item xs={4} className="date">
                                {comment.boardRating_rating ?
                                <span className="comment_rating">
                                    {[...Array(parseInt(comment.boardRating_rating))].map(() => (
                                        <FontAwesomeIcon icon={fasStar}/>
                                    ))}
                                    {comment.boardRating_rating%1 === 0.5 ?
                                        <FontAwesomeIcon icon={fasStarHalfAlt}/>
                                    :null}
                                    {[...Array(5-Math.ceil(comment.boardRating_rating))].map(() => (
                                        <FontAwesomeIcon icon={faStar}/>
                                    ))}
                                </span>
                                :null}
                                <br/>
                                {comment.created_at}
                            </Grid>
                        </Grid>
                    </div>
                    <Divider variant="middle"/>
                </>
                    ))
                : <div className="user_board_loading">작성한 댓글이 없습니다.</div>
            :
            <div className="user_board_loading">
                <CircularProgress />
            </div>
            }
        
        </>
    );
}

export default withRouter(UserCommentList);