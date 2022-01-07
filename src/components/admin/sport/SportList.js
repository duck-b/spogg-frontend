import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Button, FormControl, InputLabel, Input, Select, Avatar, TextField, InputAdornment } from '@material-ui/core';
import { SportsBaseball, AddAPhoto, Search } from '@material-ui/icons';
import { DataGrid } from '@material-ui/data-grid';
import axios from 'axios';
import { useSnackbar } from 'notistack';

import { DialogMsg } from 'components/layout/admin'

const useStyles = makeStyles((theme) => ({
    root: {
      
    },
    paper: {
      
    },
    buttonGroup: {
        textAlign: 'right',
        marginBottom: '5px',
    },
    buttonOption: {
        marginLeft: '5px',
        width: '150px',
    },
    form: {
        width: '100%',
        marginBottom: '12px',
    },
    formTitle: {
        width: '100%',
        marginBottom: '12px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    buttonIcon: {
        textAlign: 'right',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    pointer: {
        cursor: 'pointer'
    },
    large: {
        width: theme.spacing(20),
        height: theme.spacing(20),
        border: "1px dashed rgba(0, 0, 0, 0.3)",
        padding: "5px"
      },
      searchForm: {
          marginLeft: '5px',
          width: '100%',
      }
  }));
const columns = [
    { field: 'id', headerName: 'No.', width: 100 },
    { field: 'sport_name', headerName: '종목 명', width: 200, renderCell: (params)=>(<div style={{cursor: "pointer", color: "#5093FF", width: "100%"}}>{params.row.sport_name}</div>) },
    { field: 'sport_kind', headerName: '대분류', width: 200},
    { field: 'update', headerName: '수정', width: 100, renderCell: (params)=>(<Button style={{backgroundColor:'#ff9800', color:'white'}}>수정</Button>)},
    { field: 'delete', headerName: '삭제', width: 100, renderCell: (params)=>(<Button style={{backgroundColor:'#f44336', color:'white'}}>삭제</Button>) }
];

const SportList = (props) => {
    const classes = useStyles();
    const [cookies] = useCookies(['adminKey']);
    const { enqueueSnackbar } = useSnackbar();
    const [sport, setSport] = useState([
        { 
            id: 1,
            sport_no: 1,
            sport_name: '',
            sport_kind: '',
        }
    ]);
    
    const [deleteCell, setDeleteCell] = useState();
    useEffect(() => {
      async function fetchMyAPI(){
        if(await fetch('/api/admin/sport/')){
          let response = await fetch('/api/admin/sport')
          response = await response.json();
          setSport(response);
        }
      }
      fetchMyAPI();
    }, []);

    const [openCreate, setOpenCreate] = useState(false);
    const handleCloseCreate = () => {
        setOpenCreate(false);
        setValues({
            kind: '',
            name: ''
        })
        setIconBase64('');
        setIconFile(null);
    };
    const [openDelete, setOpenDelete] = useState(false);
    const handleCloseDelete = () => {
        setOpenDelete(false);
        setDeleteCell();
    }

    const [values, setValues] = useState({
        kind: '',
        name: ''
    })
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickCreate = async() => {
        if(values.kind && values.name && iconFile && icon2File && backgroundFile){
            const formData = new FormData();
            formData.append('kind', values.kind);
            formData.append('name', values.name);
            formData.append('images[]', iconFile);
            formData.append('images[]', icon2File);
            formData.append('images[]', backgroundFile);
            const config = {
                headers: {
                    'Content-type': 'multipart/form-data'
                }
            };
            await axios.post(`/api/admin/sport/create`, formData, config).then((response)=>{
                if(response.data.result === 1){
                    let addSport = [...sport];
                    addSport.push(response.data.data);
                    setSport(addSport);
                    setValues({
                        kind: '',
                        name: ''
                    });
                    setIconBase64('');
                    setIconFile(null);
                    setOpenCreate(false);
                    enqueueSnackbar(`종목이 등록 되었습니다.`, { variant: 'success'});
                }else{
                    setOpenCreate(false);
                    enqueueSnackbar(`Error`, { variant: 'error'});
                }
            })
        }else{
            enqueueSnackbar(`모든 정보를 입력해야합니다.`, { variant: 'error'});
        }
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

    const handleClickCell = (event) => {
        if(event.field === 'sport_name'){
            props.history.push(`/admin/sport/${event.row.id}`);
        }else if(event.field === 'update'){
            props.history.push(`/admin/sport/${event.row.id}/update`);
        }else if(event.field === 'delete'){
            setOpenDelete(true);
            setDeleteCell(event.row.id);
        }else{
            return false;
        }
    }
    const handleClickDelete = async() =>{
        const formData = new FormData();
        formData.append('adminKey', cookies.adminKey);
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        };
        await axios.post(`/api/admin/sport/${deleteCell}/delete`, formData, config).then((response)=>{
            if(response.data.result === 1){
                let deleteSport = [...sport];
                const itemToFind = deleteSport.find(function(item) {return item.id === deleteCell})
                const idx = deleteSport.indexOf(itemToFind)
                if (idx > -1) deleteSport.splice(idx, 1)
                setDeleteCell();
                setSport(deleteSport);
                setOpenDelete(false);
                enqueueSnackbar(`종목이 삭제되었습니다.`, { variant: 'success'});
            }else{
                setDeleteCell();
                setOpenDelete(false);
                enqueueSnackbar(`마스터 계정만 삭제가 가능합니다.`, { variant: 'warning'});
            }
        })
    }
    const [sportSearch, setSportSearch] = useState('');
    const [sportSelect, setSportSelect] = useState('sport_name');
    const handleChangeSportSearch = (event) =>{
        setSportSearch(event.target.value);
    }
    const handleChangeSportSelect = (event) =>{
        setSportSelect(event.target.value);
    }
    const filterSport = (data) => {
        data.sort();
        data = data.filter((contact) =>{
            return contact[sportSelect].toString().toLowerCase().indexOf(sportSearch) > -1;
        });
        return data;
    }
    return (
        <>
        <Grid className={classes.root}>
            <Grid container>
                <Grid xs={1}>
                    <FormControl required className={classes.searchForm}>
                        <Select
                            native
                            onChange={handleChangeSportSelect}
                            value={sportSelect}
                            style={{marginRight: '5px'}}
                        >
                            <option value={"id"}>No.</option>
                            <option value={"sport_name"} selected>종목 명</option>
                            <option value={"sport_kind"}>대분류</option>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid xs={2}>
                    <TextField
                        onChange={handleChangeSportSearch}
                        value={sportSearch}
                        InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                        }}
                        className={classes.searchForm}
                    />
                </Grid>
                <Grid xs={9} className={classes.buttonGroup}>
                    <Button 
                        variant="contained"
                        color="primary"
                        endIcon={<SportsBaseball />}
                        className={classes.buttonOption}
                        onClick={() => setOpenCreate(true)}
                    >종목 등록
                    </Button>
                </Grid>
            </Grid>
            <Paper style={{ height: '87vh', width: '100%' }} >
                <DataGrid 
                    rows={filterSport(sport)}
                    columns={columns}
                    pageSize={15}
                    disableSelectionOnClick={true}
                    hideFooterSelectedRowCount={true}
                    //disableColumnMenu={true}
                    onCellClick={handleClickCell}
                    sortingMode='client'
                    multipleColumnsFiltering={true}
                />
            </Paper>
        </Grid>
        <DialogMsg 
            open={openCreate}
            title="종목을 등록합니다."
            btn="등록"
            handleClick={handleClickCreate}
            handleClose={handleCloseCreate}
        >
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
                        <img src={backgroundBase64}  style={{width: '100%'}}/> :
                        <Avatar variant="square" className={classes.large}>No Backgound</Avatar>
                    }
                    </Grid>
                </Grid>
            </FormControl>
        </DialogMsg>

        <DialogMsg 
            open={openDelete}
            title="종목을 삭제합니다."
            btn="삭제"
            handleClick={handleClickDelete}
            handleClose={handleCloseDelete}
        >
            &nbsp;'삭제' 버튼 클릭 시 종목의 모든 정보가 삭제되며, 삭제된 내용은 복구할 수 없습니다.<br/>
            종목을 삭제 하시겠습니까?
        </DialogMsg>
        </>
    );
}

export default SportList;