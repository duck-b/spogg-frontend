import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, CircularProgress } from '@material-ui/core';
import ContentSlider from 'components/content/ContentSlider';
import ContentPlay from 'components/content/ContentPlay';
import sports_icon_1 from 'img/sports_icon_1.png';
import sports_icon_2 from 'img/sports_icon_2.png';
import sports_icon_3 from 'img/sports_icon_3.png';
import sports_icon_4 from 'img/sports_icon_4.png';
import sports_icon_5 from 'img/sports_icon_5.png';
import sports_icon_6 from 'img/sports_icon_6.png';
import sports_icon_7 from 'img/sports_icon_7.png';
import sports_icon_8 from 'img/sports_icon_8.png';
import sports_icon_9 from 'img/sports_icon_9.png';
import sports_icon_10 from 'img/sports_icon_10.png';
import sports_icon_11 from 'img/sports_icon_11.png';
import sports_icon_12 from 'img/sports_icon_12.png';
import sports_icon_13 from 'img/sports_icon_13.png';
import sports_icon_14 from 'img/sports_icon_14.png';
import sports_icon_15 from 'img/sports_icon_15.png';
import board_play_icon from 'img/board_play_icon.png';
import board_review_icon from 'img/board_review_icon.png';
import board_gram_icon from 'img/board_gram_icon.png';
import board_video_icon from 'img/board_video_icon.png';
import board_column_icon from 'img/board_column_icon.png';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';
import BoardLoading from 'components/layout/user/BoardLoading';
import BoardNoContent from 'components/layout/user/BoardNoContent';

