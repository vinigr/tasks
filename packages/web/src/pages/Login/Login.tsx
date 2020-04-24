import React, { useState, useContext } from 'react';
import * as RRD from 'react-router-dom';

import Form from '../../components/Form';
import Loading from '../../components/Loading';

import Input from '../../styles/InputForm';
import Button from '../../styles/ButtonForm';
import TextError from '../../styles/TextError';

import { UserLoginWithEmailMutationResponse } from './__generated__/UserLoginWithEmailMutation.graphql';
import UserLoginWithEmailMutation from './UserLoginWithEmailMutation';

import Context from '../../core/context';
import { login } from '../../helpers/auth';

const useNavigate = (RRD as any).useNavigate;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();

  const navigate = useNavigate();
  const { handleLogged } = useContext(Context);

  const handleLogin = (e: any) => {
    e.preventDefault();

    setError(null);

    if (!email || !password) {
      return setError('Incomplete credentials');
    }

    setLoading(true);

    const input = {
      email,
      password,
    };

    const onCompleted = (response: UserLoginWithEmailMutationResponse) => {
      setLoading(false);

      if (!response.UserLoginWithEmail) return;

      const { error, token } = response.UserLoginWithEmail;

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

    UserLoginWithEmailMutation.commit(input, onCompleted, onError);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Form title="Login">
      <Input placeholder="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <TextError>{error}</TextError>}
      <Button onClick={handleLogin}>Login</Button>
      <RRD.Link to="/register">Create account</RRD.Link>
    </Form>
  );
};

export default Login;
