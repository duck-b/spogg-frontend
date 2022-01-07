import react, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { Grid, Chip, Typography, Button, Divider, CircularProgress  } from '@material-ui/core';
import { Check, Add } from '@material-ui/icons';
import axios from 'axios';
import { useSnackbar } from 'notistack';


const UserSport = (props) => {
    const [cookies] = useCookies('userKey');
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        async function loadSport(){
            let response = await fetch(`/api/user/${cookies.userKey}/sport`);
            response = await response.json();
            if(response.result === 1){
                const dt = response.value;
                let loadSport = []
                for(let i = 0; i<dt.length; i++){
                    loadSport.push({
                        sportNo: dt[i].sport_no,
                        sportName: dt[i].sport_name,
                        sportCheck: dt[i].sport_favorite === null ? false : true,
                        sportFavorite: dt[i].sport_favorite === 1 ? true : false,
                        sportChangeCheck: dt[i].sport_favorite === null ? false : true
                    })
                }
                setSports(loadSport);
            }
        }
        loadSport();
    },[])
    const [sports, setSports] = useState([]);
    const handleClickSport = (key) => {
        let clickSport = [...sports];
        clickSport[key].sportCheck = !sports[key].sportCheck;
        if(clickSport[key].sportCheck === false){
            clickSport[key].sportFavorite = false;
        }
        setSports(clickSport);
    }
    const handleClickFavoriteSport = (key) => {
        let clickFavoriteSport = [...sports];
        for(let i=0; i<sports.length; i++){
            clickFavoriteSport[i].sportFavorite = false;
        }
        clickFavoriteSport[key].sportFavorite = !sports[key].sportFavorite;
        setSports(clickFavoriteSport);
    }

    const [updating, setUpdating] = useState(false);
    const [updateButton, setUpdateButton] = useState(true);
    useEffect(() => {
        setUpdateButton(true);
        for(let i = 0; i < sports.length; i++){
            if(sports[i].sportFavorite){
                setUpdateButton(false);
                return false;
            }
        }
    }, [sports]);
    
    const handleClickUpdate = async() => {
        setUpdating(true);
        let changeSport = [];
        let sportFavorite;
        for(let i = 0; i < sports.length; i++){
            if(sports[i].sportChangeCheck !== sports[i].sportCheck){
                changeSport.push(sports[i]);
            }
        }
        for(let i = 0; i < sports.length; i++){
            if(sports[i].sportFavorite){
                sportFavorite = sports[i];
            }
        }
        const data = {
            sports: changeSport,
            sportFavorite: sportFavorite
        }
        const config = {
            headers: {
                "content-type": "application/json"
            }
        };
        await axios.post(`/api/user/${cookies.userKey}/sport`, data, config).then((response)=>{
            if(response.data.result === 1){
                props.history.goBack();
            }else{
                enqueueSnackbar(`Error 관리자에게 문의해주세요.`, { variant: 'error'});
                props.history.replace('/');
            } 
        });
    }
    return(
        <>
            <Grid item container justify="center" className="user_sport_update">
                <Grid item xs={10}>
                    <Typography className="user_sport_update_info">선호하는 종목을 선택해 주세요.</Typography>
                    {sports.map((sport,i) => (
                        <Chip 
                            variant="outlined" 
                            clickable label={sport.sportName} 
                            icon={sport.sportCheck ? <Check/> : <Add />} 
                            color={sport.sportCheck ? 'primary' : ''}
                            onClick={() => handleClickSport(i)}
                            className="regist_info_sport"
                        />
                    ))}
                </Grid>
            </Grid>
            <Divider variant="middle"/>
            <Grid item container justify="center">
                <Grid item xs={10}>
                    <Typography className="user_sport_update_info">가장 선호하는 종목을 선택해 주세요.</Typography>
                    {sports.map((sport, i) => (
                        sport.sportCheck ?
                        <Chip 
                            variant="outlined" 
                            clickable label={sport.sportName} 
                            color={sport.sportFavorite ? 'primary' : ''}
                            onClick={() => handleClickFavoriteSport(i)}
                            className="regist_info_sport"
                        /> :
                        null
                    ))}
                </Grid>
            </Grid>
            <Grid item container justify="center">
                <Grid item xs={10} className="user_form_update_button">
                    {!updating ?
                    <Button  className="select_btn" disabled={updateButton} onClick={handleClickUpdate}>
                        수정 완료
                    </Button> :
                    <Button  className="select_btn" disabled>
                        <CircularProgress style={{width: '30px', height: '30px'}} />
                    </Button>
                    }
                </Grid>
            </Grid>
        </>
    )   
}
export default withRouter(UserSport);