import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { Link, Grid, CircularProgress } from '@material-ui/core';
import ContentPlay from 'components/content/ContentPlay';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useSnackbar } from 'notistack';

import BoardLoading from 'components/layout/user/BoardLoading';
import BoardNoContent from 'components/layout/user/BoardNoContent';

const BoardPlay = (props) => {
    const [cookies] = useCookies('userKey');
    const { enqueueSnackbar } = useSnackbar();
    const [values, setValues] = useState([
        {
            boardNo: '',
            userNo: '',
            userProfile: '',
            userName: '',
            sportNo: '',
            sportName: '',
            userFollow: null,
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
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState([])
    useEffect(()=>{
        const loadPlay = async() => {
            const data = {
                userKey: cookies.userKey,
                search: decodeURI(props.history.location.search.substr(1))
            }
            const config = {
                headers: {
                    "content-type": "application/json"
                }
            };
            await axios.post("/api/boardPlay", data, config).then((response)=>{
                props.setSearch(decodeURI(props.history.location.search.substr(1)))
                if(response.data.boardKeyword){
                    let loadSearchKeyword = [];
                    for(let i = 0; i < response.data.boardKeyword.length; i++){
                        loadSearchKeyword.push(response.data.boardKeyword[i].sportDetail_keyword);
                    }
                    setSearchKeyword(loadSearchKeyword);
                }
                setLoading(true);
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
    }, [props.history.location.search.substr(1)]);
    const [mouseScroll, setMouseScroll] = useState(false);
    const [mouseX, setMouseX] = useState();
    const [scrollLeft, setScrollLeft] = useState();
    const handleMouseDown = (event) => {
        setMouseX(event.pageX);
        setScrollLeft(document.getElementsByClassName('board_keyword_table')[0].scrollLeft);
        setMouseScroll(true);
    }
    const handleMouseMove = (event) => {
        if(mouseScroll){
            const walk = (event.pageX - mouseX)/2;
            document.getElementsByClassName('board_keyword_table')[0].scrollLeft = scrollLeft - walk;
        }
    }
    const handleMouseUpOrLeave = () => {
        setMouseScroll(false);
        setMouseX();
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
            <Grid item container justify="space-between" className="board_top">
                <Grid item xs={12} className="board_keyword">
                    추천 검색어
                    <div className="board_keyword_table" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave}>
                        <table>
                            <tr>
                                
                                {searchKeyword.map((keyword, i) => (
                                    <td><div className="hashtag_img"/><div onClick={() => props.history.replace(`/board/1?${keyword}`)}>{keyword}</div></td>
                                ))}
                            </tr>
                        </table>
                    </div>
                </Grid>
                <Grid item xs={8} className="board_another">
                    {cookies.userKey?
                    <div onClick={handleClickOtherSport}>다른 종목을 보고 싶으신가요?</div>:
                    null}
                </Grid>
                {/* <Grid item xs={4} className="board_sort">
                    <select>
                        <option>최신순</option>
                        <option>최신순</option>
                        <option>최신순</option>
                        <option>최신순</option>
                    </select>
                </Grid> */}
            </Grid>
            {!loading ?
                values[0] ?
            <div className='board_list'>
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
            <>
                <BoardLoading />
                <BoardLoading />
            </>
            }
        </>
    );
}

export default withRouter(BoardPlay);