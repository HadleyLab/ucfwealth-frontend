import { Checkbox, Divider, Timeline } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React from 'react';

import { PatientData, TimeLineArray } from 'src/containers/SuperAdminApp/PatientData/useTimeline';
import { formatHumanDate } from 'src/utils/date';

import s from './TimelineSection.module.scss';

interface TimelineManager {
    onCheckAllChange: (e: CheckboxChangeEvent) => void;
    onChange: (list: CheckboxValueType[]) => void;
    warning: () => void;
    configureTimelineArray: (data: PatientData, checkedList: CheckboxValueType[]) => TimeLineArray;
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
    const { configureTimelineArray, onCheckAllChange, onChange, warning } = timelineManager;

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
                {timeLineArray.map((item, key) => {
                    return (
                        <Timeline.Item key={key} label={formatHumanDate(item.date)}>
                            <div className={s.timelineItem} onClick={warning}>
                                {item.type}: {item.text}
                            </div>
                        </Timeline.Item>
                    );
                })}
            </Timeline>
        </div>
    );
};
