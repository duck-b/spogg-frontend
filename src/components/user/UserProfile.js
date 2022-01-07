import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import profileBackground from 'img/profileBackground.png';
import pro_sns_instargram from 'img/pro_sns_instargram.png';
import pro_sns_youtube from 'img/pro_sns_youtube.png';
import pro_sns_naver from 'img/pro_sns_naver.png';
import pro_sns_tstory from 'img/pro_sns_tstory.png';
import pro_sns_facebook from 'img/pro_sns_facebook.png';
import pro_sns_homepage from 'img/pro_sns_homepage.png';
import profile_board from 'img/profile_board.png';
import profile_save from 'img/profile_save.png';
import profile_comment from 'img/profile_comment.png';
import profile_point from 'img/profile_point.png';
import { Avatar, Grid, Paper, CircularProgress } from '@material-ui/core';
import MuiTab from '@material-ui/core/Tab';
import MuiTabs from '@material-ui/core/Tabs';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import UserBoardList from 'components/content/UserBoardList';
import { ArrowForwardIos, Add } from '@material-ui/icons';


const Tab = withStyles({
    root:{
        fontSize: '14px',
        '&$selected': {
            color: '#5093FF'
        }
    },
    selected:{}
})(MuiTab);

const Tabs = withStyles({
    indicator: {
        backgroundColor: '#5093FF'
    }
})(MuiTabs);

