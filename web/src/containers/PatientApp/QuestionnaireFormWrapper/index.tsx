import { Button } from 'antd';

import { Patient } from 'shared/src/contrib/aidbox';

import { RenderRemoteData } from 'src/components/RenderRemoteData';

import { QuestionnaireSteps } from '../QuestionnaireSteps';
import s from './QuestionnaireFormWrapper.module.scss';
import { useQuestionnaireFormWrapper } from './useQuestionnaireFormWrapper';

interface QuestionnaireFormWrapperProps {
    patient: Patient;
    isSaveDisabled?: boolean;
}

export const QuestionnaireFormWrapper = ({
    patient,
    isSaveDisabled,
}: QuestionnaireFormWrapperProps) => {
    const { settingsMapRD, questionnaireSelect, questionnaireSelected, setQuestionnaireSelected } =
        useQuestionnaireFormWrapper({ patient });

    return (
        <div className={s.wrapper}>
            <RenderRemoteData remoteData={settingsMapRD}>
                {(settingsMap) => {
                    if (
                        settingsMap.patientSettings?.questionnaire &&
                        questionnaireSelected !== settingsMap.patientSettings.questionnaire.id
                    ) {
                        setQuestionnaireSelected(settingsMap.patientSettings.questionnaire.id);
                    }

                    return (
                        <>
                            {questionnaireSelected !== '' ? (
                                <QuestionnaireSteps
                                    patient={patient}
                                    questionnaireName={questionnaireSelected}
                                    questionnaireResponseList={
                                        settingsMap.questionnaireResponseList
                                    }
                                    isSaveDisabled={isSaveDisabled}
                                />
                            ) : !isSaveDisabled ? (
                                <div style={{ width: '1000px' }}>
                                    <h2 className={s.title}>Select a study to participate</h2>
                                    <div className={s.sectionWrapper}>
                                        <div className={s.subTitle}>COVID-19 research</div>
                                        <div className={s.joinText}>
                                            <p>
                                                The purpose of this study is to develop medical
                                                Artificial Intelligence (AI) to better understand
                                                COVID-19 using patients' chest imaging. In
                                                collaboration with clinical partners, we have built
                                                a secure platform that allows us to enroll patients
                                                who were previously hospitalized for COVID-19 to
                                                share their X-rays and clinical experiences.
                                            </p>
                                            <p>
                                                As a participant, you can gain realtime access to
                                                your clinical X-rays that you can then share with
                                                your healthcare providers. We take every precaution
                                                to keep your data private, secure and anonymous.
                                                Your data allows us to develop technology that
                                                ultimately helps doctors better treat their
                                                patients.
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() =>
                                                questionnaireSelect('screening-questions')
                                            }
                                            type="primary"
                                        >
                                            Join
                                        </Button>
                                    </div>
                                    <div className={s.sectionWrapper}>
                                        <div className={s.subTitle}>Breast Cancer research</div>
                                        <div className={s.joinText}>
                                            <p>
                                                The purpose of this study is to develop medical
                                                Artificial Intelligence (AI) to better understand
                                                Breast Cancer using patients' mammograms.
                                            </p>
                                            <p>
                                                Your data allows us to develop technology that
                                                ultimately helps doctors better treat their
                                                patients.
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() =>
                                                questionnaireSelect('patient-report-baseline')
                                            }
                                            type="primary"
                                        >
                                            Join
                                        </Button>
                                    </div>
                                    <div className={s.sectionWrapper}>
                                        <div className={s.subTitle}>
                                            Survival and Disease control
                                        </div>
                                        <div className={s.joinText}>
                                            <p>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing
                                                elit. Nam et enim quis purus vestibulum aliquam. In
                                                non velit felis. Donec est augue, pretium vitae
                                                tellus vitae, condimentum vestibulum massa. Mauris
                                                hendrerit, sem in vestibulum iaculis, risus nunc
                                                lobortis dolor, sit amet dictum libero lorem tempus
                                                ante. Phasellus tincidunt, magna non ultrices
                                                malesuada, lorem est tempus massa, at gravida velit
                                                lectus et justo. Maecenas rutrum risus sit amet mi
                                                vehicula, ut viverra libero vulputate. Phasellus
                                                vestibulum dolor eu sapien venenatis, ullamcorper
                                                varius elit ullamcorper. Etiam egestas nibh et nisi
                                                maximus, quis feugiat lorem sollicitudin.
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() =>
                                                questionnaireSelect('survival-and-disease-control')
                                            }
                                            type="primary"
                                        >
                                            Join
                                        </Button>
                                    </div>
                                    <div className={s.sectionWrapper}>
                                        <div className={s.subTitle}>EORTCQLQ</div>
                                        <div className={s.joinText}>
                                            <p>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing
                                                elit. Nam et enim quis purus vestibulum aliquam. In
                                                non velit felis. Donec est augue, pretium vitae
                                                tellus vitae, condimentum vestibulum massa. Mauris
                                                hendrerit, sem in vestibulum iaculis, risus nunc
                                                lobortis dolor, sit amet dictum libero lorem tempus
                                                ante. Phasellus tincidunt, magna non ultrices
                                                malesuada, lorem est tempus massa, at gravida velit
                                                lectus et justo. Maecenas rutrum risus sit amet mi
                                                vehicula, ut viverra libero vulputate. Phasellus
                                                vestibulum dolor eu sapien venenatis, ullamcorper
                                                varius elit ullamcorper. Etiam egestas nibh et nisi
                                                maximus, quis feugiat lorem sollicitudin.
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() =>
                                                questionnaireSelect('eortc-questionnaire')
                                            }
                                            type="primary"
                                        >
                                            Join
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ fontSize: 16, fontWeight: 600, marginTop: 1 }}>
                                    Patient does not participate in any study
                                </div>
                            )}
                        </>
                    );
                }}
            </RenderRemoteData>
        </div>
    );
};
