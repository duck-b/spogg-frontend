import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, CircularProgress } from '@material-ui/core';
import ContentListHarfText from 'components/content/ContentListHarfText';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import BoardLoading from 'components/layout/user/BoardLoading';
import BoardNoContent from 'components/layout/user/BoardNoContent';

const BoardColumn = (props) => {
    const [cookies] = useCookies('userKey');
    const [values, setValues] = useState([
        {
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
            await axios.post("/api/boardColumn", data, config).then((response)=>{
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
                            boardTitle: dt[i].board_title,
                            userNo: dt[i].user_no,
                            userProfile: dt[i].user_profile,
                            userName: dt[i].user_name,
                            sportNo: dt[i].sport_no,
                            sportName: dt[i].sport_name,
                            createdAt: dt[i].created_at,
                            boardCountLike: dt[i].boardCount_like,
                            boardCountSave: dt[i].boardCount_save,
                            boardCountView: dt[i].boardCount_view,
                            boardRating: dt[i].boardRating_count ? (dt[i].boardRating_rating/dt[i].boardRating_count).toPrecision(2) : '-',
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
    const handleChangeSort = (event) => {
        let sortValues = [...values];
        setLoading(true)
        setTimeout(() => {
            if(event.target.value === '0'){
                sortValues.sort(function(a, b){
                    return a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0;
                })    
            }else if(event.target.value === '1'){
                sortValues.sort(function(a, b){
                    return a.boardTitle < b.boardTitle ? -1 : a.boardTitle > b.boardTitle ? 1 : 0;
                })
            }else if(event.target.value === '2'){
                sortValues.sort(function(a, b){
                    return a.boardCountView < b.boardCountView ? 1 : a.boardCountView > b.boardCountView ? -1 : 0;
                })
            }else if(event.target.value === '3'){
                sortValues.sort(function(a, b){
                    return a.boardRating < b.boardRating ? 1 : a.boardRating > b.boardRating ? -1 : 0;
                })
            }
            setValues(sortValues);
            setLoading(false);
        }, [500])
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
                <Grid item xs={12} className="board_keyword">
                    추천 검색어
                    <div className="board_keyword_table" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave}>
                        <table>
                            <tr>
                                {searchKeyword.map((keyword, i) => (
                                    <td><div className="hashtag_img"/><div onClick={() => props.history.replace(`/board/5?${keyword}`)}>{keyword}</div></td>
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
                <Grid item xs={4} className="board_sort">
                    <select onChange={handleChangeSort}>
                        <option value={0} selected>최신순</option>
                        <option value={1}>제목순</option>
                        <option value={2}>조회순</option>
                        <option value={3}>별점순</option>
                    </select>
                </Grid>
            </Grid>
            {!loading ?
                values[0] ?
            <div className='board_list'>
                {values.map((value, i) => (
                    <ContentListHarfText 
                        value={value} 
                        contentKey={i} 
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

export default withRouter(BoardColumn);