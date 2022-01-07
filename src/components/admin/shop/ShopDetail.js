import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Button, Avatar, Table, TableRow, TableCell, GridList, GridListTile, Link, FormControl, Select, TextField, InputAdornment, CircularProgress, List, ListItem, ListItemIcon, Checkbox, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import axios from 'axios';

import { DialogMsg } from 'components/layout/admin';

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
    buttonGroup: {
        textAlign: 'right',
        marginTop: '10px',
        marginBottom: '10px'
    },
    buttonOption: {
        marginLeft: '5px',
        width: '50px',
    },
    gridGroup: {
        padding: "1em"
    },
    companyTitle: {
        margin: "0px 0px 0px 10px"
    },
    companyTable:{
        border: "2px solid rgba(224, 224, 224, 1)",
    },
    companyTableCellTitle:{
        border: "1px solid rgba(224, 224, 224, 1)",
        textAlign: "center",
        width: "25%",
        padding: "1em",
        fontWeight: "bold",
        fontSize: "80%",
        backgroundColor: "rgba(224, 224, 224, 0.5)"
    },
    companyTableCellValue:{
        border: "1px solid rgba(224, 224, 224, 1)",
        textAlign: "center",
        width: "25%",
        padding: "1em",
        fontSize: "80%"
    },
    chagePwBtn: {
        width: "100%"
    },
    gridList: {
        width: "100%",
        height: 400,
        textAlign: "center",
        borderLeft:"1px solid rgba(224, 224, 224, 1)"
    },
    imgList: {
        padding: "1.5em",
    },
    searchForm: {
        width: "100%",
        marginBottom: "10px"
    },
    addBtn: {
        width: "100%"
    },
    listTable:{
        border: "2px solid rgba(224, 224, 224, 1)",
    },
    listTableCellTitle:{
        border: "1px solid rgba(224, 224, 224, 1)",
        textAlign: "center",
        width: "20%",
        padding: "0.5em",
        fontWeight: "bold",
        fontSize: "80%",
        backgroundColor: "rgba(224, 224, 224, 0.5)"
    },
    listTableCellValue:{
        border: "1px solid rgba(224, 224, 224, 1)",
        textAlign: "center",
        width: "20%",
        padding: "0.3em",
        fontSize: "80%"
    },
    topLine: {
        borderTop: "1px solid rgba(224, 224, 224, 1)",
        paddingTop: "10px",
        marginTop: "10px"
    }
}));

