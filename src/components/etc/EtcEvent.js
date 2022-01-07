import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Divider, Link } from '@material-ui/core';
import main_banner1 from 'img/main_banner1.png';
import main_banner2 from 'img/main_banner2.png';
import board1_banner from 'img/board1_banner.png';
import board3_banner from 'img/board3_banner.png';
import board5_banner from 'img/board5_banner.png';

const EtcEvent = (props) => {
    const [event, setEvent] = useState([
        {
            link: '/board/1',
            img: board1_banner,
            date: '2021. 08. 01 ~ '
        },
        {
            link: '/board/3',
            img: board3_banner,
            date: '2021. 08. 01 ~ '
        },
        {
            link: '/board/5',
            img: board5_banner,
            date: '2021. 08. 01 ~ '
        }
    ]);

    return(
        <>
            {event.map((event, i)=>(
            <>
            <div className="event_list" key={i} onClick={() => props.history.push(event.link)}>
                <img src={event.img}/>
                <p>{event.date}</p>
            </div>
            <Divider variant="middle"/>
            </>
            ))}
        </>
    );
}

export default withRouter(EtcEvent);