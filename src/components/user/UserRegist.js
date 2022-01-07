import React, { useEffect, useState } from 'react';
import { Stepper, Step, StepLabel, Button, CircularProgress, Grid, StepConnector, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Divider, Link, Typography, Chip } from '@material-ui/core';
import { Add, Check, CheckCircleOutline, CheckCircle } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import MuiCheckbox from '@material-ui/core/Checkbox';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import DialogAgree from 'components/layout/user/DialogAgree';

const Checkbox = withStyles({
    root:{
        '&$checked':{
            color: '#5093FF'
        }
    },
    checked:{}
})(MuiCheckbox);

const Connector = withStyles({
    alternativeLabel: {
      top: 10,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)',
    },
    active: {
      '& $line': {
        borderColor: '#5093FF',
      },
    },
    completed: {
      '& $line': {
        borderColor: '#5093FF',
      },
    },
    line: {
      borderColor: '#eaeaf0',
      borderTopWidth: 3,
      borderRadius: 1,
    },
})(StepConnector);



const UserLogin = (props) => {
    //console.log(props.history.location.state);
    const [open, setOpen] = useState(false);
    const [agree, setAgree] = useState(0);
    const handleClickAgree = (key) => {
        window.history.pushState(null, null, '');
        setAgree(key);
        setOpen(true);
    }
    const handlecloseAgree = () => {
        setOpen(false);
    }
    const [cookies, setCookie, removeCookie] = useCookies(['userKey', 'beforePage']);
    const steps = ['약관 동의', '간단 정보 입력', '관심 종목 선택'];
    
    const [activeStep, setActiveStep] = useState(0);

    const [checked, setChecked] = useState([false, false, false]);
    const [checkedAll, setCheckedAll] = useState(false);
    const handleClickCheckedAll = () => {
        if(!checkedAll){
            setChecked([true, true, true]);
            setCheckedAll(true);
        }else{
            setChecked([false, false, false]);
            setCheckedAll(false);
        }
    }
    const [nickName, setNickName] = useState();
    const [gender, setGender] = useState();
    const [birth, setBirth] = useState({
        year: 0,
        month: 0,
        day: 0
    });
    const [nextDisable, setNextDisable] = useState(false);

    const now = new Date();
    let selectYear = [];
    for(let i = now.getFullYear(); i > now.getFullYear()-120; i--){
        selectYear.push(i);
    }

    const selectMonths = [1,2,3,4,5,6,7,8,9,10,11,12];
    const [selectDays, setSelectDays] = useState([]);
    const [sports, setSports] = useState([]);
    useEffect(() => {
        !props.history.location.state && props.history.goBack();
        async function fetchMyAPI(){
            if(await fetch('/api/regist')){
                let response = await fetch('/api/regist')
                response = await response.json();
                setSports(response);
            }
        }
        fetchMyAPI();
    },[])
    useEffect(() => {
        if(activeStep === 0){
            if(checked[0] && checked[1]){
                setNextDisable(false);
                return ;
            }else{
                setNextDisable(true);
                return ;
            }
        }else if(activeStep === 1){
            if(nickName && gender && birth.year !== 0 && birth.month !== 0 && birth.day !== 0){
                setNextDisable(false);
                return ;
            }else{
                setNextDisable(true);
                return ;
            }
        }else if(activeStep === 2){
            let checkedSport = true;
            for(let i = 0; i<sports.length; i++){
                if(sports[i].sport_favorite){
                    checkedSport = false;
                    break;
                }
            }
            setNextDisable(checkedSport);
        }
    })
    const handleChangeNickName = (event) => {
        setNickName(event.target.value);
        setNickNameError('');
    }
    const handleChangeYear = (event) => {
        setBirth({...birth, year: event.target.value, month: 0, day: 0});
    }
    const handleChangeMonth = (event) => {
        setBirth({...birth, month: event.target.value, day: 0});
        let endDays = 0;
        if([1,3,5,7,8,10,12].includes(parseInt(event.target.value))){
            endDays = 31;
        }else if([4,6,9,11].includes(parseInt(event.target.value))){
            endDays = 30;
        }else{
            if(birth.year % 4 === 0){
                endDays = 29;
            }else{
                endDays = 28;
            }
        }
        let changDays = [];
        for(let i = 0; i < endDays; i++){
            changDays.push(i+1);
        }
        setSelectDays(changDays);
    }
    const handleClickSport = (key) => {
        let clickSport = [...sports];
        clickSport[key].sport_check = !clickSport[key].sport_check;
        if(clickSport[key].sport_check === false){
            clickSport[key].sport_favorite = false;
        }
        setSports(clickSport);
    }
    const handleClickFavoriteSport = (key) => {
        let clickFavoriteSport = [...sports];
        for(let i=0; i<sports.length; i++){
            clickFavoriteSport[i].sport_favorite = false;
        }
        clickFavoriteSport[key].sport_favorite = !sports[key].sport_favorite;
        setSports(clickFavoriteSport);
    }

    const [nickNameError, setNickNameError] = useState('');
    const handleClickNext = () => {
        if(activeStep === 2){
            setActiveStep(activeStep + 1);
            setTimeout(async function(){
                const data = {
                    sns: props.history.location.state,
                    checked: checked,
                    nickName: nickName,
                    gender: gender,
                    birth: birth,
                    sports: sports
                }
                const config = {
                    headers: {
                        "content-type": "application/json"
                    }
                };
                await axios.post("/api/regist/create", data, config).then((response)=>{
                    
                    if(response.data.result === 1){
                        setCookie('userKey', response.data.userKey, {path: '/'});
                        if(cookies.beforePage){
                            removeCookie('beforePage', {path: '/'});
                        }
                        props.history.replace('/', {login: 'frist'});
                    }else{
                        props.history.replace('/user/regist');
                    }
                });
            },[1200]);
        }else if(activeStep === 1){
            if(nickName.length > 3){
                async function checkedNickName(){
                    const data = {
                        nickName: nickName,
                    }
                    const config = {
                        headers: {
                            "content-type": "application/json"
                        }
                    };
                    await axios.post("/api/regist/checkId", data, config).then((response)=>{
                        if(response.data.status === 1){
                            setActiveStep(activeStep + 1);
                        }else{
                            setNickName('');
                            document.getElementById('nickName').focus();
                            setNickNameError('중복된 닉네임 입니다.');
                        }
                    });
                }
                checkedNickName();
            }else{
                setNickName('');
                document.getElementById('nickName').focus();
                setNickNameError('4글자 이상만 사용할 수 있습니다.');
            }
        }else if(activeStep === 0){
            setActiveStep(activeStep + 1);
        }
    }
    const handleClickBack = () => {
        if(activeStep === 1){
            setNickName('');
            setGender('');
            setBirth({year: 0, month: 0, day: 0});
        }else if(activeStep === 2){
            let resetSport = [...sports];
            for(let i = 0; i < resetSport.length; i++){
                resetSport[i].check = false;
            }
            setSports(resetSport);
        }
        setActiveStep(activeStep - 1);
    }
    return(
        <>
            <div className="regist_form">
                <Stepper activeStep={activeStep} alternativeLabel connector={<Connector />}>
                    {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel color="#5093FF">{label}</StepLabel>
                    </Step>
                    ))}
                </Stepper>
                <Grid item container justify="center" className="regist_content">
                    {activeStep === 0 ? (
                    <>
                    <Grid item xs={10}>
                        <Typography >
                            <p>스포지지 서비스를 이용하기 위해서는 약관에 동의가 필요합니다.</p>
                        </Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <List style={{padding: '0px', border: '1px solid rgba(0, 0, 0, 0.12)', marginTop: '15px'}}>
                            <ListItem dense button onClick={handleClickCheckedAll}>
                                <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={checkedAll === true}
                                    color="primary"
                                    icon={<CheckCircleOutline />}
                                    checkedIcon={<CheckCircle />}
                                />
                                </ListItemIcon>
                                <ListItemText primary="전체 동의"  className="regist_agree_text"/>
                            </ListItem>
                            <Divider/>
                            <ListItem dense button onClick={() => setChecked([!checked[0], checked[1], checked[2]])}>
                                <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={checked[0] === true}
                                    color="primary"
                                    icon={<CheckCircleOutline />}
                                    checkedIcon={<CheckCircle />}
                                />
                                </ListItemIcon>
                                <ListItemText primary="서비스 이용약관 동의" secondary="(필수)" className="regist_agree_text" />
                                <ListItemSecondaryAction onClick={() => handleClickAgree(0)}>
                                    <Link href="javascript:;" className="regist_agree_view">보기</Link>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem dense button onClick={() => setChecked([checked[0], !checked[1], checked[2]])}>
                                <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={checked[1] === true}
                                    color="primary"
                                    icon={<CheckCircleOutline />}
                                    checkedIcon={<CheckCircle />}
                                />
                                </ListItemIcon>
                                <ListItemText primary="개인정보 수집 및 이용 동의" secondary="(필수)"  className="regist_agree_text" />
                                <ListItemSecondaryAction onClick={() => handleClickAgree(1)}>
                                    <Link href="javascript:;" className="regist_agree_view">보기</Link>
                                </ListItemSecondaryAction>
                            </ListItem>
                            {/* <ListItem dense button onClick={() => setChecked([checked[0], checked[1], !checked[2], checked[3]])}>
                                <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={checked[2] === true}
                                    color="primary"
                                    icon={<CheckCircleOutline />}
                                    checkedIcon={<CheckCircle />}
                                />
                                </ListItemIcon>
                                <ListItemText primary="필수 고지 / 기타 알림 동의" secondary="(필수)"  className="regist_agree_text" />
                                <ListItemSecondaryAction>
                                    <Link href="javascript:;" target="_blank" className="regist_agree_view">보기</Link>
                                </ListItemSecondaryAction>
                            </ListItem> */}
                            <ListItem dense button onClick={() => setChecked([checked[0], checked[1], !checked[2]])}>
                                <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={checked[2] === true}
                                    color="primary"
                                    icon={<CheckCircleOutline />}
                                    checkedIcon={<CheckCircle />}
                                />
                                </ListItemIcon>
                                <ListItemText primary="프로모션 정보 수신 동의" secondary="(선택)" className="regist_agree_text" />
                                <ListItemSecondaryAction onClick={() => handleClickAgree(2)}>
                                    <Link href="javascript:;" className="regist_agree_view">보기</Link>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                    </Grid>
                    </>
                    ) : activeStep === 1 ? (
                    <Grid item xs={10} container justify="space-between">
                        <Grid item xs={7}>
                            <input type="text" placeholder="닉네임" id="nickName" className="regist_info_input" value={nickName} onChange={handleChangeNickName} style={{borderColor: nickNameError ? 'red' : ''}}/>
                        </Grid>
                        <Grid item xs={4} className="regist_info_button_group">
                            <button className="regist_info_button" style={{color: gender === '1' ? '#000000' : '#BDBDBD'}} onClick={() => setGender('1')}>남</button>
                            <button className="regist_info_button" style={{color: gender === '2' ? '#000000' : '#BDBDBD'}} onClick={() => setGender('2')}>여</button>
                        </Grid>
                        {nickNameError ?
                        <Grid item xs={12}>
                            <span className="regist_info_nickname_error">{nickNameError}</span>
                        </Grid>:null}
                        <Grid item xs={12}>
                            <div className="regist_info_select_title">생년월일</div>
                            <Grid item container className="regist_info_select_group">
                                <Grid item xs={4}>
                                    <select className="regist_info_select" onChange={handleChangeYear}>
                                        <option selected={Number(birth.year) === 0 ? true : false}></option>
                                        {selectYear.map((year, i) => (
                                        <option value={year} selected={year === Number(birth.year) ? true : false} >{year}</option>
                                        ))}
                                    </select>
                                    <dvi className="regist_info_select_text">년</dvi>
                                </Grid>
                                <Grid item xs={4}>
                                    <select className="regist_info_select" onChange={handleChangeMonth}>
                                        <option selected={Number(birth.month) === 0 ? true : false}></option>
                                        {birth.year ? 
                                        selectMonths.map((month, i) => (
                                        <option value={month} selected={month === Number(birth.month) ? true : false} >{month}</option>
                                        ))
                                        :null}
                                    </select>
                                    <dvi className="regist_info_select_text">월</dvi>
                                </Grid>
                                <Grid item xs={4}>
                                    <select className="regist_info_select" onChange={(event) => setBirth({...birth, day: event.target.value})}>
                                        <option selected={Number(birth.day) === 0 ? true : false}></option>
                                        {birth.month ? 
                                        selectDays.map((day, i) => (
                                        <option value={day} selected={day === Number(birth.day) ? true : false} >{day}</option>
                                        ))
                                        :null}
                                    </select>
                                    <dvi className="regist_info_select_text">일</dvi>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    ) : activeStep === 2 ? (
                    <>
                    <Grid item container justify="center" className="regist_sport_btn_group">
                        <Grid item xs={10}>
                            <Typography >딱 맞는 컨텐츠를 보여드립니다</Typography>
                            {sports.map((sport,i) => (
                                <Chip 
                                    variant="outlined" 
                                    clickable label={sport.sport_name} 
                                    icon={sport.sport_check ? <Check/> : <Add />} 
                                    color={sport.sport_check ? 'primary' : ''}
                                    onClick={() => handleClickSport(i)}
                                    className="regist_info_sport"
                                />
                            ))}
                        </Grid>
                    </Grid>
                    <Grid item container justify="center" className="regist_sport_favorite_btn_group">
                        <Grid item xs={10}>
                            <Typography className="user_sport_update_info">가장 선호하는 종목을 선택해 주세요.<span style={{color: '#5093FF'}}> (1개 필수 선택)</span></Typography>
                            {sports.map((sport, i) => (
                                sport.sport_check ?
                                <Chip 
                                    variant="outlined" 
                                    clickable label={sport.sport_name} 
                                    color={sport.sport_favorite ? 'primary' : ''}
                                    onClick={() => handleClickFavoriteSport(i)}
                                    className="regist_info_sport"
                                /> :
                                null
                            ))}
                        </Grid>
                    </Grid>
                    </>
                    ) : 
                    <Grid item xs={10} className="regist_progress">
                        <CircularProgress />
                    </Grid>
                    }
                </Grid>
            </div>
            <Grid item container justify="flex-end">
                {activeStep !== 0 && activeStep !== steps.length ?
                <Grid item xs={6} className="regist_button">
                    <Button className="cancle_btn" onClick={handleClickBack}>
                        이전
                    </Button>
                </Grid>
                : null }
                {activeStep !== steps.length ?
                <Grid item xs={6} className="regist_button">
                    <Button disabled={nextDisable} className="select_btn" onClick={handleClickNext}>
                        {activeStep === steps.length - 1 ? '가입 하기' : '다음'}
                    </Button>
                </Grid>
                : null}
            </Grid>
            <DialogAgree 
                open={open}
                handleClose={handlecloseAgree}
                agree={agree}
            />
        </>
    );
}

export default UserLogin;