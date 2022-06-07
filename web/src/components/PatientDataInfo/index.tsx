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
        <Descriptions size="middle" column={column} colon={false}>
            <Descriptions.Item label="Address" labelStyle={leftColumnLabelStyle}>
                {patient.address
                    ? `${patient.address[0].country} {patient.address[0].state} 
                ${patient.address[0].city} ${patient.address[0].line?.[0]}`
                    : 'Empty'}
            </Descriptions.Item>
            <Descriptions.Item label="Medical Record Number" labelStyle={rightColumnLabelStyle}>
                {patient.identifier?.[1].value || 'Empty'}
            </Descriptions.Item>
            <Descriptions.Item label="Birth date" labelStyle={leftColumnLabelStyle}>
                {patient.birthDate || 'Empty'}
            </Descriptions.Item>
            <Descriptions.Item label="External Patient Resource" labelStyle={rightColumnLabelStyle}>
                {patient.identifier?.[1].system ? (
                    <a href={patient.identifier?.[1].system} className={s.externalPatientResource}>
                        {patient.identifier?.[1].system}
                    </a>
                ) : (
                    'Empty'
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Birth place" labelStyle={leftColumnLabelStyle}>
                {patient.extension
                    ? `${patient.extension[4]['valueAddress'].country} 
                ${patient.extension[4]['valueAddress'].state} 
                ${patient.extension[4]['valueAddress'].city}`
                    : 'Empty'}
            </Descriptions.Item>
            <Descriptions.Item label="Created at" labelStyle={rightColumnLabelStyle}>
                {patient.meta?.['createdAt'].slice(0, 10) || 'Empty'}
            </Descriptions.Item>
            <Descriptions.Item label="Ethnicity" labelStyle={leftColumnLabelStyle}>
                {patient.extension
                    ? `${patient.extension[0].extension?.[1].valueString} / ${patient.extension[1].extension?.[1].valueString}`
                    : 'Empty'}
            </Descriptions.Item>
        </Descriptions>
    );

    return (
        <PageHeader
            className={s.pageHeader}
            onBack={() => window.history.back()}
            title={
                patient.name
                    ? `${patient.name[0].prefix} ${patient.name[0].given} ${patient.name[0].family}`
                    : 'Name not provided'
            }
            subTitle={patient.identifier ? `SSN: ${patient.identifier[2].value}` : 'SSN: Empty'}
        >
            <Content>{renderContent()}</Content>
        </PageHeader>
    );
};

const leftColumnLabelStyle = { width: 98, fontWeight: 700 };

const rightColumnLabelStyle = { width: 208, fontWeight: 700 };
