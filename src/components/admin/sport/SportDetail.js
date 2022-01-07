import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Button, Table, TableRow, TableCell, Chip } from '@material-ui/core';
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
    buttonGroup: {
        textAlign: 'right',
        marginTop: '10px',
        marginBottom: '10px'
    },
    buttonOption: {
        marginLeft: '5px',
        width: '50px',
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
        width: "75%",
        padding: "1em",
        fontSize: "80%"
    },
    icon: {
        width:"75%",
        padding:"1em"
    },
    secondTitle: {
        marginTop: "10px",
        marginBottom: "10px"
    },
    keyword : {
        marginRight: "5px",
    },
}));

const SportDetail = (props) => {
    const classes = useStyles();
    const [cookies] = useCookies(['adminKey']);
    const { enqueueSnackbar } = useSnackbar();

    const [values, setValues] = useState({});
    const [keyword, setkeyword] = useState({
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
    useEffect(()=> {
        async function fetchMyAPI(){
            if(await fetch(`/api/admin/sport/${props.match.params.sportId}`)){
                let response = await fetch(`/api/admin/sport/${props.match.params.sportId}`);
                response = await response.json();
                if(response.result === 1){
                    setValues(response.data);
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
                            loadKeyword[`keyword${response.keyword[i].sportDetail_page}`].push(response.keyword[i].sportDetail_keyword);
                        }
                        setkeyword(loadKeyword);
                    }  
                }else{
                    enqueueSnackbar(`잘못된 경로입니다.`, { variant: 'error'});
                    props.history.push('/admin/sport');
                }
            }
          }
        fetchMyAPI();
    }, []);

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
        await axios.post(`/api/admin/sport/${props.match.params.sportId}/delete`, formData, config).then((response)=>{
            if(response.data.result === 1){
                props.history.push(`/admin/sport`);
                enqueueSnackbar(`종목이 삭제되었습니다.`, { variant: 'success'});
            }else{
                setOpenDelete(false);
                enqueueSnackbar(`마스터 계정만 삭제가 가능합니다.`, { variant: 'warning'});
            }
        });
    }
    return(
        <>
        <Grid className={classes.root}> 
            <Paper className={classes.paper}>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={6}>
                        <div  className={classes.title}>종목 정보</div>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={10} className={classes.buttonGroup}>
                        <Button variant="contained" className={classes.buttonOption} onClick={()=>props.history.push(`/admin/sport/${props.match.params.sportId}/update`)}>
                        수정
                        </Button>
                        <Button variant="contained" color="secondary" className={classes.buttonOption} onClick={() => setOpenDelete(true)}>
                        삭제
                        </Button>
                    </Grid>
                </Grid>
                <Grid container justify="center">
                    <Grid container xs={10} alignItems="center">
                        <Grid xs={3} >
                            <img src={values.sport_icon} className={classes.icon} alt=""/>
                        </Grid>
                        <Grid xs={9}>
                            <Table className={classes.table}>
                                <TableRow>
                                    <TableCell className={classes.tableCellTitle}>대분류</TableCell>
                                    <TableCell className={classes.tableCellValue}>{values.sport_kind}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.tableCellTitle}>종목 명</TableCell>
                                    <TableCell className={classes.tableCellValue}>{values.sport_name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.tableCellTitle}>추천 기록</TableCell>
                                    <TableCell className={classes.tableCellValue}>
                                        {keyword.keyword1.map((txt, i)=>(
                                            <Chip label={`# ${txt}`} key={i} color="primary" className={classes.keyword} variant="outlined" size="small" />
                                        ))}
                                    </TableCell>
                                </TableRow>
                            </Table>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justify="center">
                    <Grid xs={10}>
                        <div className={classes.secondTitle}>
                            <b>게시판 별 키워드</b>
                        </div>
                        <Table className={classes.table}>
                            <TableRow>
                                <TableCell className={classes.tableCellTitle}>상품 연계</TableCell>
                                <TableCell className={classes.tableCellValue}>
                                    {keyword.keyword2.map((txt, i)=>(
                                        <Chip label={`# ${txt}`} key={i} color="primary" className={classes.keyword} variant="outlined" size="small" />
                                    ))}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.tableCellTitle}>상품 리뷰</TableCell>
                                <TableCell className={classes.tableCellValue}>
                                        {keyword.keyword3.map((txt, i)=>(
                                            <Chip label={`# ${txt}`} key={i} color="primary" className={classes.keyword} variant="outlined" size="small" />
                                        ))}
                                    </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.tableCellTitle}>기록</TableCell>
                                <TableCell className={classes.tableCellValue}>
                                        {keyword.keyword4.map((txt, i)=>(
                                            <Chip label={`# ${txt}`} key={i} color="primary" className={classes.keyword} variant="outlined" size="small" />
                                        ))}
                                    </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.tableCellTitle}>영상 기록</TableCell>
                                <TableCell className={classes.tableCellValue}>
                                        {keyword.keyword5.map((txt, i)=>(
                                            <Chip label={`# ${txt}`} key={i} color="primary" className={classes.keyword} variant="outlined" size="small" />
                                        ))}
                                    </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.tableCellTitle}>전문가 칼럼</TableCell>
                                <TableCell className={classes.tableCellValue}>
                                        {keyword.keyword6.map((txt, i)=>(
                                            <Chip label={`# ${txt}`} key={i} color="primary" className={classes.keyword} variant="outlined" size="small" />
                                        ))}
                                    </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.tableCellTitle}>중고 거래</TableCell>
                                <TableCell className={classes.tableCellValue}>
                                        {keyword.keyword7.map((txt, i)=>(
                                            <Chip label={`# ${txt}`} key={i} color="primary" className={classes.keyword} variant="outlined" size="small" />
                                        ))}
                                    </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.tableCellTitle}>용품</TableCell>
                                <TableCell className={classes.tableCellValue}>
                                        {keyword.keyword8.map((txt, i)=>(
                                            <Chip label={`# ${txt}`} key={i} color="primary" className={classes.keyword} variant="outlined" size="small" />
                                        ))}
                                    </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.tableCellTitle}>레슨</TableCell>
                                <TableCell className={classes.tableCellValue}>
                                        {keyword.keyword9.map((txt, i)=>(
                                            <Chip label={`# ${txt}`} key={i} color="primary" className={classes.keyword} variant="outlined" size="small" />
                                        ))}
                                    </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.tableCellTitle}>구장</TableCell>
                                <TableCell className={classes.tableCellValue}>
                                        {keyword.keyword10.map((txt, i)=>(
                                            <Chip label={`# ${txt}`} key={i} color="primary" className={classes.keyword} variant="outlined" size="small" />
                                        ))}
                                    </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.tableCellTitle}>대회</TableCell>
                                <TableCell className={classes.tableCellValue}>
                                        {keyword.keyword11.map((txt, i)=>(
                                            <Chip label={`# ${txt}`} key={i} color="primary" className={classes.keyword} variant="outlined" size="small" />
                                        ))}
                                    </TableCell>
                            </TableRow>
                        </Table>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
        
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

export default SportDetail;