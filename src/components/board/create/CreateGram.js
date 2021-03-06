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
        let file = event.target.files[0];	// ???????????? file??????
        
        // ????????? resize ?????? ?????? (?????? width??? 100px??? ??????)
        const options = { 
            maxSizeMB: 1, 
            maxWidthOrHeight: 500
        }
        
        try {
          const compressedFile = await imageCompression(file, options);
          setImgFile(compressedFile);
          
          // resize??? ???????????? url??? ?????? fileUrl??? ??????
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
                    enqueueSnackbar(`Error ??????????????? ??????????????????.`, { variant: 'error'})
                }
                props.history.go(-2);
            });
        }
    }
    return(
        <Grid item container justify="center" className="board_create_body">
            <Grid item container xs={12} alignItems="center" className="board_create_form_group">
                <Grid item xs={4} className="board_create_title">
                    ????????????
                </Grid>
                <Grid item xs={7}>
                    <select className="board_create_select board_create_form" id="sport" onChange={handleChangeValues} style={{color: !values.sport ? 'rgba(0, 0, 0, 0.34)' : '#000'}}>
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
                    <input type="text" className="board_create_input board_create_form" placeholder="????????? ????????? ?????????." id="title" value={values.title} onChange={handleChangeValues} />
                </Grid>
            </Grid>
            {!img ?
            <>
            <div className="board_create_file_before">
                <div className="board_create_file">
                    <p>?????? ????????? : 600 X 600 ( 1 : 1 ?????? )</p>
                    <label for="imgFile">?????? ????????????</label>
                    <input type="file" id="imgFile" onChange={handleChangeImg} accept="image/jpeg,image/jpg,image/png" hidden />
                </div>
            </div>
            <div className="board_create_file_after_button">
                <button className="board_create_form" disabled={true}>?????? ??????</button>
            </div>
            </>
            :
            <>
            <div className="board_create_file_after" style={{backgroundImage: `url(${img})`}}/>
            <div className="board_create_file_after_button">
                <button className="board_create_form"><label for="imgFile">?????? ??????</label></button>
                <input type="file" id="imgFile" onChange={handleChangeImg} accept="image/jpeg,image/jpg,image/png" hidden />
            </div>
            </>
            }
            <div className="board_create_record">
                <p>?????? ??????</p>
                {values.record.map((record, i) => (
                <Grid item container justify="space-between" alignItems="center" className="board_create_record_form">
                    <Grid xs={4}>
                        <input type="text" className="board_create_form" placeholder="?????? ???" value={record.recordTitle} id="recordTitle" accessKey={i}  onChange={handleChangeValues}/>
                    </Grid>
                    <Grid xs={8}>
                        <input type="text" className="board_create_form" placeholder="????????? ????????? ?????????." value={record.recordContent} id="recordContent" accessKey={i} onChange={handleChangeValues} />
                    </Grid>
                </Grid>
                ))}
            </div>
            <div className="board_create_content">
                <div>
                    <textarea rows={15} className="board_create_form" placeholder="????????? ????????? ?????????." id="content" value={values.content} onChange={handleChangeValues}></textarea>
                </div>
            </div>
            <div className="board_create_keyword" onClick={() => handleClickKeyword()}>
                <p className="board_create_keyword_title"># ???????????? ??????????????????.</p>
                {keyword.map((keyword, i) => (
                <div className="board_create_keyword_content"># {keyword} <IconButton aria-label="cancle" size="small"><Close style={{fontSize: '12px', marginBottom: '2.5px'}} /></IconButton></div>
                ))}
            </div>
            {!creating ?
            <div className="board_create_button">
                <button className="board_create_form" disabled={createButton} onClick={handleClickCreate}>????????????</button>
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
                ??????
            </DialogSave>
        </Grid>
    )
}

export default withRouter(CreateGram);