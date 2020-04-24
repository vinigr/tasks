import { createContext } from 'react';

interface AppContextInterface {
  isLogged: boolean;
  handleLogged: () => any;
}

const initialState = {
  isLogged: false,
  handleLogged: () => null,
};

const Context = createContext<AppContextInterface>(initialState);

export default Context;
