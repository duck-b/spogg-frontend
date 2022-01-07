import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { DetailPlay, DetailReview, DetailColumn, DetailGram } from './detail';
import DialogComment from 'components/layout/user/DialogComment';
import ContentComment from 'components/content/ContentComment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-regular-svg-icons';
import { Favorite, FavoriteBorder , ShareOutlined, ExpandMore, Bookmark, BookmarkBorder, HearingOutlined } from '@material-ui/icons';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';

const DetailBoard = (props) => {
    const [cookies] = useCookies('userKey');
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        window.history.pushState(null, null, '');
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const [counts, setCounts] = useState({like: 0, save: 0, view: 0, comment: 0});
    const [checks, setChecks] = useState({like: false, save: false});
    const [user, setUser] = useState({user_no: '', user_profile: ''});
    const [comments, setComments] = useState([
        {
            boardComment_no: '',
            user_no: 0,
            user_profile: '',
            user_name: '',
            boardComment_content: '',
            boardRecomment_no: '',
            deleted_at: '',
            created_at: ''
        }
    ]);
    const [writeUser, setWriteUser] = useState(0);
    const [recomment, setRecomment] = useState({recommentNo: 0, recommentUser: 0, recommentUserName: ''});
    const [previewComments, setPreviewComments]= useState([
        {
            boardComment_no: '',
            user_no: 0,
            user_profile: '',
            user_name: '',
            boardComment_content: '',
            boardRecomment_no: '',
            deleted_at: '',
            created_at: ''
        }
    ])
    useEffect(() => {
        const loadComment = async() => {
            const config = {
                headers: {
                    "content-type": "application/json"
                }
            };
            await axios.get(`/api/comment/${props.match.params.boardId}/${cookies.userKey}`, config).then((response)=>{
                setComments(response.data.comments);
                setUser(response.data.user);
            }); 
        }
        loadComment();
    }, []);
    useEffect(() => {
        let loadPreviewComments = [];
        let stop = [];
        for(let i = comments.length - 1; i >= 0; i--){
            if(comments[i].boardComment_no === comments[i].boardRecomment_no){
                stop.push(i);
            }
        }
        for(let i = 1; i >= 0; i--){
            for(let j = 0; j < 3; j++){
                if(comments[stop[i]+j]){
                    if(comments[stop[i]+j].boardRecomment_no === comments[stop[i]].boardRecomment_no){
                        loadPreviewComments.push(comments[stop[i]+j]);
                    }
                }
            }
        }
        setPreviewComments(loadPreviewComments);
    },[comments]);
    const handleClickIcon = async(value) => {
        const data = {
            boardNo: props.match.params.boardId, 
            countKind: value,
            countValue: value === 'board_like' ? !checks.like : !checks.save,
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
                let changeCounts = {...counts};
                let changeChecks = {...checks};
                if(value === 'board_like'){
                    changeCounts.like = checks.like ? counts.like - 1 : counts.like + 1;
                    changeChecks.like = !checks.like;
                    enqueueSnackbar(`해당 게시글${changeChecks.like ? '을 좋아합니다.' : ' 좋아요를 취소합니다.'}`, { variant: 'info'});
                }else if(value === 'board_save'){
                    changeCounts.save = checks.save ? counts.save - 1 : counts.save + 1;
                    changeChecks.save = !checks.save;
                    enqueueSnackbar(`해당 게시글${changeChecks.save ? '을 저장하였습니다.' : ' 저장을 취소합니다.'}`, { variant: 'info'});
                }
                setCounts(changeCounts);
                setChecks(changeChecks);
            }
        });
    }
    const handleClickShare = () => {
        const dummy   = document.createElement("input");
        const text    = window.location.href;
        
        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        enqueueSnackbar(`URL이 복사되었습니다.`, { variant: 'info'});
    }
    return(
        <>
            {props.match.params.boardKind === '1' ?
            <DetailPlay
                handleClickOpen={handleClickOpen}
                setCounts={setCounts}
                setChecks={setChecks}
                counts={counts}
                user={user}
                previewComments={previewComments}
            /> :
            props.match.params.boardKind === '2' ?
            <DetailReview /> :
            props.match.params.boardKind === '3' ?
            <DetailGram /> :
            props.match.params.boardKind === '5' ?
            <DetailColumn 
                handleClickOpen={handleClickOpen}
                setCounts={setCounts}
                setChecks={setChecks}
                counts={counts}
                user={user}
                previewComments={previewComments}
                setWriteUser={setWriteUser}
            /> :
            null
            }
            <Grid item container justify="center">
                <Grid item container xs={12} sm={8} md={5} lg={4} xl={3} justify="center" alignItems="center" alignContent="center" className="board_detail_bottom_button" style={{zIndex : open ? '1' : '1500'}}>
                    <Grid xs={1} onClick={()=>handleClickIcon('board_like')}>{checks.like ? <Favorite />: <FavoriteBorder />}</Grid>
                    <Grid xs={2}><p>{counts.like}</p></Grid>
                    <Grid xs={1} onClick={()=>handleClickIcon('board_save')}>{checks.save ? <Bookmark /> : <BookmarkBorder />}</Grid>
                    <Grid xs={2}><p>{counts.save}</p></Grid>
                    <Grid xs={1} onClick={handleClickOpen}><FontAwesomeIcon icon={faCommentDots} /></Grid>
                    <Grid xs={2}><p>{counts.comment}</p></Grid>
                    <Grid xs={1} onClick={handleClickShare}><ShareOutlined /></Grid>
                </Grid>
            </Grid>
            <DialogComment 
                open={open}
                handleClose={handleClose}
                handleOpen={() => setOpen(true)}
                boardComment_boardNo={props.match.params.boardId}
                user={user}
                commentCount={counts.comment}
                recomment={recomment}
                setRecomment={setRecomment}
                setComments={setComments}
                boardKind={props.match.params.boardKind}
                writeUser={writeUser}
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

export default DetailBoard;