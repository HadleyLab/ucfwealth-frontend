import React from 'react';

import { SuccessIcon } from 'src/images/SuccessIcon';

import s from './QuestionnaireSuccess.module.scss';

export const QuestionnaireSuccess = () => (
    <div className={s.wrapper}>
        <SuccessIcon />
        <div className={s.thankYou}>Thank you! We really appreciate your time</div>
        <div className={s.asSoonAsWeGet}>
            As soon as we get results we will send you an email to scotteaton@gmail.com
            <br />
            all the details
        </div>
    </div>
);
