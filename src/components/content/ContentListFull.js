import React from 'react';
import { Link } from '@material-ui/core';
import main_content_full from 'img/main_content_full.png';

const ContentListFull = () => {
    return(
        <div className="content_full_group">
            <Link href="javascript:;" className="content_full_img">
                <img src={main_content_full} alt="" />
            </Link>    
            <div className="content_full_title"><Link href="javascript:;">서수원 호매실 축구 파크</Link></div>
            <div className="content_hashtag">
                <Link href="javascript:;"># 축구장</Link>
                <Link href="javascript:;"># 주차장</Link>
                <Link href="javascript:;"># 야간조명</Link>
                <Link href="javascript:;"># 축구화 대여</Link>
            </div>
            <div className="content_full_content">1시간 30,000원</div>
        </div>
    );
}

export default ContentListFull;