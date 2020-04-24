import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: solid #000 1px;
  padding: 10px;
  border-radius: 4px;
  width: 400px;
  min-height: 250px;

  a {
    text-decoration: none;
    margin: 10px 0;
  }
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

type FormProps = {
  title: string;
};

const Form: FunctionComponent<FormProps> = ({ title, children }) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      {children}
    </Wrapper>
  );
};

export default Form;
