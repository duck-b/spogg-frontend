import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiInputBase from '@material-ui/core/InputBase';
import MuiFormControl from '@material-ui/core/FormControl';
import MuiChip from '@material-ui/core/Chip'
import { Typography, Divider, InputAdornment, IconButton } from '@material-ui/core';
import { ExpandMore, Search } from '@material-ui/icons';

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
      //borderBottom: '1px solid rgba(0, 0, 0, 0.125)',
      marginBottom: -1,
      backgroundColor: '#FFFFFF',
      minHeight: 60,
      '&$expanded': {
        minHeight: 60,
        //borderBottom: '1px solid rgba(255, 255, 255)'
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

const FormControl = withStyles((theme) => ({
    root: {
        width: '100%'
    },
}))(MuiFormControl);

const InputBase = withStyles((theme) => ({
    root: {
        margin: '0px 10px',
        border: '2px solid #000000',
        height: '50px',
        padding: '10px 20px',
        fontSize: '15px',
        /*'&$focused': {
            border: '2px solid #5093FF',
        }*/
    },
    /*focused: {}*/

}))(MuiInputBase);

const Chip = withStyles((theme) => ({
    root: {
        width: '90px',
        height: '35px',
        fontSize: '15px',
        fontWeight: '400',
        '&$colorPrimary':{
            backgroundColor: '#5093FF',
            color: '#FFFFFF'
        }
    },
    colorPrimary: {}

}))(MuiChip);

const EtcFaq = (props) => {
    const titleText = { fontSize: '15px' }
    const contentText = { fontSize: '14px', color: 'rgba(0, 0, 0, 0.5)' }
    const [list, setList] = useState(1);
    const [search, setSearch] = useState('');
    const onChangeSearch = (event) => {
        setSearch(event.target.value);
    }

    const [expanded, setExpanded] = useState();
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    const [faq, setFaq] = useState([
        {
            kind: 3,
            title: '[회원정보] 회원탈퇴 후 재가입이 가능한가요?',
            content: `스포지지는 15일간 계정을 임시 보관하고 있으며, 복구할 수 있습니다.\n\n[로그인 > 복구신청]\n\n15일이 지난 이후엔 계정이 삭제되며 재가입은 언제든지 가능합니다.`
        },
        {
            kind: 3,
            title: '[회원정보] 회원정보를 수정하고 싶은데 어떻게 하나요?',
            content: `[더보기 > 마이페이지 > 프로필 편집]에서 회원 정보 수정이 가능합니다.`
        },
        {
            kind: 3,
            title: '[회원정보] 푸시 알림 설정은 어떻게 하나요?',
            content: `모바일 앱을 통해 설정이 가능하며\n\n[더보기 > 마이페이지 > 프로필 편집 > 프로모션 알림 설정]을 통해 푸시알림 수신 설정이 가능합니다.`
        },
        {
            kind: 3,
            title: '[회원정보] 회원탈퇴는 어떻게 하나요?',
            content: `스포지지 모바일웹 또는 모바일앱은 지원하지 않습니다.\n\ninfo@spo.gg 혹은 카카오 채널 '스포지지'를 통해 문의해주시면 감사하겠습니다.`
        },
        {
            kind: 4,
            title: '[서비스/기타] "저장하기"를 누른 콘텐츠(다이어리/인포머/큐레이션)들은 어디서 볼 수 있나요?',
            content: `[마이페이지 > 내가 저장한글] 페이지에서 확인이 가능합니다.`
        },
        {
            kind: 4,
            title: '[서비스/기타] 좋지않은 댓글을 받았습니다. 어떻게 해야하나요?',
            content: `댓글 아래에 신고 버튼을 눌러 댓글 신고가 가능합니다.`
        },
        {
            kind: 4,
            title: '[서비스/기타] 인기게시글, 인기유저의 기준은 무엇인가요?',
            content: `스포지지 추천 알고리즘에 따라 인기게시글과 유저가 뽑히게 됩니다.\n\n많은 분들에게 유익한 스포츠활동 사진을 통해 인기 유저가 되어보세요.`
        },
        {
            kind: 4,
            title: '[서비스/기타] 스포지지에서 다루는 콘텐츠는 어떤것이 있나요?',
            content: `스포지지에서 다루는 콘텐츠는 크게 스포츠 큐레이션, 스포츠 다이어리, 스포츠 인포머로 구분됩니다.\n\n"스포츠 큐레이션"은 자신만의 스포츠 용품, 공간, 활동 등을 후기와 구체적인 정보를 공유하는 콘텐츠입니다. 여러분의 스포츠활동을 소개하거나 다른 분과의 소통을 통해 같이 스포츠 활동을 해보세요.\n\n"스포츠 다이어리"는 자신만의 스포츠 목표를 정해 하루동안의 운동기록과 인증사진을 올려 공휴하는 소셜네트워크 공간입니다. 여러분의 '오하운'을 정해 자유롭게 올려주세요.\n\n"스포츠 인포머"는 스포지지의 팜매자/레슨강사/파워블로거 등 전문가들이 직접 작성하는 운동 노하우가 담긴 가이드입니다. 여러분의 스포츠 관심을 언제나 열려있는 운동노하우 신청을 통해 주제를 알려주세요.`
        },
        {
            kind: 4,
            title: '[서비스/기타] 다이어리와 큐레이션은 어떻게 업로드 하나요?',
            content: `스포지지 홈페이지 접속하신 다음 우측 상단 연필 모양 버튼 클릭 수 큐레이션 또는 다이어리 업로드가 가능합니다.`
        },
        {
            kind: 4,
            title: '[서비스/기타] 전문가계정은 무엇인가요?',
            content: `스포지지 전문가 계정은 홍보가 어려웠던 스포츠 전문가님에게 홍보와 판매를 효율적으로 관리할 수 있게 마련된 계정입니다.\n\n전문가 계정을 통해 유저들에게 자신의 스포츠활동을 알리며 홍보를 해보세요.\n\n손쉬운 홍보가 가능하니 많은 이용 부탁드립니다.`
        },
        {
            kind: 4,
            title: '[서비스/기타] 전문가계정 신청은 어떻게하나요?',
            content: `[스포지지 > 회원가입 > 전문가신청]에서 신청하실 수 있습니다.\n\n자세한 문의는 고객센터 혹은 카카오 채널 "스포지지 전문가"를 이용 부탁드립니다.`
        },
        {
            kind: 4,
            title: '[서비스/기타] 모바일 웹/앱이 정상 동작하지 않아요. 어떻게 해야하나요?',
            content: `먼저 사용하시는 어플리케이션 버전이 최신 버전인지 확인부탁드립니다.\n\n최신 버전에서도 계속 장애가 발생한다면, [더보기 > 의견보내기]를 통해 신고 가능합니다. 어플리케이션 버전 그리고 장애 내용과 발생되는 과정을 설명 부탁드립니다. 스크린샷을 첨부해 주시면 더욱 원활한 처리가 가능하니 참고 부탁드립니다.`
        },
        {
            kind: 4,
            title: '[서비스/기타] 회원가입시 이미 가입된 이메일이라고 표시됩니다. 어떻게 해야하나요?',
            content: `info@spo.gg 또는 카카오 채널 "스포지지"로 문의 부탁드립니다.`
        },
        {
            kind: 4,
            title: '[서비스/기타] 상담방법과 상담가능한 유선번호는 어떻게 되나요?',
            content: `상담 시간은 평일 09:00 ~ 19:00 (주말 & 공휴일 제외)이며, 전화번호는 010-2239-6702입니다.\n\n[더보기 > 고객센터]를 이용하시면 상담원과 채팅으로 더욱 빠르고 편리하게 문의 가능합니다.`
        },
        {
            kind: 4,
            title: '[서비스/기타] 입점 및 제휴/광고 문의는 어떻게 하나요?',
            content: `입점 및 제휴/광고 문의는 info@spo.gg로 메일 부탁드립니다.`
        },
        {
            kind: 4,
            title: '[서비스/기타] 랭킹 선정 기준은 무엇인가요?',
            content: `1. 스포지지 랭킹은 스포지지 사용자분이 작성하신 리뷰와 별점 데이터를 활용해 만든 순위입니다.\n\n2. 스포지지 자체 알고리즘에 따라 랭킹을 결정하기 때문에 별점이 높은 제품이라도 랭킹에 오르지 않을 수 있습니다.\n\n3. 스포지지 자체 필터링으로 광고성 리뷰는 모두 배제합니다.\n\n4. 스포지지 스포츠랭킹을 통해 인기있는 스포츠 용품과 신제품 선호도를 확인해보세요.`
        },
        {
            kind: 5,
            title: '[리뷰] 리뷰 서비스 운영 원칙은 무엇인가요?',
            content: `스포지지 서비스 리뷰 서비스는 아래와 같은 원칙에 따라 관리 및 운영됩니다. ※용어정의 : 스포지지 가입 회원(이하 "회원"), 스포지지를 운영하는 주식회사 핏데이터(이하 "회사")\n
            가. 리뷰 정보의 저작권
            1. 회원이 작성한 리뷰 정보로 인해 본인 또는 타인에게 손해나 기타 문제가 발생할 경우, 회원은 이에 대한 책임을 지고 회사는 특별한 사정이 없는한 이에 대해 책임을 지지 않습니다.
            2. 리뷰 정보에 대한 권리와 책임은 회원에게 있으며 회사는 회원의 리뷰정보가 타인의 저작권 등을 침해하더라도 민, 형사상의 책임을 부담하지 않습니다. 만일 회원이 타인의 저작권, 프로그램저작권 등을 침해하였음을 이유로 회사가 타인으로부터 손해 배상 청구 등 이의 제기를 받을 경우 회원은 회사의 면책을 위하여 노력해야하며, 회사가 면책되지 못한 경우 회원은 그로 인해 회사에 발생한 모든 손해를 부담하여야 합니다.
            3. 스포지지 서비스 및 스포지지에서 제공하는 관련 콘텐츠 및 서비스 내에서 복제, 전송, 전시, 배포될 수 있고, 서비스 화면에 노출하는 과정에서 리뷰의 내용이 일부 수정, 생략, 변경 등 편집 될 수 있으며, 회사는 리뷰를 이용하여 2차 저작물을 만들 수 도 있습니다. 또한, 스포지지 서비스의 홍보, 제휴, 프로모션 등을 위해 미디어, 통시나 등 서비스 제휴 파트너에게 리뷰를 제공하여, 제휴 파트너에게 해당 리뷰를 보도, 방영 등으로 상요하게 할 수 있으며, 이 과정에서 리뷰의 내용이 일부 수정, 생략, 변경 등 편집될 수 있습니다. 이경우 회사는 제휴 파트너에게 작성자의 개인정보는 제공하지 않으며, 작성자가 이에 대해 삭제 및 게시 중단을 요청할 경우 즉시 리뷰 삭제, 게시 중단 등의 조치를 취합니다.
            4. 회사가 제 3항 이외의 방법으로 리뷰를 제3자에게 제공하고 금전적 대가를 지급받는 등과 같이 상업적으로 이용하고자 하는 경우, '리뷰의 제3자제공'에 대한 사전 동의를 얻도록 하겠습니다. 이 경우에도 개인정보는 제공하지 않으며 별도의 보상제도를 운용할 수 있습니다
            
            나. 저작권의 위반 및 처벌
            1. 타인의 지적재산권을 무단으로 차용하여 이용하는 경우에는 침해자에게 손해배상 등 민사적 청구는 물론 형사적 처벌이 가해질 수 있습니다.
            2. 저작권에 위배된 리뷰 정보는 무통보 블라인드 처리됩니다.
            3. 저작권 위배가 2회 이상 해당될 경우, 해당 회원은 강제탈퇴 처리됩니다.

            다. 리뷰 정보의 명예훼손 시 처리 
            1. 악의적인 사실로 인해 제3자의 명에가 훼손되었다고 판단되면, 며예훼손죄, 사이버 명예훼손죄, 모욕죄 등에 저축되는 법률이 적용될 수 있습니다.
            2. 명예훼손죄는 '공연히 구체적인 사실이나 허위 사시을 적시(摘示)하여 사람의 명예를 훼손함으로써 성립하는 범죄'로 정의됩니다.
            3. 명예훼손죄는 형법 제 307조에 의거합니다.
            4. 사이버 명예훼손죄는 정보통신망 이용촉진 및 정보보호 등에 관한 법률 제 70조에 의거합니다.
            5. 모욕죄는 형법 제 311조에 의거합니다.
            6. 타인의 명예를 훼손하는 내용의 리뷰 기타 게시물에 대해 해당 리뷰 또는 게시물을 작성한 회원은 그 내용에 위법 소지가 있는 경우 형법, 정보통신망이용촉진 및 정보보호 등에 관한 법률 등 관련 법령에 따라 민 · 형사상의 책임을 질 수 있습니다.
            7. 이용자가 올린 리뷰 기타 게시물에 대해 회사는 법적인 책임을 지지 않습니다. 
            8. 이용자가 올린 리뷰 기타 게시물이 타인의 명예를 훼손하는 것으로 판단되거나 해당 리뷰 기타 게시물로 인해 명예가 훼손되었다고 주장하는 자가 게시물에 대한 삭제 등을 요청하는 경우 회사는 해당 리뷰 기타 게시물을 블라인드 처리하거나 삭제할 수 있습니다. 명예훼손의 사실적 판단이 이루어져 회사가 리뷰 기타 게시물을 블라인드 처리하거나 삭제할 경우에는 블라인드 또는 삭제 3일 전까지 해당 리뷰 기타 게시물을 작성한 회원에게 해당 사실을 통보합니다.
            9. 해당 리뷰 또는 게시물이 타인의 명예를 훼손하는 것인지 여부는 회사가 다음과 같은 기준을 바탕으로 판단합니다.
            ① 특정 제조사 도는 특정 상품 기타 타인에 대해 허위 또는사실과 다른 내용이 게시되었거나, 허위 또는 사실과 다른 내용이라고 충분히 의심되는 게시물
            ② 상품에 대한 합리적인 범위의 평가를 넘어, 특정 제조사나 특정 제품기타 타인을 비난하거나 욕설, 비속어 등을 퐇마한 게시물
            ③ 특정 제조사 또는 상품 기타 타인에 대한 부정적인 리뷰를 동일한 내용으로 반복적으로 게시하는 게시물 
            ④ 그 외 특정인의 사회적 가치 내지 평가가 침해될 가느엉이 있는 사실을 적시한 게시물 
            10. 이용자가 올린 리뷰 기타 게시물이 타인의 명예를 회손하는 것인지 여부가 불분명한 경우, 임시적으로 블라인드 처리를 할 수 있습니다.

            라. 어뷰징 리뷰에 대한 처리
            1. 회사는 '공정한 리뷰 플랫폼'을 지향하며 광고/홍보/비방등을 목적으로 작성된 어뷰징 리뷰는 발견 즉시 블라인드 처리합니다.
            2. 회사는 어뷰징 리뷰로 판단하여 블라인드 된 리뷰의 작성자, 제품과 브랜드를 회사 '어뷰징 리뷰 관리 정책'에 따라 운영합니다.

            마. 리뷰 정보의 보호 
            1. 회사는 불법적이지 않고, 운영원칙에 위배되지 않고, 리뷰 수정 요청 기준에 해당되지 않는 리뷰 정보는 스포지지 서비스 내에서 임의로 삭제 및 수정하지 않음을 원칙으로 합니다.
            2. 회사는 리뷰 정보의 내용에 대하여 사실여부를 확인하는 작업은 수행하지 않습니다.
            3. 회사는 리뷰 정보의 소중함을 알고 ,이정보가 스포츠활동에 도움이 되고 구매를 하는데에 있어 많은 사람들에게 유용한 도움을 줄 수 있도록 최선을 다합니다.`
        },
        {
            kind: 5,
            title: '[리뷰] 댓글/게시글 블라인드 처리 기준은 무엇인가요?',
            content: `스포지지는 스포지지에서 작성되는 글이 스포츠 활동과 구매 시 유용한 정보로 활용되기를 원하며 더불어 이용자분들 사이에서 자유롭게 의견을 나눌 수 있는 공간이 되기를 원합니다.

            이런 공간이 되기 위해서는 최소한의 규칙과 에디켓이 필요하기에 아래와 같은 기준에 해당하는 댓글/게시글은 블라인드 처리될 수 있음을 알려드립니다.
            
            1. 광고성 댓글
            2. 도배/중복 댓글
            3. 욕설/비속어 사용
            4. 명예훼손이 우려되는 댓글
            5. 블로그,연락처 등 개인정보 포함
            6. 기타 에티켓 위반`
        },
    ]);
    const filterFaq = (data) => {
        data.sort();
        data = data.filter((contact) =>{
            return contact.title.toString().toLowerCase().indexOf(search) > -1;
        });
        return data;
    }
    const [mouseScroll, setMouseScroll] = useState(false);
    const [mouseX, setMouseX] = useState();
    const [scrollLeft, setScrollLeft] = useState();
    const handleMouseDown = (event) => {
        setMouseX(event.pageX);
        setScrollLeft(document.getElementsByClassName('faq_menu')[0].scrollLeft);
        setMouseScroll(true);
    }
    const handleMouseMove = (event) => {
        if(mouseScroll){
            const walk = (event.pageX - mouseX)/2;
            document.getElementsByClassName('faq_menu')[0].scrollLeft = scrollLeft - walk;
        }
    }
    const handleMouseUpOrLeave = () => {
        setMouseScroll(false);
        setMouseX();
    }
    return(
        <>
            <FormControl >
                <InputBase
                    id="search"
                    type="text"
                    placeholder="무엇을 도와드릴까요?"
                    value={search}
                    onChange={onChangeSearch}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="Search Icon"
                        edge="end"
                        >
                            <Search style={{color: '#000000', fontSize: '20px'}}/>
                        </IconButton>
                    </InputAdornment>
                    }
                    
                />
            </FormControl>
            <div className="faq_menu" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave}>
                <table className="faq_table" >
                    <tr>
                        <td className="faq_td">{list === 1 ? <Chip onClick={() => setList(1)} label="전체"color="primary" /> : <Chip onClick={() => setList(1)} label="전체" variant="outlined"/>}</td>
                        <td className="faq_td">{list === 2 ? <Chip onClick={() => setList(2)} label="성분정보" color="primary" /> : <Chip onClick={() => setList(2)} label="성분정보" variant="outlined"/>}</td>
                        <td className="faq_td">{list === 3 ? <Chip onClick={() => setList(3)} label="회원정보" color="primary" /> : <Chip onClick={() => setList(3)} label="회원정보" variant="outlined"/>}</td>
                        <td className="faq_td">{list === 4 ? <Chip onClick={() => setList(4)} label="서비스/기타" color="primary" /> : <Chip onClick={() => setList(4)} label="서비스/기타" variant="outlined"/>}</td>
                        <td className="faq_td">{list === 5 ? <Chip onClick={() => setList(5)} label="리뷰"color="primary" /> : <Chip onClick={() => setList(5)} label="리뷰" variant="outlined"/>}</td>
                    </tr>
                </table>
            </div>
            {faq[0]?
            filterFaq(faq).map((faq, i) => (
                list === 1 ?
            <>
            <Accordion square expanded={expanded === `panel${i}`} onChange={handleChange(`panel${i}`)}>
                <AccordionSummary aria-controls={`panel${i}d-content`} id={`panel${i}d-header`} expandIcon={<ExpandMore />}>
                    <Typography style={titleText}>
                        Q. {faq.title}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography style={contentText}>
                    {faq.content.split('\n').map((line) => {return <>&nbsp;{line}<br/></>})}
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Divider variant="middle"/>
            </>
            :
            faq.kind === list ?
            <>
            <Accordion square expanded={expanded === `panel${i}`} onChange={handleChange(`panel${i}`)}>
                <AccordionSummary aria-controls={`panel${i}d-content`} id={`panel${i}d-header`} expandIcon={<ExpandMore />}>
                    <Typography style={titleText}>
                        Q. {faq.title}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography style={contentText}>
                    {faq.content.split('\n').map((line) => {return <>&nbsp;{line}<br/></>})}
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Divider variant="middle"/>
            </>
            :
            null
            ))
            :null}
        </>
    );
}

export default EtcFaq;