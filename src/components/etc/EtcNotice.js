import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import { Typography, Divider } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

const Accordion = withStyles({
    root: {
      borderBottom: '1px solid #FFFFFF',
      minHeight: '60px',
      boxShadow: 'none',
      '&:before': {
        display: 'none',
      },
      '&$expanded': {
        margin: 'auto',
      },
    },
    expanded: {},
})(MuiAccordion);
  
const AccordionSummary = withStyles({
    root: {
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
      marginBottom: -1,
      backgroundColor: '#FFFFFF',
      minHeight: 60,
      '&$expanded': {
        minHeight: 60,
      },
    },
    content: {
      '&$expanded': {
        margin: '12px 0',
      },
    },
    expandIcon: {
        padding: '0px 12px',
        '&expanded': {
            padding: '0px 12px'
        }
    },
    expanded: {},
})(MuiAccordionSummary);
  
const AccordionDetails = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
    },
}))(MuiAccordionDetails);
const EtcNotice = (props) => {
    const titleText = { fontSize: '16px' }
    const contentText = { fontSize: '14px', color: 'rgba(0, 0, 0, 0.5)' }
    const dateText = { fontSize: '12px', color: 'rgba(0, 0, 0, 0.34)', margin: '0px', fontWeight: '900' }
    
    const [expanded, setExpanded] = useState();

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    const [notice, setNotice] = useState([
        {
            title: '스포지지 개인정보처리방침 안내',
            date: '2021-00-00',
            content: `안녕하세요. 
            핏데이터는 고객님들의 개인정보를 더욱 투명하고 안전하게 관리하고자 개정보처리방침을 공개하고 있으며, 변경사항 발생시 공지사항을 통해 스포지지 고객분들에게 안내하고 있습니다.
            새롭게 시작하는 개인정보처리방침 내용을 확인하시고 서비스 이용에 참고하시기 바랍니다 
            
            1. 안내내용
            2021년00월00일(오픈일)개인정보처리방침안내 확인
            
            2. 시기
            개인정보처리방침은 2021년 00월 00에(오픈일) 효력이 발생됩니다.
            
            3. 이의 및 문의제기
            - 개인정보처리방침 내용에 대한 문의와 이의제기는 개인정보 고충처리부서로 문의 주시기 바랍니다.
            (대표전화 : 010-2239-6702, 상담시간 월~금 09:00 ~ 19:00 (주말, 공휴일 제외))
            - 해당 개인정보처리방침 내용에 동의하지 않으시는 경우, 회원탈퇴를 요청 할 수 있습니다.
            
            앞으로 보다 나은 서비스를 제공할 수 있도록 최선의 노력을 다하는 스포지지가 되도록 하겠습니다.
            감사합니다.
            `
        },
        {
            title: '스포지지 서비스 오픈 안내',
            date: '2021-00-00',
            content: `안녕하세요. 핏데이터입니다.
            핏데이터는 올바른 스포츠 정보를 통해 스포츠 라이프를 즐길 수 있게 해주는 ‘스포지지' 서비스를 오픈했습니다.
            다양한 스포츠 정보 콘텐츠를 통해, 더욱 더 즐거운 스포츠 활동을 할 수 있게 도움을 줄 수 있는 핏데이터가 되겠습니다. 
            감사합니다.`
        }
    ]);
    return(
        <>
            {notice.map((notice, i) => (
            <>
            <Accordion square expanded={expanded === `panel${i}`} onChange={handleChange(`panel${i}`)}>
                <AccordionSummary aria-controls={`panel${i}d-content`} id={`panel${i}d-header`} expandIcon={<ExpandMore />}>
                    <Typography style={titleText}>
                        {notice.title}
                        <p style={dateText}>{notice.date}</p>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography style={contentText} >
                        {notice.content.split('\n').map((line) => {return <>{line}<br/></>})}
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Divider variant="middle"/>
            </>
            ))}
        </>
    );
}

export default EtcNotice;