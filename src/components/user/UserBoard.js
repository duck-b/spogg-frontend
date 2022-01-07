import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import UserBoardList from 'components/content/UserBoardList';

const UserBoard = (props) => {
    const [cookies] = useCookies('userKey');
    const [value, setValue] = useState({userStatus: 1});
    useEffect(() => {
        const userStatusCheck = async() => {
            const config = {
              headers: {
                  "content-type": "application/json"
              }
            };
            await axios.get(`/api/user/${cookies.userKey}/userStatus`, config).then((response)=>{
                setValue({userStatus: response.data.userStatus});
            })
          }
          userStatusCheck();
    }, [])
    return(
        <>
            <UserBoardList value={value} />
        </>
    );
}

export default UserBoard;