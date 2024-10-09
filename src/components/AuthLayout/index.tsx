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
                    <S.Header />
                    <S.Form>{children}</S.Form>
                </S.FormContainer>
            </S.Content>
        </S.Container>
    );
}
