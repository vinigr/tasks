import React, { useState, useEffect } from 'react';

import { isLoggedIn } from '../helpers/auth';

import Context from './context';

interface Props {
  children: React.ReactNode;
}

export const ContextProvider = ({ children }: Props) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);

  useEffect(() => {
    setIsLogged(isLoggedIn());
  }, []);

  const handleLogged = () => {
    setIsLogged(!isLogged);
  };

  return <Context.Provider value={{ isLogged, handleLogged }}>{children}</Context.Provider>;
};

export default ContextProvider;