const UserProfile = (props) => {
    const [cookies] = useCookies('userKey');
    const { enqueueSnackbar } = useSnackbar();
    
    const [value, setValue] = useState({
        userNo: 0,
        userName: '',
        userProfile: '',
        sport: [],
        userFollow: true,
        countFollow: 0,
        countFollower: 0,
        userEqual: false,
        userStatus: 1,
        sportBackground: ''
    });
    useEffect(() => {
        const loadUser = async() => {
            const config = {
                headers: {
                    "content-type": "application/json"
                }
            };
            await axios.get(`/api/user/${props.match.params.userId}/${cookies.userKey}`, config).then((response)=>{
                if(response.data.result !== 0){
                    const dt = response.data.value;
                    let loadValue = {...value};
                    loadValue = {
                        userNo: dt.user_no,
                        userName: dt.user_name,
                        userProfile: dt.user_profile,
                        countFollow: dt.count_follow,
                        countFollower: dt.count_follower,
                        userFollow: dt.user_follow ? true : false,
                        userEqual: response.data.result === 2 ? true : false,
                        userStatus: dt.user_status,
                        sport: [],
                        sportBackground: dt.sport_background
                    };
                    const sportName = dt.sport_name.split(',');
                    const sportIcon = dt.sport_icon.split(',');
                    const sportFavorite = dt.sport_favorite.split(',');
                    for(let i = 0; i < sportName.length; i++){
                        loadValue.sport.push({sportName: sportName[i], sportIcon: sportIcon[i], sportFavorite: sportFavorite[i]})
                    }
                    setValue(loadValue);
                }else{
                    enqueueSnackbar(`잘못된 경로입니다.`, { variant: 'error'});
                    props.history.replace('/');
                }
            })
        }
        loadUser();
    }, []);


    const [mouseScroll, setMouseScroll] = useState(false);
    const [mouseX, setMouseX] = useState();
    const [scrollLeft, setScrollLeft] = useState();
    const handleMouseDown = (event) => {
        setMouseX(event.pageX);
        setScrollLeft(document.getElementsByClassName('user_sport_table')[0].scrollLeft);
        setMouseScroll(true);
    }
    const handleMouseMove = (event) => {
        if(mouseScroll){
            const walk = (event.pageX - mouseX)/2;
            document.getElementsByClassName('user_sport_table')[0].scrollLeft = scrollLeft - walk;
        }
    }
    const handleMouseUpOrLeave = () => {
        setMouseScroll(false);
        setMouseX();
    }
    const handleClickFollw = async() => {
        const data = {
            followUser: value.userNo,
            followerUser: cookies.userKey,
            follow: value.userFollow ? 'delete' : 'insert'
        }
        const config = {
            headers: {
                "content-type": "application/json"
            }
        };
        await axios.post("/api/user/follow", data, config).then((response) =>{
            if(response.data.result === 1){
                if(!value.userFollow){
                    enqueueSnackbar(`${value.userName}님을 팔로우 하였습니다.`, { variant: 'info'});
                    let changeValue = {...value};
                    changeValue.userFollow = true;
                    changeValue.countFollower = value.countFollower + 1;
                    setValue(changeValue);
                }else{
                    enqueueSnackbar(`${value.userName}님을 팔로우 취소 하였습니다.`, { variant: 'info'});
                    let changeValue = {...value};
                    changeValue.userFollow = false;    
                    changeValue.countFollower = value.countFollower - 1;
                    setValue(changeValue);
                }                    
            }else{
                enqueueSnackbar(`로그인이 필요합니다.`, 
                {   
                    variant: 'warning', 
                    action: <div className="alret_action">
                        <button 
                            onClick={() => props.history.push({pathname: `/user/login`, state: `${props.history.location.pathname}`})}
                        >로그인
                        </button>
                    </div>
                })
                return false;
            }
        });
    }
    const handleClickNotReady = () => {
        enqueueSnackbar(`준비중 입니다.`, {variant: 'warning'});
    }
    return(
        <>
            <div className="user_profile">
                <div className="background_gradient"/>
                <img className="background_img" src={value.sportBackground}/>
                {value.userStatus === 3 ?
                <div className="pro_user">
                    <Grid item container justify="space-between">
                        <Grid item xs={4} className="profile_img">
                            <Avatar src={value.userProfile}/>
                            <p onClick={() => props.history.push('/etc/pro/create')}>{value.userEqual ? <>정보 수정 <ArrowForwardIos/></> : null}</p>
                        </Grid>
                        <Grid item xs={8} className="profile_info">
                            <p className="name">{value.userName}</p>
                            <div className="info">
                                작성글
                                <span> 1551</span>
                            </div>
                            <div className="info" style={{textAlign: 'right'}}>
                                평점
                                <span> 4.5</span>
                            </div>
                            <div className="info">
                                활동 종목
                                <span> 축구</span>
                            </div>
                            <div className="email">
                                fsdksd@naver.com
                            </div>
                            <div className="infomation">
                                사직동 '사직 헬스장' 헬스 트레이너 활동 중
                            </div>
                        </Grid>
                    </Grid>
                </div>
                :
                <div className="nomal_user">
                    <Avatar src={value.userProfile}/>
                    <p>{value.userName}</p>
                </div>
                }
                <div className="follow_info">
                    <Grid item container justify="center" alignItems="center" >
                        <Grid item xs={6} 
                            onClick={() => props.history.push({
                                pathname: `/user/${props.match.params.userId}/follow`, 
                                state: {
                                    follow: value.countFollow, 
                                    follower: value.countFollower, 
                                    list: 0}})}
                        ><p>{value.countFollower}</p><span>followers</span></Grid>
                        <Grid item xs={6}
                            onClick={() => props.history.push({
                                pathname: `/user/${props.match.params.userId}/follow`, 
                                state: {
                                    follow: value.countFollow, 
                                    follower: value.countFollower, 
                                    list: 1}})}
                        ><p>{value.countFollow}</p><span>following</span></Grid>
                    </Grid>
                </div>
                {value.userEqual ?
                <div className="follow_button" onClick={() => props.history.push(`/user/${props.match.params.userId}/update`)}>
                    프로필 편집
                </div>
                :
                <div className="follow_button" onClick={handleClickFollw}>
                    {value.userFollow ? '팔로우 취소' : '팔로우'}
                </div>}
            </div>
            <div className="user_sport">
                {value.userStatus === 3 ?
                <Grid item container className="pro_sns" justify="space-between">
                    <Grid item container alignContent="center">
                        <img src={pro_sns_instargram} alt=""/>
                        <Grid xs={8}>인스타그램</Grid>
                    </Grid>
                    <Grid item container alignContent="center">
                        <img src={pro_sns_youtube} alt=""/>
                        <Grid xs={8}>유튜브</Grid>
                    </Grid>
                    <Grid item container alignContent="center">
                        <img src={pro_sns_naver} alt=""/>
                        <Grid xs={8}>네이버</Grid>
                    </Grid>
                    <Grid item container alignContent="center">
                        <img src={pro_sns_tstory} alt=""/>
                        <Grid xs={8}>티스토리</Grid>
                    </Grid>
                    <Grid item container alignContent="center">
                        <img src={pro_sns_facebook} alt=""/>
                        <Grid xs={8}>페이스북</Grid>
                    </Grid>
                    <Grid item container alignContent="center">
                        <img src={pro_sns_homepage} alt=""/>
                        <Grid xs={8}>개인페이지</Grid>
                    </Grid>
                </Grid>
                :null}
                <div className="user_sport_table" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave}>
                    <table>
                        <tr>
                            {value.userEqual ?
                            <td>
                                <div onClick={() => props.history.push(`/user/${props.match.params.userId}/sport`)}>
                                    <div className="user_sport_addBox"><Add /></div>
                                    <p>종목추가</p>
                                </div>
                            </td>
                            :null}
                            {value.sport.map((sport, i) => (
                                <td>
                                    <div>
                                        <img src={sport.sportIcon} draggable={false}/>
                                        <p>{sport.sportName}</p>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    </table>
                </div>
            </div>
            {value.userEqual ?
            <Grid item container className="my_page">
                <Grid item container xs={6} justify="center" onClick={() => props.history.push(`/user/${props.match.params.userId}/board`)}>
                    <Grid>
                        <img src={profile_board} alt="" />
                        <p>내가 작성한 글</p>
                    </Grid>
                </Grid>
                <Grid item container xs={6} justify="center" onClick={() =>  props.history.push(`/user/${props.match.params.userId}/save`)}>
                    <Grid>
                        <img src={profile_save} alt="" />
                        <p>내가 저장한 글</p>
                    </Grid>
                </Grid>
                <Grid item container xs={6} justify="center" onClick={() =>  props.history.push(`/user/${props.match.params.userId}/comment`)}>
                    <Grid>
                        <img src={profile_comment} alt="" />
                        <p>내가 쓴 댓글</p>
                    </Grid>
                </Grid>
                <Grid item container xs={6} justify="center" onClick={handleClickNotReady}>
                    <Grid>
                        <img src={profile_point} alt="" />
                        <p>나의 포인트</p>
                    </Grid>
                </Grid>
            </Grid>
            :<UserBoardList value={value}/>}
        </>
    );
}

export default withRouter(UserProfile);