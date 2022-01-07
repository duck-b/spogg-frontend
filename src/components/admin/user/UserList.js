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
    { field: 'user_profile', headerName: '프로필', width: 100, renderCell: (params)=>(<Avatar src={params.row.user_profile}/>) },
    { field: 'user_name', headerName: '닉네임', width: 200, renderCell: (params)=>(<div style={{cursor: "pointer", color: "#5093FF", width: "100%"}}>{params.row.user_name}</div>) },
    { field: 'user_email', headerName: '이메일', width: 300 },
    { field: 'user_sns', headerName: 'SNS', width: 100 },
    { field: 'user_gender', headerName: '성별', width: 100 },
    { field: 'user_status', headerName: '구분', width: 130 },
    { field: 'created_at', headerName: '가입일시', width: 200 },
    // { field: 'shop_status', headerName: '상태', width: 80 },
    // { field: 'update', headerName: '수정', width: 100, renderCell: (params)=>(<Button style={{backgroundColor:'#ff9800', color:'white'}} onClick={()=>console.log(params)}>수정</Button>)},
    // { field: 'delete', headerName: '삭제', width: 100, renderCell: (params)=>(<Button style={{backgroundColor:'#f44336', color:'white'}}>삭제</Button>) }
];

const UserList = (props) => {
    const classes = useStyles();
    const [cookies] = useCookies(['adminKey']);
    const { enqueueSnackbar } = useSnackbar();
    const [user, setUser] = useState([
        { 
            id: 1,
            user_no: 1,
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
          let response = await fetch('/api/admin/user')
          response = await response.json();
          setUser(response);
      }
      fetchMyAPI();
    }, []);

    const handleClickCell = (event) => {
        if(event.field === 'user_name'){
            props.history.push(`/admin/user/${event.row.id}`);
        }else if(event.field === 'update'){
            props.history.push(`/admin/user/${event.row.id}/update`);
        }else{
            return false;
        }
    }
   
    const [userSearch, setUserSearch] = useState('');
    const [userSelect, setUserSelect] = useState('user_name');
    const handleChangeUserSearch = (event) =>{
        setUserSearch(event.target.value);
    }
    const handleChangeUserSelect = (event) =>{
        setUserSelect(event.target.value);
    }
    const filterUser = (data) => {
        data.sort();
        data = data.filter((contact) =>{
            return contact[userSelect].toString().toLowerCase().indexOf(userSearch.toLowerCase()) > -1;
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
                            onChange={handleChangeUserSelect}
                            value={userSelect}
                            style={{marginRight: '5px'}}
                        >
                            <option value={"id"}>No.</option>
                            <option value={"user_name"} selected>닉네임</option>
                            <option value={"user_email"}>이메일</option>
                            <option value={"user_sns"}>SNS</option>
                            <option value={"user_gender"}>성별</option>
                            <option value={"user_status"}>구분</option>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid xs={2}>
                    <TextField
                        onChange={handleChangeUserSearch}
                        value={userSearch}
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
                        endIcon={<MonetizationOn />}
                        className={classes.buttonOption}
                    >
                        마일리지
                    </Button>
                </Grid>
            </Grid>
            <Paper style={{ height: '87vh', width: '100%' }} >
                <DataGrid 
                    rows={filterUser(user)}
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
        </>
    );
}

export default UserList;