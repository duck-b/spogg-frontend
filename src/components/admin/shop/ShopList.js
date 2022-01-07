import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Button, FormControl, Select, TextField, InputAdornment } from '@material-ui/core';
import { People, Search } from '@material-ui/icons';
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
    { field: 'shop_companyName', headerName: '업체 명', width: 150, renderCell: (params)=>(<div style={{cursor: "pointer", color: "#5093FF", width: "100%"}}>{params.row.shop_companyName}</div>) },
    { field: 'shop_companyPhone', headerName: '업체 전화번호', width: 130},
    { field: 'shop_address', headerName: '업체 주소', width: 300 },
    { field: 'shop_num', headerName: '사업자 등록번호', width: 140 },
    { field: 'shop_name', headerName: '판매자 명', width: 120 },
    { field: 'shop_phone', headerName: '판매자 번호', width: 130 },
    { field: 'shop_kind', headerName: '업종', width: 80 },
    { field: 'shop_status', headerName: '상태', width: 80 },
    { field: 'update', headerName: '수정', width: 100, renderCell: (params)=>(<Button style={{backgroundColor:'#ff9800', color:'white'}} onClick={()=>console.log(params)}>수정</Button>)},
    { field: 'delete', headerName: '삭제', width: 100, renderCell: (params)=>(<Button style={{backgroundColor:'#f44336', color:'white'}}>삭제</Button>) }
];

const ShopList = (props) => {
    const classes = useStyles();
    const [cookies] = useCookies(['adminKey']);
    const { enqueueSnackbar } = useSnackbar();
    const [shop, setShop] = useState([
        { 
            id: 1,
            shop_no: 1,
            shop_name: '',
            shop_phone: '',
            shop_num: '',
            shop_companyName: '',
            shop_companyPhone: '',
            shop_address: '',
            shop_kind: ''
        }
    ]);
    const [deleteCell, setDeleteCell] = useState();
    useEffect(() => {
      async function fetchMyAPI(){
        if(await fetch('/api/admin/shop/')){
          let response = await fetch('/api/admin/shop')
          response = await response.json();
          setShop(response);
        }
      }
      fetchMyAPI();
    }, []);

    const handleClickCreate = () => {
        props.history.push('/admin/shop/create');
    };
    const handleClickCell = (event) => {
        if(event.field === 'shop_companyName'){
            props.history.push(`/admin/shop/${event.row.id}`);
        }else if(event.field === 'update'){
            props.history.push(`/admin/shop/${event.row.id}/update`);
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
        await axios.post(`/api/admin/shop/${props.match.params.shopId}/delete`, formData, config).then((response)=>{
            if(response.data.result === 1){
                let deleteShop = [...shop];
                const itemToFind = deleteShop.find(function(item) {return item.id === deleteCell})
                const idx = deleteShop.indexOf(itemToFind)
                if (idx > -1) deleteShop.splice(idx, 1)
                setDeleteCell();
                setShop(deleteShop);
                setOpenDelete(false);
                enqueueSnackbar(`판매자가 삭제되었습니다.`, { variant: 'success'});
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
    const [shopSearch, setShopSearch] = useState('');
    const [shopSelect, setShopSelect] = useState('shop_companyName');
    const handleChangeShopSearch = (event) =>{
        setShopSearch(event.target.value);
    }
    const handleChangeShopSelect = (event) =>{
        setShopSelect(event.target.value);
    }
    const filterShop = (data) => {
        data.sort();
        data = data.filter((contact) =>{
            return contact[shopSelect].toString().toLowerCase().indexOf(shopSearch) > -1;
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
                            onChange={handleChangeShopSelect}
                            value={shopSelect}
                            style={{marginRight: '5px'}}
                        >
                            <option value={"id"}>No.</option>
                            <option value={"shop_companyName"} selected>업체 명</option>
                            <option value={"shop_companyPhone"}>업체 전화번호</option>
                            <option value={"shop_address"}>업체 주소</option>
                            <option value={"shop_num"}>사업자 등록번호</option>
                            <option value={"shop_name"}>판매자 명</option>
                            <option value={"shop_phone"}>판매자 번호</option>
                            <option value={"shop_kind"}>업종</option>
                            <option value={"shop_status"}>상태</option>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid xs={2}>
                    <TextField
                        onChange={handleChangeShopSearch}
                        value={shopSearch}
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
                        endIcon={<People />}
                        className={classes.buttonOption}
                        onClick={handleClickCreate}
                    >
                        판매자 등록
                    </Button>
                </Grid>
            </Grid>
            <Paper style={{ height: '87vh', width: '100%' }} >
                <DataGrid 
                    rows={filterShop(shop)}
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
            title="판매자를 삭제합니다."
            btn="삭제"
            handleClick={handleClickDelete}
            handleClose={handleCloseDelete}
        >
            &nbsp;'삭제' 버튼 클릭 시 판매자의 모든 정보가 삭제되며, 삭제된 내용은 복구할 수 없습니다.<br/>
            판매자를 삭제 하시겠습니까?
        </DialogMsg>
        </>
    );
}

export default ShopList;