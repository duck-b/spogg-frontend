import React from 'react';
import { withRouter } from 'react-router-dom';
import icon_pen from 'img/icon_pen.png';
import { ChevronRight } from '@material-ui/icons';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';

const BoardNoContent = (props) => {
    const [cookies] = useCookies('userKey');
    const { enqueueSnackbar } = useSnackbar();
    const handleClickOtherSport = async() => {
        if(cookies.userKey){
            const config = {
                headers: {
                    "content-type": "application/json"
                }
            };
            await axios.get(`/api/user/${cookies.userKey}`, config).then((response)=>{
                if(response.data){
                    props.history.push(`/user/${response.data.user_no}/sport`);
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
        <div className="board_noContent">
            <p>선호하는 종목에 맞는 콘텐츠가 없습니다.</p>
            <button onClick={handleClickOtherSport}>선호 종목 추가하기<ChevronRight /></button>
        </div>
    )
}

export default withRouter(BoardNoContent);