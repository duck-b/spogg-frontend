import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Button, Table, TableRow, TableCell, TextField, InputAdornment, List, ListItem, ListItemIcon, Checkbox, ListItemText, ListItemSecondaryAction, IconButton, CircularProgress, Chip, Link, Select, FormControl } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Carousel from 'react-material-ui-carousel'
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
    table:{
        border: "2px solid rgba(224, 224, 224, 1)",
    },
    tableCellTitle:{
        border: "1px solid rgba(224, 224, 224, 1)",
        textAlign: "center",
        width: "25%",
        padding: "1em",
        fontWeight: "bold",
        fontSize: "80%",
        backgroundColor: "rgba(224, 224, 224, 0.5)"
    },
    tableCellValue:{
        border: "1px solid rgba(224, 224, 224, 1)",
        textAlign: "center",
        width: "25%",
        padding: "1em",
        fontSize: "80%"
    },
    searchForm: {
        width: "100%",
        marginBottom: "10px"
    },
    addBtn: {
        width: "100%"
    },
    keyword : {
        marginRight: "5px",
    },
    listTable:{
        border: "2px solid rgba(224, 224, 224, 1)",
    },
    listTableCellTitle:{
        border: "1px solid rgba(224, 224, 224, 1)",
        textAlign: "center",
        width: "25%",
        padding: "0.5em",
        fontWeight: "bold",
        fontSize: "80%",
        backgroundColor: "rgba(224, 224, 224, 0.5)"
    },
    listTableCellValue:{
        border: "1px solid rgba(224, 224, 224, 1)",
        textAlign: "center",
        width: "25%",
        padding: "0.3em",
        fontSize: "80%"
    },
}));

