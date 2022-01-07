import React, { useEffect, useState } from 'react';
import { Link } from '@material-ui/core';
import { CreatePlay, CreateReview, CreateGram, CreateVideo, CreateColumn } from './create';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const CreateBoard = (props) => {
    const [cookies] = useCookies('userKey');
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        !cookies.userKey && 
        enqueueSnackbar(`잘못된 경로입니다.`, { variant: 'error'}) &&
        props.history.replace('/');
    },[])
    return(
        <>
            {props.match.params.boardKind === '1' ?
            <CreatePlay /> :
            props.match.params.boardKind === '2' ?
            <CreateReview /> :
            props.match.params.boardKind === '3' ?
            <CreateGram /> :
            props.match.params.boardKind === '4' ?
            <CreateVideo /> :
            props.match.params.boardKind === '5' ?
            <CreateColumn /> :
            null
            }
            
        </>
    );
}

export default CreateBoard;