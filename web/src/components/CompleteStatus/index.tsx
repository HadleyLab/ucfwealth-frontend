interface Props {
    questionnaire: { id: string; title: string; result: boolean };
}

import s from './CompleteStatus.module.scss';

export const CompleteStatus = ({ questionnaire }: Props) => {
    if (questionnaire.id === 'personal-information') {
        questionnaire.title = 'Personal information';
    } else if (questionnaire.id === 'patient-report-baseline') {
        questionnaire.title = 'Breast Cancer research';
    } else if (questionnaire.id === 'screening-questions') {
        questionnaire.title = 'COVID-19 research';
    }
    return (
        <div key={questionnaire.id} className={s.questionnaireSummary}>
            <div className={s.title}>{questionnaire.title}:</div>{' '}
            <div className={questionnaire.result ? s.complete : s.incomplete}>
                <div className={s.font}>{questionnaire.result ? 'completed' : 'not completed'}</div>
            </div>
        </div>
    );
};
