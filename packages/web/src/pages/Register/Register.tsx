import React, { useState, useContext } from 'react';
import * as RRD from 'react-router-dom';

import Loading from '../../components/Loading';
import Form from '../../components/Form';

import Input from '../../styles/InputForm';
import Button from '../../styles/ButtonForm';
import TextError from '../../styles/TextError';

import { UserRegisterWithEmailMutationResponse } from './__generated__/UserRegisterWithEmailMutation.graphql';
import UserRegisterWithEmailMutation from './UserRegisterWithEmailMutation';

import Context from '../../core/context';
import { login } from '../../helpers/auth';

const useNavigate = (RRD as any).useNavigate;

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();

  const navigate = useNavigate();
  const { handleLogged } = useContext(Context);

  const handleRegister = (e: any) => {
    e.preventDefault();

    setError(null);

    if (!name || !email || !password) {
      return setError('Incomplete credentials');
    }

    setLoading(true);

    const input = {
      name,
      email,
      password,
    };

    const onCompleted = (response: UserRegisterWithEmailMutationResponse) => {
      setLoading(false);

      if (!response.UserRegisterWithEmail) return;

      const { error, token } = response.UserRegisterWithEmail;

      error && setError(error);

      if (token) {
        login(token);
        navigate('/');
        handleLogged();
      }
    };

    const onError = () => {
      setError('Something goes wrong with login');

      setLoading(false);
    };

    UserRegisterWithEmailMutation.commit(input, onCompleted, onError);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Form title="Register">
      <Input placeholder="full name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <TextError>{error}</TextError>}
      <Button onClick={handleRegister}>Register</Button>
      <RRD.Link to="/login">Sign in</RRD.Link>
    </Form>
  );
};

export default Login;
