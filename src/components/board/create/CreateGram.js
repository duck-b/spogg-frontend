import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, IconButton, CircularProgress } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import DialogKeyword from 'components/layout/user/DialogKeyword';
import DialogSave from 'components/layout/user/DialogSave';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';
import imageCompression from 'browser-image-compression';

const CreateGram = (props) => {
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
        sport: 0,
        title: '',
        record: [
            {recordTitle: '', recordContent: ''},
            {recordTitle: '', recordContent: ''},
            {recordTitle: '', recordContent: ''},
            {recordTitle: '', recordContent: ''}
        ],
        content: ''
    });
    const handleChangeValues = (event) => {
        let changeValue = {...values};
        if(event.target.id === 'recordTitle'){
            changeValue.record[event.target.accessKey].recordTitle = event.target.value.split(',').join('');
        }else if(event.target.id === 'recordContent'){
            if(!isNaN(event.target.value)){
                changeValue.record[event.target.accessKey].recordContent = event.target.value;
            }
        }else{
            changeValue[event.target.id] = event.target.value;
        }
        setValues(changeValue);
    }

    const [img, setImg] = useState('');
    const [imgFile, setImgFile] = useState(null);
    const handleChangeImg = async (event) => {
        let file = event.target.files[0];	// 입력받은 file객체
        
        // 이미지 resize 옵션 설정 (최대 width을 100px로 지정)
        const options = { 
            maxSizeMB: 1, 
            maxWidthOrHeight: 500
        }
        
        try {
          const compressedFile = await imageCompression(file, options);
          setImgFile(compressedFile);
          
          // resize된 이미지의 url을 받아 fileUrl에 저장
          const promise = imageCompression.getDataUrlFromFile(compressedFile);
          promise.then(result => {
            setImg(result);
          })
        } catch (error) {
            console.log(error);
        }
    }
    const [keyword, setKeyword] = useState([]);
    const [open, setOpen] = useState(false);
    const handleClickAddKeyword = (word) => {
        let addKeyword = [...keyword];
        addKeyword.push(word.split(',').join(''));
        setKeyword(addKeyword);
    }
    const handleClickRemoveKeyword = (key) => {
        let removeKeyword = [...keyword];
        removeKeyword.splice(key, 1);
        setKeyword(removeKeyword);
    }
    const handleClickKeyword = (key) => {
        window.history.pushState(null, null, '');
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const [createButton, setCreateButton] = useState(true);
    useEffect(() => {
        if(!values.sport || !values.title || !values.record[0].recordTitle || !values.record[0].recordContent){
            setCreateButton(true);
            return false;
        }else if(!imgFile){
            setCreateButton(true);
            return false;
        }else{
            setCreateButton(false)
        }
    },[values, imgFile])
    const handleClickCreate = async() => {
        if(!values.sport || !values.title || !values.record[0].recordTitle || !values.record[0].recordContent){
            setCreateButton(true);
            return false;
        }else if(!imgFile){
            setCreateButton(true);
            return false;
        }else{
            setCreating(true);
            const formData = new FormData();
            formData.append('userKey', cookies.userKey);
            formData.append('board_kind', props.match.params.boardKind);
            formData.append('sport_no', values.sport);
            formData.append('board_title', values.title);
            formData.append('board_content', values.content);
            formData.append('imgFile', imgFile);
            formData.append('board_complete', 1);
            for(let i = 0; i < values.record.length; i++){
                formData.append('recordTitle[]', values.record[i].recordTitle);
                formData.append('recordContent[]', values.record[i].recordContent);
            }
            for(let i = 0; i < keyword.length; i++){
                formData.append('keyword[]', keyword[i]);
            }
            const config = {
                headers: {
                    "content-type": "multipart/form-data"
                }
            };
            await axios.post("/api/boardGram/create", formData, config).then((response)=>{
                if(!response.data.result){
                    enqueueSnackbar(`Error 관리자에게 문의해주세요.`, { variant: 'error'})
                }
                props.history.go(-2);
            });
        }
    }
    return(
        <Grid item container justify="center" className="board_create_body">
            <Grid item container xs={12} alignItems="center" className="board_create_form_group">
                <Grid item xs={4} className="board_create_title">
                    카테고리
                </Grid>
                <Grid item xs={7}>
                    <select className="board_create_select board_create_form" id="sport" onChange={handleChangeValues} style={{color: !values.sport ? 'rgba(0, 0, 0, 0.34)' : '#000'}}>
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
                    <input type="text" className="board_create_input board_create_form" placeholder="제목을 입력해 주세요." id="title" value={values.title} onChange={handleChangeValues} />
                </Grid>
            </Grid>
            {!img ?
            <>
            <div className="board_create_file_before">
                <div className="board_create_file">
                    <p>권장 사이즈 : 600 X 600 ( 1 : 1 비율 )</p>
                    <label for="imgFile">사진 추가하기</label>
                    <input type="file" id="imgFile" onChange={handleChangeImg} accept="image/jpeg,image/jpg,image/png" hidden />
                </div>
            </div>
            <div className="board_create_file_after_button">
                <button className="board_create_form" disabled={true}>사진 변경</button>
            </div>
            </>
            :
            <>
            <div className="board_create_file_after" style={{backgroundImage: `url(${img})`}}/>
            <div className="board_create_file_after_button">
                <button className="board_create_form"><label for="imgFile">사진 변경</label></button>
                <input type="file" id="imgFile" onChange={handleChangeImg} accept="image/jpeg,image/jpg,image/png" hidden />
            </div>
            </>
            }
            <div className="board_create_record">
                <p>기록 입력</p>
                {values.record.map((record, i) => (
                <Grid item container justify="space-between" alignItems="center" className="board_create_record_form">
                    <Grid xs={4}>
                        <input type="text" className="board_create_form" placeholder="기록 명" value={record.recordTitle} id="recordTitle" accessKey={i}  onChange={handleChangeValues}/>
                    </Grid>
                    <Grid xs={8}>
                        <input type="text" className="board_create_form" placeholder="기록을 입력해 주세요." value={record.recordContent} id="recordContent" accessKey={i} onChange={handleChangeValues} />
                    </Grid>
                </Grid>
                ))}
            </div>
            <div className="board_create_content">
                <div>
                    <textarea rows={15} className="board_create_form" placeholder="내용을 입력해 주세요." id="content" value={values.content} onChange={handleChangeValues}></textarea>
                </div>
            </div>
            <div className="board_create_keyword" onClick={() => handleClickKeyword()}>
                <p className="board_create_keyword_title"># 키워드를 입력해주세요.</p>
                {keyword.map((keyword, i) => (
                <div className="board_create_keyword_content"># {keyword} <IconButton aria-label="cancle" size="small"><Close style={{fontSize: '12px', marginBottom: '2.5px'}} /></IconButton></div>
                ))}
            </div>
            {!creating ?
            <div className="board_create_button">
                <button className="board_create_form" disabled={createButton} onClick={handleClickCreate}>등록완료</button>
            </div>
            :
            <div className="board_create_button">
                <button className="board_create_form" disabled={true} >
                    <CircularProgress style={{width: '30px', height: '30px'}} />
                </button>
            </div>
            }
            <DialogKeyword 
                open={open}
                handleClose={handleClose}
                handleOpen={() => setOpen(true)}
                handleClickAddKeyword={handleClickAddKeyword}
            >
                {keyword.map((keyword, i) => (
                <div className="board_create_keyword_content"># {keyword} <IconButton aria-label="cancle" size="small" onClick={() => handleClickRemoveKeyword(i)}><Close style={{fontSize: '12px', marginBottom: '2.5px'}} /></IconButton></div>
                ))}
            </DialogKeyword>
            <DialogSave
                open={saveOpen}
                handleClose={() => setSaveOpen(false)}
                handleClickCreate={handleClickCreate}
            >
                저장
            </DialogSave>
        </Grid>
    )
}

export default withRouter(CreateGram);