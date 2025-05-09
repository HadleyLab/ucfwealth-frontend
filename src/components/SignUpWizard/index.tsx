import { useState } from 'react';

import { QuestionnairesWizard, QuestionnairesWizardHeader } from '@beda.software/emr/components';

import { S } from './styles';
import { SignUpWizardProps } from './types';

const WizardContainer = ({ children }: { children: React.ReactNode }) => (
    <S.OuterContainer>
        <S.InnerContainer>
            {children}
        </S.InnerContainer>
    </S.OuterContainer>
);

export function SignUpWizard(props: SignUpWizardProps) {
    const { patient, onSuccess, questionnaires, notFinishedQuestionnaires,
        questionnaireResponses, show } = props;
    const [headerProps, setHeaderProps] = useState({ title: "", index: 0, total: 0 });

    if (!show) {
        return null;
    }

    return (
        <WizardContainer>
            <QuestionnairesWizardHeader {...headerProps} />
            <S.FormContainer>
                <QuestionnairesWizard
                    questionnaires={questionnaires}
                    questionnaireResponses={questionnaireResponses}
                    initialQuestionnaireResponse={{
                        subject: { reference: `${patient?.resourceType}/${patient?.id}` },
                    }}
                    initialQuestionnaireId={
                        notFinishedQuestionnaires[0]?.id
                    }
                    onQuestionnaireChange={(q, index) =>
                        setHeaderProps({ title: q.title ?? "", index: index, total: questionnaires.length })}
                    launchContextParameters={[{ name: 'Patient', resource: patient }]}
                    onSuccess={onSuccess}
                />
            </S.FormContainer>
        </WizardContainer>
    );
}
