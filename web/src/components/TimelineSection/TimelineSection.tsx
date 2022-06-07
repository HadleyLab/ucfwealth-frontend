import { Checkbox, Divider, Timeline } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React from 'react';

import { AidboxResource } from 'shared/src/contrib/aidbox';

import { PatientData, TimeLineArray } from 'src/containers/SuperAdminApp/PatientData/useTimeline';
import { formatHumanDate } from 'src/utils/date';

import s from './TimelineSection.module.scss';

interface TimelineManager {
    onCheckAllChange: (e: CheckboxChangeEvent) => void;
    onChange: (list: CheckboxValueType[]) => void;
    configureTimelineArray: (data: PatientData, checkedList: CheckboxValueType[]) => TimeLineArray;
    openResourceDetails: (resource: AidboxResource) => void;
}

interface Props {
    data: PatientData;
    checkedList: CheckboxValueType[];
    indeterminate: boolean;
    checkAll: boolean;
    plainOptions: string[];
    timelineManager: TimelineManager;
}

export const TimelineSection = ({
    data,
    checkedList,
    indeterminate,
    checkAll,
    plainOptions,
    timelineManager,
}: Props) => {
    const { configureTimelineArray, onCheckAllChange, onChange, openResourceDetails } =
        timelineManager;

    const timeLineArray = configureTimelineArray(data, checkedList);

    const CheckboxGroup = Checkbox.Group;

    return (
        <div>
            <>
                <Divider />
                <Checkbox
                    indeterminate={indeterminate}
                    onChange={onCheckAllChange}
                    checked={checkAll}
                >
                    Check all
                </Checkbox>
                <Divider />
                <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
                <Divider />
            </>
            <Timeline mode="left">
                {timeLineArray.map((timelineResource, key) => (
                    <Timeline.Item key={key} label={formatHumanDate(timelineResource.date)}>
                        <div
                            className={s.timelineResource}
                            onClick={() => openResourceDetails(timelineResource.data)}
                        >
                            {timelineResource.type}: {timelineResource.text}
                        </div>
                    </Timeline.Item>
                ))}
                {timeLineArray.length === 0 && <div>Empty</div>}
            </Timeline>
        </div>
    );
};
