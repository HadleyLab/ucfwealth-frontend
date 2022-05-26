/* eslint-disable dot-notation */
import React from 'react';

import { Patient } from 'shared/src/contrib/aidbox';

import s from './PatientDataInfo.module.scss';

interface Props {
    patient: Patient;
}

export const PatientDataInfo = ({ patient }: Props) => (
    <div className={s.article}>
        <div>
            Fullname: {patient.name?.[0].prefix} {patient.name?.[0].given}{' '}
            {patient.name?.[0].family}
        </div>
        <div>
            Adress: {patient.address?.[0].country} {patient.address?.[0].state}{' '}
            {patient.address?.[0].city} {patient.address?.[0].line?.[0]}
        </div>
        <div>Created at: {patient.meta?.['createdAt'].slice(0, 10)}</div>
        <div>Birth date: {patient.birthDate}</div>
        <div>{patient.extension?.[0].extension?.[1].valueString}</div>
        <div>{patient.extension?.[1].extension?.[1].valueString}</div>
        <div>
            Birth place: {patient.extension?.[4]['valueAddress'].country}{' '}
            {patient.extension?.[4]['valueAddress'].state}{' '}
            {patient.extension?.[4]['valueAddress'].city}
        </div>
        <div>Medical Record Number: {patient.identifier?.[1].value}</div>
        <div>{patient.identifier?.[1].system}</div>
        <div>Social Security Number: {patient.identifier?.[2].value}</div>
    </div>
);
