import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Button, FormControl, Select, TextField, InputAdornment } from '@material-ui/core';
import { Info, Search } from '@material-ui/icons';
import { DataGrid } from '@material-ui/data-grid';
import axios from 'axios';
import { useSnackbar } from 'notistack';

import { DialogMsg } from 'components/layout/admin';

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
    searchForm: {
        marginLeft: '5px',
        width: '100%',
    }
  }));
const columns = [
    { field: 'id', headerName: 'No.', width: 100 },
    { field: 'notice_title', headerName: '공지사항 명', width: 300, renderCell: (params)=>(<div style={{cursor: "pointer", color: "#5093FF", width: "100%"}}>{params.row.notice_title}</div>) },    
    { field: 'created_at', headerName: '작성일시', width: 200},
    { field: 'update', headerName: '수정', width: 100, renderCell: (params)=>(<Button style={{backgroundColor:'#ff9800', color:'white'}} onClick={()=>console.log(params)}>수정</Button>)},
    { field: 'delete', headerName: '삭제', width: 100, renderCell: (params)=>(<Button style={{backgroundColor:'#f44336', color:'white'}}>삭제</Button>) }
];

const NoticeList = (props) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [notices, setNotices] = useState([
        { 
            id: 1,
            notice_title: ''
        }
    ]);
    const [deleteCell, setDeleteCell] = useState();
    useEffect(() => {
      async function fetchMyAPI(){
        if(await fetch('/api/admin/notice/')){
          let response = await fetch('/api/admin/notice')
          response = await response.json();
          setNotices(response);
        }
      }
      fetchMyAPI();
    }, []);

    const handleClickCreate = () => {
        props.history.push('/admin/notice/create');
    };
    const handleClickCell = (event) => {
        if(event.field === 'update'){
            props.history.push(`/admin/notice/${event.row.id}/update`);
        }else if(event.field === 'delete'){
            setOpenDelete(true);
            setDeleteCell(event.row.id);
        }else if(event.field === 'notice_title'){
            props.history.push(`/admin/notice/${event.row.id}`)
        }else{
            return false;
        }
    }
    const handleClickDelete = async() =>{
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        };
        await axios.post(`/api/admin/notice/${deleteCell}/delete`, config).then((response)=>{
            let deleteNotice = [...notices];
            const itemToFind = deleteNotice.find(function(item) {return item.id === deleteCell})
            const idx = deleteNotice.indexOf(itemToFind)
            if (idx > -1) deleteNotice.splice(idx, 1)
            setDeleteCell();
            setNotices(deleteNotice);
            setOpenDelete(false);
            enqueueSnackbar(`공지사항이 삭제되었습니다.`, { variant: 'success'});
        })
    }
    const [openDelete, setOpenDelete] = useState(false);
    const handleCloseDelete = () => {
        setOpenDelete(false);
        setDeleteCell();
    };

    const [noticeSearch, setNoticeSearch] = useState('');
    const [noticeSelect, setNoticeSelect] = useState('notice_title');
    const handleChangeNoticeSearch = (event) =>{
        setNoticeSearch(event.target.value);
    }
    const handleChangeNoticeSelect = (event) =>{
        setNoticeSelect(event.target.value);
    }
    const filterNotice = (data) => {
        data.sort();
        data = data.filter((contact) =>{
            return contact[noticeSelect].toString().toLowerCase().indexOf(noticeSearch.toLowerCase()) > -1;
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
                            onChange={handleChangeNoticeSelect}
                            value={noticeSelect}
                            style={{marginRight: '5px'}}
                        >
                            <option value={"id"}>No.</option>
                            <option value={"notice_title"} selected>공지사항 명</option>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid xs={2}>
                    <TextField
                        onChange={handleChangeNoticeSearch}
                        value={noticeSearch}
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
                        endIcon={<Info />}
                        className={classes.buttonOption}
                        onClick={handleClickCreate}
                    >공지사항 등록
                    </Button>
                </Grid>
            </Grid>
            <Paper style={{ height: '87vh', width: '100%' }} >
                <DataGrid 
                    rows={filterNotice(notices)}
                    columns={columns}
                    pageSize={15}
                    disableSelectionOnClick={true} 
                    hideFooterSelectedRowCount={true}
                    onCellClick={handleClickCell}
                    sortingMode='client'
                    disableColumnFilter={true}
                />
            </Paper>
        </Grid>
        <DialogMsg 
            open={openDelete}
            title="공지사항을 삭제합니다."
            btn="삭제"
            handleClick={handleClickDelete}
            handleClose={handleCloseDelete}
        >
            &nbsp;'삭제' 버튼 클릭 시 공지사항의 모든 정보가 삭제되며, 삭제된 내용은 복구할 수 없습니다.<br/>공지사항을 삭제 하시겠습니까?
        </DialogMsg>
        </>
    );
}

export default NoticeList;