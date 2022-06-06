/* eslint-disable dot-notation */
import { Descriptions, PageHeader } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React from 'react';

import { Patient } from 'shared/src/contrib/aidbox';

import s from './PatientDataInfo.module.scss';

interface Props {
    patient: Patient;
}

export const PatientDataInfo = ({ patient }: Props) => {
    const renderContent = (column = 2) => (
        <Descriptions size="middle" column={column}>
            <Descriptions.Item label="Address">
                {patient.address?.[0].country} {patient.address?.[0].state}{' '}
                {patient.address?.[0].city} {patient.address?.[0].line?.[0]}
            </Descriptions.Item>
            <Descriptions.Item label="Medical Record Number">
                {patient.identifier?.[1].value}
            </Descriptions.Item>
            <Descriptions.Item label="Birth date">{patient.birthDate}</Descriptions.Item>
            <Descriptions.Item>{patient.identifier?.[1].system}</Descriptions.Item>
            <Descriptions.Item label="Birth place">
                {patient.extension?.[4]['valueAddress'].country}{' '}
                {patient.extension?.[4]['valueAddress'].state}{' '}
                {patient.extension?.[4]['valueAddress'].city}
            </Descriptions.Item>
            <Descriptions.Item label="Created at">
                {patient.meta?.['createdAt'].slice(0, 10)}
            </Descriptions.Item>
            <Descriptions.Item label="Ethnicity">
                {patient.extension?.[0].extension?.[1].valueString} /{' '}
                {patient.extension?.[1].extension?.[1].valueString}
            </Descriptions.Item>
        </Descriptions>
    );

    return (
        <PageHeader
            className={s.pageHeader}
            onBack={() => window.history.back()}
            title={`${patient.name?.[0].prefix} ${patient.name?.[0].given} 
            ${patient.name?.[0].family}`}
            subTitle={`SSN: ${patient.identifier?.[2].value}`}
        >
            <Content>{renderContent()}</Content>
        </PageHeader>
    );
};

