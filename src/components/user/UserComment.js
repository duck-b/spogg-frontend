import React from 'react';
import { useCookies } from 'react-cookie';
import UserCommentList from 'components/content/UserCommentList';

const UserComment = (props) => {
    const [cookies] = useCookies('userKey');
    return(
        <>
            <UserCommentList />
        </>
    );
}

export default UserComment;