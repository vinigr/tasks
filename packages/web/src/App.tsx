import React from 'react';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import environment from './relay/Environment';

import ContextProvider from './core/ContextProvider';

import Routes from './routes';

import GlobalStyle from './styles/global';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

function App() {
  toast.configure({ autoClose: 2000 });

  return (
    <RelayEnvironmentProvider environment={environment}>
      <Wrapper>
        <ContextProvider>
          <Routes />
        </ContextProvider>
      </Wrapper>
      <GlobalStyle />
      <ToastContainer />
    </RelayEnvironmentProvider>
  );
}

export default App;