const UserMain = (props) => {
    const [cookies] = useCookies('userKey');
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [values, setValues] = useState([
        {
            boardNo: '',
            userNo: '',
            userProfile: '',
            userName: '',
            sportNo: '',
            sportName: '',
            userFollow: '',
            thisUser: 0,
            boardDetail: [
                {   
                    boardDetailNo: '',
                    boardDetailNum: '',
                    boardDetailContent: '',
                    boardImage: '',
                    boardHashtag: [],
                    boardGoods: [{x: '', y: '', info: ''}],
                    thisGoods: [{no: '', image: ''}],
                }
            ],
            createdAt: ''
        },
    ]);
    useEffect(()=>{
        const loadPlay = async() => {
            const data = {
                userKey: cookies.userKey,
                search: ''
            }
            const config = {
                headers: {
                    "content-type": "application/json"
                }
            };
            await axios.post("/api/boardPlay", data, config).then((response)=>{
                setTimeout(() => {
                    let dt = response.data.values;
                    let loadValues = [];
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
                    setValues(loadValues);
                    setLoading(false);
                }, [900])
            }); 
        }
        loadPlay();
    }, []);
    const handleClickNotReady = () => {
        enqueueSnackbar(`준비중 입니다.`, {variant: 'warning'});
    }
    // const [mouseScroll, setMouseScroll] = useState(false);
    // const [mouseX, setMouseX] = useState();
    // const [scrollLeft, setScrollLeft] = useState();
    // const handleMouseDown = (event) => {
    //     setMouseX(event.pageX);
    //     setScrollLeft(document.getElementsByClassName('content_list_slide')[0].scrollLeft);
    //     setMouseScroll(true);
    // }
    // const handleMouseMove = (event) => {
    //     if(mouseScroll){
    //         const walk = (event.pageX - mouseX)/2;
    //         document.getElementsByClassName('content_list_slide')[0].scrollLeft = scrollLeft - walk;
    //     }
    // }
    // const handleMouseUpOrLeave = () => {
    //     setMouseScroll(false);
    //     setMouseX();
    // }
    // const [open, setOpen] = useState(false);
    // const handleClose = () => {
    //     setOpen(false);
    // };
    // const [boardComment, setBoardComment] = useState(0);
    // const [comments, setComments] = useState([
    //     {
    //         boardComment_no: '',
    //         user_no: '',
    //         user_profile: '',
    //         user_name: '',
    //         boardComment_content: '',
    //         boardRecomment_no: '',
    //         deleted_at: '',
    //         created_at: ''
    //     }
    // ])
    // const handleClickOpen = (board_no) => {
    //     setBoardComment(board_no)
    //     window.history.pushState(null, null, '');
    //     const loadComment = async() => {
    //         const config = {
    //             headers: {
    //                 "content-type": "application/json"
    //             }
    //         };
    //         await axios.get(`/api/comment/${board_no}`, config).then((response)=>{
    //             setComments(response.data);
    //         }); 
    //     }
    //     loadComment();
    //     setOpen(true);
    // };
    
    // const [user, setUser] = useState(0);
    // const [cardValues, setCardValues] = useState([
    //     {
    //         board_no: '',
    //         board_title: '',
    //         user_no: '',
    //         user_profile: '',
    //         user_name: '',
    //         boardDetail_content: '',
    //         boardDetail_no: '',
    //         sport_no: '',
    //         sport_name: '',
    //         sport_icon: '',
    //         board_img: '',
    //         board_hashtag: '',
    //         board_recordTitle: '',
    //         board_recordContent: '',
    //         board_save: '',
    //         board_like: ''
    //     }
    // ]);
    // const [recomment, setRecomment] = useState({recommentNo: 0, recommentUser: 0, recommentUserName: ''})
    // useEffect(()=>{
    //     const loadGram = async() => {
    //         const data = {
    //             boardKind: '3', 
    //             userKey: cookies.userKey
    //         }
    //         const config = {
    //             headers: {
    //                 "content-type": "application/json"
    //             }
    //         };
    //         await axios.post("/api/boardGram", data, config).then((response)=>{
    //             setCardValues(response.data.values);
    //             setUser(response.data.user);
    //         }); 
    //     }
    //     loadGram();
    // }, [])
    // const handleClickCardValue = (key, value) => {
    //     if(value === 'board_like' || value === 'board_save'){
    //         const saveCount = async() => {
    //             const data = {
    //                 boardNo: cardValues[key].board_no, 
    //                 countKind: value,
    //                 countValue: !cardValues[key][value],
    //                 userKey: cookies.userKey
    //             }
    //             const config = {
    //                 headers: {
    //                     "content-type": "application/json"
    //                 }
    //             };
    //             await axios.post("/api/board/count", data, config).then((response) =>{
    //                 if(response.data.result === 0){
    //                     enqueueSnackbar(`로그인이 필요합니다.`, 
    //                     {   
    //                         variant: 'warning', 
    //                         action: <div className="alret_action">
    //                             <button 
    //                                 onClick={() => props.history.push({pathname: `/user/login`, state: `${props.history.location.pathname}`})}
    //                             >로그인
    //                             </button>
    //                         </div>
    //                     })
    //                     return false;
    //                 }else{
    //                     let changeValue = [...cardValues];
    //                     changeValue[key][value] = !changeValue[key][value] ? true : false;
    //                     if(value === 'board_like'){
    //                         changeValue[key].boardCount_like = changeValue[key][value] ? changeValue[key].boardCount_like+1 : changeValue[key].boardCount_like-1;
    //                     }else if(value === 'board_save'){
    //                         changeValue[key].boardCount_save = changeValue[key][value] ? changeValue[key].boardCount_save+1 : changeValue[key].boardCount_save-1;
    //                     }
    //                     setCardValues(changeValue);
    //                 }
    //             });
    //         }
    //         saveCount();
    //     }else if(value === 'board_delete'){
    //         const deleteBoard = async() => {
    //             const data = {
    //                 boardNo: cardValues[key].board_no, 
    //                 userKey: cookies.userKey
    //             }
    //             const config = {
    //                 headers: {
    //                     "content-type": "application/json"
    //                 }
    //             };
    //             await axios.post("/api/boardGram/delete", data, config).then((response) =>{
    //                 if(response.data.result === 0){
    //                     enqueueSnackbar(`잘못된 정보입니다. 관리자에 문의해주세요.`, 
    //                     {   
    //                         variant: 'Error', 
    //                     })
    //                     return false;
    //                 }else{
    //                     let changeValue = [...cardValues];
    //                     changeValue.splice(key ,1);    
    //                     setCardValues(changeValue);
    //                 }
    //             });
    //         }
    //         deleteBoard();
    //     }else if(value === 'user_follow'){
    //         const followUser = async() => {
    //             const data = {
    //                 followUser: cardValues[key].user_no,
    //                 followerUser: cookies.userKey,
    //                 follow: cardValues[key].user_follow ? 'delete' : 'insert'
    //             }
    //             const config = {
    //                 headers: {
    //                     "content-type": "application/json"
    //                 }
    //             };
    //             await axios.post("/api/user/follow", data, config).then((response) =>{
    //                 if(response.data.result === 1){
    //                     if(!cardValues[key].user_follow){
    //                         enqueueSnackbar(`${cardValues[key].user_name}님과 팔로우 하였습니다.`, { variant: 'success'});
    //                         let changeValue = [...cardValues];
    //                         changeValue[key].user_follow = new Date();    
    //                         setCardValues(changeValue);
    //                     }else{
    //                         enqueueSnackbar(`${cardValues[key].user_name}님과 팔로우 취소 하였습니다.`, { variant: 'success'});
    //                         let changeValue = [...cardValues];
    //                         changeValue[key].user_follow = null;    
    //                         setCardValues(changeValue);
    //                     }                    
    //                 }else{
    //                     enqueueSnackbar(`로그인이 필요합니다.`, 
    //                     {   
    //                         variant: 'warning', 
    //                         action: <div className="alret_action">
    //                             <button 
    //                                 onClick={() => props.history.push({pathname: `/user/login`, state: `${props.history.location.pathname}`})}
    //                             >로그인
    //                             </button>
    //                         </div>
    //                     })
    //                     return false;
    //                 }
    //             });
    //         }
    //         followUser();
    //     }else{
    //         let changeValue = [...cardValues];
    //         changeValue[key][value] = !changeValue[key][value] ? true : false;
    //         setCardValues(changeValue);
    //     }
    // }
    const handleClickFollow = async(key) => {
        const data = {
            followUser: values[key].userNo,
            followerUser: cookies.userKey,
            follow: values[key].userFollow ? 'delete' : 'insert'
        }
        const config = {
            headers: {
                "content-type": "application/json"
            }
        };
        await axios.post("/api/user/follow", data, config).then((response) =>{
            if(response.data.result === 1){
                if(!values[key].userFollow){
                    enqueueSnackbar(`${values[key].userName}님을 팔로우 하였습니다.`, { variant: 'info'});
                    let changeValue = [...values];
                    for(let k = 0; k<changeValue.length; k++){
                        if(changeValue[k].userNo === changeValue[key].userNo){
                            changeValue[k].userFollow = new Date();
                        }    
                    }
                    setValues(changeValue);
                }else{
                    enqueueSnackbar(`${values[key].userName}님을 팔로우 취소 하였습니다.`, { variant: 'info'});
                    let changeValue = [...values];
                    for(let k = 0; k<changeValue.length; k++){
                        if(changeValue[k].userNo === changeValue[key].userNo){
                            changeValue[k].userFollow = null;
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
    const handleClickDelete = async(key) => {
        const data = {
            boardNo: values[key].boardNo,
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
    return(
        <>
            <Grid item container justify="space-between" alignContent="center" className="main_content">
                <Grid item xs={2} className="main_board_title " onClick={() => props.history.push(`/board/1`)}><div><img className="icon_shadow" src={board_play_icon} alt="" draggable={false}/></div><p>상품연계</p></Grid>
                <Grid item xs={2} className="main_board_title " onClick={handleClickNotReady}><div><img className="icon_shadow" src={board_review_icon} alt="" draggable={false}/></div><p>상품리뷰</p></Grid>
                <Grid item xs={2} className="main_board_title " onClick={() => props.history.push(`/board/3`)}><div><img className="icon_shadow" src={board_gram_icon} alt="" draggable={false}/></div><p>기록</p></Grid>
                <Grid item xs={2} className="main_board_title " onClick={handleClickNotReady}><div><img className="icon_shadow" src={board_video_icon} alt="" draggable={false}/></div><p>영상기록</p></Grid>
                <Grid item xs={2} className="main_board_title " onClick={() => props.history.push(`/board/5`)}><div><img className="icon_shadow" src={board_column_icon} alt="" draggable={false}/></div><p>전문가칼럼</p></Grid>
            </Grid> 
            <div className="main_content">
                <ContentSlider />
            </div>
            <div className="main_content main_content_background">
                <div className="main_content_title">
                전문가들의 꿀팁을 한눈에!
                </div>
                <Grid item container justify="space-between" alignContent="center" onClick={() => props.history.push('/board/5')}>
                    <Grid xs={2} className="main_board_title main_margin"><div><img src={sports_icon_1} alt="" draggable={false}/></div><p>축구</p></Grid>
                    <Grid xs={2} className="main_board_title main_margin"><div><img src={sports_icon_2} alt="" draggable={false}/></div><p>농구</p></Grid>
                    <Grid xs={2} className="main_board_title main_margin"><div><img src={sports_icon_3} alt="" draggable={false}/></div><p>야구</p></Grid>
                    <Grid xs={2} className="main_board_title main_margin"><div><img src={sports_icon_4} alt="" draggable={false}/></div><p>배드민턴</p></Grid>
                    <Grid xs={2} className="main_board_title main_margin"><div><img src={sports_icon_5} alt="" draggable={false}/></div><p>골프</p></Grid>
                </Grid>
                <Grid item container justify="space-between" alignContent="center" onClick={() => props.history.push('/board/5')}>
                    <Grid xs={2} className="main_board_title main_margin"><div><img src={sports_icon_6} alt="" draggable={false}/></div><p>볼링</p></Grid>
                    <Grid xs={2} className="main_board_title main_margin"><div><img src={sports_icon_7} alt="" draggable={false}/></div><p>당구</p></Grid>
                    <Grid xs={2} className="main_board_title main_margin"><div><img src={sports_icon_8} alt="" draggable={false}/></div><p>헬스</p></Grid>
                    <Grid xs={2} className="main_board_title main_margin"><div><img src={sports_icon_9} alt="" draggable={false}/></div><p>크로스핏</p></Grid>
                    <Grid xs={2} className="main_board_title main_margin"><div><img src={sports_icon_10} alt="" draggable={false}/></div><p>필라테스</p></Grid>
                </Grid>
                <Grid item container justify="space-between" alignContent="center" onClick={() => props.history.push('/board/5')}>
                    <Grid xs={2} className="main_board_title main_margin"><div><img src={sports_icon_11} alt="" draggable={false}/></div><p>등산</p></Grid>
                    <Grid xs={2} className="main_board_title main_margin"><div><img src={sports_icon_12} alt="" draggable={false}/></div><p>마라톤</p></Grid>
                    <Grid xs={2} className="main_board_title main_margin"><div><img src={sports_icon_13} alt="" draggable={false}/></div><p>자전거</p></Grid>
                    <Grid xs={2} className="main_board_title main_margin"><div><img src={sports_icon_14} alt="" draggable={false}/></div><p>낚시</p></Grid>
                    <Grid xs={2} className="main_board_title main_margin"><div><img src={sports_icon_15} alt="" draggable={false}/></div><p>기타</p></Grid>
                </Grid>
            </div>
            {!loading ?
                values[0] ?
            <div className='board_list' style={{marginTop: '20px'}}>
                {values.map((value, i) => (
                    <ContentPlay 
                        value={value} 
                        contentKey={i} 
                        handleClickFollow={handleClickFollow}
                        handleClickDelete={handleClickDelete}
                    />
                ))}
            </div>:
            <BoardNoContent />
            :
            <div style={{marginTop: '20px'}}>
                <BoardLoading />
                <BoardLoading />
            </div>
            }
            {/* <div className="main_content">
                {cardValues.map((value, i) => (
                    <ContentCard 
                        handleClickOpen={() => handleClickOpen(value.board_no)} 
                        value={value} 
                        user={user}
                        contentKey={i} 
                        handleClickCardValue={handleClickCardValue}
                        userNo={user.user_no} />
                ))}
            </div> */}
            {/* <div className="main_content main_content_background">
                <div className="main_content_title">
                용품
                </div>
                <div className="content_list_slide" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave}>
                    <table className="content_list_table">
                        <tr>
                            <ContentListSlide />
                            <ContentListSlide />
                            <ContentListSlide />
                            <ContentListSlide />
                            <ContentListSlide />
                            <ContentListSlide />
                            <ContentListSlide />
                            <ContentListSlide />
                        </tr>
                    </table>
                </div>
            </div>
            <div className="main_content main_content_background">
                <div className="main_content_title">
                구장
                </div>
                <ContentListFull />
                <ContentListFull />
            </div>
            <div className="main_content main_content_background">
                <div className="main_content_title">
                레슨
                </div>
                <ContentListHarfText />
                <ContentListHarfText />
            </div>
            <div className="main_content main_content_background">
                <div className="main_content_title">
                대회
                </div>
                <Grid item container justify="space-between" alignContent="center">
                    <ContentListHarf />
                    <ContentListHarf />
                    <ContentListHarf />
                    <ContentListHarf />
                </Grid>
            </div> */}
            {/* <DialogComment 
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
            </DialogComment> */}
        </>
    );
}

export default withRouter(UserMain);