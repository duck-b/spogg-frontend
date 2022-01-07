import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Link } from '@material-ui/core';
import EtcMenu from 'components/layout/user/BoardPlayEtc';

const ContentPlay = (props) => {
    const [mouseScroll, setMouseScroll] = useState(false);
    const [mouseX, setMouseX] = useState();
    const [scrollLeft, setScrollLeft] = useState();
    const handleMouseDown = (event) => {
        setMouseX(event.pageX);
        setScrollLeft(document.getElementById(`board_play_goods${props.contentKey}`).scrollLeft);
        setMouseScroll(true);
    }
    const handleMouseMove = (event) => {
        if(mouseScroll){
            const walk = (event.pageX - mouseX)/2;
            document.getElementById(`board_play_goods${props.contentKey}`).scrollLeft = scrollLeft - walk;
        }
    }
    const handleMouseUpOrLeave = () => {
        setMouseScroll(false);
        setMouseX();
    }
    const created_at = new Date(props.value.createdAt?.split('-').join('/'));
    const createTime = `${created_at.getFullYear()}년 ${created_at.getMonth()+1}월 ${created_at.getDate()}일`;
    
    return (
        <div className="board_play">
            <Grid className="board_play_profile" item container alignItems="center">
                <img src={props.value.userProfile} alt="" onClick={() => props.history.push(`/user/${props.value.userNo}`)}/>
                <div className="play_profile_text">
                    <div onClick={() => props.history.push(`/user/${props.value.userNo}`)}>{props.value.userName}</div>
                    {props.value.userFollow || props.value.thisUser ? null : <span onClick={() => props.handleClickFollow(props.contentKey)}>팔로우</span>}
                    <p>{createTime}</p>
                </div>
                <div>
                    <EtcMenu value={props.value} handleClickFollow={props.handleClickFollow} handleClickDelete={props.handleClickDelete} contentKey={props.contentKey} />
                </div>
            </Grid>
            <div className="board_play_img" onClick={() => props.history.push(`/board/1/${props.value.boardNo}`)} style={{backgroundImage: props.value.boardDetail[0].boardImage ? `url('${props.value.boardDetail[0].boardImage}')` : null}}>
                {/* <img src={props.value.boardDetail[0].boardImage} alt="" /> */}
            </div>
            {props.value.boardDetail[0].boardGoods ?
            <div className="board_play_goods" id={`board_play_goods${props.contentKey}`}  onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave}>
                <table>
                    <tr> 
                    {props.value.boardDetail[0].boardGoods.map((boardGoods, i) => (
                        boardGoods.no ?
                        <td><img src={boardGoods.image} alt="" draggable={false}/></td>:
                        null
                    ))}
                    </tr>
                </table>
            </div>
            :null}

            {props.value.boardDetail[0].boardHashtag ?
            <div className="board_play_hashtag">
                
                {props.value.boardDetail[0].boardHashtag.map((hashtag, i) => (
                    hashtag ?
                    <>
                    <div className="hashtag_img" />
                    <Link onClick={() => props.history.push(`/board/1?${hashtag}`)}>{hashtag}</Link>
                    </> :
                    null
                ))}
            </div>:
            null}
        </div>
    )
}

export default withRouter(ContentPlay);