interface Props {
    status: boolean;
}

import s from './CompleteStatus.module.scss';

export const CompleteStatus = ({ status }: Props) => {
    return (
        <div className={status ? s.complete : s.incomplete}>
            <div className={s.font}>{status ? 'completed' : 'not completed'}</div>
        </div>
    );
};
