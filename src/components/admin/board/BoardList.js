import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Button, FormControl, Select, TextField, InputAdornment, Avatar } from '@material-ui/core';
import { MonetizationOn, Search } from '@material-ui/icons';
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
    searchForm: {
        marginLeft: '5px',
        width: '100%',
    }
  }));
const columns = [
    { field: 'id', headerName: 'No.', width: 100 },
    { field: 'board_title', headerName: '제목', width: 300, renderCell: (params)=>(<div style={{cursor: "pointer", color: "#5093FF", width: "100%"}}>{params.row.board_title}</div>) },
    { field: 'board_image', headerName: '사진', width: 100, renderCell: (params)=>(<img src={params.row.board_image} style={{ width: '60px'}}/>) },
    { field: 'board_kind', headerName: '게시글 분류', width: 100 },
    { field: 'sport_name', headerName: '종목', width: 100 },
    { field: 'user_name', headerName: '작성자', width: 150, renderCell: (params)=>(<div style={{cursor: "pointer", color: "#5093FF", width: "100%"}}>{params.row.user_name}</div>) },
    { field: 'created_at', headerName: '작성일시', width: 200 },
    { field: 'updated_at', headerName: '수정일시', width: 200 },
    { field: 'update', headerName: '수정', width: 100, renderCell: (params)=>(<Button style={{backgroundColor:'#ff9800', color:'white'}} onClick={()=>console.log(params)}>수정</Button>)},
    { field: 'delete', headerName: '삭제', width: 100, renderCell: (params)=>(<Button style={{backgroundColor:'#f44336', color:'white'}}>삭제</Button>) }
];

const BoardList = (props) => {
    const classes = useStyles();
    const [cookies] = useCookies(['adminKey']);
    const { enqueueSnackbar } = useSnackbar();
    const [board, setBoard] = useState([
        { 
            id: 1,
            board_title: '',
            user_profile: '',
            user_name: '',
            user_email: '',
            user_sns: '',
            user_gender: '',
            user_status: '',
            created_at: ''
        }
    ]);
    useEffect(() => {
      async function fetchMyAPI(){
          let response = await fetch('/api/admin/board')
          response = await response.json();
          setBoard(response);
      }
      fetchMyAPI();
    }, []);

    const handleClickCell = (event) => {
        if(event.field === 'board_title'){
            props.history.push(`/admin/board/${event.row.id}`);
        }else if(event.field === 'user_name'){
            props.history.push(`/admin/user/${event.row.user_no}`);
        }else if(event.field === 'update'){
            props.history.push(`/admin/board/${event.row.id}/update`);
        }else{
            return false;
        }
    }
   
    const [boardSearch, setBoardSearch] = useState('');
    const [boardSelect, setBoardSelect] = useState('board_title');
    const handleChangeBoardSearch = (event) =>{
        setBoardSearch(event.target.value);
    }
    const handleChangeBoardSelect = (event) =>{
        setBoardSelect(event.target.value);
    }
    const filterBoard = (data) => {
        data.sort();
        data = data.filter((contact) =>{
            return contact[boardSelect].toString().toLowerCase().indexOf(boardSearch.toLowerCase()) > -1;
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
                            onChange={handleChangeBoardSelect}
                            value={boardSelect}
                            style={{marginRight: '5px'}}
                        >
                            <option value={"id"}>No.</option>
                            <option value={"board_title"} selected>제목</option>
                            <option value={"board_kind"}>게시글 분류</option>
                            <option value={"sport_name"}>종목</option>
                            <option value={"user_name"}>작성자</option>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid xs={2}>
                    <TextField
                        onChange={handleChangeBoardSearch}
                        value={boardSearch}
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
                    {/* <Button 
                        variant="contained"
                        color="primary"
                        endIcon={<MonetizationOn />}
                        className={classes.buttonOption}
                    >
                        마일리지
                    </Button> */}
                </Grid>
            </Grid>
            <Paper style={{ height: '87vh', width: '100%', marginTop: '10px' }} >
                <DataGrid 
                    rows={filterBoard(board)}
                    columns={columns}
                    pageSize={15}
                    rowHeight={60}
                    disableSelectionOnClick={true} 
                    hideFooterSelectedRowCount={true}
                    onCellClick={handleClickCell}
                    sortingMode='client'
                    disableColumnFilter={true}
                />
            </Paper>
        </Grid>
        </>
    );
}

export default BoardList;