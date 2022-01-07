import React, { useEffect, useState } from 'react';
import { Grid, Link } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar, faStarHalfAlt as fasStarHalfAlt } from '@fortawesome/free-solid-svg-icons';

const ContentPreviewComment = (props) => {
    let commentClass; 
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
        if(props.comment.boardComment_no === props.comment.boardRecomment_no){
            commentClass = "content_comment content_recomment_column";
        }else{
            commentClass = "content_comment content_recomment_column content_recomment";
        }
    }else{
        if(props.comment.boardComment_no === props.comment.boardRecomment_no){
            commentClass = "content_comment";
        }else{
            commentClass = "content_comment content_recomment";
        }
    }
    return(
        <div className={commentClass}>
            <Grid item container alignItems="center">
                <Grid item xs={1}>
                    <img src={props.comment.user_profile} alt="" className="content_comment_profile_img" />
                </Grid>
                <Grid item xs={11} className="content_comment_profile">
                    <span>{props.comment.user_name}</span>
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
                
                <Grid item xs={11} className="content_comment_content">
                    <p>{props.comment.boardRecomment_user ? <Link className="content_comment_recomment_id">@{props.comment.recommentUser_name}</Link> : null}{props.comment.boardComment_content.split('\n').map((line) => {return <>{line}<br/></>})}</p>
                    <span>{createTime}</span>
                </Grid>
                :                
                <Grid item xs={11} className="content_comment_content">
                    <p>삭제된 댓글입니다.</p>
                </Grid>
                }
            </Grid>
        </div>
    );
}

export default ContentPreviewComment;