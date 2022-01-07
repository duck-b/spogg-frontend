import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, IconButton, CircularProgress } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import DialogKeyword from 'components/layout/user/DialogKeyword';
import DialogBack from 'components/layout/user/DialogBack';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';
import imageCompression from 'browser-image-compression';

const UpdateGram = (props) => {
    const [cookies] = useCookies('userKey');
    const { enqueueSnackbar } = useSnackbar();
    const [updating, setUpdating] = useState(false);
    const [backOpen, setBackOpen] = useState(false);
    setTimeout(function(){
        window.onpopstate = function (event) { 
            if(event.state){
                if(!updating){
                    setBackOpen(true);
                }
            }
        }
    }, 100)
    useEffect(() => {
        if(!backOpen){
            window.history.pushState(null, null, '');
        }
    },[backOpen]);
    const [sport, setSport] = useState([{sport_no: '', sport_name: '', sport_kind: ''}]);
    useEffect(() => {
        async function fetchMyAPI(){
            let response = await fetch(`/api/boardGram/${props.match.params.boardId}/update/${cookies.userKey}`)
            response = await response.json();
            if(response.result === 1){
                setSport(response.sport);
                const updateBoard = response.board;
                let updateValue = {};
                updateValue.user_no = updateBoard.user_no;
                updateValue.boardDetail_no = updateBoard.boardDetail_no;
                updateValue.sport = updateBoard.sport_no;
                updateValue.title = updateBoard.board_title;
                updateValue.content = updateBoard.boardDetail_content;
                const boardOption_record = updateBoard.boardOption_record.split(',');
                const recordTitle = updateBoard.board_recordTitle.split(',');
                const recordContent = updateBoard.board_recordContent.split(',');
                updateValue.record = []
                for(let i = 0; i<recordTitle.length; i++){
                    updateValue.record.push({boardOptionNo: boardOption_record[i], recordTitle: recordTitle[i], recordContent: recordContent[i]});
                }
                setValues(updateValue);
                const boardOption_hashtag = updateBoard.boardOption_hashtag?.split(',');
                const hashtag = updateBoard.board_hashtag?.split(',');
                let updateKeyword = []
                for(let i = 0; i<hashtag?.length; i++){
                    if(hashtag[i]){
                        updateKeyword.push({boardOptionNo: boardOption_hashtag[i], keyword: hashtag[i]});
                    }
                }
                setDeleteKeyword(updateKeyword);
                setBeforeImg(updateBoard.board_img);
            }else{
                enqueueSnackbar(`잘못된 경로입니다.`, { variant: 'error'});
                props.history.replace('/');
            }
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
    const [beforeImg, setBeforeImg] = useState('')
    const handleChangeValues = (event) => {
        let changeValue = {...values};
        if(event.target.id === 'recordTitle'){
            changeValue.record[event.target.accessKey].recordTitle = event.target.value;
            changeValue.record[event.target.accessKey].update = true;
        }else if(event.target.id === 'recordContent'){
            if(!isNaN(event.target.value)){
                changeValue.record[event.target.accessKey].recordContent = event.target.value;
                changeValue.record[event.target.accessKey].update = true;
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
    const [deleteKeyword, setDeleteKeyword] = useState([]);
    const handleClickDeleteKeyword = (key) => {
        let deleteWord = [...deleteKeyword];
        deleteWord[key].delete = true;
        setDeleteKeyword(deleteWord);
    }
    const [open, setOpen] = useState(false);
    const handleClickAddKeyword = (word) => {
        let addKeyword = [...keyword];
        addKeyword.push(word);
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
    const [updateButton, setUpdateButton] = useState(true);
    useEffect(() => {
        if(!values.sport || !values.title || !values.record[0].recordTitle || !values.record[0].recordContent){
            setUpdateButton(true);
            return false;
        }else if(!imgFile && !beforeImg){
            setUpdateButton(true);
            return false;
        }else{
            setUpdateButton(false)
        }
    },[values, imgFile, beforeImg])
    const handleClickUpdate = async() => {
        if(!values.sport || !values.title || !values.record[0].recordTitle || !values.record[0].recordContent){
            enqueueSnackbar(`내용을 확인해주세요.`, { variant: 'error'});
            setUpdateButton(true);
            return false;
        }else if(!imgFile && !beforeImg){
            enqueueSnackbar(`사진을 확인해주세요.`, { variant: 'error'});
            setUpdateButton(true);
            return false;
        }else{
            const formData = new FormData();
            formData.append('userKey', cookies.userKey);
            formData.append('user_no', values.user_no);
            formData.append('sport_no', values.sport);
            formData.append('board_title', values.title);
            formData.append('boardDetail_no', values.boardDetail_no);
            formData.append('board_content', values.content);
            formData.append('imgFile', imgFile);
            for(let i = 0; i < values.record.length; i++){
                if(values.record[i].update){
                    formData.append('recordChange[]', values.record[i].boardOptionNo);
                    formData.append('recordTitle[]', values.record[i].recordTitle);
                    formData.append('recordContent[]', values.record[i].recordContent);
                }
            }
            for(let i = 0; i < keyword.length; i++){
                formData.append('keyword[]', keyword[i]);
            }
            for(let i = 0; i < deleteKeyword.length; i++){
                if(deleteKeyword[i].delete){
                    formData.append('deleteKeyword[]', deleteKeyword[i].boardOptionNo)
                }
            }
            const config = {
                headers: {
                    "content-type": "multipart/form-data"
                }
            };
            await axios.post(`/api/boardGram/${props.match.params.boardId}/update`, formData, config).then((response)=>{
                setUpdating(true);
                setTimeout(() => {
                    if(!response.data.result){
                        enqueueSnackbar(`잘못된 경로입니다.`, { variant: 'error'});
                    }
                    props.history.go(-2);
                }, [1500])
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
                            {sport.map((sport)=>(sport.sport_kind === 1 ?<option value={sport.sport_no} selected={sport.sport_no === values.sport ? true : false}>{sport.sport_name}</option> : null))}
                        </optgroup>
                        <optgroup label="헬스 / 피트니스">
                            {sport.map((sport)=>(sport.sport_kind === 2 ?<option value={sport.sport_no} selected={sport.sport_no === values.sport ? true : false}>{sport.sport_name}</option> : null))}
                        </optgroup>
                        <optgroup label="레저 / 생활체육">
                            {sport.map((sport)=>(sport.sport_kind === 3 ?<option value={sport.sport_no} selected={sport.sport_no === values.sport ? true : false}>{sport.sport_name}</option> : null))}
                        </optgroup>
                        <optgroup label="기타">
                            {sport.map((sport)=>(sport.sport_kind === 4 ?<option value={sport.sport_no} selected={sport.sport_no === values.sport ? true : false}>{sport.sport_name}</option> : null))}
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
                !beforeImg ?
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
            <div className="board_create_file_after" style={{backgroundImage: `url(${beforeImg})`}} />
            <div className="board_create_file_after_button">
                <button className="board_create_form"><label for="imgFile">사진 변경</label></button>
                <input type="file" id="imgFile" onChange={handleChangeImg} accept="image/jpeg,image/jpg,image/png" hidden />
            </div>
            </>
            :
            <>
            <div className="board_create_file_after" style={{backgroundImage: `url(${img})`}} />
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
                {deleteKeyword.map((keyword, i) => (
                    !keyword.delete ?
                <div className="board_create_keyword_content"># {keyword.keyword} <IconButton aria-label="cancle" size="small"><Close style={{fontSize: '12px', marginBottom: '2.5px'}} /></IconButton></div>
                    :null
                ))}
                {keyword.map((keyword, i) => (
                <div className="board_create_keyword_content"># {keyword} <IconButton aria-label="cancle" size="small"><Close style={{fontSize: '12px', marginBottom: '2.5px'}} /></IconButton></div>
                ))}
            </div>
            { !updating ?
            <div className="board_create_button">
                <button className="board_create_form" disabled={updateButton} onClick={handleClickUpdate}>수정완료</button>
            </div>:
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
            >
                {deleteKeyword.map((keyword, i) => (
                    !keyword.delete ?
                    <div className="board_create_keyword_content"># {keyword.keyword} <IconButton aria-label="cancle" size="small" onClick={() => handleClickDeleteKeyword(i)}><Close style={{fontSize: '12px', marginBottom: '2.5px'}} /></IconButton></div>
                    :null
                ))}
                {keyword.map((keyword, i) => (
                <div className="board_create_keyword_content"># {keyword} <IconButton aria-label="cancle" size="small" onClick={() => handleClickRemoveKeyword(i)}><Close style={{fontSize: '12px', marginBottom: '2.5px'}} /></IconButton></div>
                ))}
            </DialogKeyword>
            <DialogBack
                open={backOpen}
                handleClose={() => setBackOpen(false)}
            />
        </Grid>
    )
}

export default withRouter(UpdateGram);