import { Modal } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { useState } from 'react';

import {
    AidboxResource,
    Condition,
    DiagnosticReport,
    ImagingStudy,
    Observation,
    Patient,
} from 'shared/src/contrib/aidbox';

import { ResourceDetailsContent } from 'src/components/ResourceDetailsContent';

export interface PatientData {
    patientResource: Patient;
    observationList: Observation[];
    diagnosticReportList: DiagnosticReport[];
    conditionList: Condition[];
    imagingStudy: ImagingStudy[];
}

export type TimeLineArray = {
    data: AidboxResource;
    date?: string;
    type: string;
    text?: string | (string[] | undefined)[];
}[];

const sortArrayByDate = (array: TimeLineArray) => {
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

const configureTimelineArray = (data: PatientData, checkedList: CheckboxValueType[]) => {
    const timeLineArray: TimeLineArray = [];

    if (checkedList.includes('Observations')) {
        data.observationList.map((observation) =>
            timeLineArray.push({
                data: observation,
                date: observation.effective?.dateTime,
                type: 'Observation',
                text:
                    observation.code.text +
                    ' ' +
                    observation.value?.Quantity?.value +
                    ' ' +
                    observation.value?.Quantity?.unit,
            }),
        );
    }

    if (checkedList.includes('Diagnostic Reports')) {
        data.diagnosticReportList.map((diagnosticReport) =>
            timeLineArray.push({
                data: diagnosticReport,
                date: diagnosticReport.effective?.dateTime,
                type: 'Diagnostic Report',
                text:
                    diagnosticReport.category?.map((category) =>
                        category.coding?.map((code) => code.display + ' '),
                    ) +
                    ' ' +
                    diagnosticReport.status,
            }),
        );
    }

    if (checkedList.includes('Conditions')) {
        data.conditionList.map((condition) =>
            timeLineArray.push({
                data: condition,
                date: condition.onset?.dateTime,
                type: 'Condition',
                text: condition.category?.map((category) =>
                    category.coding?.map((code) => code.display + ' '),
                ),
            }),
        );
    }

    if (checkedList.includes('Imaging Studies')) {
        data.imagingStudy.map((imagingStudy) =>
            timeLineArray.push({
                data: imagingStudy,
                date: imagingStudy.started,
                type: 'Imaging Study',
                text: imagingStudy.series?.[0].bodySite?.display,
            }),
        );
    }

    sortArrayByDate(timeLineArray);

    return timeLineArray;
};

const openResourceDetails = (resource: AidboxResource) => {
    Modal.info({
        icon: false,
        mask: true,
        width: '50vw',
        content: ResourceDetailsContent({ resource }),
        okText: 'Close',
    });
};

const plainOptions = ['Observations', 'Diagnostic Reports', 'Conditions', 'Imaging Studies'];

export const useTimeline = () => {
    const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(plainOptions);
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
        configureTimelineArray,
        openResourceDetails,
    };

    return {
        checkedList,
        indeterminate,
        checkAll,
        plainOptions,
        timelineManager,
    };
};
