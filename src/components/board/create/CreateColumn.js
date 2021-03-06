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

const CreateColumn = (props) => {
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
            setImgFile(addFile); // ?????? ?????? ????????????
          
          // resize??? ???????????? url??? ?????? fileUrl??? ??????
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
            await axios.post("/api/boardColumn/create", formData, config).then((response)=>{
                if(!response.data.result){
                    enqueueSnackbar(`Error ??????????????? ??????????????????.`, { variant: 'error'})
                }
                props.history.go(-2);
            });
        }
    }
    return(
        <Grid item container justify="space-between" className="board_create_body">
            <Grid item container xs={12} alignItems="center" className="board_create_form_group">
                <Grid item xs={4} className="board_create_title">
                    ????????????
                </Grid>
                <Grid item xs={7}>
                    <select className="board_create_select board_create_form" id="sport" onChange={handleChangeSport} style={{color: !values.sport ? 'rgba(0, 0, 0, 0.34)' : '#000'}}>
                        <option value=''>????????? ????????? ?????????.</option>
                        <optgroup label="?????? / ??????">
                            {sport.map((sport)=>(sport.sport_kind === 1 ?<option value={sport.sport_no}>{sport.sport_name}</option> : null))}
                        </optgroup>
                        <optgroup label="?????? / ????????????">
                            {sport.map((sport)=>(sport.sport_kind === 2 ?<option value={sport.sport_no}>{sport.sport_name}</option> : null))}
                        </optgroup>
                        <optgroup label="?????? / ????????????">
                            {sport.map((sport)=>(sport.sport_kind === 3 ?<option value={sport.sport_no}>{sport.sport_name}</option> : null))}
                        </optgroup>
                        <optgroup label="??????">
                            {sport.map((sport)=>(sport.sport_kind === 4 ?<option value={sport.sport_no}>{sport.sport_name}</option> : null))}
                        </optgroup>
                    </select>
                </Grid>
            </Grid>
            <Grid item container xs={12} alignItems="center" className="board_create_form_group">
                <Grid item xs={4} className="board_create_title">
                    ??????
                </Grid>
                <Grid item xs={7} >
                    <input type="text" className="board_create_input board_create_form" placeholder="????????? ????????? ?????????." value={values.title}  onChange={handleChangeTitle} />
                </Grid>
            </Grid>
            {values.board.map((board, i) => (
            <>
            {!board.img ? 
            <>
            <div className="board_create_file_before" key={i}>
                <div className="board_create_file">
                    <p>?????? ????????? : 600 X 600 ( 1 : 1 ?????? )</p>
                    <label for={`imgFile${i}`}>?????? ????????????</label>
                    <input type="file" id={`imgFile${i}`} onChange={handleChangeImg} accept="image/jpeg,image/jpg,image/png" hidden accessKey={i} />
                </div>
            </div>
            <div className="board_create_file_after_button">
                <button className="board_create_form" disabled={true}>?????? ??????</button>
                <button className="board_create_form" disabled={true}>??????</button>
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
                <button className="board_create_form"><label for={`imgFile${i}`}>?????? ??????</label></button>
                <button className="board_create_form" onClick={() => handleClickRemoveImg(i)}>??????</button>
                <input type="file" id={`imgFile${i}`} onChange={handleChangeImg} accept="image/jpeg,image/jpg,image/png" hidden accessKey={i}/>
            </div>
            {board.point.map((point, j) => (
                <Grid item container justify="space-between" alignItems="center" className="board_create_file_after_point">
                    <Grid item xs={1}><div className="board_create_file_after_point_circle">{j+1}</div></Grid>
                    <Grid item xs={10}><input type="text" value={point.content} onChange={handleChangePointContent} accessKey={`${i},${j}`} className="board_create_file_after_point_input board_create_form" placeholder="????????? ?????? ????????? ????????????." /></Grid>
                    <Grid item xs={1} style={{textAlign: "right"}}><IndeterminateCheckBox fontSize="small" onClick={() => handleClickRemovePoint(i, j)} /></Grid>
                </Grid>
            ))}
            </>}
            <div className="board_create_content">
                <div>
                    <textarea rows={15} className="board_create_form" placeholder="????????? ????????? ?????????." value={board.content} onChange={handleChangeContent} accessKey={i}></textarea>
                </div>
            </div>
            <div className="board_create_keyword" onClick={() => handleClickKeyword(i)}>
                <p className="board_create_keyword_title"># ???????????? ??????????????????.</p>
                {board.keyword.map((keyword) => (
                <div className="board_create_keyword_content"># {keyword} <IconButton aria-label="cancle" size="small"><Close style={{fontSize: '12px', marginBottom: '2.5px'}} /></IconButton></div>
                ))}
            </div>
            </>
            ))}
            {values.board[0].img ? 
            <div className="board_create_file_another">
                <div className="board_create_file_another_form">
                    <p>????????? ????????? ????????? ??????<br/>??? ?????? ????????? ????????? ??? ????????????.</p>
                    <label for={`imgFileNew`}>?????? ?????????</label>
                    <input type="file" id={`imgFileNew`} onChange={handleChangeImg} accept="image/jpeg,image/jpg,image/png" hidden accessKey={values.board.length} />
                </div>
            </div>:null
            }
            {!creating ?
            <div className="board_create_button">
                <button className="board_create_form" disabled={createButton} onClick={handleClickCreate}>????????????</button>
            </div>:
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

export default withRouter(CreateColumn);