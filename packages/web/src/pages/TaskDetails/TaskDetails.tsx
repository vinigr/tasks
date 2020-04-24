import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import * as RRD from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { useLazyLoadQuery } from 'react-relay/hooks';
import { graphql } from 'babel-plugin-relay/macro';

import { getUserDecoded } from '../../helpers/auth';

import { TaskDetailsQuery } from './__generated__/TaskDetailsQuery.graphql';

const useNavigate = (RRD as any).useNavigate;

const query = graphql`
  query TaskDetailsQuery($id: ID!) {
    task(id: $id) {
      title
      description
      author {
        _id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

const TaskDetails: React.FC = () => {
  let { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { task } = useLazyLoadQuery<TaskDetailsQuery>(query, { id });

  return (
    <Wrapper>
      <Title>{task?.title}</Title>
      <Detail>{task?.description}</Detail>
      {task?.createdAt && <Date>Created at: {dayjs(task?.createdAt).format('DD/MM/YYYY')}</Date>}
      {task?.updatedAt && <Date>Updated at: {dayjs(task?.updatedAt).format('DD/MM/YYYY')}</Date>}
      <Buttons>
        <Button onClick={() => navigate(-1)}>Back</Button>
        {task?.author?._id === getUserDecoded()?.id && <Button>Edit</Button>}
      </Buttons>
    </Wrapper>
  );
};

export default TaskDetails;

const Wrapper = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  margin-bottom: 10px;
`;

const Detail = styled.h2`
  font-size: 18px;
  color: #090909;
  margin-bottom: 6px;
`;

const Date = styled.span`
  font-size: 14px;
  font-weight: 300;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 10px;

  &:hover {
    cursor: pointer;
  }
`;
