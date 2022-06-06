import { Modal } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { useState } from 'react';

import {
    Condition,
    DiagnosticReport,
    ImagingStudy,
    Observation,
    Patient,
} from 'shared/src/contrib/aidbox';

export interface PatientData {
    patientResource: Patient;
    observationList: Observation[];
    diagnosticReportList: DiagnosticReport[];
    conditionList: Condition[];
    imagingStudy: ImagingStudy[];
}

export type TimeLineArray = {
    date?: string;
    type: string;
    text?: string | (string[] | undefined)[];
}[];

const sortArrayByDate = (
    array: {
        date?: string;
        type: string;
        text?: string | (string[] | undefined)[];
    }[],
) => {
    array.sort((a, b) => {
        if (a.date! > b.date!) {
            return -1;
        }
        if (a.date! < b.date!) {
            return 1;
        }
        return 0;
    });
};

const warning = () => {
    Modal.warning({
        title: 'This is a warning message',
        content: 'some messages...some messages...',
    });
};

const configureTimelineArray = (data: PatientData, checkedList: CheckboxValueType[]) => {
    const timeLineArray: TimeLineArray = [];

    if (checkedList.includes('Observations')) {
        data.observationList.map((observation) => {
            timeLineArray.push({
                date: observation.effective?.dateTime,
                type: 'Observation',
                text:
                    observation.code.text +
                    ' ' +
                    observation.value?.Quantity?.value +
                    ' ' +
                    observation.value?.Quantity?.unit,
            });
        });
    }

    if (checkedList.includes('Diagnostic Reports')) {
        data.diagnosticReportList.map((diagnosticReport) => {
            timeLineArray.push({
                date: diagnosticReport.effective?.dateTime,
                type: 'Diagnostic Report',
                text:
                    diagnosticReport.category?.map((category) =>
                        category.coding?.map((code) => code.display + ' '),
                    ) +
                    ' ' +
                    diagnosticReport.status,
            });
        });
    }

    if (checkedList.includes('Conditions')) {
        data.conditionList.map((condition) => {
            timeLineArray.push({
                date: condition.onset?.dateTime,
                type: 'Condition',
                text: condition.category?.map((category) =>
                    category.coding?.map((code) => code.display + ' '),
                ),
            });
        });
    }

    if (checkedList.includes('Imaging Studies')) {
        data.imagingStudy.map((imagingStudy) => {
            timeLineArray.push({
                date: imagingStudy.started,
                type: 'Imaging Study',
                text: imagingStudy.series?.[0].bodySite?.display,
            });
        });
    }

    sortArrayByDate(timeLineArray);

    return timeLineArray;
};

const plainOptions = ['Observations', 'Diagnostic Reports', 'Conditions', 'Imaging Studies'];
const defaultCheckedList = ['Observations', 'Diagnostic Reports', 'Conditions', 'Imaging Studies'];

export const useTimeline = () => {
    const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(defaultCheckedList);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);

    const onChange = (list: CheckboxValueType[]) => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < plainOptions.length);
        setCheckAll(list.length === plainOptions.length);
    };

    const onCheckAllChange = (e: CheckboxChangeEvent) => {
        setCheckedList(e.target.checked ? plainOptions : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };

    const timelineManager = {
        onCheckAllChange,
        onChange,
        warning,
        configureTimelineArray
    }

    return {
        checkedList,
        indeterminate,
        checkAll,
        plainOptions,
        timelineManager,
    };
};
