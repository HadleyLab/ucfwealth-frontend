import { Button } from 'antd';

import { Patient } from 'shared/src/contrib/aidbox';

import { RenderRemoteData } from 'src/components/RenderRemoteData';

import { QuestionnaireSteps } from '../QuestionnaireSteps';
import s from './QuestionnaireFormWrapper.module.scss';
import { useQuestionnaireFormWrapper } from './useQuestionnaireFormWrapper';

interface QuestionnaireFormWrapperProps {
    patient: Patient;
}

export const QuestionnaireFormWrapper = ({ patient }: QuestionnaireFormWrapperProps) => {
    const { settingsMapRD, questionnaireSelect, questionnaireSelected, setQuestionnaireSelected } =
        useQuestionnaireFormWrapper({ patient });

    return (
        <div className={s.wrapper}>
            <RenderRemoteData remoteData={settingsMapRD}>
                {(settingsMap) => {
                    const questionnaireNameExpectedList = [
                        ...settingsMap.activeQuestionnaireMap.questionnaireList.split(' '),
                    ];

                    if (
                        settingsMap.patientSettings?.selectedQuestionnaire &&
                        questionnaireSelected !== settingsMap.patientSettings?.selectedQuestionnaire
                    ) {
                        setQuestionnaireSelected(settingsMap.patientSettings.selectedQuestionnaire);
                    }

                    return (
                        <>
                            {questionnaireSelected !== '' ? (
                                <QuestionnaireSteps
                                    patient={patient}
                                    activeQuestionnaireMap={settingsMap.activeQuestionnaireMap}
                                    questionnaireName={questionnaireSelected}
                                    questionnaireList={settingsMap.questionnaireList}
                                />
                            ) : (
                                <div style={{ width: '1000px' }}>
                                    <h2 className={s.title}>Select a study to participate</h2>
                                    <div className={s.sectionWrapper}>
                                        <div className={s.subTitle}>COVID-19 research</div>
                                        <div className={s.joinText}>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                            Quisque id fringilla lorem. Duis vestibulum, nisl ut
                                            feugiat sagittis, magna odio dapibus eros, in bibendum
                                            odio dui nec urna. Nam quis ex et tortor gravida posuere
                                            et et arcu. Proin elit enim, dignissim non nulla sit
                                            amet, vestibulum volutpat justo. Nulla euismod
                                            consectetur augue id venenatis. Pellentesque efficitur
                                            aliquet nisi, non lacinia eros. Pellentesque porta elit
                                            nisi, sed lacinia neque mollis sit amet. Vestibulum
                                            lacinia convallis pretium. Sed fringilla id nibh ut
                                            laoreet.
                                        </div>
                                        <Button
                                            onClick={() =>
                                                questionnaireSelect(
                                                    questionnaireNameExpectedList[0],
                                                )
                                            }
                                            type="primary"
                                        >
                                            Join
                                        </Button>
                                    </div>
                                    <div className={s.sectionWrapper}>
                                        <div className={s.subTitle}>Breast Cancer research</div>
                                        <div className={s.joinText}>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                            Quisque id fringilla lorem. Duis vestibulum, nisl ut
                                            feugiat sagittis, magna odio dapibus eros, in bibendum
                                            odio dui nec urna. Nam quis ex et tortor gravida posuere
                                            et et arcu. Proin elit enim, dignissim non nulla sit
                                            amet, vestibulum volutpat justo. Nulla euismod
                                            consectetur augue id venenatis. Pellentesque efficitur
                                            aliquet nisi, non lacinia eros. Pellentesque porta elit
                                            nisi, sed lacinia neque mollis sit amet. Vestibulum
                                            lacinia convallis pretium. Sed fringilla id nibh ut
                                            laoreet.
                                        </div>
                                        <Button
                                            onClick={() =>
                                                questionnaireSelect(
                                                    questionnaireNameExpectedList[1],
                                                )
                                            }
                                            type="primary"
                                        >
                                            Join
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    );
                }}
            </RenderRemoteData>
        </div>
    );
};
