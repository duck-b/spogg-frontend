import React, { useEffect, useState } from 'react';
import { Fab } from '@material-ui/core';
import { Edit, Search } from '@material-ui/icons';
import board_banner from 'img/board_banner.png';
import board1_banner from 'img/board1_banner.png';
import board3_banner from 'img/board3_banner.png';
import board5_banner from 'img/board5_banner.png';
import { BoardPlay, BoardReview, BoardGram, BoardVideo, BoardColumn } from './list';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';
import { InputBase, InputAdornment, IconButton } from '@material-ui/core';
import axios from 'axios';

const BoardList = (props) => {
    const [search, setSearch] = useState();
    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
        return false;
    }
    const [cookies] = useCookies('userKey');
    const { enqueueSnackbar } = useSnackbar();
    const handleClickCreate = () => {
        if(cookies.userKey){
            if(props.match.params.boardKind === '5'){
                const config = {
                    headers: {
                        "content-type": "application/json"
                    }
                };
                const checkUserStatus = async() => {
                    await axios.get(`/api/user/${cookies.userKey}/userStatus`, config).then((response)=>{
                        if(response.data.userStatus !== 3){
                            enqueueSnackbar(`전문가 등록이 필요합니다.`, 
                            {   
                                variant: 'warning', 
                                action: <div className="alret_action">
                                    <button 
                                        onClick={() => props.history.push({pathname: `/etc`})}
                                    >신청
                                    </button>
                                </div>
                            })
                            return false;
                        }else{
                            props.history.push(`/board/5/create`);            
                        }
                    }); 
                }
                checkUserStatus();
            }else{
                props.history.push(`/board/${props.match.params.boardKind}/create`);
            }
        }else{
            enqueueSnackbar(`로그인이 필요합니다.`, 
            {   
                variant: 'warning', 
                action: <div className="alret_action">
                    <button 
                        onClick={() => props.history.push({pathname: `/user/login`, state: `${props.history.location.pathname}/create`})}
                    >로그인
                    </button>
                </div>
            })
        }
    }
    const handleKeyPressSearch = (event) => {
        if(event.key === 'Enter'){
            if(search){
                props.history.replace(`/board/${props.match.params.boardKind}?${search}`);
            }
        }
    }
    return(
        <>      
            <div className='board_list_top'>
                <InputBase 
                    type='text' 
                    placeholder='Search' 
                    className='board_search' 
                    value={search} 
                    onChange={handleChangeSearch} 
                    onKeyPress={handleKeyPressSearch}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => props.history.replace(`/board/${props.match.params.boardKind}?${search}`)}
                                >
                                <Search />
                            </IconButton>
                        </InputAdornment>}
                />
                <img src={
                    props.match.params.boardKind === '1' ?
                        board1_banner :
                    props.match.params.boardKind === '3' ?
                        board3_banner :
                        board5_banner
                } alt='' className='board_banner' />
            </div>
            {props.match.params.boardKind === '1' ?
                <BoardPlay setSearch={setSearch} /> :
            props.match.params.boardKind === '2' ?
                <BoardReview /> :
            props.match.params.boardKind === '3' ?
                <BoardGram setSearch={setSearch} /> :
            props.match.params.boardKind === '4' ?
                <BoardVideo /> :
            props.match.params.boardKind === '5' ?
                <BoardColumn setSearch={setSearch} /> :
            null
            }
            <Fab color="primary" aria-label="add" className='board_create' onClick={handleClickCreate}>
                <Edit />
            </Fab>
        </>
    );
}

export default BoardList;