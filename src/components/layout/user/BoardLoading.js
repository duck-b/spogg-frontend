import React from 'react';
import { Skeleton } from '@material-ui/lab';

const BoardLoading = (props) => {
    return(
        <div style={{padding: '0px 10px', marginBottom: '20px'}}>
            <Skeleton variant="rect" style={{width: '100%', borderRadius: '10px', height: '320px'}} />
            <div style={{display: 'inline-block'}}>
                <Skeleton variant="circle" width={30} height={30} />
            </div>
            <div style={{display: 'inline-block', width: '80%'}}>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
            </div>
        </div>
    )
}

export default BoardLoading;