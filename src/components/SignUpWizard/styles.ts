import styled from 'styled-components';

const OuterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InnerContainer = styled.div`
  width: 800px;
  padding-top: 40px;
  padding-bottom: 40px;
  gap: 100px;
  flex-direction: 'column';
  display: 'flex';
`;

const FormContainer = styled.div`
  margin-top: 40px;
`;

export const S = {
    OuterContainer: OuterContainer,
    InnerContainer: InnerContainer,
    FormContainer: FormContainer
};
