import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, FormControl, InputLabel, Input, Select, InputAdornment, IconButton, Button, Avatar, CircularProgress, Chip } from '@material-ui/core';
import { AddAPhoto, AddCircle } from '@material-ui/icons'
import { useSnackbar } from 'notistack';
import axios from 'axios';

import { DialogMsg } from 'components/layout/admin'

const useStyles = makeStyles((theme) => ({
    root: {
        
    },
    paper: {
        padding: '10px'
    },
    title: {
        textAlign: 'center',
        margin: '20px',
        fontSize: '120%',
        fontWeight: 'bold'
    },
    form: {
        width: '100%',
        marginBottom: '12px',
    },
    buttonGroup: {
        textAlign: 'right',
        marginTop: '10px',
        marginBottom: '10px'
    },
    buttonOption: {
        marginLeft: '5px',
        width: '50px',
    },
    buttonSwich:{
        marginRight: '0px'
    },
    buttonIcon: {
        textAlign: 'right',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    formTitle: {
        width: '100%',
        marginBottom: '12px',
        color: 'rgba(0, 0, 0, 0.54)',
        
    },
    pointer: {
        cursor: 'pointer'
    },
    hrStyle: {
        color: 'rgba(0, 0, 0, 0.42)'
    },
    large: {
        width: theme.spacing(9),
        height: theme.spacing(9),
    },
    imageTitle: {
        color: "red"
    },
    imageTitleBar: {
        background: 'none',
    },
    gridList: {
        /*flexWrap: 'nowrap',
        transform: 'translateZ(0)',*/
        width: "100%"
    },
    imageList: {
        width: "100%",
        height: "100%",
        marginRight: "2px"
    },
    keyword : {
        marginRight: "5px",
        marginBottom: "10px"
    },
    secondTitle: {
        marginTop: "20px",
        marginBottom: "5px"
    }
}));

const SportUpdate = (props) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const [values, setValues] = useState({
        kind: '',
        name: ''
    });
    const [progress, setProgress] = useState(false);
    const [deleteKeyword, setDeleteKeyword] = useState({
        keyword1: [],
        keyword2: [],
        keyword3: [],
        keyword4: [],
        keyword5: [],
        keyword6: [],
        keyword7: [],
        keyword8: [],
        keyword9: [],
        keyword10: [],
        keyword11: [],
    });
    const [deleteNo, setDeleteNo] = useState([]);
    useEffect(() => {
        async function fetchMyAPI(){
            if(await fetch(`/api/admin/sport/${props.match.params.sportId}/update`)){
                let response = await fetch(`/api/admin/sport/${props.match.params.sportId}/update`);
                response = await response.json();
                if(response.result === 1){
                    setValues({kind: response.data.sport_kind, name: response.data.sport_name, icon: response.data.sport_icon, icon2: response.data.sport_icon2, background: response.data.sport_background});
                    if(response.keyword){
                        let loadKeyword = {
                            keyword1: [],
                            keyword2: [],
                            keyword3: [],
                            keyword4: [],
                            keyword5: [],
                            keyword6: [],
                            keyword7: [],
                            keyword8: [],
                            keyword9: [],
                            keyword10: [],
                            keyword11: [],
                        };
                        for(let i = 0; i < response.keyword.length; i++){
                            loadKeyword[`keyword${response.keyword[i].sportDetail_page}`].push({
                                no: response.keyword[i].sportDetail_no,
                                word: response.keyword[i].sportDetail_keyword,
                                delete: false
                            });
                        }
                        setDeleteNo([]);
                        setDeleteKeyword(loadKeyword);
                    }
                }else{
                    enqueueSnackbar(`잘못된 경로입니다.`, { variant: 'error'});
                    props.history.push('/admin/sport');
                }
            }
          }
        fetchMyAPI();
    }, []);
    
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const [iconBase64, setIconBase64] = useState('');
    const [iconFile, setIconFile] = useState(null);	//파일	
  
    const handleChangeIcon = (event) => {
      let reader = new FileReader();
  
      reader.onloadend = () => {
        // 2. 읽기가 완료되면 아래코드가 실행됩니다.
        const base64 = reader.result;
        if (base64) {
            setIconBase64(base64.toString()); // 파일 base64 상태 업데이트
        }
      }
      if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
        setIconFile(event.target.files[0]); // 파일 상태 업데이트
      }
    }

    const [icon2Base64, setIcon2Base64] = useState('');
    const [icon2File, setIcon2File] = useState(null);	//파일	
  
    const handleChangeIcon2 = (event) => {
      let reader = new FileReader();
  
      reader.onloadend = () => {
        // 2. 읽기가 완료되면 아래코드가 실행됩니다.
        const base64 = reader.result;
        if (base64) {
            setIcon2Base64(base64.toString()); // 파일 base64 상태 업데이트
        }
      }
      if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
        setIcon2File(event.target.files[0]); // 파일 상태 업데이트
      }
    }

    const [backgroundBase64, setBackgroundBase64] = useState('');
    const [backgroundFile, setBackgroundFile] = useState(null);	//파일	
  
    const handleChangeBackground = (event) => {
      let reader = new FileReader();
  
      reader.onloadend = () => {
        // 2. 읽기가 완료되면 아래코드가 실행됩니다.
        const base64 = reader.result;
        if (base64) {
            setBackgroundBase64(base64.toString()); // 파일 base64 상태 업데이트
        }
      }
      if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
        setBackgroundFile(event.target.files[0]); // 파일 상태 업데이트
      }
    }
   
    const handleClickCancle = () => {
        props.history.push(`/admin/sport/${props.match.params.sportId}`);
    }
    const [keyword, setKeyword] = useState({
        keyword1:[],
        keyword2:[],
        keyword3:[],
        keyword4:[],
        keyword5:[],
        keyword6:[],
        keyword7:[],
        keyword8:[],
        keyword9:[],
        keyword10:[],
        keyword11:[],
    });
    
    const [addKeyword, setAddKeyword] = useState({
        keyword1: '',
        keyword2: '',
        keyword3: '',
        keyword4: '',
        keyword5: '',
        keyword6: '',
        keyword7: '',
        keyword8: '',
        keyword9: '',
        keyword10: '',
        keyword11: '',
    });
    const handleChangeKeyword = (prop) => (event) => {
        setAddKeyword({ ...addKeyword, [prop]: event.target.value });
    }
    const handleClickAddKeyword = (key) => {
        if(addKeyword[key]){
            const updateKeyword = {...keyword};
            updateKeyword[key].push(addKeyword[key]);
            setKeyword(updateKeyword);
            setAddKeyword({...addKeyword, [key]: ''});
        }
    }
    const handleKeyPress = (event) => {
        if(event.key === "Enter"){
            handleClickAddKeyword(event.target.id);
        }
    }
    const handleClickDeleteKeyword = (i, key) => {
        let deleteWord = {...deleteKeyword};
        deleteWord[key][i].delete = true;
        let addDeleteNo = [...deleteNo];
        addDeleteNo.push(deleteWord[key][i].no);
        setDeleteKeyword(deleteWord);
        setDeleteNo(addDeleteNo);
    }
    const handleClickRemoveKeyword = (i, key) => {
        const removeKeyword = {...keyword};
        removeKeyword[key].splice(i, 1);
        setKeyword(removeKeyword);
    }

    const handleClickUpdate = async() => {
        if(!values.kind){
            enqueueSnackbar(`대분류를 확인해 주세요.`, { variant: 'error'});
            return false;
        }else if(!values.name){
            enqueueSnackbar(`종목 명을 확인해 주세요.`, { variant: 'error'});
            return false;
        }else{
            setProgress(true);
            const formData = new FormData();
            if(iconFile){
                formData.append('images[]', iconFile);
                formData.append('imagesKind[]', 'icon');
            }
            if(icon2File){
                formData.append('images[]', icon2File);
                formData.append('imagesKind[]', 'icon2');
            }
            if(backgroundFile){
                formData.append('images[]', backgroundFile);
                formData.append('imagesKind[]', 'background');
            }
            formData.append('kind', values.kind);
            formData.append('name', values.name);
            for(let i = 0; i < 11; i++){
                if(keyword[`keyword${(i+1)}`][0]){
                    for(let j = 0; j < keyword[`keyword${(i+1)}`].length; j++){
                        formData.append(`keyword[${i}][]`, keyword[`keyword${(i+1)}`][j]);
                    }
                }else{
                    formData.append(`keyword[${i}][]`, '');
                }
            }
            for(let i = 0; i < deleteNo.length; i++){
                formData.append('deleteKeyword[]', deleteNo[i])
            }
            const config = {
                headers: {
                    "content-type": "multipart/form-data"
                }
            };
            await axios.post(`/api/admin/sport/${props.match.params.sportId}/update`, formData, config).then((response)=>{
                if(response.data.result){
                    setTimeout(function(){
                        enqueueSnackbar(`수정이 완료되었습니다.`, { variant: 'success'});
                        props.history.push(`/admin/sport/${props.match.params.sportId}`);
                    },1000);
                }else{
                    enqueueSnackbar(`Error`, { variant: 'error'});
                }
            });
        } 
    }
    
    const [openCancle, setOpenCancle] = useState(false);
    const handleCloseCancle = () => {
        setOpenCancle(false);
    };
    
    return(
        <>
        <Grid className={classes.root}> 
            <Paper className={classes.paper}>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={4}>
                        <div  className={classes.title}>종목 수정</div>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={4}>
                        <FormControl required className={classes.form}>
                            <InputLabel htmlFor="sportKind">대분류</InputLabel>
                            <Select
                            native
                            value={values.kind}
                            onChange={handleChange('kind')}
                            inputProps={{
                                name: 'kind',
                                id: 'sportKind',
                            }}
                            >
                                <option aria-label="None" value="" />
                                <option value={1}>구기 / 라켓</option>
                                <option value={2}>헬스 / 피트니스</option>
                                <option value={3}>레저 / 생활체육</option>
                                <option value={4}>기타</option>
                            </Select>
                        </FormControl>
                        <FormControl required className={classes.form}>
                            <InputLabel htmlFor="sportName">종목 명</InputLabel>
                            <Input
                                id="sportName"
                                type="text"
                                value={values.name}
                                onChange={handleChange('name')}
                            />
                        </FormControl>
                        <FormControl className={classes.form}>
                            <Grid container>
                                <Grid xs={6} className={classes.formTitle}>
                                    <div>아이콘 *</div>
                                </Grid>
                                <Grid xs={6} className={classes.buttonIcon}>
                                    <label for="imgLogo" className={classes.pointer}><AddAPhoto /></label>
                                    <input type="file" id="imgLogo" onChange={handleChangeIcon} accept="image/jpeg,image/jpg,image/png" hidden/>
                                </Grid>
                                <Grid xs={12}>
                                {
                                iconBase64 ?
                                    <Avatar variant="square" src={iconBase64} className={classes.large} />:
                                    values.icon ?
                                    <Avatar variant="square" src={values.icon} className={classes.large} />:
                                    <Avatar variant="square" className={classes.large}>No Icon</Avatar>
                                }
                                </Grid>
                            </Grid>
                        </FormControl>
                        <FormControl className={classes.form}>
                            <Grid container>
                                <Grid xs={6} className={classes.formTitle}>
                                    <div>아이콘2 *</div>
                                </Grid>
                                <Grid xs={6} className={classes.buttonIcon}>
                                    <label for="imgLogo2" className={classes.pointer}><AddAPhoto /></label>
                                    <input type="file" id="imgLogo2" onChange={handleChangeIcon2} accept="image/jpeg,image/jpg,image/png" hidden/>
                                </Grid>
                                <Grid xs={12}>
                                {
                                icon2Base64 ?
                                    <Avatar variant="square" src={icon2Base64} className={classes.large} />:
                                    values.icon2 ?
                                    <Avatar variant="square" src={values.icon2} className={classes.large} />:
                                    <Avatar variant="square" className={classes.large}>No Icon2</Avatar>
                                }
                                </Grid>
                            </Grid>
                        </FormControl>
                        <FormControl className={classes.form}>
                            <Grid container>
                                <Grid xs={6} className={classes.formTitle}>
                                    <div>배경 *</div>
                                </Grid>
                                <Grid xs={6} className={classes.buttonIcon}>
                                    <label for="imgBackground" className={classes.pointer}><AddAPhoto /></label>
                                    <input type="file" id="imgBackground" onChange={handleChangeBackground} accept="image/jpeg,image/jpg,image/png" hidden/>
                                </Grid>
                                <Grid xs={12}>
                                {
                                backgroundBase64 ?
                                    <img src={backgroundBase64}  style={{width: '100%'}}/>:
                                    values.background ?
                                    <img src={values.background}  style={{width: '100%'}}/>:
                                    <Avatar variant="square" className={classes.large}>No Backgound</Avatar>
                                }
                                </Grid>
                            </Grid>
                        </FormControl>
                        <Grid xs={12}>
                            <FormControl className={classes.form}>
                                <InputLabel htmlFor="keyword1">추천 기록</InputLabel>
                                <Input
                                    id="keyword1"
                                    type="text"
                                    value={addKeyword.keyword1}
                                    onChange={handleChangeKeyword("keyword1")}
                                    onKeyPress={handleKeyPress}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => handleClickAddKeyword("keyword1")}
                                            edge="end"
                                            >
                                                <AddCircle />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            {deleteKeyword.keyword1.map((txt, i) => (
                            !txt.delete?
                            <Chip label={`# ${txt.word}`} onDelete={() => handleClickDeleteKeyword(i, "keyword1")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>:
                            null
                            ))}
                            {keyword.keyword1.map((txt, i) => (
                            <Chip label={`# ${txt}`} onDelete={() => handleClickRemoveKeyword(i, "keyword1")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>
                            ))}
                        </Grid>
                        <div className={classes.secondTitle}>
                            <b>게시판 별 키워드</b>
                        </div>
                        <Grid xs={12}>
                            <FormControl className={classes.form}>
                                <InputLabel htmlFor="keyword2">상품 연계</InputLabel>
                                <Input
                                    id="keyword2"
                                    type="text"
                                    value={addKeyword.keyword2}
                                    onChange={handleChangeKeyword("keyword2")}
                                    onKeyPress={handleKeyPress}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => handleClickAddKeyword("keyword2")}
                                            edge="end"
                                            >
                                                <AddCircle />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            {deleteKeyword.keyword2.map((txt, i) => (
                            !txt.delete?
                            <Chip label={`# ${txt.word}`} onDelete={() => handleClickDeleteKeyword(i, "keyword2")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>:
                            null
                            ))}
                            {keyword.keyword2.map((txt, i) => (
                            <Chip label={`# ${txt}`} onDelete={() => handleClickRemoveKeyword(i, "keyword2")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>
                            ))}
                        </Grid>
                        <Grid xs={12}>
                            <FormControl className={classes.form}>
                                <InputLabel htmlFor="keyword3">상품 리뷰</InputLabel>
                                <Input
                                    id="keyword3"
                                    type="text"
                                    value={addKeyword.keyword3}
                                    onChange={handleChangeKeyword("keyword3")}
                                    onKeyPress={handleKeyPress}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => handleClickAddKeyword("keyword3")}
                                            edge="end"
                                            >
                                                <AddCircle />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            {deleteKeyword.keyword3.map((txt, i) => (
                            !txt.delete?
                            <Chip label={`# ${txt.word}`} onDelete={() => handleClickDeleteKeyword(i, "keyword3")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>:
                            null
                            ))}
                            {keyword.keyword3.map((txt, i) => (
                            <Chip label={`# ${txt}`} onDelete={() => handleClickRemoveKeyword(i, "keyword3")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>
                            ))}
                        </Grid>
                        <Grid xs={12}>
                            <FormControl className={classes.form}>
                                <InputLabel htmlFor="keyword4">기록</InputLabel>
                                <Input
                                    id="keyword4"
                                    type="text"
                                    value={addKeyword.keyword4}
                                    onChange={handleChangeKeyword("keyword4")}
                                    onKeyPress={handleKeyPress}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => handleClickAddKeyword("keyword4")}
                                            edge="end"
                                            >
                                                <AddCircle />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            {deleteKeyword.keyword4.map((txt, i) => (
                            !txt.delete?
                            <Chip label={`# ${txt.word}`} onDelete={() => handleClickDeleteKeyword(i, "keyword4")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>:
                            null
                            ))}
                            {keyword.keyword4.map((txt, i) => (
                            <Chip label={`# ${txt}`} onDelete={() => handleClickRemoveKeyword(i, "keyword4")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>
                            ))}
                        </Grid>
                        <Grid xs={12}>
                            <FormControl className={classes.form}>
                                <InputLabel htmlFor="keyword5">영상 기록</InputLabel>
                                <Input
                                    id="keyword5"
                                    type="text"
                                    value={addKeyword.keyword5}
                                    onChange={handleChangeKeyword("keyword5")}
                                    onKeyPress={handleKeyPress}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => handleClickAddKeyword("keyword5")}
                                            edge="end"
                                            >
                                                <AddCircle />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            {deleteKeyword.keyword5.map((txt, i) => (
                            !txt.delete?
                            <Chip label={`# ${txt.word}`} onDelete={() => handleClickDeleteKeyword(i, "keyword5")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>:
                            null
                            ))}
                            {keyword.keyword5.map((txt, i) => (
                            <Chip label={`# ${txt}`} onDelete={() => handleClickRemoveKeyword(i, "keyword5")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>
                            ))}
                        </Grid>
                        <Grid xs={12}>
                            <FormControl className={classes.form}>
                                <InputLabel htmlFor="keyword6">전문가 칼럼</InputLabel>
                                <Input
                                    id="keyword6"
                                    type="text"
                                    value={addKeyword.keyword6}
                                    onChange={handleChangeKeyword("keyword6")}
                                    onKeyPress={handleKeyPress}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => handleClickAddKeyword("keyword6")}
                                            edge="end"
                                            >
                                                <AddCircle />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            {deleteKeyword.keyword6.map((txt, i) => (
                            !txt.delete?
                            <Chip label={`# ${txt.word}`} onDelete={() => handleClickDeleteKeyword(i, "keyword6")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>:
                            null
                            ))}
                            {keyword.keyword6.map((txt, i) => (
                            <Chip label={`# ${txt}`} onDelete={() => handleClickRemoveKeyword(i, "keyword6")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>
                            ))}
                        </Grid>
                        <Grid xs={12}>
                            <FormControl className={classes.form}>
                                <InputLabel htmlFor="keyword7">중고 거래</InputLabel>
                                <Input
                                    id="keyword7"
                                    type="text"
                                    value={addKeyword.keyword7}
                                    onChange={handleChangeKeyword("keyword7")}
                                    onKeyPress={handleKeyPress}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => handleClickAddKeyword("keyword7")}
                                            edge="end"
                                            >
                                                <AddCircle />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            {deleteKeyword.keyword7.map((txt, i) => (
                            !txt.delete?
                            <Chip label={`# ${txt.word}`} onDelete={() => handleClickDeleteKeyword(i, "keyword7")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>:
                            null
                            ))}
                            {keyword.keyword7.map((txt, i) => (
                            <Chip label={`# ${txt}`} onDelete={() => handleClickRemoveKeyword(i, "keyword7")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>
                            ))}
                        </Grid>
                        <Grid xs={12}>
                            <FormControl className={classes.form}>
                                <InputLabel htmlFor="keyword8">용품</InputLabel>
                                <Input
                                    id="keyword8"
                                    type="text"
                                    value={addKeyword.keyword8}
                                    onChange={handleChangeKeyword("keyword8")}
                                    onKeyPress={handleKeyPress}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => handleClickAddKeyword("keyword8")}
                                            edge="end"
                                            >
                                                <AddCircle />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            {deleteKeyword.keyword8.map((txt, i) => (
                            !txt.delete?
                            <Chip label={`# ${txt.word}`} onDelete={() => handleClickDeleteKeyword(i, "keyword8")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>:
                            null
                            ))}
                            {keyword.keyword8.map((txt, i) => (
                            <Chip label={`# ${txt}`} onDelete={() => handleClickRemoveKeyword(i, "keyword8")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>
                            ))}
                        </Grid>
                        <Grid xs={12}>
                            <FormControl className={classes.form}>
                                <InputLabel htmlFor="keyword9">레슨</InputLabel>
                                <Input
                                    id="keyword9"
                                    type="text"
                                    value={addKeyword.keyword9}
                                    onChange={handleChangeKeyword("keyword9")}
                                    onKeyPress={handleKeyPress}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => handleClickAddKeyword("keyword9")}
                                            edge="end"
                                            >
                                                <AddCircle />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            {deleteKeyword.keyword9.map((txt, i) => (
                            !txt.delete?
                            <Chip label={`# ${txt.word}`} onDelete={() => handleClickDeleteKeyword(i, "keyword9")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>:
                            null
                            ))}
                            {keyword.keyword9.map((txt, i) => (
                            <Chip label={`# ${txt}`} onDelete={() => handleClickRemoveKeyword(i, "keyword9")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>
                            ))}
                        </Grid>
                        <Grid xs={12}>
                            <FormControl className={classes.form}>
                                <InputLabel htmlFor="keyword10">구장</InputLabel>
                                <Input
                                    id="keyword10"
                                    type="text"
                                    value={addKeyword.keyword10}
                                    onChange={handleChangeKeyword("keyword10")}
                                    onKeyPress={handleKeyPress}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => handleClickAddKeyword("keyword10")}
                                            edge="end"
                                            >
                                                <AddCircle />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            {deleteKeyword.keyword10.map((txt, i) => (
                            !txt.delete?
                            <Chip label={`# ${txt.word}`} onDelete={() => handleClickDeleteKeyword(i, "keyword10")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>:
                            null
                            ))}
                            {keyword.keyword10.map((txt, i) => (
                            <Chip label={`# ${txt}`} onDelete={() => handleClickRemoveKeyword(i, "keyword10")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>
                            ))}
                        </Grid>
                        <Grid xs={12}>
                            <FormControl className={classes.form}>
                                <InputLabel htmlFor="keyword11">대회</InputLabel>
                                <Input
                                    id="keyword11"
                                    type="text"
                                    value={addKeyword.keyword11}
                                    onChange={handleChangeKeyword("keyword11")}
                                    onKeyPress={handleKeyPress}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => handleClickAddKeyword("keyword11")}
                                            edge="end"
                                            >
                                                <AddCircle />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            {deleteKeyword.keyword11.map((txt, i) => (
                            !txt.delete?
                            <Chip label={`# ${txt.word}`} onDelete={() => handleClickDeleteKeyword(i, "keyword11")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small"/>:
                            null
                            ))}
                            {keyword.keyword11.map((txt, i) => (
                            <Chip label={`# ${txt}`} onDelete={() => handleClickRemoveKeyword(i, "keyword11")} key={i} color="primary" className={classes.keyword} variant="outlined" size="small" />
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={4} className={classes.buttonGroup}>
                        {!progress ?
                        <>
                        <Button variant="contained" className={classes.buttonOption} onClick={() => setOpenCancle(true)}>
                        취소
                        </Button>
                        <Button variant="contained" color="primary" className={classes.buttonOption} onClick={handleClickUpdate}>
                        수정
                        </Button>
                        </>
                        :
                        <CircularProgress />
                        }
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
        <DialogMsg 
            open={openCancle}
            title="수정을 취소합니다."
            btn="확인"
            handleClick={handleClickCancle}
            handleClose={handleCloseCancle}
        >
            &nbsp;'확인' 버튼 클릭 시 종목 수정이 취소가되며, 입력한 내용은 저장되지 않습니다.<br/>
            종목 정보 페이지로 이동합니다.
        </DialogMsg>
        </>
    );
}

export default SportUpdate;