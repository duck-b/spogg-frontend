import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { Grid, Link } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faEdit, faHeart, faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeartBorder, faBookmark as fasBookmarkBorder, faEllipsisH as fasEllipsisH, faCommentDots as fasCommentDots, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { ExpandMore } from '@material-ui/icons';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';
import EtcMenu from 'components/layout/user/BoardGramEtc';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    borderRadius: '10px',
    marginBottom: '20px'
  },
  media: {
    position: 'relative',
    paddingBottom: '100%', // 1:1
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  },
  img: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
  },
  record: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
  recordTitle: {
    paddingTop: '5%',
    paddingBottom: '5%',
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: '16px',
  },
  title: {
    fontSize: '14px',
    textAlign: 'left',
    marginBottom: '5%',
    paddingLeft: '30px'
  },
  recordContent: {
    padding: '0px 30px',
  },
  recordDetail: {
    paddingTop: '5%',
    paddingBottom: '10%',
    color: '#FFFFFF',
    borderTop: '1px solid rgba(255, 255, 255, 0.5)',
    '&:last-child':{
      borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
    }
  },
  recordDetailTitle: {
    textAlign: 'left',
    float: 'left',
    fontSize: '14px',
    fontWeight: '400',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    maxWidth: '50%',
    lineHeight: '20px'
  },
  recordDetailContent: {
    textAlign: 'right',
    float: 'right',
    fontSize: '18px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    maxWidth: '50%',
    lineHeight: '20px',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

 const ContentCard = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleClickIcon = (icon) => {
    if(icon === 0){
        props.handleClickCardValue(props.contentKey, 'board_like');
        return false;
    }else if(icon === 1){
        props.handleClickCardValue(props.contentKey, 'board_save');
        return false;
    }else{
      props.handleClickCardValue(props.contentKey, 'record_view');
      return false;
    }
  }
  const recordContent = props.value.board_recordContent.split(',');
  const created_at = new Date(props.value.created_at?.split('-').join('/'));
  const createTime = `${created_at.getFullYear()}년 ${created_at.getMonth()+1}월 ${created_at.getDate()}일`;
  return (
    <Card className={classes.root}>
      <div className={classes.media} onClick={() => handleClickIcon()} style={{backgroundImage: props.value.board_img ? `url(${props.value.board_img})` : null}}>
        {/* <img src={props.value.board_img} className={classes.img} alt="" /> */}
        {props.value.record_view ?
        <>
        <div className={classes.record}>
          <div className={classes.recordTitle}>
          <p className={classes.title}>&gt; Exercise Log Summary </p>
          <img src={props.value.sport_icon} alt="" style={{width: '30px', height: '30px'}}/><br/>
          {props.value.sport_name}
          </div>
          <div className={classes.recordContent}>
            {
            props.value.board_recordTitle.split(',').map((title, i) => (
              title ?
              <div className={classes.recordDetail}>
                <div className={classes.recordDetailTitle}>{title}</div>
                <div className={classes.recordDetailContent}>{recordContent[i]}</div>
              </div>:
              null
            ))}
          </div>
        </div>
        </>:
        <div className="view_goods_btn" style={{bottom: `10px`, right: `10px`}}><FontAwesomeIcon icon={faChartBar} /> 기록 보기</div>}
      </div>
      <CardActions disableSpacing>
        <Avatar aria-label="recipe" onClick={() => props.history.push(`/user/${props.value.user_no}`)} src={props.value.user_profile} style={{filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'}}/>
        <div className="card_user_nick_name" >
          <div onClick={() => props.history.push(`/user/${props.value.user_no}`)}>{props.value.user_name}</div>
          {props.value.user_follow || props.user.user_no === props.value.user_no ? null : <span onClick={() => props.handleClickCardValue(props.contentKey, 'user_follow')}>팔로우</span>}
          <p>{createTime}</p>
        </div>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMore />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent className="card_content">
          <div className="card_content_title">{props.value.board_title}</div>
          <div className="card_content_content">
            {props.value.boardDetail_content.split('\n').map((line) => {return <>{line}<br/></>})}
          </div>
          <div className="content_hashtag">
            {props.value.board_hashtag ?
            props.value.board_hashtag.split(',').map((hashtag)=>(
              hashtag?
              <>
              <div className="hashtag_img" />
              <Link onClick={() => props.history.push(`/board/3?${hashtag}`)}>{hashtag}</Link>
              </>
              : null
            )):null}
          </div>
          <div className="card_content_count">
            <FontAwesomeIcon icon={fasHeartBorder}/>{props.value.boardCount_like}<FontAwesomeIcon icon={fasCommentDots}/>{props.value.boardCount_comment}
          </div>
          <Grid item container justify="space-between" alignContent="center" className="card_content_icon_group">
            <IconButton aria-label="like" className="card_content_icon" onClick={() => handleClickIcon(0)}>
              <FontAwesomeIcon icon={props.value.board_like ? fasHeartBorder : faHeart} />
            </IconButton>
            <IconButton aria-label="save" className="card_content_icon" onClick={() => handleClickIcon(1)}>
              <FontAwesomeIcon icon={props.value.board_save ? fasBookmarkBorder : faBookmark } />
            </IconButton>
            <IconButton aria-label="comment" className="card_content_icon" onClick={props.handleClickOpen}>
              <FontAwesomeIcon icon={faCommentDots} />
            </IconButton>
            <EtcMenu value={props.value} user={props.user} contentKey={props.contentKey} handleClickCardValue={props.handleClickCardValue}/>
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
}
export default withRouter(ContentCard);