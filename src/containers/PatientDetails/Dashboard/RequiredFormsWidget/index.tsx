import { AlertOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';
import { Button } from 'antd';
import { Patient } from 'fhir/r4b';
import { Link, useNavigate } from 'react-router-dom';

import { DashboardCard, DashboardCardTable, Spinner } from '@beda.software/emr/components';
import { RenderRemoteData } from '@beda.software/fhir-react';

import { RequiredFormsWidgetData, useRequiredFormsWidget } from './hooks';

export function RequiredFormsWidget(props: { patient: Patient }) {
    const title = t`Required forms`;
    const { patient } = props;
    const { response } = useRequiredFormsWidget(patient);
    const navigate = useNavigate();

    const columns = [
        {
            title: t`Name`,
            key: 'forms-name',
            render: ({ questionnaire, questionnaireResponse }: RequiredFormsWidgetData) => {
                const title = questionnaire.title;

                return (
                    <>
                        {questionnaireResponse ? (
                            <Link to={`${location.pathname}/documents/${questionnaireResponse.id}`}>{title}</Link>
                        ) : (
                            <Link to={`${location.pathname}/documents/new/${questionnaire.id}`}>{title}</Link>
                        )}
                    </>
                );
            },
            width: 326,
        },
        {
            title: t`Submitted?`,
            key: 'forms-submitted',
            render: ({ questionnaireResponse }: RequiredFormsWidgetData) => (questionnaireResponse ? t`Yes` : t`No`),
            width: 100,
        },
        {
            title: '',
            key: 'print',
            render: ({ questionnaireResponse }: RequiredFormsWidgetData) => {
                if (questionnaireResponse) {
                    return (
                        <Button
                            type="link"
                            onClick={() =>
                                navigate(`/print-patient-document/${patient.id}/${questionnaireResponse?.id}`)
                            }
                        >
                            {t`Print`}
                        </Button>
                    );
                }

                return null;
            },
            width: 100,
        },
    ];

    return (
        <RenderRemoteData remoteData={response} renderLoading={Spinner}>
            {(data) => (
                <DashboardCard title={title} icon={<AlertOutlined />} key={`cards-required-forms`}>
                    <DashboardCardTable
                        title={title}
                        data={data}
                        columns={columns}
                        getKey={(r: RequiredFormsWidgetData) => r.questionnaire.id!}
                    />
                </DashboardCard>
            )}
        </RenderRemoteData>
    );
}
