import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText, Divider, Collapse, Box } from '@material-ui/core';
import { Dashboard, Person, People, Assignment, ShoppingCart, CreditCard, SportsBaseball, Message, PersonAdd, ExpandMore, ExpandLess, ExitToApp, CardGiftcard, AddShoppingCart, ContactSupport, Info } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
  root: {
    width: '18%',
    height: '100vh',
    backgroundColor: 'white',
    borderRight: '1px solid #d7d7d7',
    position: 'fixed'
  },
  title: {
    textAlign: 'center',
    paddingTop: '20px',
    paddingBottom: '20px',
    fontSize: '150%',
    fontWeight: 'bold',

  },
  nested: {
      paddingLeft: '30px'
  }
}));

const Menu = (props) => {
    const [open, setOpen] = useState({
        user: props.page[0].title === "판매자" || props.page[0].title === "회원" ? true : false,
        goods: props.page[0].title === "상품" ? true : false,
    });
    
    const iconColor = {
        color: "#5093FF"
    }
    
    const handleClickMenu = (menuDrop) => {
        let changeOpen = {...open};
        switch(menuDrop){
            case "user":
                changeOpen = {user: !open.user, };
                break;
            case "goods":
                changeOpen = {goods: !open.goods, };
                break;
            default :
                break;
        }
        setOpen(changeOpen);
     };
    const classes = useStyles();
    
    return (
        <Box className={classes.root} boxShadow={3}>
            <div className={classes.title}>Dashboard</div>
            <Divider />
            <List component="nav" aria-label="main mailbox folders">
                <ListItem button onClick={()=> props.history.push('/admin')}>
                    <ListItemIcon>
                        <Dashboard style={!props.page[0].title ? iconColor : null } />
                    </ListItemIcon>
                    <ListItemText primary="대시보드" />
                </ListItem>
                <ListItem button onClick={() => handleClickMenu("user")}>
                    <ListItemIcon>
                        <Person />
                    </ListItemIcon>
                    <ListItemText primary="회원 관리" />
                    {open.user ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open.user} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem button className={classes.nested} onClick={()=>props.history.push('/admin/user')}>
                            <ListItemIcon>
                                <People style={props.page[0].title === "회원" ? iconColor : null } />
                            </ListItemIcon>
                            <ListItemText primary="회원 목록" />
                        </ListItem>
                        <ListItem button className={classes.nested} onClick={()=>props.history.push('/admin/shop')}>
                            <ListItemIcon>
                                <People style={props.page[0].title === "판매자" && props.page[1].title !== "등록" ? iconColor : null } />
                            </ListItemIcon>
                            <ListItemText primary="판매자 목록" />
                        </ListItem>
                        <ListItem button className={classes.nested} onClick={()=>props.history.push('/admin/shop/create')}>
                            <ListItemIcon>
                                <PersonAdd style={props.page[0].title === "판매자" && props.page[1].title === "등록" ? iconColor : null } />
                            </ListItemIcon>
                            <ListItemText primary="판매자 등록" />
                        </ListItem>
                    </List>
                </Collapse>
                <ListItem button onClick={()=>props.history.push('/admin/board')}>
                    <ListItemIcon>
                        <Assignment style={props.page[0].title === "게시글" ? iconColor : null } />
                    </ListItemIcon>
                    <ListItemText primary="게시글 관리" />
                </ListItem>
                <ListItem button onClick={() => handleClickMenu("goods")}>
                    <ListItemIcon>
                        <ShoppingCart />
                    </ListItemIcon>
                    <ListItemText primary="상품 관리" />
                    {open.goods ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open.goods} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem button className={classes.nested} onClick={()=>props.history.push('/admin/goods')}>
                            <ListItemIcon>
                                <ShoppingCart style={props.page[0].title === "상품" && props.page[1].title !== "등록" ? iconColor : null } />
                            </ListItemIcon>
                            <ListItemText primary="상품 목록" />
                        </ListItem>
                        <ListItem button className={classes.nested} onClick={()=>props.history.push('/admin/goods/create')}>
                            <ListItemIcon>
                                <AddShoppingCart style={props.page[0].title === "상품" && props.page[1].title === "등록" ? iconColor : null } />
                            </ListItemIcon>
                            <ListItemText primary="상품 등록" />
                        </ListItem>
                    </List>
                </Collapse>
                <ListItem button onClick={()=>props.history.push('/admin/order')}>
                    <ListItemIcon>
                        <CreditCard style={props.page[0].title === "주문" ? iconColor : null } />
                    </ListItemIcon>
                    <ListItemText primary="주문 관리" />
                </ListItem>
                <ListItem button onClick={()=>props.history.push('/admin/sport')}>
                    <ListItemIcon>
                        <SportsBaseball style={props.page[0].title === "종목" ? iconColor : null } />
                    </ListItemIcon>
                    <ListItemText primary="종목 관리" />
                </ListItem>
                <ListItem button onClick={()=>props.history.push('/admin/message')}>
                    <ListItemIcon>
                        <Message style={props.page[0].title === "메세지" ? iconColor : null } />
                    </ListItemIcon>
                    <ListItemText primary="메세지 관리" />
                </ListItem>
                <ListItem button onClick={()=>props.history.push('/admin/notice')}>
                    <ListItemIcon>
                        <Info style={props.page[0].title === "공지사항" ? iconColor : null } />
                    </ListItemIcon>
                    <ListItemText primary="공지사항 관리" />
                </ListItem>
                <ListItem button onClick={()=>props.history.push('/admin/faq')}>
                    <ListItemIcon>
                        <ContactSupport style={props.page[0].title === "FAQ" ? iconColor : null } />
                    </ListItemIcon>
                    <ListItemText primary="FAQ 관리" />
                </ListItem>
                <ListItem button onClick={()=>props.history.push('/admin/event')}>
                    <ListItemIcon>
                        <CardGiftcard style={props.page[0].title === "이벤트" ? iconColor : null } />
                    </ListItemIcon>
                    <ListItemText primary="이벤트 관리" />
                </ListItem>
                <ListItem button onClick={props.logout}>
                    <ListItemIcon>
                        <ExitToApp />
                    </ListItemIcon>
                    <ListItemText primary="로그아웃" />
                </ListItem>
            </List>
        </Box>
    );
}

export default withRouter(Menu);