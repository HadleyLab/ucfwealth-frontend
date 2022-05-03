import React from 'react';

import { Patient } from 'shared/src/contrib/aidbox';

import { SuccessIcon } from 'src/images/SuccessIcon';

import { QuestionnaireForm } from '../QuestionnaireForm';
import s from './QuestionnaireFormWrapper.module.scss';

interface QuestionnaireFormWrapperProps {
    isSuccessQuestionnaire: boolean;
    setIsSuccessQuestionnaire: (state: boolean) => void;
    patient: Patient;
}

export const QuestionnaireFormWrapper = ({
    isSuccessQuestionnaire,
    setIsSuccessQuestionnaire,
    patient,
}: QuestionnaireFormWrapperProps) => {
    if (isSuccessQuestionnaire) {
        return (
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
    }

    return (
        <QuestionnaireForm
            patient={patient}
            setIsSuccessQuestionnaire={setIsSuccessQuestionnaire}
        />
    );
};
