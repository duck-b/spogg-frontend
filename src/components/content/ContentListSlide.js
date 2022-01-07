import React from 'react';
import { Link } from '@material-ui/core'
import main_content_list from 'img/main_content_list.png'

const ContentListHarf = () => {
    return(
        <>
            <td className="content_list_td">
                <img src={main_content_list} alt="" draggable={false}/>
                <div className="content_list_title">K 글러브</div>
                <div className="content_list_content">가죽 재질로 제작되었고, 2008 올림픽에서 사용...가죽 재질로 제작되었고, 2008 올림픽에서 사용...가죽 재질로 제작되었고, 2008 올림픽에서 사용...</div>
                <div className="content_hashtag">
                    <Link href="javascript:;"># 가벼운</Link>
                    <Link href="javascript:;"># 가성비</Link>
                </div>
            </td>
        </>
    );
}

export default ContentListHarf;