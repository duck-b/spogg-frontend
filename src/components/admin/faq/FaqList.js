import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Button, FormControl, Select, TextField, InputAdornment } from '@material-ui/core';
import { CardGiftcard, Search } from '@material-ui/icons';
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
    { field: 'event_name', headerName: '이벤트 명', width: 200},
    { field: 'event_image', headerName: '사진', width: 200, renderCell: (params)=>(<><img src={params.row.event_image} style={{width: "100%"}} alt=""/></>) },
    { field: 'event_info', headerName: '이벤트 내용', width: 200, renderCell: (params)=>(<><div dangerouslySetInnerHTML={ {__html: params.row.event_info} }></div></>) },
    { field: 'event_term', headerName: '이벤트 기간', width: 250, renderCell: (params)=>(<><div dangerouslySetInnerHTML={ {__html: params.row.event_term} }></div></>) },
    { field: 'event_url', headerName: '이벤트 URL', width: 200},
    { field: 'update', headerName: '수정', width: 100, renderCell: (params)=>(<Button style={{backgroundColor:'#ff9800', color:'white'}} onClick={()=>console.log(params)}>수정</Button>)},
    { field: 'delete', headerName: '삭제', width: 100, renderCell: (params)=>(<Button style={{backgroundColor:'#f44336', color:'white'}}>삭제</Button>) }
];

const EventList = (props) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [event, setEvent] = useState([
        { 
            id: 1,
            event_name: ''
        }
    ]);
    const [deleteCell, setDeleteCell] = useState();
    useEffect(() => {
      async function fetchMyAPI(){
        if(await fetch('/api/admin/event/')){
          let response = await fetch('/api/admin/event')
          response = await response.json();
          setEvent(response);
        }
      }
      fetchMyAPI();
    }, []);

    const handleClickCreate = () => {
        props.history.push('/admin/event/create');
    };
    const handleClickCell = (event) => {
        if(event.field === 'update'){
            props.history.push(`/admin/event/${event.row.id}/update`);
        }else if(event.field === 'delete'){
            setOpenDelete(true);
            setDeleteCell(event.row.id);
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
        await axios.post(`/api/admin/event/${deleteCell}/delete`, config).then((response)=>{
            let deleteEvent = [...event];
            const itemToFind = deleteEvent.find(function(item) {return item.id === deleteCell})
            const idx = deleteEvent.indexOf(itemToFind)
            if (idx > -1) deleteEvent.splice(idx, 1)
            setDeleteCell();
            setEvent(deleteEvent);
            setOpenDelete(false);
            enqueueSnackbar(`이벤트가 삭제되었습니다.`, { variant: 'success'});
        })
    }
    const [openDelete, setOpenDelete] = useState(false);
    const handleCloseDelete = () => {
        setOpenDelete(false);
        setDeleteCell();
    };

    const [eventSearch, setEventSearch] = useState('');
    const [eventSelect, setEventSelect] = useState('event_name');
    const handleChangeEventSearch = (event) =>{
        setEventSearch(event.target.value);
    }
    const handleChangeEventSelect = (event) =>{
        setEventSelect(event.target.value);
    }
    const filterEvent = (data) => {
        data.sort();
        data = data.filter((contact) =>{
            return contact[eventSelect].toString().toLowerCase().indexOf(eventSearch) > -1;
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
                            onChange={handleChangeEventSelect}
                            value={eventSelect}
                            style={{marginRight: '5px'}}
                        >
                            <option value={"id"}>No.</option>
                            <option value={"event_name"} selected>이벤트 명</option>
                            <option value={"event_info"}>이벤트 내용</option>
                            <option value={"event_term"}>이벤트 기간</option>
                            <option value={"event_url"}>이벤트 URL</option>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid xs={2}>
                    <TextField
                        onChange={handleChangeEventSearch}
                        value={eventSearch}
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
                        endIcon={<CardGiftcard />}
                        className={classes.buttonOption}
                        onClick={handleClickCreate}
                    >이벤트 등록
                    </Button>
                </Grid>
            </Grid>
            <Paper style={{ height: '87vh', width: '100%' }} >
                <DataGrid 
                    rows={filterEvent(event)}
                    columns={columns}
                    pageSize={15}
                    rowHeight={120}
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
            title="이벤트를 삭제합니다."
            btn="삭제"
            handleClick={handleClickDelete}
            handleClose={handleCloseDelete}
        >
            &nbsp;'삭제' 버튼 클릭 시 이벤트의 모든 정보가 삭제되며, 삭제된 내용은 복구할 수 없습니다.<br/>이벤트를 삭제 하시겠습니까?
        </DialogMsg>
        </>
    );
}

export default EventList;