const GoodsDetail = (props) => {
    const classes = useStyles();
    const [cookies] = useCookies(['adminKey']);
    const { enqueueSnackbar } = useSnackbar();

    const [values, setValues] = useState({});
    const [images, setImages] = useState([]);
    const [keyword, setKeyword] = useState([]);
    const [withGoods, setWithGoods] = useState([]);
    const [kindText, setKindText] = useState();
    const [shopGoods, setShopGoods] = useState([]);
    useEffect(()=> {
        async function fetchMyAPI(){
            if(await fetch(`/api/admin/goods/${props.match.params.goodsId}`)){
                let response = await fetch(`/api/admin/goods/${props.match.params.goodsId}`);
                response = await response.json();
                if(response.result === 1){
                    setValues(response.data);
                    setWithGoods(response.withGoods);
                    setShopGoods(response.shopGoods);
                    if(response.detailData){
                        let loadImages = [];
                        let loadKeyword = [];
                        for(let i = 0; i < response.detailData.length; i++){
                            if(response.detailData[i].goodsDetail_kind === 1 || response.detailData[i].goodsDetail_kind === 3){
                                loadImages.push(response.detailData[i].goodsDetail_value);
                            }else if(response.detailData[i].goodsDetail_kind === 2 || response.detailData[i].goodsDetail_kind === 4){
                                loadKeyword.push({txt: response.detailData[i].goodsDetail_value, kind: response.detailData[i].goodsDetail_kind,no: response.detailData[i].goodsDetail_no, delete: false})
                            }
                        }
                        setImages(loadImages);
                        setKeyword(loadKeyword);
                    }
                    let changeKindText;
                    switch(response.data.goods_kind){
                        case 1:
                            changeKindText = "??????";
                            break;
                        case 2:
                            changeKindText = "??????";
                            break;
                        case 3:
                            changeKindText = "??????";
                            break;
                        case 4:
                            changeKindText = "??????";
                            break;
                        default :
                            break;
                    }
                    setKindText(changeKindText);
                }else{
                    enqueueSnackbar(`????????? ???????????????.`, { variant: 'error'});
                    props.history.push('/admin/goods');
                }
            }
          }
        fetchMyAPI();
    },[]);

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
        await axios.post(`/api/admin/goods/${props.match.params.goodsId}/delete`, formData, config).then((response)=>{
            if(response.data.result === 1){
                props.history.push(`/admin/goods`);
                enqueueSnackbar(`????????? ?????????????????????.`, { variant: 'success'});
            }else{
                setOpenDelete(false);
                enqueueSnackbar(`????????? ????????? ????????? ???????????????.`, { variant: 'warning'});
            }
        });
    }

    const [openWithGoods, setOpenWithGoods] = useState(false);
    const handleCloseWithGoods = () => {
        setSearching(false);
        setGoodsList([]);
        setAddGoodsList([]);
        setSearchGoods('');
        setOpenWithGoods(false);
    };
    const [searchGoods, setSearchGoods] = useState();
    const [searching, setSearching] = useState(false);
    const [goodsList, setGoodsList] = useState([]);
    const [addGoodsList, setAddGoodsList] = useState([]);
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
                        enqueueSnackbar(`???????????? ????????? ????????????.`, { variant: 'error'});
                        setGoodsList([]);
                        setSearching(false);
                    }
                });
            },1500);
        }else{
            enqueueSnackbar(`?????? ?????? ??????????????????.`, { variant: 'error'});
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

    const handleClickAddWithGoods = async() => {
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
            await axios.post(`/api/admin/goods/${props.match.params.goodsId}/withGoods`, formData, config).then((response)=>{
                if(response.data){
                    handleCloseWithGoods();
                    enqueueSnackbar(`?????? ????????? ?????????????????????.`, { variant: 'success'});
                    setWithGoods(response.data);
                }else{
                    enqueueSnackbar(`Error`, { variant: 'error'});
                }
            });
        }else{
            enqueueSnackbar(`????????? ??? ?????? ?????? ???????????? ?????????.`, { variant: 'error'});
        }
    } 

    const [withGoodsSearch, setWithGoodsSearch] = useState('');
    const [withGoodsSelect, setWithGoodsSelect] = useState('goods_name');
    const handleChangeWithGoodsSearch = (event) =>{
        setWithGoodsSearch(event.target.value);
    }
    const handleChangeWithGoodsSelect = (event) =>{
        setWithGoodsSelect(event.target.value);
    }
    const filterGoods = (data) => {
        data.sort();
        data = data.filter((contact) =>{
            return contact[withGoodsSelect].toString().toLowerCase().indexOf(withGoodsSearch) > -1;
        });
        return data;
    }

    const [shopGoodsSearch, setShopGoodsSearch] = useState('');
    const [shopGoodsSelect, setShopGoodsSelect] = useState('shop_name');
    const handleChangeShopGoodsSearch = (event) =>{
        setShopGoodsSearch(event.target.value);
    }
    const handleChangeShopGoodsSelect = (event) =>{
        setShopGoodsSelect(event.target.value);
    }
    const filterShopGoods = (data) => {
        data.sort();
        data = data.filter((contact) =>{
            return contact[shopGoodsSelect].toString().toLowerCase().indexOf(shopGoodsSearch) > -1;
        });
        return data;
    }

    const [openDeleteWithGoods, setOpenDeleteWithGoods] = useState(false);
    const [deleteKey, setDeleteKey] = useState();
    const deleteWithGoods = (key) => {
        setDeleteKey(key);
        setOpenDeleteWithGoods(true);
    }
    const handleCloseDeleteWithGoods = () => {
        setOpenDeleteWithGoods(false);
    }
    const handleClickDeleteWithGoods = async(key) => {
        const formData = new FormData();
        formData.append('goodsNo', withGoods[key].goods_no);
        const config = {
            headers: {
                "content-type": "application/json"
            }
        };
        await axios.post(`/api/admin/goods/${props.match.params.goodsId}/withGoodsDelete`, formData, config).then((response)=>{
            if(response.data.result > 0){
                setDeleteKey('');
                setOpenDeleteWithGoods(false);
                enqueueSnackbar(`?????? ????????? ?????????????????????.`, { variant: 'success'});
                let deleteWithGoods = [...withGoods];
                for(let i = 0; i < deleteWithGoods.length; i++){
                    const itemToFind = deleteWithGoods.find(function(item) {return item.goods_no === withGoods[key].goods_no})
                    const idx = deleteWithGoods.indexOf(itemToFind)
                    if (idx > -1) deleteWithGoods.splice(idx, 1)
                }
                setWithGoods(deleteWithGoods);
            }else{
                enqueueSnackbar(`Error`, { variant: 'error'});
            }
        });
    };
    return(
        <>
        <Grid className={classes.root}> 
            <Paper className={classes.paper}>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={6}>
                        <div  className={classes.title}>?????? ??????</div>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={10} className={classes.buttonGroup}>
                        <Button variant="contained" className={classes.buttonOption} onClick={()=>props.history.push(`/admin/goods/${props.match.params.goodsId}/update`)}>
                        ??????
                        </Button>
                        <Button variant="contained" color="secondary" className={classes.buttonOption} onClick={() => setOpenDelete(true)}>
                        ??????
                        </Button>
                    </Grid>
                </Grid>
                <Grid container alignItems="flex-start" justify="center">
                    <Grid xs={5} className={classes.gridGroup}>
                        <Table className={classes.table}>
                            <TableRow>
                                <TableCell className={classes.tableCellTitle}>?????? ???</TableCell>
                                <TableCell colSpan={3} className={classes.tableCellValue}>{values.goods_name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.tableCellTitle}>?????????</TableCell>
                                <TableCell className={classes.tableCellValue}>{kindText}</TableCell>
                                <TableCell className={classes.tableCellTitle}>?????????</TableCell>
                                <TableCell className={classes.tableCellValue}>{values.sport_name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.tableCellTitle}>?????? ??????</TableCell>
                                <TableCell colSpan={3} className={classes.tableCellValue}>
                                    {keyword.map((item, i)=>(
                                        
                                        <Chip label={`# ${item.txt}`} key={i} color={item.kind === 2 ? "secondary" : "primary" } className={classes.keyword} variant="outlined" size="small" />
                                    ))}
                                </TableCell>
                            </TableRow>
                            {images.length ?
                            <TableRow>
                                <TableCell colSpan={4} className={classes.tableCellValue} style={{padding:"2em"}}>
                                    <Carousel
                                        
                                        autoPlay={false}
                                        animation="slide"
                                        timeout={300}
                                    >
                                    {images.map((img, i) => (    
                                        <img src={img} key={i} style={{width: "300px", height: "300px"}} alt=""/>
                                    ))}
                                    </Carousel>
                                </TableCell>
                            </TableRow>
                            : null}
                            {values.goods_info ? 
                            <TableRow>
                                <TableCell colSpan={4} className={classes.tableCellValue} style={{textAlign:"left"}}><div dangerouslySetInnerHTML={ {__html: values.goods_info.replaceAll("\n","<br/>")} }></div></TableCell>
                            </TableRow>
                            : null}
                            <TableRow>
                                <TableCell className={classes.tableCellTitle}>?????????</TableCell>
                                <TableCell className={classes.tableCellValue}>{values.goods_manufacturer}</TableCell>
                                <TableCell className={classes.tableCellTitle}>?????? ??????</TableCell>
                                <TableCell className={classes.tableCellValue}>{values.goods_status === 2 ? "??????" : "?????????"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.tableCellTitle}>?????????</TableCell>
                                <TableCell className={classes.tableCellValue}>{values.goods_releaseDate !== "0000-00-00" ? values.goods_releaseDate : null}</TableCell>
                                <TableCell className={classes.tableCellTitle}>?????????</TableCell>
                                <TableCell className={classes.tableCellValue}>{values.goods_releasePrice ? `${values.goods_releasePrice}???` : null}</TableCell>
                            </TableRow>
                        </Table>
                    </Grid>
                    <Grid container xs={5} alignItems="flex-start" justify="space-between" className={classes.gridGroup}>
                        <Grid xs={12}>
                            <b>?????? ??????</b>
                        </Grid>
                        <Grid xs={2}>
                            <FormControl required className={classes.searchForm}>
                                <Select
                                    native
                                    value={withGoodsSelect}
                                    onChange={handleChangeWithGoodsSelect}
                                >
                                    <option value={"goods_no"}>?????? ??????</option>
                                    <option value={"goods_name"} selected>?????? ???</option>
                                    <option value={"goods_manufacturer"}>?????????</option>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid xs={6}>
                            <TextField
                                value={withGoodsSearch}
                                onChange={handleChangeWithGoodsSearch}
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
                        <Grid xs={3}>
                            <Button variant="outlined" size="small" color="primary" className={classes.addBtn} onClick={() => setOpenWithGoods(true)} >
                            ?????? ??????
                            </Button>
                        </Grid>
                        <Table className={classes.listTable}>
                            <TableRow>
                                <TableCell className={classes.listTableCellTitle}>?????? ??????</TableCell>
                                <TableCell className={classes.listTableCellTitle}>?????? ???</TableCell>
                                <TableCell className={classes.listTableCellTitle}>?????????</TableCell>
                                <TableCell className={classes.listTableCellTitle}>??????</TableCell>
                            </TableRow>
                            {filterGoods(withGoods).length ?
                                filterGoods(withGoods).map((goods, i) => (
                            <TableRow key={i}>
                                <TableCell className={classes.listTableCellValue}>{goods.goods_no}</TableCell>
                                <TableCell className={classes.listTableCellValue}><Link href={`/admin/goods/${goods.goods_no}`}>{goods.goods_name}</Link></TableCell>
                                <TableCell className={classes.listTableCellValue}>{goods.goods_manufacturer}</TableCell>
                                <TableCell className={classes.listTableCellValue}>
                                    <Button variant="outlined" size="small" color="secondary" onClick={() => deleteWithGoods(i)}>
                                    ??????
                                    </Button>
                                </TableCell>
                            </TableRow>)) :
                            <TableRow>
                                <TableCell colSpan={4} className={classes.listTableCellValue}>?????? ????????? ????????????.</TableCell>
                            </TableRow>}                       
                        </Table>
                        <Grid xs={12} style={{marginTop:"10px"}}>
                            <b>????????? ?????? ??????</b>
                        </Grid>
                        <Grid xs={2}>
                            <FormControl required className={classes.searchForm}>
                                <Select
                                    native
                                    value={shopGoodsSelect}
                                    onChange={handleChangeShopGoodsSelect}
                                >
                                    <option value={"shop_no"}>?????? ??????</option>
                                    <option value={"shop_name"} selected>?????? ???</option>
                                    <option value={"shop_num"}>????????? ????????????</option>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid xs={6}>
                            <TextField
                                value={shopGoodsSearch}
                                onChange={handleChangeShopGoodsSearch}
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
                        <Grid xs={3}></Grid>
                        <Table className={classes.table}>
                            <TableRow>
                                <TableCell className={classes.tableCellTitle}>?????? ??????</TableCell>
                                <TableCell className={classes.tableCellTitle}>?????? ???</TableCell>
                                <TableCell className={classes.tableCellTitle}>????????? ????????????</TableCell>
                            </TableRow>
                            {filterShopGoods(shopGoods).length ?
                                filterShopGoods(shopGoods).map((shop, i) => (
                            <TableRow key={i}>
                                <TableCell className={classes.tableCellValue}>{shop.shop_no}</TableCell>
                                <TableCell className={classes.tableCellValue}><Link href={`/admin/shop/${shop.shop_no}`}>{shop.shop_name}</Link></TableCell>
                                <TableCell className={classes.tableCellValue}>{shop.shop_num}</TableCell>
                            </TableRow>
                                )):
                            <TableRow>
                                <TableCell colSpan={3} className={classes.tableCellValue}>????????? ?????? ????????? ????????????.</TableCell>
                            </TableRow>
                            }
                        </Table>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={10}>
                        <hr/>
                        ?????? ??????
                        <hr/>
                        ?????? ?????? & ?????? ?????? ??????
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
        <DialogMsg 
            open={openWithGoods}
            title="?????? ????????? ???????????????."
            btn="??????"
            count={addGoodsList.length}
            handleClick={handleClickAddWithGoods}
            handleClose={handleCloseWithGoods}
        >
            <Grid container alignItems="center" justify="space-between">
                <Grid xs={9}>
                    <TextField
                        label="?????? ???"
                        helperText="?????? ????????? ???????????????."
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
                        ??????
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
            open={openDelete}
            title="????????? ???????????????."
            btn="??????"
            handleClick={handleClickDelete}
            handleClose={handleCloseDelete}
        >
            &nbsp;'??????' ?????? ?????? ??? ????????? ?????? ????????? ????????????, ????????? ????????? ????????? ??? ????????????.<br/>????????? ?????? ???????????????????
        </DialogMsg>
        <DialogMsg 
            open={openDeleteWithGoods}
            title="?????? ????????? ???????????????."
            btn="??????"
            handleClick={() => handleClickDeleteWithGoods(deleteKey)}
            handleClose={handleCloseDeleteWithGoods}
        >
            &nbsp;'??????' ?????? ?????? ??? ?????? ????????? ?????? ????????? ????????????, ????????? ????????? ????????? ??? ????????????.<br/>????????? ?????? ???????????????????
        </DialogMsg>
        </>
    );
}

export default GoodsDetail;