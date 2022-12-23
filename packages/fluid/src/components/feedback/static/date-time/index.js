import React, { useEffect, useState } from 'react';
import useStyles from '@hooks/styles';
import defaultStyles from './style';

export default function DateTime({ locale, halfTime }) {
    const style = useStyles(defaultStyles);
    const [date, setDate] = useState(new Date());

    const update = () => {
        setDate(new Date());
    };

    let interval;
    useEffect(() => {
        const delay = 1000 * 60;
        interval = setTimeout(() => {
            interval = setInterval(update, delay);
            update();
        }, delay - date.getSeconds() * 1000);

        return () => {
            clearTimeout(interval);
            clearInterval(interval);
        }
    }, []);

    const format = val => val.toString().padStart(2, '0');

    let hours = date.getHours() % (halfTime ? 12 : 24);
    if (hours == 0) hours = 12;
    const mins = date.getMinutes();
    const postfix = date.getHours() >= 12 ? 'PM' : 'AM';

    return <div className={style.datetime} data-halftime={halfTime}>
        <div className={style.time}>
            {format(hours)}:{format(mins)}

            {halfTime ? <span className={style.time_postfix}>{postfix}</span> : null}
        </div>
        <div className={style.date}>{date.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: '2-digit' })}</div>
    </div>;
}

DateTime.defaultProps = {
    locale: 'en',
    halfTime: false
}