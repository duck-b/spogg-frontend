import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { Grid, IconButton, CircularProgress } from '@material-ui/core';
import { Close, IndeterminateCheckBox } from '@material-ui/icons';
import DialogKeyword from 'components/layout/user/DialogKeyword';
import DialogSave from 'components/layout/user/DialogSave';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

const CreatePlay = (props) => {
    const [cookies] = useCookies('userKey');
    const { enqueueSnackbar } = useSnackbar();
    const [creating, setCreating] = useState(false);
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
    const [sport, setSport] = useState([{sport_no: '', sport_name: '', sport_kind: ''}])
    useEffect(() => {
        async function fetchMyAPI(){
              let response = await fetch(`/api/board/create/${cookies.userKey}`);
              response = await response.json();
              setSport(response);
          }
          fetchMyAPI();
    },[]);
    const [values, setValues] = useState({
        sport: '',
        title : '',
        imgWidth: 0,
        imgHeight: 0,
        board :[
            {
                img: '',
                point : [

                ],
                content : '',
                keyword: []
            }
        ]
    });
    
    const handleChangeSport = (event) => {
        setValues({...values, sport: event.target.value});
        setCreating(false)
    }
    const handleChangeTitle = (event) => {
        setValues({...values, title: event.target.value});
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
            if(values.board[event.target.accessKey]){
                addFile[event.target.accessKey] = compressedFile;
            }else{
                addFile.push(compressedFile);
            }
            setImgFile(addFile); // 파일 상태 업데이트
          
          // resize된 이미지의 url을 받아 fileUrl에 저장
          const promise = imageCompression.getDataUrlFromFile(compressedFile);
          promise.then(result => {
            let addImg = {...values};
            if(addImg.board[event.target.accessKey]){
                addImg.board[event.target.accessKey].img = result;
                addImg.board[event.target.accessKey].point = [];
                addImg.board[event.target.accessKey].content = '';
                addImg.board[event.target.accessKey].keyword = [];
            }else{
                addImg.board.push({
                    img: result,
                    point : [],
                    content : '',
                    keyword: []
                });
            }
            setValues(addImg);
          })
        } catch (error) {
            console.log(error);
        }
    }
   
    const handleClickRemoveImg = (key) => {
        let removeImg = {...values};
        if(key === 0){
            if(values.board.length === 1){
                removeImg.board[0].img = '';
                removeImg.board[0].point = [];
                removeImg.board[0].content = '';
                removeImg.board[0].keyword = []
            }else{
                removeImg.board.splice(0, 1);
            }
        }else{
            removeImg.board.splice(key, 1);
        }
        setValues(removeImg);
        let removeFile = [...imgFile];
        removeFile.splice(key, 1);
        setImgFile(removeFile);
    }
    
    const handleClickImg = (event) => {
        if(event.target.accessKey){
            if(values.board[event.target.accessKey].point.length < 10){
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
                let addPoint = {...values, imgWidth: imgWidth, imgHeight: imgHeight};
                addPoint.board[event.target.accessKey].point.push({x: x, y: y, content: ''});
                setValues(addPoint);
            }
        }
    }
    const handleChangePointContent = (event) => {
        const num = event.target.accessKey.split(',');
        let addPointContent = {...values};
        addPointContent.board[num[0]].point[num[1]].content = event.target.value;
        setValues(addPointContent);
    }

    const handleChangeContent = (event) => {
        let addContent = {...values};
        addContent.board[event.target.accessKey].content = event.target.value;
        setValues(addContent);
    }

    const handleClickRemovePoint = (boardKey, pointKey) => {
        let removePoint = {...values};
        removePoint.board[boardKey].point.splice(pointKey, 1);
        setValues(removePoint);
    }

    const [open, setOpen] = useState(false);
    const [keywordBoardKey, setKeywordBoardKey] = useState(0);
    const handleClickAddKeyword = (word, boardKey) => {
        let addKeyword = {...values};
        addKeyword.board[boardKey].keyword.push(word.split(',').join(''));
        setValues(addKeyword);
    }
    const handleClickRemoveKeyword = (boardKey, keywordKey) => {
        let removeKeyword = {...values};
        removeKeyword.board[boardKey].keyword.splice(keywordKey, 1);
        setValues(removeKeyword);
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
        if(!values.sport || !values.title){
            setCreateButton(true);
            return false;
        }else if(!imgFile[0]){
            setCreateButton(true);
            return false;
        }else{
            setCreateButton(false)
        }
    },[values])
    const handleClickCreate = async() => {
        if(!values.sport || !values.title){
            setCreateButton(true);
            return false;
        }else if(!imgFile[0]){
            setCreateButton(true);
            return false;
        }else{
            setCreating(true);
            const formData = new FormData();
            formData.append('userKey', cookies.userKey);
            formData.append('board_kind', props.match.params.boardKind);
            formData.append('sport_no', values.sport);
            formData.append('board_title', values.title);
            formData.append('imgWidth', values.imgWidth);
            formData.append('imgHeight', values.imgHeight);
            for(let i = 0; i < imgFile.length; i++){
                formData.append('imgFile', imgFile[i]);
                formData.append('board_content[]', values.board[i].content.split(',').join('&#44;').split('|').join('&#124;'));
                for(let j = 0; j < values.board[i].point.length; j++){
                    formData.append(`board_point_x[${i}][]`, values.board[i].point[j].x);
                    formData.append(`board_point_y[${i}][]`, values.board[i].point[j].y);
                    formData.append(`board_point_content[${i}][]`, values.board[i].point[j].content.split(',').join('&#44;').split('|').join('&#124;'));
                }
                for(let j = 0; j < values.board[i].keyword.length; j++){
                    formData.append(`board_keyword[${i}][]`, values.board[i].keyword[j].split(',').join('&#44;').split('|').join('&#124;'));
                }
            }
            formData.append('board_complete', 1);
            const config = {
                headers: {
                    "content-type": "multipart/form-data"
                }
            };
            await axios.post("/api/boardPlay/create", formData, config).then((response)=>{
                if(!response.data.result){
                    enqueueSnackbar(`Error 관리자에게 문의해주세요.`, { variant: 'error'})
                }
                props.history.go(-2);
            });
        }
    }
    // 파일 용량 줄이기
    //https://www.popit.kr/react-%EC%9B%B9%EC%97%90%EC%84%9C-%EC%97%85%EB%A1%9C%EB%93%9C-%EC%A0%84-%EC%9D%B4%EB%AF%B8%EC%A7%80-%ED%8C%8C%EC%9D%BC-%EC%9A%A9%EB%9F%89-%EC%A4%84%EC%9D%B4%EA%B8%B0/

    // 이미지 제외 막기
    //https://sqlplus.tistory.com/entry/%ED%8C%8C%EC%9D%BC%EC%B2%A8%EB%B6%80%EC%97%90-%EC%9D%B4%EB%AF%B8%EC%A7%80%EB%A7%8C-%EC%B2%A8%EB%B6%80%ED%95%A0-%EC%88%98-%EC%9E%88%EB%8F%84%EB%A1%9D-%EC%B2%98%EB%A6%AC-input-file
    return(
        <Grid item container justify="space-between" className="board_create_body">
            <Grid item container xs={12} alignItems="center" className="board_create_form_group">
                <Grid item xs={4} className="board_create_title">
                    카테고리
                </Grid>
                <Grid item xs={7}>
                    <select className="board_create_select board_create_form" id="sport" onChange={handleChangeSport} style={{color: !values.sport ? 'rgba(0, 0, 0, 0.34)' : '#000'}}>
                        <option value=''>종목을 선택해 주세요.</option>
                        <optgroup label="구기 / 라켓">
                            {sport.map((sport)=>(sport.sport_kind === 1 ?<option value={sport.sport_no}>{sport.sport_name}</option> : null))}
                        </optgroup>
                        <optgroup label="헬스 / 피트니스">
                            {sport.map((sport)=>(sport.sport_kind === 2 ?<option value={sport.sport_no}>{sport.sport_name}</option> : null))}
                        </optgroup>
                        <optgroup label="레저 / 생활체육">
                            {sport.map((sport)=>(sport.sport_kind === 3 ?<option value={sport.sport_no}>{sport.sport_name}</option> : null))}
                        </optgroup>
                        <optgroup label="기타">
                            {sport.map((sport)=>(sport.sport_kind === 4 ?<option value={sport.sport_no}>{sport.sport_name}</option> : null))}
                        </optgroup>
                    </select>
                </Grid>
            </Grid>
            <Grid item container xs={12} alignItems="center" className="board_create_form_group">
                <Grid item xs={4} className="board_create_title">
                    제목
                </Grid>
                <Grid item xs={7} >
                    <input type="text" className="board_create_input board_create_form" placeholder="제목을 입력해 주세요." value={values.title}  onChange={handleChangeTitle} />
                </Grid>
            </Grid>
            {values.board.map((board, i) => (
            <>
            {!board.img ? 
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
            <div className="board_create_file_after" id={`img${i}`} onClick={handleClickImg} accessKey={i} style={{backgroundImage: `url(${board.img})`}}>
                {board.point.map((point, j) => (
                <div style={{top: `${point.y}px`, left: `${point.x}px`}}>{j+1}</div>
                ))}
            </div>
            <div className="board_create_file_after_button">
                <button className="board_create_form"><label for={`imgFile${i}`}>사진 변경</label></button>
                <button className="board_create_form" onClick={() => handleClickRemoveImg(i)}>삭제</button>
                <input type="file" id={`imgFile${i}`} onChange={handleChangeImg} accept="image/jpeg,image/jpg,image/png" hidden accessKey={i}/>
            </div>
            {board.point.map((point, j) => (
                <Grid item container justify="space-between" alignItems="center" className="board_create_file_after_point">
                    <Grid item xs={1}><div className="board_create_file_after_point_circle">{j+1}</div></Grid>
                    <Grid item xs={10}><input type="text" value={point.content} onChange={handleChangePointContent} accessKey={`${i},${j}`} className="board_create_file_after_point_input board_create_form" placeholder="상품에 대한 설명을 해주세요." /></Grid>
                    <Grid item xs={1} style={{textAlign: "right"}}><IndeterminateCheckBox fontSize="small" onClick={() => handleClickRemovePoint(i, j)} /></Grid>
                </Grid>
            ))}
            </>}
            <div className="board_create_content">
                <div>
                    <textarea rows={15} className="board_create_form" placeholder="내용을 입력해 주세요." value={board.content} onChange={handleChangeContent} accessKey={i}></textarea>
                </div>
            </div>
            <div className="board_create_keyword" onClick={() => handleClickKeyword(i)}>
                <p className="board_create_keyword_title"># 키워드를 입력해주세요.</p>
                {board.keyword.map((keyword) => (
                <div className="board_create_keyword_content"># {keyword} <IconButton aria-label="cancle" size="small"><Close style={{fontSize: '12px', marginBottom: '2.5px'}} /></IconButton></div>
                ))}
            </div>
            </>
            ))}
            {values.board[0].img ? 
            <div className="board_create_file_another">
                <div className="board_create_file_another_form">
                    <p>사진을 추가로 업로드 하면<br/>더 많은 내용을 작성할 수 있습니다.</p>
                    <label for={`imgFileNew`}>사진 업로드</label>
                    <input type="file" id={`imgFileNew`} onChange={handleChangeImg} accept="image/jpeg,image/jpg,image/png" hidden accessKey={values.board.length} />
                </div>
            </div>:null
            }
            {!creating ?
            <div className="board_create_button">
                <button className="board_create_form" disabled={createButton} onClick={handleClickCreate}>등록완료</button>
            </div>
            :
            <div className="board_create_button">
                <button className="board_create_form" disabled={true}>
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
                {values.board[keywordBoardKey].keyword.map((keyword, i) => (
                <div className="board_create_keyword_content"># {keyword}<IconButton aria-label="cancle" size="small" onClick={() => handleClickRemoveKeyword(keywordBoardKey, i)}><Close style={{fontSize: '12px', marginBottom: '2.5px'}} /></IconButton></div>
                ))}
            </DialogKeyword>
            <DialogSave
                open={saveOpen}
                handleClose={() => setSaveOpen(false)}
            />
        </Grid>
    )
}

export default withRouter(CreatePlay);