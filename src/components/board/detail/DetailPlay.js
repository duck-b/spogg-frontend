import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Link, Divider, Grid, Avatar } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight, faAngleRight, faTag } from '@fortawesome/free-solid-svg-icons';
import ContentPreviewComment from 'components/content/ContentPreviewComment';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const DetailPlay = (props) => {
    const [mouseScroll, setMouseScroll] = useState(false);
    const [mouseX, setMouseX] = useState();
    const [scrollLeft, setScrollLeft] = useState();
    const handleMouseDown = (event, key) => {
        setMouseX(event.pageX);
        setScrollLeft(document.getElementById(`board_play_goods${key}`).scrollLeft);
        setMouseScroll(true);
    }
    const handleMouseMove = (event, key) => {
        if(mouseScroll){
            const walk = (event.pageX - mouseX)/2;
            document.getElementById(`board_play_goods${key}`).scrollLeft = scrollLeft - walk;
        }
    }
    const handleMouseUpOrLeave = () => {
        setMouseScroll(false);
        setMouseX();
    }

    const [cookies] = useCookies('userKey');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [value, setValue] = useState({
            boardNo: '',
            userNo: '',
            userProfile: '',
            userName: '',
            sportNo: '',
            sportName: '',
            boardDetail: [
                {   
                    boardDetailNo: '',
                    boardDetailNum: '',
                    boardDetailContent: '',
                    boardImage: '',
                    boardHashtag: [],
                    boardGoods: [{x: '', y: '', info: '',no: '', name: '', image: ''}],
                    openGoods: false
                }
            ],
            userFollow: 0,
            wirteUser:0,
            createdAt: new Date()
    });
    const [otherGoods, setOtherGoods] = useState([
        {
            goods_no: '',
            goods_name: '',
            goodsDetail_value: ''
        }
    ])
    useEffect(()=>{
        const loadPlay = async() => {
            const config = {
                headers: {
                    "content-type": "application/json"
                }
            };
            await axios.get(`/api/boardPlay/${props.match.params.boardId}/${cookies.userKey}`, config).then((response)=>{
                setOtherGoods(response.data.otherGoods)
                let dt = response.data.value;
                let loadValue = {
                    boardNo: dt.board_no,
                    boardTitle: dt.board_title,
                    userNo: dt.user_no,
                    userProfile: dt.user_profile,
                    userName: dt.user_name,
                    sportNo: dt.sport_no,
                    sportName: dt.sport_name,
                    createdAt: new Date(dt.created_at.split('-').join('/')),
                    boardDetail: [],
                    userFollow: dt.user_follow,
                    writeUser: dt.write_user
                };
                let boardHashtag = dt.board_hashtag.split('|');
                let boardGoodsInfo = dt.boardGoods_info.split('|');
                let boardGoodsX = dt.boardGoods_x.split('|');
                let boardGoodsY = dt.boardGoods_y.split('|');
                let thisGoods = dt.goods_no.split('|');
                let thisGoodsName = dt.goods_name.split('|');
                let thisGoodsManufacturer = dt.goods_manufacturer.split('|');
                let thisGoodsImage = dt.thisGoods_image.split('|');
                for(let j = 0; j < dt.boardDetail_num.split('|').length; j++){
                    loadValue.boardDetail.push({
                        boardDetailNo: dt.boardDetail_no.split('|')[j],
                        boardDetailNum: dt.boardDetail_num.split('|')[j],
                        boardDetailContent: dt.boardDetail_content.split('|')[j],
                        boardImage: dt.board_img.split('|')[j],
                        boardHashtag: boardHashtag[j] ? boardHashtag[j].split(',') : [],
                        boardGoods: [],
                        openGoods: false
                    })
                    for(let k = 0; k < boardGoodsX[j].split(',').length; k++){
                        loadValue.boardDetail[j].boardGoods.push({
                            x: boardGoodsX[j].split(',')[k],
                            y: boardGoodsY[j].split(',')[k],
                            info: boardGoodsInfo[j].split(',')[k],
                            no: thisGoods[j].split(',')[k],
                            name :thisGoodsName[j].split(',')[k],
                            manufacturer :thisGoodsManufacturer[j].split(',')[k],
                            image: thisGoodsImage[j].split(',')[k],
                            openInfo: false
                        })
                    }
                }
                setValue(loadValue);
                props.setCounts({like: dt.boardCount_like ,save: dt.boardCount_save, boardCountView: dt.boardCount_view, comment: dt.comment_count});
                props.setChecks({like: dt.user_like ? true : false, save: dt.user_save ? true : false});
            }); 
        }
        loadPlay();
    }, []);
    const [imgSize, setImgSize] = useState({width: '', height: ''});
    const handleClickImg = (event) => {
        if(event.target.accessKey){
            let openGoods = {...value};
            let onOff = 0;
            for(let k=0; k<openGoods.boardDetail[event.target.accessKey].boardGoods.length; k++){
                if(openGoods.boardDetail[event.target.accessKey].boardGoods[k].openInfo === true){
                    openGoods.boardDetail[event.target.accessKey].boardGoods[k].openInfo = false;
                    onOff = 1;
                }
            }
            if(onOff === 0){
                openGoods.boardDetail[event.target.accessKey].openGoods = !value.boardDetail[event.target.accessKey].openGoods;
            }
            setValue(openGoods);
            const imgWidth = document.getElementById(`img${event.target.accessKey}`).getBoundingClientRect().width;
            const imgHeight = document.getElementById(`img${event.target.accessKey}`).getBoundingClientRect().height;
            setImgSize({width: imgWidth, height: imgHeight});
        }
    }
    const handleClickTag = (i, j) => {
        let changeValue = {...value};
        for(let k=0; k<changeValue.boardDetail[i].boardGoods.length; k++){
            changeValue.boardDetail[i].boardGoods[k].openInfo = false;
        }
        changeValue.boardDetail[i].boardGoods[j].openInfo = !value.boardDetail[i].boardGoods[j].openInfo;
        setValue(changeValue);
    }
    const handleClickFollow = async() => {
        const data = {
            followUser: value.userNo,
            followerUser: cookies.userKey,
            follow: value.userFollow ? 'delete' : 'insert'
        }
        const config = {
            headers: {
                "content-type": "application/json"
            }
        };
        await axios.post("/api/user/follow", data, config).then((response) =>{
            if(response.data.result === 1){
                if(!value.userFollow){
                    enqueueSnackbar(`${value.userName}님을 팔로우 하였습니다.`, { variant: 'info'});
                    let changeValue = {...value};
                    changeValue.userFollow = new Date();    
                    setValue(changeValue);
                }else{
                    enqueueSnackbar(`${value.userName}님을 팔로우 취소 하였습니다.`, { variant: 'info'});
                    let changeValue = {...value};
                    changeValue.userFollow = null;    
                    setValue(changeValue);
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
    const handleClickDeleteQuestion = () => {
        enqueueSnackbar(`게시글을 삭제합니다. 삭제 시 복구할 수 없습니다.`, 
        {   
            variant: 'warning', 
            action: <div className="alret_action">
                <button 
                    onClick={() => closeSnackbar()}
                >취소
                </button>
                <button 
                    onClick={handleClickDelete}
                >삭제
                </button>
            </div>
        })
     }
    const handleClickDelete = async() => {
        const data = {
            boardNo: value.boardNo,
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
                props.history.goBack();
            }
        });
    }
    const handleClickReport = () => {
        enqueueSnackbar(`신고 접수가 완료되었습니다. 빠른 시일 내 조치하겠습니다.`, { variant: 'success'});
    }
    return (
        <>
            <div className="board_detail">
                <div className="board_detail_title">
                    <div className="board_detail_kind">스포츠 활동 <FontAwesomeIcon icon={faAngleDoubleRight} /> {value.sportName}</div>
                    <div className="board_detail_report" onClick={handleClickReport}>신고</div>
                    <p>{value.boardTitle}</p>
                    <img src={value.userProfile} onClick={() => props.history.push(`/user/${value.userNo}`)}/>
                    <div className="board_detail_profile">
                        <div onClick={() => props.history.push(`/user/${value.userNo}`)}>{value.userName}</div>
                        <div>{`${value.createdAt.getFullYear()}년 ${value.createdAt.getMonth()+1}월 ${value.createdAt.getDate()}일`}</div>
                    </div>
                    <div className="board_detail_follow">
                        { !value.writeUser ?
                            !value.userFollow ?
                        <button className="follow" onClick={handleClickFollow}>팔로우</button>
                            :
                        <button className="unfollow" onClick={handleClickFollow}>팔로우 취소</button>
                        :
                        <>
                            <button className="update" onClick={() => props.history.push(`/board/1/${value.boardNo}/update`)}>수정</button>
                            <button className="delete" onClick={handleClickDeleteQuestion}>삭제</button>
                        </>}
                    </div>
                </div>
                {value.boardDetail.map((boardDetail, i) => (
                <div className="board_detail_play_content_body">
                    <div className="board_detail_play_img" id={`img${i}`} onClick={handleClickImg} accessKey={i} style={{backgroundImage: boardDetail.boardImage ? `url('${boardDetail.boardImage}')` : null}}>
                        {/* <img src={boardDetail.boardImage} alt="" id={`img${i}`} onClick={handleClickImg} accessKey={i} /> */}
                        {boardDetail.openGoods ? 
                            boardDetail.boardGoods.map((boardGoods, j) => (
                                boardGoods.x ?
                            <>
                                <div 
                                    className={boardGoods.no ? 'otherGoodsTag_img' : 'noneGoodsTag_img'}
                                    style={{
                                        left: boardGoods.x*imgSize.width + 30 > imgSize.width ? `${imgSize.width-30}px` : `${boardGoods.x*imgSize.width}px`,
                                        top: boardGoods.y*imgSize.height + 20 > imgSize.height ? `${imgSize.height-20}px` : `${boardGoods.y*imgSize.height}px`
                                    }}
                                    onClick={() => handleClickTag(i,j)}
                                />
                                    {boardGoods.no ? 
                                <div className="otherGoods_view"
                                    style={{
                                        left: boardGoods.x*imgSize.width + 145 > imgSize.width ? `${imgSize.width-130}px` : boardGoods.x*imgSize.width - 130 < 0 ? '130px' : `${boardGoods.x*imgSize.width+15}px`,
                                        top: boardGoods.y*imgSize.height + 50 > imgSize.height ? `${imgSize.height-40}px` : boardGoods.y*imgSize.height - 40 < 0 ? '40px' : `${boardGoods.y*imgSize.height+10}px`,
                                        display: boardGoods.openInfo ? 'block' : 'none'
                                    }}
                                >
                                    <Grid item container justify="space-between">
                                        <Grid item xs={4}>
                                            <img src={boardGoods.image} alt=""/>
                                        </Grid>
                                        <Grid item container xs={8} alignItems="center">
                                            <Grid item xs={10}>
                                                <Grid item className="otherGoods_view_goodsTitle">{boardGoods.name}</Grid>
                                                <Grid item className="otherGoods_view_goodsManufacturer">{boardGoods.manufacturer}</Grid> 
                                            </Grid>                                            
                                            <Grid item xs={2} className="otherGoods_view_goodsLink"><FontAwesomeIcon icon={faAngleRight} szie='6x' /></Grid>
                                            <Grid item xs={12} className="otherGoods_view_price">
                                                50000~
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </div>
                                    :
                                <div className="noneGoods_view"
                                    style={{
                                        left: boardGoods.x*imgSize.width + 90 > imgSize.width ? `${imgSize.width-75}px` : boardGoods.x*imgSize.width - 75 < 0 ? '75px' : `${boardGoods.x*imgSize.width+15}px`,
                                        top: boardGoods.y*imgSize.height + 35 > imgSize.height ? `${imgSize.height-25}px` : boardGoods.y*imgSize.height - 25 < 0 ? '25px' : `${boardGoods.y*imgSize.height+10}px`,
                                        display: boardGoods.openInfo ? 'block' : 'none',
                                    }}
                                >{boardGoods.info}
                                </div>
                                    }
                            </>
                                :
                            null
                            ))
                        :
                        boardDetail.boardGoods[0].x ?
                        <div className="view_goods_btn" accessKey={i} style={{bottom: `10px`, right: `10px`}}><FontAwesomeIcon icon={faTag} /> 상품 보기</div>:
                        null
                        }
                    </div>
                    <div className="board_detail_play_content">
                        <div className="board_play_goods" id={`board_play_goods${i}`} 
                            onMouseDown={(event) => handleMouseDown(event, i)} 
                            onMouseMove={(event) => handleMouseMove(event, i)} 
                            onMouseUp={handleMouseUpOrLeave} 
                            onMouseLeave={handleMouseUpOrLeave}>
                            <table>
                                <tr>
                                    {boardDetail.boardGoods.map((boardGoods) => (
                                    boardGoods.no ?
                                    <td><img src={boardGoods.image} alt="" draggable={false}/></td> :
                                    null
                                    ))}
                                </tr>
                            </table>
                        </div>
                        <div className="board_play_hashtag">
                            
                            {boardDetail.boardHashtag.map((hashtag, i) => (
                                hashtag ?
                                <>
                                <div className="hashtag_img" />
                                <Link onClick={() => props.history.push(`/board/1?${hashtag}`)}>{hashtag}</Link>
                                </> :
                                null
                            ))}
                        </div>
                        <div className="board_detail_play_content_contents">
                            {boardDetail.boardDetailContent ?
                            boardDetail.boardDetailContent.split('\n').map((content) => (
                                <>{content.split('&#44;').join(',').split('&#124;').join('|')}<br/></>
                            ))
                            :null}
                        </div>
                    </div>
                    <br/>
                </div>
                ))}
                <Divider variant="middle" />
                <br/>
                {props.counts.comment !== 0 ?
                <>
                    <div className="board_detail_play_comment" onClick={props.handleClickOpen}>
                        {props.previewComments.map((previewComment, i)=>(
                            <ContentPreviewComment 
                                comment={previewComment} 
                                commentKey={i} 
                                user={props.user} 
                            />
                        ))}
                    </div>
                    <div className="board_detail_play_add_comment" onClick={props.handleClickOpen}>
                        {props.counts.comment}개 댓글 전체 보기 <FontAwesomeIcon icon={faAngleRight} />
                        <Grid item container justify="space-between" alignItems="center">
                            <Grid item xs={1}><Avatar src={props.user.user_profile} className="avatar30" alt="" /></Grid>
                            <Grid item xs={8}>댓글을 입력해주세요.</Grid>
                            <Grid item xs={2}>입력</Grid>
                        </Grid>
                    </div>
                </>:
                <div className="board_detail_play_add_comment" onClick={props.handleClickOpen}>
                    첫번째로 댓글을 달아주세요. <FontAwesomeIcon icon={faAngleRight} />
                    <Grid item container justify="space-between" alignItems="center">
                        <Grid item xs={1}><Avatar src={props.user.user_profile} className="avatar30" alt="" /></Grid>
                        <Grid item xs={8}>댓글을 입력해주세요.</Grid>
                        <Grid item xs={2}>입력</Grid>
                    </Grid>
                </div>
                }
                {otherGoods ?
                <div className="board_detail_play_another_goods">
                    <div className="board_detail_play_another_goods_title">이런 상품은 어떠세요?</div>
                    <Grid item container justify="space-between" alignItems="center">
                        {otherGoods.map((goods) => (
                            <Grid item xs={6}><img src={goods.goodsDetail_value} alt="" /><div >{goods.goods_name}</div></Grid>
                        ))}
                    </Grid>
                </div>
                :null}
            </div>
        </>
    )
}

export default withRouter(DetailPlay);