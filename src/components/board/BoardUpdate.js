import React, { useState } from 'react';
import { Link } from '@material-ui/core';
import { UpdatePlay, UpdateReview, UpdateGram, UpdateVideo, UpdateColumn } from './update';

const UpdateBoard = (props) => {
    return(
        <>
            {props.match.params.boardKind === '1' ?
            <UpdatePlay /> :
            props.match.params.boardKind === '2' ?
            <UpdateReview /> :
            props.match.params.boardKind === '3' ?
            <UpdateGram /> :
            props.match.params.boardKind === '4' ?
            <UpdateVideo /> :
            props.match.params.boardKind === '5' ?
            <UpdateColumn /> :
            null
            }
            
        </>
    );
}

export default UpdateBoard;