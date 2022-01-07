import React, { useState, useEffect } from 'react';
import { Grid, Button, CircularProgress } from '@material-ui/core';
import { Clear } from '@material-ui/icons'
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

const EtcQuestion = (props) => {
    const [cookies] = useCookies('userKey');
    const { enqueueSnackbar } = useSnackbar();
    const [value, setValue] = useState({
        title: '',
        content: ''
    });
    const [createButton, setCreateButton] = useState(false);
    useEffect(() => {
        if(!cookies.userKey){
            enqueueSnackbar(`잘못된 경로입니다.`, { variant: 'error'})
            props.history.replace('/');
        }
    }, []);
    useEffect(() => {
        if(value.title && value.content){
            setCreateButton(false);
        }else{
            setCreateButton(true);
        }
    }, [value])
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
    const handleClickRemoveImage = () => {
        setImg('');
        setImgFile(null);
    }
    const handleChangeValue = (event) => {
        let changeValue = {...value};
        changeValue[event.target.id] = event.target.value;
        setValue(changeValue);
    }
    const [creating, setCreating] = useState(false);
    const handleClickCreate = async() => {
        setCreating(true);
        const formData = new FormData();
        formData.append('title', value.title);
        formData.append('content', value.content);
        formData.append('userKey', cookies.userKey);
        formData.append('imgFile', imgFile);
        const config = {
            headers: {
                "content-type": "multipart/form-data"
            }
        };
        await axios.post(`/api/user/question`, formData, config).then((response)=>{
            console.log(response)
            setTimeout(() => {
                if(response.data.result === 1){
                    enqueueSnackbar(`정상적으로 접수되었습니다.`, { variant: 'info'});
                    props.history.replace(`/etc`);
                }else{
                    enqueueSnackbar(`Error 관리자에게 문의해주세요.`, { variant: 'error'});
                    props.history.replace('/');
                }
            }, [800]);
        });
    }
    return(
        <>
        <div className="user_form">
            <Grid item container alignItems="center">
                <Grid item xs={2} className="pro_info">
                    제목
                </Grid>
                <Grid item xs={10} className="pro_info">
                    <input type="text" placeholder="문의하고자 하는 내용의 키워드를 적어주세요." value={value.title} id="title" onChange={handleChangeValue} />
                </Grid>
            </Grid>
            <Grid item container alignItems="center">
                <Grid item xs={12}>
                    의견 내용
                </Grid>
                <Grid item xs={12}>
                    <textarea placeholder="보내주실 내용을 입력해주세요." rows={15} id='content' value={value.content} onChange={handleChangeValue}></textarea>
                </Grid>
            </Grid>
        </div>
        {!img ? 
        <Grid item container justify="center" alignItems="center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)', padding:'14px 0px'}}>
            <Grid item xs={12} className="question_file">
                <p >스크린샷을 첨부하시면 더욱 원활한 처리가<br/>가능합니다.</p>
                <label for="uploadFile" className="upload_btn"><div>스크린샷 업로드</div></label>
                <input type="file" id="uploadFile" onChange={handleChangeImg} accept="image/jpeg,image/jpg,image/png" hidden/>
            </Grid>
        </Grid>
        :
        <div className="question_img">
            <div onClick={handleClickRemoveImage}><Clear/></div>
            <img src={img} alt=""/>
        </div> 
        }
        <div className="user_form">
            <Grid item xs={12}>
                <p className="upload_infomation">보내주신 소중한 의견은 내부 검토 후 가입하신 이메일로 답변 드리겠습니다.</p>
            </Grid>
            <Grid item xs={12} className="user_form_update_button">
                {!creating ?
                <Button disabled={createButton} className="select_btn" onClick={handleClickCreate}>
                    제출하기
                </Button> :
                <Button  className="select_btn" disabled>
                    <CircularProgress style={{width: '30px', height: '30px'}} />
                </Button>
                }
            </Grid>
        </div>
        </>
    );
}

export default EtcQuestion;