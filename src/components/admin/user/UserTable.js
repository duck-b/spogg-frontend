import React, { useState, useEffect } from 'react';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, Avatar } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => createStyles({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit*3,
      overflowX: "auto"
    },
    table: {
      minWidth: 1080
    },
    progress: {
      margin: theme.spacing.unit*2
    }
  }));
  
  const UserList = (props) => {
    const [users, setUsers] = useState();
    useEffect(() => {
      async function fetchMyAPI(){
          let response = await fetch('/api/admin/user')
          response = await response.json()
          setUsers(response);
      }
      fetchMyAPI();
    }, []);
    
    const [completed, setCompleted] = useState(0);
    useEffect(() => {
      const progress = () => {
        setCompleted(completed < 100 ? completed + 1 : 0);
      }
      if(completed < 100){
        setInterval(progress(), 20);
      }
    }, [completed]);
  
    const classes = useStyles(props);
  
    return (
      <>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>프로필</TableCell>
                <TableCell>닉네임</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>SNS</TableCell>
                <TableCell>성별</TableCell>
                <TableCell>구분</TableCell>
                <TableCell>가입일시</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {
              users ?
              users.map(user => {
                return (
                    <TableRow>
                        <TableCell>{user.user_no}</TableCell>
                        <TableCell><Avatar src={user.user_profile}/></TableCell>
                        <TableCell>{user.user_name}</TableCell>
                        <TableCell>{user.user_email}</TableCell>
                        <TableCell>{user.user_sns === 1 ? '카카오' : user.user_sns === 2 ? '네이버' : '구글'}</TableCell>
                        <TableCell>{user.user_gender === 1 ? '남' : '여'}</TableCell>
                        <TableCell>{user.user_status === 1 ? '일반' : user.user_status === 2 ? '인플루언서' : '전문가'}</TableCell>
                        <TableCell>{user.created_at}</TableCell>
                    </TableRow>
                )
              }):
              <TableRow>
                  <TableCell colSpan="6" align="center">
                    <CircularProgress className={classes.progress} variant="determinate" value={completed}/>
                  </TableCell>
              </TableRow>
            }
            </TableBody>
          </Table>
        </Paper>
        
      </>
    );
  }
  
  export default UserList;