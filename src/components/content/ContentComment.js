import React, { useEffect, useState } from 'react';
import { Grid, Link, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { Star, StarBorder, StarHalf } from '@material-ui/icons';
import { useSnackbar } from 'notistack';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar, faStarHalfAlt as fasStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';

const ContentComment = (props) => {
    const [deleting, setDeleting] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleClickDeleteQuestion = () => {
        enqueueSnackbar(`댓글을 삭제합니다. 삭제 시 복구할 수 없습니다.`, 
        {   
            variant: 'warning',
            action: <div className="alret_action">
                <button 
                    onClick={() => closeSnackbar()}
                >취소
                </button>
                <button 
                    onClick={handleClickDeleteComment}
                >삭제
                </button>
            </div>
        })
    }

    const handleClickDeleteComment = () => {
        if(props.comment.user_no === props.user.user_no){
            setDeleting(true);
            setTimeout(async() => {
                let deleteComments = [...props.comments];
                deleteComments[props.commentKey].deleted_at = new Date();
                props.setComments(deleteComments);
                const data = {
                    comment_no: props.comment.boardComment_no,
                    user_no: props.user.user_no
                };
                const config = {
                    headers: {
                        "content-type": "application/json"
                    }
                };
                await axios.post("/api/comment/delete", data, config).then((response)=>{
                    setDeleting(false);
                });
            },[1000])
        }
    }
    const handleClickReport = () => {
        enqueueSnackbar(`신고 접수가 완료되었습니다. 빠른 시일 내 조치하겠습니다.`, { variant: 'success'});
    }
    let commentClass;
    let commentMenu;
    const now = new Date();
    const created_at = new Date(props.comment.created_at.split('-').join('/'));
    const diffSecond = Number((now.getTime()-created_at.getTime())/1000);
    let createTime;
    if(diffSecond < 60){
        createTime = '방금 전';
    }else if(diffSecond < 60 * 60){
        createTime = parseInt(diffSecond/60)+'분 전';
    }else if(diffSecond < 60 * 60 * 24){
        createTime = parseInt(diffSecond/(60*60))+'시간 전';
    }else if(diffSecond < 60 * 60 * 24 * 365){
        createTime = `${created_at.getMonth()+1}월 ${created_at.getDate()}일`;
    }else{
        createTime = `${created_at.getFullYear()}년 ${created_at.getMonth()+1}월 ${created_at.getDate()}일`;
    }
    if(props.comment.user_no === props.user.user_no){
        commentMenu = <Link onClick={handleClickDeleteQuestion}>삭제</Link>;
        if(props.comment.boardComment_no === props.comment.boardRecomment_no){
            commentClass = "content_comment content_recomment_column";
        }else{
            commentClass = "content_comment content_recomment_column content_recomment";
        }
    }else{
        commentMenu = <Link onClick={handleClickReport}>신고</Link>;
        if(props.comment.boardComment_no === props.comment.boardRecomment_no){
            commentClass = "content_comment";
        }else{
            commentClass = "content_comment content_recomment";
        }
    }
    const handleClickRecomment = (data) => {
        props.setRecomment({recommentNo: data.boardRecomment_no, recommentUser: data.user_no, recommentUserName: `@${data.user_name} `});
    }
    return(
        
        <div className={commentClass}>
            <Grid item container alignItems="center">
                <Grid item xs={1}>
                    <img src={props.comment.user_profile} alt="" className="content_comment_profile_img" onClick={() => props.history.replace(`/user/${props.comment.user_no}`)}/>
                </Grid>
                <Grid item xs={11} className="content_comment_profile">
                    <span onClick={() => props.history.replace(`/user/${props.comment.user_no}`)}>{props.comment.user_name}</span>
                    {props.comment.boardRating_rating ?
                    <span className="comment_rating">
                        {[...Array(parseInt(props.comment.boardRating_rating))].map(() => (
                            <FontAwesomeIcon icon={fasStar}/>
                        ))}
                        {props.comment.boardRating_rating%1 === 0.5 ?
                            <FontAwesomeIcon icon={fasStarHalfAlt}/>
                        :null}
                        {[...Array(5-Math.ceil(props.comment.boardRating_rating))].map(() => (
                            <FontAwesomeIcon icon={faStar}/>
                        ))}
                    </span>
                    :null}
                </Grid>
                <Grid item xs={1}></Grid>
                {!props.comment.deleted_at ?
                !deleting ?
                <Grid item xs={11} className="content_comment_content">
                    <p>{props.comment.boardRecomment_user ? <Link onClick={() => props.history.replace(`/user/${props.comment.boardRecomment_user}`)} target="_blank" className="content_comment_recomment_id">@{props.comment.recommentUser_name}</Link> : null}{props.comment.boardComment_content.split('\n').map((line) => {return <>{line}<br/></>})}</p>
                    <span>{createTime} &#183; <Link onClick={() => handleClickRecomment(props.comment)}>답글 달기</Link> &#183; {commentMenu}</span>
                </Grid>
                :
                    <CircularProgress style={{marginLeft: '20px', width: '20px', height: '20px'}}/>
                : 
                <Grid item xs={11} className="content_comment_content">
                    <p>삭제된 댓글입니다.</p>
                </Grid>
                }
            </Grid>
        </div>
    );
}

export default withRouter(ContentComment);