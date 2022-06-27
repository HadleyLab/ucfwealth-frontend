import { Progress } from 'antd';

import s from './QuestionnaireProgress.module.scss';

interface Props {
    progress: number;
}

export const QuestionnaireProgress = ({ progress }: Props) => (
    <Progress className={s.progressBar} percent={progress} status="active" />
);
