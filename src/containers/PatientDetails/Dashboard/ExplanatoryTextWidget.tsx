import { Trans } from '@lingui/macro';

import { Text } from '@beda.software/emr/components';

import { S } from './styles';

export function ExplanatoryTextWidget() {
    return (
        <S.Content>
            <Text style={{ fontWeight: 500 }}>
                <Trans>
                    With over 40,000,000 mammograms run annually in the US, there are psychological consequences of
                    breast cancer imaging that are well documented among patients such as stress and anxiety from
                    largely false positive or indeterminant readings by radiologists.
                </Trans>
            </Text>
            <br />
            <br />
            <Text style={{ fontWeight: 500 }}>
                <Trans>The research purpose of this
                    project is to determine how we may develop Artificial Intelligence (AI) models of breast imaging
                    that facilitate new ways of detecting and treating disease and improve patient outcomes by
                    assembling a de-identified breast cancer radiographic imaging repository.
                </Trans>
            </Text>
            <br />
            <br />
            <Text style={{ fontWeight: 500 }}>
                <Trans>This project also aims to
                    document how patients may use a trusted social health or wellness network to better understand their
                    imaging.
                </Trans>
            </Text>
        </S.Content>
    );
}
