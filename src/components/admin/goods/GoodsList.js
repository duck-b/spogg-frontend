import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Button, FormControl, Select, TextField, InputAdornment } from '@material-ui/core';
import { AddShoppingCart, Search } from '@material-ui/icons';
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
    { field: 'firstImg', headerName: '사진', width: 130, renderCell: (params)=>(<><img src={params.row.firstImg} style={{width: "100%"}} alt=""/></>) },
    { field: 'goods_name', headerName: '상품 명', width: 200, renderCell: (params)=>(<div style={{cursor: "pointer", color: "#5093FF", width: "100%"}}>{params.row.goods_name}</div>) },
    { field: 'goods_kind', headerName: '대분류', width: 100 },
    { field: 'sport_name', headerName: '소분류', width: 100 },
    { field: 'fixHashtag', headerName: '고정 해시태그', width: 150 },
    { field: 'createTime', headerName: '등록일', width: 150},
    { field: 'update', headerName: '수정', width: 100, renderCell: (params)=>(<Button style={{backgroundColor:'#ff9800', color:'white'}} onClick={()=>console.log(params)}>수정</Button>)},
    { field: 'delete', headerName: '삭제', width: 100, renderCell: (params)=>(<Button style={{backgroundColor:'#f44336', color:'white'}}>삭제</Button>) }
];

const GoodsList = (props) => {
    const classes = useStyles();
    const [cookies] = useCookies(['adminKey']);
    const { enqueueSnackbar } = useSnackbar();
    const [goods, setGoods] = useState([
        { 
            id: 1,
            goods_name: ''
        }
    ]);
    const [deleteCell, setDeleteCell] = useState();
    useEffect(() => {
      async function fetchMyAPI(){
        if(await fetch('/api/admin/goods/')){
          let response = await fetch('/api/admin/goods')
          response = await response.json();
          setGoods(response);
        }
      }
      fetchMyAPI();
    }, []);

    const handleClickCreate = () => {
        props.history.push('/admin/goods/create');
    };
    const handleClickCell = (event) => {
        if(event.field === 'goods_name'){
            props.history.push(`/admin/goods/${event.row.id}`);
        }else if(event.field === 'update'){
            props.history.push(`/admin/goods/${event.row.id}/update`);
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
        await axios.post(`/api/admin/goods/${deleteCell}/delete`, formData, config).then((response)=>{
            if(response.data.result === 1){
                let deleteGoods = [...goods];
                const itemToFind = deleteGoods.find(function(item) {return item.id === deleteCell})
                const idx = deleteGoods.indexOf(itemToFind)
                if (idx > -1) deleteGoods.splice(idx, 1)
                setDeleteCell();
                setGoods(deleteGoods);
                setOpenDelete(false);
                enqueueSnackbar(`상품이 삭제되었습니다.`, { variant: 'success'});
            }else{
                setOpenDelete(false);
                enqueueSnackbar(`마스터 계정만 삭제가 가능합니다.`, { variant: 'warning'});
            }
        })
    }
    const [openDelete, setOpenDelete] = useState(false);
    const handleCloseDelete = () => {
        setOpenDelete(false);
        setDeleteCell();
    };

    const [goodsSearch, setGoodsSearch] = useState('');
    const [goodsSelect, setGoodsSelect] = useState('goods_name');
    const handleChangeGoodsSearch = (event) =>{
        setGoodsSearch(event.target.value);
    }
    const handleChangeGoodsSelect = (event) =>{
        setGoodsSelect(event.target.value);
    }
    const filterGoods = (data) => {
        data.sort();
        data = data.filter((contact) =>{
            return contact[goodsSelect].toString().toLowerCase().indexOf(goodsSearch) > -1;
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
                            onChange={handleChangeGoodsSelect}
                            value={goodsSelect}
                            style={{marginRight: '5px'}}
                        >
                            <option value={"id"}>No.</option>
                            <option value={"goods_name"} selected>상품 명</option>
                            <option value={"goods_kind"}>대분류</option>
                            <option value={"sport_name"}>소분류</option>
                            <option value={"fixHashtag"}>고정 해시태그</option>
                            <option value={"createTime"}>등록일</option>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid xs={2}>
                    <TextField
                        onChange={handleChangeGoodsSearch}
                        value={goodsSearch}
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
                        endIcon={<AddShoppingCart />}
                        className={classes.buttonOption}
                        onClick={handleClickCreate}
                    >상품 등록
                    </Button>
                </Grid>
            </Grid>
            <Paper style={{ height: '87vh', width: '100%' }} >
                <DataGrid 
                    rows={filterGoods(goods)}
                    columns={columns}
                    pageSize={15}
                    rowHeight={130}
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
            title="상품을 삭제합니다."
            btn="삭제"
            handleClick={handleClickDelete}
            handleClose={handleCloseDelete}
        >
            &nbsp;'삭제' 버튼 클릭 시 상품의 모든 정보가 삭제되며, 삭제된 내용은 복구할 수 없습니다.<br/>상품을 삭제 하시겠습니까?
        </DialogMsg>
        </>
    );
}

export default GoodsList;