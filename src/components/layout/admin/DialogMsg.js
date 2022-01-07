import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Badge } from '@material-ui/core';

const DialogMsg = (props) => {
    return(
    <Dialog
        open={props.open}
        keepMounted
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
    >
        <DialogTitle id="alert-dialog-slide-title" style={{minWidth:"500px"}}>{props.title}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                {props.children}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.handleClose}>
                닫기
            </Button>
            {props.btn ?
            <Button onClick={props.handleClick} color="primary">
                <Badge badgeContent={props.count} color="secondary">
                {props.btn}
                </Badge>
            </Button>:null}
        </DialogActions>
    </Dialog>
    )
}
export default DialogMsg;