const ShopDetail = (props) => {
    const classes = useStyles();
    const [cookies] = useCookies(['adminKey']);
    const { enqueueSnackbar } = useSnackbar();

    const [values, setValues] = useState({shop_num:''});
    const [images, setImages] = useState([]);
    const [kindText, setKindText] = useState();
    const [shopGoods, setShopGoods] = useState([]);
    useEffect(()=> {
        async function fetchMyAPI(){
            if(await fetch(`/api/admin/shop/${props.match.params.shopId}`)){
                let response = await fetch(`/api/admin/shop/${props.match.params.shopId}`);
                response = await response.json();
                if(response.result === 1){
                    setValues(response.data);
                    setShopGoods(response.goods);
                    if(response.images){
                        setImages(response.images);
                    }
                    let changeKindText;
                    switch(response.data.shop_kind){
                        case 1:
                            changeKindText = "용품";
                            break;
                        case 2:
                            changeKindText = "레슨";
                            break;
                        case 3:
                            changeKindText = "구장";
                            break;
                        case 4:
                            changeKindText = "대회";
                            break;
                        default :
                            break;
                    }
                    setKindText(changeKindText);
                }else{
                    enqueueSnackbar(`잘못된 경로입니다.`, { variant: 'error'});
                    props.history.push('/admin/shop');
                }
            }
          }
        fetchMyAPI();
    }, [props]);

    const [openPwReset, setOpenPwReset] = useState(false);
    const handleClosePwReset = () => {
        setOpenPwReset(false);
    };
    const handleClickPwRset = async() => {
        let response = await fetch("/api/admin/shop/pwreset", {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                shop_no: values.shop_no,
                shop_pw: values.shop_num.replaceAll("-","")
            })
        })
        let res = await response.json();
        if(res.result === 1){
            enqueueSnackbar(`해당 판매자의 비밀번호가 초기화되었습니다.`, { variant: 'success'});
            setOpenPwReset(false);
        }else{
            enqueueSnackbar(`Error`, { variant: 'error'});
        }
    }
    const [openDelete, setOpenDelete] = useState(false);
    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
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
                props.history.push(`/admin/shop`);
                enqueueSnackbar(`판매자가 삭제되었습니다.`, { variant: 'success'});
            }else{
                setOpenDelete(false);
                enqueueSnackbar(`마스터 계정만 삭제가 가능합니다.`, { variant: 'warning'});
            }
        });
    }
    
    const [openShopGoods, setOpenShopGoods] = useState(false);
    const [searchGoods, setSearchGoods] = useState();
    const [searching, setSearching] = useState(false);
    const [goodsList, setGoodsList] = useState([]);
    const [addGoodsList, setAddGoodsList] = useState([]);
    const handleCloseShopGoods = () => {
        setSearching(false);
        setGoodsList([]);
        setAddGoodsList([]);
        setSearchGoods('');
        setOpenShopGoods(false);
    };
    const handleChangeSearchGoods = (event) => {
        setSearchGoods(event.target.value);
    }
    const handleKeyPress = (event) => {
        if(event.key === "Enter" && !searching){
            handleClickGoodsSearch();
        }
    }
    const handleClickGoodsSearch = () => {
        if(searchGoods){
            setSearchGoods('');
            setSearching(true);
            setTimeout(async function(){
                const config = {
                    headers: {
                        'Content-type': 'application/json'
                    }
                };
                await axios.get(`/api/admin/goods/search/${searchGoods}`, config).then((response)=>{
                    if(response.data[0]){
                        const searchList = response.data;
                        for(let i = 0; i < addGoodsList.length; i++){
                            const itemToFind = searchList.find(function(item) {return item.id === addGoodsList[i]})
                            const idx = searchList.indexOf(itemToFind)
                            if (idx > -1) searchList[idx].check = true;
                        }
                        setGoodsList(searchList);
                        setSearching(false);
                    }else{
                        enqueueSnackbar(`일치하는 상품이 없습니다.`, { variant: 'error'});
                        setGoodsList([]);
                        setSearching(false);
                    }
                });
            },1500);
        }else{
            enqueueSnackbar(`상품 명을 입력해주세요.`, { variant: 'error'});
        }
    }
    const handleClickChecked = (key) => {
        let goodsCheck = [...goodsList];
        let addGoodsCheck = [...addGoodsList];
        if(!goodsCheck[key].check){
            goodsCheck[key].check = true;
            addGoodsCheck.push(goodsCheck[key].id);
        }else{
            goodsCheck[key].check = false;
            const idx = addGoodsCheck.indexOf(goodsCheck[key].id);
            addGoodsCheck.splice(idx, 1);
        }
        setGoodsList(goodsCheck);
        setAddGoodsList(addGoodsCheck);
    }

    const handleClickAddShopGoods = async() => {
        if(addGoodsList.length > 0){
            const formData = new FormData();
            for(let i = 0; i < addGoodsList.length; i++){
                formData.append('goodsNo[]', addGoodsList[i]);
            }
            const config = {
                headers: {
                    "content-type": "application/json"
                }
            };
            await axios.post(`/api/admin/shop/${props.match.params.shopId}/goods`, formData, config).then((response)=>{
                if(response.data.data){
                    handleCloseShopGoods();
                    enqueueSnackbar(`상품 정보가 추가되었습니다.`, { variant: 'success'});
                    setShopGoods(response.data.data);
                }else{
                    enqueueSnackbar(`Error`, { variant: 'error'});
                }
            });
        }else{
            enqueueSnackbar(`상품을 한 가지 이상 선택해야 합니다.`, { variant: 'error'});
        }
    }
    const [openDeleteShopGoods, setOpenDeleteShopGoods] = useState(false);
    const [deleteKey, setDeleteKey] = useState();
    const deleteShopGoods = (key) => {
        setDeleteKey(key);
        setOpenDeleteShopGoods(true);
    }
    const handleCloseDeleteShopGoods = () => {
        setOpenDeleteShopGoods(false);
    }
    const handleClickDeleteShopGoods = async(key) => {
        const formData = new FormData();
        formData.append('goodsNo', shopGoods[key].goods_no);
        const config = {
            headers: {
                "content-type": "application/json"
            }
        };
        await axios.post(`/api/admin/shop/${props.match.params.shopId}/goodsDelete`, formData, config).then((response)=>{
            if(response.data.result > 0){
                setDeleteKey('');
                setOpenDeleteShopGoods(false);
                enqueueSnackbar(`판매자 상품 정보가 삭제되었습니다.`, { variant: 'success'});
                let deleteShopGoods = [...shopGoods];
                for(let i = 0; i < deleteShopGoods.length; i++){
                    const itemToFind = deleteShopGoods.find(function(item) {return item.goods_no === shopGoods[key].goods_no})
                    const idx = deleteShopGoods.indexOf(itemToFind)
                    if (idx > -1) deleteShopGoods.splice(idx, 1)
                }
                setShopGoods(deleteShopGoods);
            }else{
                enqueueSnackbar(`Error`, { variant: 'error'});
            }
        });
    };
    const [shopGoodsSearch, setShopGoodsSearch] = useState('');
    const [shopGoodsSelect, setShopGoodsSelect] = useState('goods_name');
    const handleChangeShopGoodsSearch = (event) =>{
        setShopGoodsSearch(event.target.value);
    }
    const handleChangeShopGoodsSelect = (event) =>{
        setShopGoodsSelect(event.target.value);
    }
    const filterGoods = (data) => {
        data.sort();
        data = data.filter((contact) =>{
            return contact[shopGoodsSelect].toString().toLowerCase().indexOf(shopGoodsSearch) > -1;
        });
        return data;
    }
    return(
        <>
        <Grid className={classes.root}> 
            <Paper className={classes.paper}>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={6}>
                        <div  className={classes.title}>판매자 정보</div>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={10} className={classes.buttonGroup}>
                        <Button variant="contained" className={classes.buttonOption} onClick={()=>props.history.push(`/admin/shop/${props.match.params.shopId}/update`)}>
                        수정
                        </Button>
                        <Button variant="contained" color="secondary" className={classes.buttonOption} onClick={() => setOpenDelete(true)}>
                        삭제
                        </Button>
                    </Grid>
                </Grid>
                <Grid container justify="center">
                    <Grid container xs={5} alignItems="center" className={classes.gridGroup}>
                        <Grid xs={1} >
                            <Avatar alt="Shop Logo Images" src={values.shop_logo} />
                        </Grid>
                        <Grid xs={7}>
                            <h3 className={classes.companyTitle}>{values.shop_companyName}</h3>
                            <h5 className={classes.companyTitle}>{values.shop_num}</h5>
                        </Grid>
                        <Grid xs={4}>
                            <Button variant="contained" className={classes.chagePwBtn} onClick={() => setOpenPwReset(true)}>
                                비밀번호 초기화
                            </Button>
                        </Grid>
                        <Grid xs={12}>
                            <Table className={classes.companyTable}>
                                <TableRow>
                                    <TableCell className={classes.companyTableCellTitle}>회원 번호</TableCell>
                                    <TableCell className={classes.companyTableCellValue}>{values.shop_no}</TableCell>
                                    <TableCell className={classes.companyTableCellTitle}>판매자 명</TableCell>
                                    <TableCell className={classes.companyTableCellValue}>{values.shop_name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.companyTableCellTitle}>업체 전화번호</TableCell>
                                    <TableCell className={classes.companyTableCellValue}>{values.shop_companyPhone}</TableCell>
                                    <TableCell className={classes.companyTableCellTitle}>판매자 전화번호</TableCell>
                                    <TableCell className={classes.companyTableCellValue}>{values.shop_phone}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.companyTableCellTitle}>업종</TableCell>
                                    <TableCell className={classes.companyTableCellValue}>{kindText}</TableCell>
                                    <TableCell className={classes.companyTableCellTitle}>상태</TableCell>
                                    <TableCell className={classes.companyTableCellValue}>{values.shop_status === 2 ? "영업" : "정지"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.companyTableCellTitle}>판매자 이메일</TableCell>
                                    <TableCell colSpan={3} className={classes.companyTableCellValue}>{values.shop_email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.companyTableCellTitle}>업체 주소</TableCell>
                                    <TableCell colSpan={3} className={classes.companyTableCellValue}>{values.shop_address} {values.shop_addressDetail}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.companyTableCellTitle}>대표 홈페이지 링크</TableCell>
                                    <TableCell colSpan={3} className={classes.companyTableCellValue}>{values.shop_homepage} {values.shop_homepage ? <Link href={values.shop_homepage} target="_blank" style={{fontSize:"80%", textDecoration:"none"}}>[바로가기]</Link> : null}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.companyTableCellTitle}>업체 소개</TableCell>
                                    <TableCell colSpan={3} className={classes.companyTableCellValue}>{values.shop_info ? <div dangerouslySetInnerHTML={ {__html: values.shop_info.replaceAll("\n","<br/>")} }></div> : null}</TableCell>
                                </TableRow>
                            </Table>
                        </Grid>
                    </Grid>
                    <Grid xs={5} className={classes.gridGroup}>
                        <GridList cellHeight={230} className={classes.gridList}>
                            {images ? images.map((img, key) => (
                            <GridListTile key={key} className={classes.imgList}>
                                <img src={img.shopImage_image}  style={{width: "auto", height: "100%"}} alt=""/>
                            </GridListTile>
                            )):
                            <GridListTile className={classes.imgList}>
                                <img src="" alt=""/>
                                (No Image)
                            </GridListTile>
                            }
                        </GridList>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={10} container justify="space-between" className={classes.topLine}>
                        <Grid xs={12}>
                            <b>상품 정보</b>
                        </Grid>
                        <Grid xs={2}>
                            <FormControl required className={classes.searchForm}>
                                <Select
                                    native
                                    onChange={handleChangeShopGoodsSelect}
                                    value={shopGoodsSelect}
                                >
                                    <option value={"goods_no"}>상품 번호</option>
                                    <option value={"goods_kind"}>대분류</option>
                                    <option value={"sport_name"}>소분류</option>
                                    <option value={"goods_name"} selected>상품 명</option>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid xs={4}>
                            <TextField
                                onChange={handleChangeShopGoodsSearch}
                                value={shopGoodsSearch}
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
                        <Grid xs={4}></Grid>
                        <Grid xs={1}>
                            <Button variant="outlined" size="small" color="primary" className={classes.addBtn} onClick={() => setOpenShopGoods(true)}>
                            상품 추가
                            </Button>
                        </Grid>
                        <Table className={classes.listTable}>
                            <TableRow>
                                <TableCell className={classes.listTableCellTitle}>상품 번호</TableCell>
                                <TableCell className={classes.listTableCellTitle}>대분류</TableCell>
                                <TableCell className={classes.listTableCellTitle}>소분류</TableCell>
                                <TableCell className={classes.listTableCellTitle}>상품 명</TableCell>
                                <TableCell className={classes.listTableCellTitle}>삭제</TableCell>
                            </TableRow>
                            {filterGoods(shopGoods).length ?
                                filterGoods(shopGoods).map((goods, i) => (
                            <TableRow key={i}>
                                <TableCell className={classes.listTableCellValue}>{goods.goods_no}</TableCell>
                                <TableCell className={classes.listTableCellValue}>{goods.goods_kind}</TableCell>
                                <TableCell className={classes.listTableCellValue}>{goods.sport_name}</TableCell>
                                <TableCell className={classes.listTableCellValue}><Link href={`/admin/goods/${goods.goods_no}`}>{goods.goods_name}</Link></TableCell>
                                <TableCell className={classes.listTableCellValue}>
                                    <Button variant="outlined" size="small" color="secondary"  onClick={() => deleteShopGoods(i)}>
                                    삭제
                                    </Button>
                                </TableCell>
                            </TableRow>)):
                            <TableRow>
                                <TableCell colSpan={6} className={classes.listTableCellValue}>판매 상품이 없습니다.</TableCell>
                            </TableRow>}
                        </Table>
                    </Grid>
                    <Grid xs={10} container justify="space-between" className={classes.topLine}>
                        <Grid xs={12}>
                            <b>추천 상품</b>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
        <DialogMsg 
            open={openPwReset}
            title="비밀번호를 초기화합니다."
            btn="확인"
            handleClick={handleClickPwRset}
            handleClose={handleClosePwReset}
        >
            &nbsp;'확인' 버튼 클릭 시 비밀번호가 '<span style={{color: "red"}}>{values.shop_num.replaceAll("-","")}</span>'로 초기화되며, 이전 비밀번호는 저장되지 않습니다.<br/>
            비밀번호를 초기화하겠습니까?<br/><br/>
            <small>초기화된 비밀번호는 '-'을 제외한 사업자 등록번호입니다.</small>
        </DialogMsg>
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
        <DialogMsg 
            open={openShopGoods}
            title="추천 상품을 추가합니다."
            btn="추가"
            count={addGoodsList.length}
            handleClick={handleClickAddShopGoods}
            handleClose={handleCloseShopGoods}
        >
            <Grid container alignItems="center" justify="space-between">
                <Grid xs={9}>
                    <TextField
                        label="상품 명"
                        helperText="상품 명으로 검색합니다."
                        fullWidth
                        margin="normal"
                        onKeyPress={handleKeyPress}
                        onChange={handleChangeSearchGoods}
                        value={searchGoods}
                    />
                </Grid>
                <Grid xs={2} style={{textAlign: "center"}}>
                    {
                    !searching ?
                    <Button variant="outlined" size="small" color="primary" className={classes.addBtn} onClick={handleClickGoodsSearch} >
                        검색
                    </Button> :
                    <CircularProgress />
                    }
                </Grid>
                <Grid xs={12} style={{textAlign: "center"}}>
                    {
                    goodsList[0] ?
                        !searching ?
                    <List >
                        {goodsList.map((goods, i) => (
                        <ListItem dense button onClick={() => handleClickChecked(i)}>
                            <ListItemIcon>
                            <Checkbox
                                key={i}
                                role={undefined}
                                edge="start"
                                disableRipple
                                checked={!goods.check ? false : true}
                            />
                            </ListItemIcon>
                            <img src={goods.firstImg} width="50px" height="50px"  alt=""/>
                            <ListItemText style={{padding: "5px"}} primary={<><h3 style={{margin: "0px"}}>{goods.goods_name}</h3>{goods.goods_kind} / {goods.sport_name} / {goods.fixHashtag}</>} />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="comments" onClick={() => window.open('about:blank').location.href=`/admin/goods/${goods.id}`}>
                                    <Search />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>))}
                    </List> :
                        null :
                    null
                    }
                </Grid>
            </Grid>
        </DialogMsg>
        <DialogMsg 
            open={openDeleteShopGoods}
            title="판매자 상품 정보를 삭제합니다."
            btn="삭제"
            handleClick={() => handleClickDeleteShopGoods(deleteKey)}
            handleClose={handleCloseDeleteShopGoods}
        >
            &nbsp;'삭제' 버튼 클릭 시 판매자 상품의 모든 정보가 삭제되며, 삭제된 내용은 복구할 수 없습니다.<br/>상품 정보를 삭제 하시겠습니까?
        </DialogMsg>
        </>
    );
}

export default ShopDetail;