import React, { useState } from 'react';
import styled from 'styled-components';
import * as RRD from 'react-router-dom';
import { toast } from 'react-toastify';

import TaskAddMutation from './TaskAddMutation';
import { TaskAddMutationResponse } from './__generated__/TaskAddMutation.graphql';
import Loading from '../../components/Loading';

const useNavigate = (RRD as any).useNavigate;

const TaskAdd: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const createTask = () => {
    if (!title) {
      return toast('Title is required!', { type: 'warning' });
    }

    setLoading(true);
    const input = {
      title,
      description,
    };

    const onCompleted = (response: TaskAddMutationResponse) => {
      setLoading(false);

      if (!response.TaskAdd) return;

      const { error, task } = response.TaskAdd;

      if (error) {
        return toast(error, { type: 'error' });
      }

      if (task) {
        toast('Task successfully created', { type: 'success' });
        navigate(`/task/${task.node?.id}`);
      }
    };

    const onError = () => {
      setLoading(false);
      return toast('Something wrong when creating the task!', { type: 'error' });
    };

    TaskAddMutation.commit(input, onCompleted, onError);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <Title>Create task</Title>
      <Label>Title</Label>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      <Label>Details</Label>
      <Area value={description} onChange={(e) => setDescription(e.target.value)} />
      <Buttons>
        <Button onClick={() => navigate(-1)}>Back</Button>
        <Button onClick={createTask}>Create</Button>
      </Buttons>
    </Wrapper>
  );
};

export default TaskAdd;

const Wrapper = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 14px;
`;

const Label = styled.label``;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
`;

const Area = styled.textarea`
  resize: none;
  height: 100px;
  padding: 10px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const Button = styled.button`
  padding: 10px;

  &:hover {
    cursor: pointer;
  }
`;
