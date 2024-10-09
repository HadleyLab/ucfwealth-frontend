import logo from 'src/images/ucf-logo.svg';

import { S } from './styles';

interface Props {
    children?: React.ReactElement;
    illustrationNumber?: number;
}

export function AuthLayout(props: Props) {
    const { children, illustrationNumber } = props;

    return (
        <S.Container>
            <S.Content>
                <S.Illustration $illustrationNumber={illustrationNumber} />
                <S.FormContainer>
                    <S.Header>
                        <img src={logo} />
                        <S.CollegeName>College of Medicine</S.CollegeName>
                        <S.UniName>University of Central Florida</S.UniName>
                        <S.AppName>UCF MammoChat</S.AppName>
                    </S.Header>
                    <S.Form>{children}</S.Form>
                </S.FormContainer>
            </S.Content>
        </S.Container>
    );
}
