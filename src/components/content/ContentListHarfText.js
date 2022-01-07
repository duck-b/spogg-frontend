import React from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Link, Avatar } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

const ContentListHarf = (props) => {
    return(
        <>
            <Grid item container justify="space-between" alignContent="center" alignItems="center" className="content_half_text_group">
                <Grid item xs={5}><img src={props.value.boardDetail[0].boardImage} alt="" onClick={() => props.history.push(`/board/5/${props.value.boardNo}`)}/></Grid>
                <Grid item xs={6} className="content_half_text_right">
                    <Grid item container className="content_half_text_profile" alignItems="center">
                        <Avatar onClick={() => props.history.push(`/user/${props.value.userNo}`)} src={props.value.userProfile} class="avatar30"/>
                        <span onClick={() => props.history.push(`/user/${props.value.userNo}`)}>{props.value.userName}</span>
                    </Grid>
                    <div className="content_half_text_title" onClick={() => props.history.push(`/board/5/${props.value.boardNo}`)}>{props.value.boardTitle}</div>
                    {props.value.boardDetail[0].boardHashtag ?
                    <div className="content_hashtag">
                        
                        {props.value.boardDetail[0].boardHashtag.map((hashtag, i) => (
                            hashtag ?
                            <>
                            <div className="hashtag_img" />
                            <Link onClick={() => props.history.push(`/board/5?${hashtag}`)}>{hashtag}</Link>
                            </> :
                            null
                        ))}
                    </div>:
                    null}
                    <div className="content_half_text_another">
                        스그랩 {props.value.boardCountSave} &middot; ♡ {props.value.boardCountLike} &middot; ☆ {props.value.boardRating}
                    </div>
                </Grid>
                <Grid item xs={1} className="content_half_text_next" onClick={() => props.history.push(`/board/5/${props.value.boardNo}`)}>
                    <FontAwesomeIcon icon={faAngleRight} />
                </Grid>
            </Grid>
        </>
    );
}

export default withRouter(ContentListHarf);