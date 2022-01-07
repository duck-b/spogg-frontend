import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { BottomNavbar, TopNavbar } from './';

import login_background from 'img/login_background.png';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      margin: '0px',
    },
    content: {
        minHeight: '100vh',
        boxShadow: '0px 8px 10px rgba(0, 0, 0, 0.14), 0px 3px 14px rgba(0, 0, 0, 0.12), 0px 5px 5px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#FFFFFF',
        paddingBottom: '80px'
    }
}));

const Layout = (props) => {
    const classes = useStyles();
    const [detail, setDetail] = useState();
    const [background, setBackground] = useState({});
    useEffect(() =>{
        setBackground({});
        const nowUrl = (props.history.location.pathname).split('/');
        if(nowUrl.length > 2){
            let changeDetailText;
            switch(nowUrl[2]){
                case 'event' :
                    changeDetailText = '이벤트';
                    break;
                case 'privacy' :
                    changeDetailText = '개인정보 처리 방침';
                    break;
                case 'service' :
                    changeDetailText = '이용약관';
                    break;
                case 'notice' :
                    changeDetailText = '공지사항';
                    break;
                case 'faq' :
                    changeDetailText = 'F A Q';
                    break;
                case 'login' :
                    changeDetailText = '로그인';
                    setBackground({backgroundImage: `url(${login_background})`, backgroundSize: 'cover', paddingBottom : '0px'})
                    break;
                case 'regist' :
                    changeDetailText = '회원가입';
                    setBackground({paddingBottom : '0px'})
                    break;
                case 'question' :
                    changeDetailText = '의견 보내기';
                    setBackground({paddingBottom : '0px'})
                    break;
                default :
                    if(nowUrl[1] === 'board'){
                        if(nowUrl[3] === 'create'){
                            changeDetailText = '글쓰기';
                        }else if(nowUrl[2] === '1'){
                            changeDetailText = '스포츠 활동';    
                        }else if(nowUrl[2] === '2'){
                            changeDetailText = '상품 리뷰';    
                        }else if(nowUrl[2] === '3'){
                            changeDetailText = '운동 그램';    
                        }else if(nowUrl[2] === '4'){
                            changeDetailText = '영상';    
                        }else if(nowUrl[2] === '5'){
                            changeDetailText = '전문가 칼럼';    
                        }
                    }else if(nowUrl[1] === 'user'){
                        if(nowUrl[3] === 'board'){
                            changeDetailText = '내가 작성한 글';
                        }else if(nowUrl[3] === 'save'){
                            changeDetailText = '내가 저장한 글';
                        }else if(nowUrl[3] === 'comment'){
                            changeDetailText = '내가 쓴 댓글';
                        }else if(nowUrl[3] === 'update'){
                            changeDetailText = '프로필 편집';
                        }else if(nowUrl[3] === 'follow'){
                            changeDetailText = '팔로우 리스트';
                        }else if(nowUrl[3] === 'sport'){
                            changeDetailText = '선호종목 편집';
                        }else{
                            changeDetailText = '프로필';
                        }
                    }else{
                        changeDetailText = '';
                    }
                    break;
            }
            setDetail(changeDetailText);
        }else{
            setDetail();
            if(nowUrl[1] === ""){
                setBackground({backgroundColor: 'rgba(0, 0, 0, 0.03)'})
            }
        }
    },[props.history.location.pathname]);

    return(
        <Grid container justify="center" className={classes.root}>
            <Grid item xs={12} sm={8} md={5} lg={4} xl={3} className={classes.content} style={background}>
                <TopNavbar page={props.page} detail={detail}/>
                {!detail ? <BottomNavbar page={props.page}/>: null}
                <div style={{paddingTop:'10px'}}>{props.children}</div>
            </Grid>
        </Grid>
    );
}

export default withRouter(Layout);