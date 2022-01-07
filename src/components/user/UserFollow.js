import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Avatar, Grid, Paper, CircularProgress, InputBase, InputAdornment, IconButton } from '@material-ui/core';
import { Search } from '@material-ui/icons'
import MuiTab from '@material-ui/core/Tab';
import MuiTabs from '@material-ui/core/Tabs';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar, faStarHalfAlt as fasStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { set } from 'date-fns';

const useStyles = makeStyles({
    root: {
      flexGrow: 1,
      borderRadius: '0px',
      boxShadow: 'none',
      marginBottom: '10px'
    },
    tabs: {
        boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.15)',
    }
});

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

const UserFollowList = (props) => {
    const [cookies] = useCookies('userKey');
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const [follows, setFollows] = useState([]);
    const [followCount, setFollowCount] = useState({
        follow: props.history.location.state ? props.history.location.state.follow : null,
        follower: props.history.location.state ? props.history.location.state.follower : null})
    const [followSelected, setFollowSelected] = useState(props.history.location.state ? props.history.location.state.list : 0);
    const [loading, setLoading] = useState(true);
    const [thisUser, setThisUser] = useState(0);
    useEffect(() => {
        loadFollowList(followSelected);
    }, []);

    const handleChange = (event, newValue) => {
        if(newValue !== followSelected){
            loadFollowList(newValue);
            setFollowSelected(newValue);
        }
    };

    const loadFollowList = async(followKind) => {
        setLoading(true);
        const config = {
            headers: {
                "content-type": "application/json"
            }
        };
        let url = `/api/userPage/${props.match.params.userId}/${cookies.userKey}/${followKind}`;
        await axios.get(url, config).then((response)=>{
            let loadFollow = response.data.values ? response.data.values : [];
            if(followKind === 0 && loadFollow[0]){
                setFollowCount({...followCount, follower: response.data.values.length});
            }else if(followKind === 1 && loadFollow[0]){
                setFollowCount({...followCount, follow: response.data.values.length});
            }
            setThisUser(response.data.thisUser)
            setFollows(loadFollow);
            setTimeout(() => {
                setLoading(false);
            },[800]);
        })
    }

    const [search, setSearch] = useState('');
    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
    }
    const filterList = (data) => {
        data.sort();
        data = data.filter((contact) =>{
            return contact.user_name.toString().toLowerCase().indexOf(search.toLowerCase()) > -1;
        });
        return data;
    }
    const handleClickFollw = async(key) => {
        if(cookies.userKey){
            setLoading(true);
            const data = {
                followUser: follows[key].follow_user_no,
                followerUser: cookies.userKey,
                follow: follows[key].this_user_follow ? 'delete' : 'insert'
            }
            const config = {
                headers: {
                    "content-type": "application/json"
                }
            };
            await axios.post("/api/user/follow", data, config).then((response) =>{
                if(response.data.result === 1){
                    let changeFollows = [...follows];
                    if(!follows[key].this_user_follow){
                        enqueueSnackbar(`${follows[key].user_name}님을 팔로우 하였습니다.`, { variant: 'info'});
                        changeFollows[key].this_user_follow = new Date();
                        setFollows(changeFollows);
                        if(Number(props.match.params.userId) === response.data.thisUser){
                            setFollowCount({...followCount, follow : followCount.follow ? followCount.follow + 1 : null});
                        }
                    }else{
                        enqueueSnackbar(`${follows[key].user_name}님을 팔로우 취소 하였습니다.`, { variant: 'info'});
                        changeFollows[key].this_user_follow = null;
                        setFollows(changeFollows);
                        if(Number(props.match.params.userId) === response.data.thisUser){
                            setFollowCount({...followCount, follow : followCount.follow ? followCount.follow - 1 : null});
                        }
                    }
                    setTimeout(() => {
                        setLoading(false);
                    }, [800])
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
                    setTimeout(() => {
                        setLoading(false);
                    }, [800])
                    return false;
                }
            });
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
    }
    return(
        <>
            <Paper className={classes.root}>
                <Tabs
                    value={followSelected}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                    variant="fullWidth"
                    className={classes.tabs}
                >
                    <Tab label={followCount.follower ? `팔로워 ${followCount.follower}명` : '팔로워' } disabled={loading} className={classes.tab}/>
                    <Tab label={followCount.follow ?`팔로잉 ${followCount.follow}명` : '팔로잉'} disabled={loading} className={classes.tab}/>              
                </Tabs>
            </Paper>
            <div className='board_list_top'>
                <InputBase 
                    type='text' 
                    placeholder='아이디를 검색하세요' 
                    className='board_search' 
                    value={search} 
                    onChange={handleChangeSearch} 
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                >
                                <Search />
                            </IconButton>
                        </InputAdornment>}
                />
            </div>
            {!loading ?
                follows[0] ?
                    filterList(follows).map((follow, i) => (
                    <div className="user_follow_list">
                        <Grid item container justify="space-between" alignItems="center">
                            <Grid item xs={2} onClick={() => props.history.push(`/user/${follow.follow_user_no}`)}>
                                <Avatar src={follow.user_profile} className="follow_user_profile"/>
                            </Grid>
                            <Grid item xs={7} className='follow_user_name' onClick={() => props.history.push(`/user/${follow.follow_user_no}`)}>
                                {follow.user_name}<br/>
                                <span>{follow.sport_name} 선호</span>
                            </Grid>
                            <Grid item xs={3} className="follow_button">
                                
                                {follow.follow_user_no !== thisUser ?
                                    follow.this_user_follow ?
                                <button className="unfollow_btn" onClick={() => handleClickFollw(i)}>팔로우 취소</button>
                                    :
                                <button className="follow_btn" onClick={() => handleClickFollw(i)}>팔로우</button>
                                :
                                null
                                }
                            </Grid>
                        </Grid>
                    </div>
                    ))
                : <div className="user_board_loading">팔로우 리스트가 없습니다.</div>
            :
            <div className="user_board_loading">
                <CircularProgress />
            </div>
            }
        
        </>
    );
}

export default withRouter(UserFollowList);