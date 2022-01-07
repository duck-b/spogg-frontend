import React, { useState } from 'react';
import board_play_main from 'img/board_play_main.jpg';
import board_review_main from 'img/board_review_main.jpg';
import board_gram_main from 'img/board_gram_main.jpg';
import board_video_main from 'img/board_video_main.jpg';
import board_column_main from 'img/board_column_main.jpg';
import { useSnackbar } from 'notistack';


const BoardKind = (props) => {
    const { enqueueSnackbar } = useSnackbar();
    const handleClickNotReady = () => {
        enqueueSnackbar(`준비중 입니다.`, {variant: 'warning'});
    }
    return(
        <>
            <div className="board_kind_list">
                <div onClick={() => props.history.push('/board/1')}>
                    <div className="board_kind_img">
                        <img src={board_play_main} alt="" draggable={false}/>
                        <div>
                            <p>스포츠 활동</p>
                            스포츠 용품을 공유하고<br/>자신의 용품을 자랑해 보세요.
                        </div>
                    </div>
                </div>
                <div onClick={handleClickNotReady}>
                    <div className="board_kind_img">
                        <img src={board_review_main} alt="" draggable={false}/>
                        <div>
                            <p>상품 리뷰</p>
                            상품에 대한 솔직한<br/>리뷰를 남겨주세요.
                        </div>
                    </div>
                </div>
                <div onClick={() => props.history.push('/board/3')}>
                    <div className="board_kind_img">
                        <img src={board_gram_main} alt="" draggable={false}/>
                        <div>
                            <p>운동 그램</p>
                            스포츠 일상을 공유하고<br/>자신의 기록을 남겨보세요.
                        </div>
                    </div>
                </div>
                <div onClick={handleClickNotReady}>
                    <div className="board_kind_img">
                        <img src={board_video_main} alt="" draggable={false}/>
                        <div>
                            <p>영상</p>
                            영상을 통해서 스포츠 활동을<br/>공유해 보세요.
                        </div>
                    </div>
                </div>
                <div onClick={() => props.history.push('/board/5')}>
                    <div className="board_kind_img board_kind_lastImg">
                        <img src={board_column_main} alt="" draggable={false}/>
                        <div>
                            <p>칼럼</p>
                            스포츠 전문가들이<br/>제공하는 꿀팁!
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BoardKind;