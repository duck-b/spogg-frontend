import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, CircularProgress } from '@material-ui/core';
import ContentCard from 'components/content/ContentCard';
import DialogComment from 'components/layout/user/DialogComment';
import BoardLoading from 'components/layout/user/BoardLoading';
import BoardNoContent from 'components/layout/user/BoardNoContent';
import ContentComment from 'components/content/ContentComment';

import Skeleton from '@material-ui/lab/Skeleton';

import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const BoardGram = (props) => {
    const [cookies] = useCookies('userKey');
    const { enqueueSnackbar } = useSnackbar();
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
    const [user, setUser] = useState(0);
    const [values, setValues] = useState([
        {
            board_no: '',
            board_title: '',
            user_no: '',
            user_profile: '',
            user_name: '',
            boardDetail_content: '',
            boardDetail_no: '',
            sport_no: '',
            sport_name: '',
            sport_icon: '',
            board_img: '',
            board_hashtag: '',
            board_recordTitle: '',
            board_recordContent: '',
            board_save: '',
            board_like: ''
        },
    ]);
    const [recomment, setRecomment] = useState({recommentNo: 0, recommentUser: 0, recommentUserName: ''});
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        const loadGram = async() => {
            const data = {
                userKey: cookies.userKey,
                search: decodeURI(props.history.location.search.substr(1))
            }
            const config = {
                headers: {
                    "content-type": "application/json"
                }
            };
            await axios.post("/api/boardGram", data, config).then((response)=>{
                props.setSearch(decodeURI(props.history.location.search.substr(1)))
                setLoading(true);
                setTimeout(() => {
                    setValues(response.data.values);
                    setUser(response.data.user);
                    setLoading(false);
                }, [900])
            }); 
        }
        loadGram();
    }, [props.history.location.search.substr(1)])
    const handleClickCardValue = (key, value) => {
        if(value === 'board_like' || value === 'board_save'){
            const saveCount = async() => {
                const data = {
                    boardNo: values[key].board_no, 
                    countKind: value,
                    countValue: !values[key][value],
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
                        let changeValue = [...values];
                        changeValue[key][value] = !changeValue[key][value] ? true : false;
                        if(value === 'board_like'){
                            changeValue[key].boardCount_like = changeValue[key][value] ? changeValue[key].boardCount_like+1 : changeValue[key].boardCount_like-1;
                            enqueueSnackbar(`해당 게시글${changeValue[key][value] ? '을 좋아합니다.' : ' 좋아요를 취소합니다.'}`, { variant: 'info'});
                        }else if(value === 'board_save'){
                            changeValue[key].boardCount_save = changeValue[key][value] ? changeValue[key].boardCount_save+1 : changeValue[key].boardCount_save-1;
                            enqueueSnackbar(`해당 게시글${changeValue[key][value] ? '을 저장하였습니다.' : ' 저장을 취소합니다.'}`, { variant: 'info'});
                        }
                        setValues(changeValue);
                    }
                });
            }
            saveCount();
        }else if(value === 'board_delete'){
            const deleteBoard = async() => {
                const data = {
                    boardNo: values[key].board_no, 
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
                        let changeValue = [...values];
                        changeValue.splice(key ,1);    
                        setValues(changeValue);
                    }
                });
            }
            deleteBoard();
        }else if(value === 'user_follow'){
            const followUser = async() => {
                const data = {
                    followUser: values[key].user_no,
                    followerUser: cookies.userKey,
                    follow: values[key].user_follow ? 'delete' : 'insert'
                }
                const config = {
                    headers: {
                        "content-type": "application/json"
                    }
                };
                await axios.post("/api/user/follow", data, config).then((response) =>{
                    if(response.data.result === 1){
                        if(!values[key].user_follow){
                            enqueueSnackbar(`${values[key].user_name}님을 팔로우 하였습니다.`, { variant: 'info'});
                            let changeValue = [...values];
                            for(let k = 0; k<changeValue.length; k++){
                                if(changeValue[k].user_no === changeValue[key].user_no){
                                    changeValue[k].user_follow = new Date();
                                }    
                            }
                            setValues(changeValue);
                        }else{
                            enqueueSnackbar(`${values[key].user_name}님을 팔로우 취소 하였습니다.`, { variant: 'info'});
                            let changeValue = [...values];
                            for(let k = 0; k<changeValue.length; k++){
                                if(changeValue[k].user_no === changeValue[key].user_no){
                                    changeValue[k].user_follow = null;
                                }    
                            }
                            setValues(changeValue);
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
            let changeValue = [...values];
            changeValue[key][value] = !changeValue[key][value] ? true : false;
            setValues(changeValue);
        }
    }
    const handleClickOtherSport = async() => {
        const config = {
            headers: {
                "content-type": "application/json"
            }
        };
        await axios.get(`/api/user/${cookies.userKey}`, config).then((response)=>{
            if(response.data){
                props.history.push(`/user/${response.data.user_no}/sport`);
            }
        });
    }
    return(
        <>
            <Grid item container justify="space-between" className="board_top">
                <Grid item xs={8} className="board_another">
                    {cookies.userKey?
                    <div onClick={handleClickOtherSport}>다른 종목을 보고 싶으신가요?</div>:
                    null}
                </Grid>
            </Grid>
            {!loading ?
                values[0] ?
            <div className='board_list'>
                {values.map((value, i) => (
                    <ContentCard 
                        handleClickOpen={() => handleClickOpen(value.board_no)} 
                        value={value} 
                        user={user}
                        contentKey={i} 
                        handleClickCardValue={handleClickCardValue}
                    />
                ))}
            </div>:
            <BoardNoContent />
            :
            <>
                <BoardLoading />
                <BoardLoading />
            </>
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

export default withRouter(BoardGram);