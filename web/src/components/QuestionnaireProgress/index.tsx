import { Progress } from 'antd';
import React from 'react';

interface Props {
    progress: number;
}

export const QuestionnaireProgress = ({ progress }: Props) => (
    <>
        <Progress percent={progress} status="active" />
    </>
);
