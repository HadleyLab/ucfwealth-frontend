import { AlertOutlined } from '@ant-design/icons';
import { t, Trans } from '@lingui/macro';
import { Button } from 'antd';
import { Patient, QuestionnaireResponse } from 'fhir/r4b';
import { Link, useNavigate } from 'react-router-dom';

import { DashboardCard, DashboardCardTable, Spinner } from '@beda.software/emr/components';
import { evaluate } from '@beda.software/emr/utils';
import { RenderRemoteData } from '@beda.software/fhir-react';

import { useMedicalImagesAuthorizationWidget } from './hooks';
import { S } from './styles';

export function MedicalImagesAuthorizationWidget(props: { patient: Patient }) {
    const title = t`Authorization for Release of Medical Images`;
    const { patient } = props;
    const { response } = useMedicalImagesAuthorizationWidget(patient);
    const navigate = useNavigate();

    const columns = [
        {
            title: t`Name`,
            key: 'authorization-name',
            render: (qr: QuestionnaireResponse) => {
                const authorizationRelease =
                    evaluate(qr, `item.where(linkId='authorizationRelease').answer.valueString`)?.[0] || '';

                return <Link to={`${location.pathname}/documents/${qr.id}`}>{authorizationRelease}</Link>;
            },
        },
        {
            title: '',
            key: 'print',
            render: (qr: QuestionnaireResponse) => {
                return (
                    <Button type="link" onClick={() => navigate(`/print-patient-document/${patient.id}/${qr.id}`)}>
                        {t`Print`}
                    </Button>
                );
            },
            width: 100,
        },
    ];

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {(data) => (
                <DashboardCard
                    title={title}
                    icon={<AlertOutlined />}
                    key={`cards-medical-images-authorization`}
                    extra={
                        <S.Button
                            type="link"
                            onClick={() => navigate(`${location.pathname}/documents/new/${data.questionnaire.id}`)}
                        >
                            <Trans>Add</Trans>
                        </S.Button>
                    }
                >
                    <DashboardCardTable
                        title={title}
                        data={data.questionnaireResponse}
                        columns={columns}
                        getKey={(r: QuestionnaireResponse) => r.id!}
                    />
                </DashboardCard>
            )}
        </RenderRemoteData>
    );
}
