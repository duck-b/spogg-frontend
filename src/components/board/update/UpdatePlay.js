import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { Grid, IconButton, CircularProgress } from '@material-ui/core';
import { Close, IndeterminateCheckBox, CheckBox } from '@material-ui/icons';
import DialogKeyword from 'components/layout/user/DialogKeyword';
import DialogSave from 'components/layout/user/DialogSave';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

const UpdatePlay = (props) => {
    const [cookies] = useCookies('userKey');
    const { enqueueSnackbar } = useSnackbar();
    const [updating, setUpdating] = useState(false);
    const [saveOpen, setSaveOpen] = useState(false);
    setTimeout(function(){
        window.onpopstate = function (event) { 
            if(event.state){
                setSaveOpen(true);
            }
        }
    }, 100)
    useEffect(() => {
        if(!saveOpen){
            window.history.pushState(null, null, '');
        }
    },[saveOpen]);
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
    });
    const [sport, setSport] = useState([{sport_no: '', sport_name: '', sport_kind: ''}])
    useEffect(async() => {
        let response = await fetch(`/api/boardPlay/${props.match.params.boardId}/update/${cookies.userKey}`);
        response = await response.json();
        if(response.result === 1){
            setSport(response.sport);
            const imgWidth = document.getElementsByClassName('board_create_body')[0].offsetWidth;
            let dt = response.board;
            let loadValue = {
                boardNo: dt.board_no,
                boardTitle: dt.board_title,
                userNo: dt.user_no,
                sportNo: dt.sport_no,
                createdAt: new Date(dt.created_at),
                boardDetail: [],
            };
            let boardHashtag = dt.board_hashtag.split('|');
            let boardGoodsInfo = dt.boardGoods_info.split('|');
            let boardGoodsX = dt.boardGoods_x.split('|');
            let boardGoodsY = dt.boardGoods_y.split('|');
            let thisGoods = dt.goods_no.split('|');
            let thisGoodsName = dt.goods_name.split('|');
            let thisGoodsImage = dt.thisGoods_image.split('|');
            for(let j = 0; j < dt.boardDetail_num.split('|').length; j++){
                loadValue.boardDetail.push({
                    boardDetailNo: dt.boardDetail_no.split('|')[j],
                    boardDetailNum: dt.boardDetail_num.split('|')[j],
                    boardDetailContent: dt.boardDetail_content.split('|')[j],
                    boardImage: dt.board_img.split('|')[j],
                    boardHashtag: [],
                    boardGoods: [],
                    openGoods: false,
                    changeImg: -1
                })
                for(let k = 0; k < boardHashtag[j].split(',').length; k++){
                    if(boardHashtag[j].split(',')[k]){
                        loadValue.boardDetail[j].boardHashtag.push({
                            keyword: boardHashtag[j].split(',')[k],
                            state: ''
                        })
                    }
                }
                for(let k = 0; k < boardGoodsX[j].split(',').length; k++){
                    if(boardGoodsX[j].split(',')[k]){
                        loadValue.boardDetail[j].boardGoods.push({
                            x: boardGoodsX[j].split(',')[k],
                            y: boardGoodsY[j].split(',')[k],
                            pointX: boardGoodsX[j].split(',')[k]*imgWidth,
                            pointY: boardGoodsY[j].split(',')[k]*imgWidth,
                            info: boardGoodsInfo[j].split(',')[k],
                            no: thisGoods[j].split(',')[k],
                            name :thisGoodsName[j].split(',')[k]
                        })
                    }
                }
            }
            setValue(loadValue);
        }else{
            enqueueSnackbar(`잘못된 경로입니다.`, { variant: 'error'});
            props.history.replace('/');
        }
    },[]);
    
    const handleChangeSport = (event) => {
        setValue({...value, sportNo: event.target.value});
    }
    const handleChangeTitle = (event) => {
        setValue({...value, boardTitle: event.target.value});
    }

    const [imgFile, setImgFile] = useState([]);
    const handleChangeImg = async (event) => {
        let file = event.target.files[0];
        
        const options = { 
            maxSizeMB: 1, 
            maxWidthOrHeight: 500
        }
        try {
            const compressedFile = await imageCompression(file, options);
            let addFile = [...imgFile];
            addFile.push(compressedFile);
            setImgFile(addFile); // 파일 상태 업데이트
          
            // resize된 이미지의 url을 받아 fileUrl에 저장
            const promise = imageCompression.getDataUrlFromFile(compressedFile);
            promise.then(result => {
                let addImg = {...value};
                if(addImg.boardDetail[event.target.accessKey]){
                    addImg.boardDetail[event.target.accessKey].boardImage = result;
                    addImg.boardDetail[event.target.accessKey].boardGoods = [];
                    addImg.boardDetail[event.target.accessKey].boardDetailContent = '';
                    addImg.boardDetail[event.target.accessKey].boardHashtag = [];
                    addImg.boardDetail[event.target.accessKey].changeImg = imgFile.length;
                }else{
                    addImg.boardDetail.push({
                        boardImage: result,
                        boardGoods : [],
                        boardDetailContent : '',
                        boardHashtag: [],
                        changeImg: imgFile.length
                    });
                }
                setValue(addImg);
            })
        } catch (error) {
            console.log(error);
        }
    }
    const [deleteBoardDetail, setDeleteBoardDetail] = useState([])
    const handleClickRemoveImg = (key) => {
        let changeBoardDetail = [...deleteBoardDetail];
        changeBoardDetail.push(value.boardDetail[key].boardDetailNo);
        setDeleteBoardDetail(changeBoardDetail);
        let removeImg = {...value};
        if(key === 0){
            if(removeImg.boardDetail.length === 1){
                removeImg.boardDetail[0].boardImage = '';
                removeImg.boardDetail[0].boardGoods = [];
                removeImg.boardDetail[0].boardDetailContent = '';
                removeImg.boardDetail[0].boardHashtag = [];
            }else{
                removeImg.boardDetail.splice(0, 1);
            }
        }else{
            removeImg.boardDetail.splice(key, 1);
        }
    }
    
    const handleClickImg = (event) => {
        if(value.boardDetail[event.target.accessKey].boardGoods.length < 10){
            let x = event.nativeEvent.offsetX - 7.5;
            let y = event.nativeEvent.offsetY - 7.5;
            const imgWidth = document.getElementById(`img${event.target.accessKey}`).getBoundingClientRect().width;
            const imgHeight = document.getElementById(`img${event.target.accessKey}`).getBoundingClientRect().height;
            if(x+15 > imgWidth){
                x = imgWidth - 15;
            }else if(y+15 > imgHeight){
                y = imgHeight - 15;
            }else if(x < 0){
                x = 0;
            }else if(y < 0){
                y = 0;
            }
            let addPoint = {...value, imgWidth: imgWidth, imgHeight: imgHeight};
            addPoint.boardDetail[event.target.accessKey].boardGoods.push({x: x, y: y, info: ''});
            setValue(addPoint);
        }
    }
    const handleChangePointContent = (event) => {
        const num = event.target.accessKey.split(',');
        let addPointContent = {...value};
        addPointContent.boardDetail[num[0]].boardGoods[num[1]].info = event.target.value;
        addPointContent.boardDetail[num[0]].boardGoods[num[1]].pointX ?
        addPointContent.boardDetail[num[0]].boardGoods[num[1]].state = 'update' : addPointContent.boardDetail[num[0]].boardGoods[num[1]].state = 'insert'
        setValue(addPointContent);
    }

    const handleChangeContent = (event) => {
        let addContent = {...value};
        addContent.boardDetail[event.target.accessKey].boardDetailContent = event.target.value;
        setValue(addContent);
    }
    const [deleteBoardGoods, setDeleteBoardGoods] = useState([])
    const handleClickDeletePoint = (boardKey, pointKey) => {
        let changeGoods = [...deleteBoardGoods];
        changeGoods.push(value.boardDetail[boardKey].boardGoods[pointKey]);
        changeGoods[changeGoods.length-1].boardDetailNo = value.boardDetail[boardKey].boardDetailNo;
        setDeleteBoardGoods(changeGoods);

        handleClickRemovePoint(boardKey, pointKey);
    }

    const handleClickRemovePoint = (boardKey, pointKey) => {
        let removePoint = {...value};
        removePoint.boardDetail[boardKey].boardGoods.splice(pointKey, 1);
        setValue(removePoint);
    }

    const [open, setOpen] = useState(false);
    const [keywordBoardKey, setKeywordBoardKey] = useState(0);
    const handleClickAddKeyword = (word, boardKey) => {
        let addKeyword = {...value};
        addKeyword.boardDetail[boardKey].boardHashtag.push({keyword: word.split(',').join(''), state: 'insert'});
        setValue(addKeyword);
    }

    const handleClickRemoveKeyword = (boardKey, keywordKey) => {
        let removeKeyword = {...value};
        removeKeyword.boardDetail[boardKey].boardHashtag[keywordKey].state = 'delete';
        setValue(removeKeyword);
    }
    const handleClickKeyword = (boardKey) => {
        setKeywordBoardKey(boardKey);
        window.history.pushState(null, null, '');
        setOpen(true);
    }

    const handleClose = () => {
        setKeywordBoardKey(0);
        setOpen(false);
    }

    const [createButton, setCreateButton] = useState(true);
    useEffect(() => {
        if(!value.sportNo || !value.boardTitle){
            setCreateButton(true);
            return false;
        }else if(!value.boardDetail[0].boardImage){
            setCreateButton(true);
            return false;
        }else{
            setCreateButton(false)
        }
    },[value])
    const handleClickUpdate = async() => {
        if(!value.sportNo || !value.boardTitle){
            setCreateButton(true);
            return false;
        }else if(!value.boardDetail[0].boardImage){
            setCreateButton(true);
            return false;
        }else{
            const formData = new FormData();
            formData.append('userKey', cookies.userKey);
            formData.append('userNo', value.userNo);
            formData.append('sportNo', value.sportNo);
            formData.append('boardTitle', value.boardTitle);
            formData.append('imgWidth', value.imgWidth);
            formData.append('imgHeight', value.imgHeight);
            for(let i = 0; i < deleteBoardDetail.length; i++){
                formData.append('deleteBoardDetail[]', deleteBoardDetail[i]);
            }
            for(let i = 0; i < deleteBoardGoods.length; i++){
                formData.append(`deleteBoardGoodsX[]`, deleteBoardGoods[i].x);
                formData.append(`deleteBoardGoodsY[]`, deleteBoardGoods[i].y);
                formData.append(`deleteBoardDetailGoods[]`, deleteBoardGoods[i].boardDetailNo);
            }
            for(let i = 0; i < value.boardDetail.length; i++){
                formData.append('boardDetailNo[]', value.boardDetail[i].boardDetailNo);
                if(value.boardDetail[i].changeImg !== -1){
                    formData.append('imgFile', imgFile[value.boardDetail[i].changeImg]);
                    formData.append('changeImg[]', 1);
                }else{
                    formData.append('changeImg[]', 0);
                }
                formData.append('boardContent[]', value.boardDetail[i].boardDetailContent.split(',').join('&#44;').split('|').join('&#124;'));
                for(let j = 0; j < value.boardDetail[i].boardGoods.length; j++){
                    if(value.boardDetail[i].boardGoods[j].state){
                        formData.append(`boardGoodsState[${i}][]`, value.boardDetail[i].boardGoods[j].state);
                        formData.append(`boardGoodsX[${i}][]`, value.boardDetail[i].boardGoods[j].x);
                        formData.append(`boardGoodsY[${i}][]`, value.boardDetail[i].boardGoods[j].y);
                        formData.append(`boardGoodsPointX[${i}][]`, value.boardDetail[i].boardGoods[j].pointX);
                        formData.append(`boardGoodsPointY[${i}][]`, value.boardDetail[i].boardGoods[j].pointY);
                        formData.append(`boardGoodsInfo[${i}][]`, value.boardDetail[i].boardGoods[j].info.split(',').join('&#44;').split('|').join('&#124;'));
                    }
                }
                for(let j = 0; j < value.boardDetail[i].boardHashtag.length; j++){
                    if(value.boardDetail[i].boardHashtag[j].state){
                        formData.append(`boardHashtag[${i}][]`, value.boardDetail[i].boardHashtag[j].keyword.split(',').join('&#44;').split('|').join('&#124;'));
                        formData.append(`boardHashtagState[${i}][]`, value.boardDetail[i].boardHashtag[j].state);

                    }
                }
            }
            const config = {
                headers: {
                    "content-type": "multipart/form-data"
                }
            };
            await axios.post(`/api/boardPlay/${value.boardNo}/update`, formData, config).then((response)=>{
                if(!response.data.result){
                    enqueueSnackbar(`잘못된 경로입니다.`, { variant: 'error'});
                }
                props.history.go(-2);
            });
        }
    }
    return(
        <Grid item container justify="space-between" className="board_create_body">
            <Grid item container xs={12} alignItems="center" className="board_create_form_group">
                <Grid item xs={4} className="board_create_title">
                    카테고리
                </Grid>
                <Grid item xs={7}>
                    <select className="board_create_select board_create_form" id="sport" onChange={handleChangeSport} style={{color: !value.sportNo ? 'rgba(0, 0, 0, 0.34)' : '#000'}}>
                        <option value=''>종목을 선택해 주세요.</option>
                        <optgroup label="구기 / 라켓">
                            {sport.map((sport)=>(sport.sport_kind === 1 ?<option value={sport.sport_no} selected={sport.sport_no === value.sportNo ? true : false}>{sport.sport_name}</option> : null))}
                        </optgroup>
                        <optgroup label="헬스 / 피트니스">
                            {sport.map((sport)=>(sport.sport_kind === 2 ?<option value={sport.sport_no} selected={sport.sport_no === value.sportNo ? true : false}>{sport.sport_name}</option> : null))}
                        </optgroup>
                        <optgroup label="레저 / 생활체육">
                            {sport.map((sport)=>(sport.sport_kind === 3 ?<option value={sport.sport_no} selected={sport.sport_no === value.sportNo ? true : false}>{sport.sport_name}</option> : null))}
                        </optgroup>
                        <optgroup label="기타">
                            {sport.map((sport)=>(sport.sport_kind === 4 ?<option value={sport.sport_no} selected={sport.sport_no === value.sportNo ? true : false}>{sport.sport_name}</option> : null))}
                        </optgroup>
                    </select>
                </Grid>
            </Grid>
            <Grid item container xs={12} alignItems="center" className="board_create_form_group">
                <Grid item xs={4} className="board_create_title">
                    제목
                </Grid>
                <Grid item xs={7} >
                    <input type="text" className="board_create_input board_create_form" placeholder="제목을 입력해 주세요." value={value.boardTitle}  onChange={handleChangeTitle} />
                </Grid>
            </Grid>
            {value.boardDetail.map((boardDetail, i) => (
            <>
            {!boardDetail.boardImage ? 
            <>
            <div className="board_create_file_before" key={i}>
                <div className="board_create_file">
                    <p>권장 사이즈 : 600 X 600 ( 1 : 1 비율 )</p>
                    <label for={`imgFile${i}`}>사진 추가하기</label>
                    <input type="file" id={`imgFile${i}`} onChange={handleChangeImg} accept="image/jpeg,image/jpg,image/png" hidden accessKey={i} />
                </div>
            </div>
            <div className="board_create_file_after_button">
                <button className="board_create_form" disabled={true}>사진 변경</button>
                <button className="board_create_form" disabled={true}>삭제</button>
            </div>
            </>
            :
            <>
            <div className="board_create_file_after" id={`img${i}`} onClick={handleClickImg} accessKey={i} style={{backgroundImage: `url(${boardDetail.boardImage})`}}>
                {boardDetail.boardGoods.map((goods, j) => (
                    !goods.delete ?
                        goods.pointY >= 0 ?
                        <div style={{top: `${goods.pointY}px`, left: `${goods.pointX}px`}}>{j+1}</div>
                        :<div style={{top: `${goods.y}px`, left: `${goods.x}px`}}>{j+1}</div>
                    :null
                ))}
            </div>
            <div className="board_create_file_after_button">
                <button className="board_create_form"><label for={`imgFile${i}`}>사진 변경</label></button>
                <button className="board_create_form" onClick={() => handleClickRemoveImg(i)}>삭제</button>
                <input type="file" id={`imgFile${i}`} onChange={handleChangeImg} accept="image/jpeg,image/jpg,image/png" hidden accessKey={i}/>
            </div>
            {boardDetail.boardGoods.map((goods, j) => (
                goods.pointY ?
                    goods.name ?
                <Grid item container justify="space-between" alignItems="center" className="board_create_file_after_point">
                    <Grid item xs={1}><div className="board_create_file_after_point_circle">{j+1}</div></Grid>
                    <Grid item xs={10}><input type="text" disabled={true} value={goods.name} className="board_create_file_after_point_input board_create_form"/></Grid>
                    <Grid item xs={1} style={{textAlign: "right"}}><CheckBox fontSize="small" style={{color: '#5093FF'}} /></Grid>
                </Grid>
                    :
                <Grid item container justify="space-between" alignItems="center" className="board_create_file_after_point">
                    <Grid item xs={1}><div className="board_create_file_after_point_circle">{j+1}</div></Grid>
                    <Grid item xs={10}><input type="text" value={goods.info} onChange={handleChangePointContent} accessKey={`${i},${j}`} className="board_create_file_after_point_input board_create_form" placeholder="상품에 대한 설명을 해주세요." /></Grid>
                    <Grid item xs={1} style={{textAlign: "right"}}><IndeterminateCheckBox fontSize="small" onClick={() => handleClickDeletePoint(i, j)} /></Grid>
                </Grid>                        
                :
                <Grid item container justify="space-between" alignItems="center" className="board_create_file_after_point">
                    <Grid item xs={1}><div className="board_create_file_after_point_circle">{j+1}</div></Grid>
                    <Grid item xs={10}><input type="text" value={goods.info} onChange={handleChangePointContent} accessKey={`${i},${j}`} className="board_create_file_after_point_input board_create_form" placeholder="상품에 대한 설명을 해주세요." /></Grid>
                    <Grid item xs={1} style={{textAlign: "right"}}><IndeterminateCheckBox fontSize="small" onClick={() => handleClickRemovePoint(i, j)} /></Grid>
                </Grid>
            ))}
            </>}
            <div className="board_create_content">
                <div>
                    <textarea rows={15} className="board_create_form" placeholder="내용을 입력해 주세요." value={boardDetail.boardDetailContent} onChange={handleChangeContent} accessKey={i}></textarea>
                </div>
            </div>
            <div className="board_create_keyword" onClick={() => handleClickKeyword(i)}>
                <p className="board_create_keyword_title"># 키워드를 입력해주세요.</p>
                {boardDetail.boardHashtag.map((hashtag) => (
                    hashtag.state !== 'delete' ?
                    <div className="board_create_keyword_content"># {hashtag.keyword} <IconButton aria-label="cancle" size="small"><Close style={{fontSize: '12px', marginBottom: '2.5px'}} /></IconButton></div>
                    :null
                ))}
            </div>
            </>
            ))}
            {value.boardDetail[0].boardImage ? 
            <div className="board_create_file_another">
                <div className="board_create_file_another_form">
                    <p>사진을 추가로 업로드 하면<br/>더 많은 내용을 작성할 수 있습니다.</p>
                    <label for={`imgFileNew`}>사진 업로드</label>
                    <input type="file" id={`imgFileNew`} onChange={handleChangeImg} accept="image/jpeg,image/jpg,image/png" hidden accessKey={value.boardDetail.length} />
                </div>
            </div>:null
            }
            {!updating ?
            <div className="board_create_button">
                <button className="board_create_form" disabled={createButton} onClick={handleClickUpdate}>수정완료</button>
            </div> :
            <div className="board_create_button">
                <button className="board_create_form" disabled={true} onClick={handleClickUpdate}>
                    <CircularProgress style={{width: '30px', height: '30px'}} />
                </button>
            </div>
            }

            <DialogKeyword 
                open={open}
                handleClose={handleClose}
                handleOpen={() => setOpen(true)}
                handleClickAddKeyword={handleClickAddKeyword}
                keywordBoardKey={keywordBoardKey}
            >                
                {value.boardDetail[keywordBoardKey].boardHashtag.map((hashtag, i) => (
                    hashtag.state !== 'delete' ?
                    <div className="board_create_keyword_content"># {hashtag.keyword}<IconButton aria-label="cancle" size="small" onClick={() => handleClickRemoveKeyword(keywordBoardKey, i)}><Close style={{fontSize: '12px', marginBottom: '2.5px'}} /></IconButton></div>
                    :null
                ))}
            </DialogKeyword>
            <DialogSave
                open={saveOpen}
                handleClose={() => setSaveOpen(false)}
            />
        </Grid>
    )
}

export default withRouter(UpdatePlay);