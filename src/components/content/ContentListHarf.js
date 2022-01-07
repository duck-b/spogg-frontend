import React from 'react';
import { Grid, Link } from '@material-ui/core';
import main_content_half from 'img/main_content_half.png';

const ContentListHarf = () => {
    return(
        <>
            <Grid item xs={6} className="content_half_group">
                <img src={main_content_half} alt="" />
                <div className="content_half_title">제 1회 전국 체전</div>
                <div className="content_half_date">21.06.12 ~ 21.07.12</div>
                <div className="content_half_profile">체육 협회</div>
            </Grid>
        </>
    );
}

export default ContentListHarf;