// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from 'react/experimental';
import React, { useCallback, useTransition, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import dayjs from 'dayjs';

import { usePaginationFragment, preloadQuery, usePreloadedQuery } from 'react-relay/hooks';
import { graphql } from 'babel-plugin-relay/macro';
import { TaskList_query$key } from './__generated__/TaskList_query.graphql';
import { TaskListQuery } from './__generated__/TaskListQuery.graphql';
import { TaskListPaginationQuery } from './__generated__/TaskListPaginationQuery.graphql';

import Environment from '../../relay/Environment';

import TaskAddedSubscription from './subscription/TaskAddedSubscription';

const fragmentQuery = graphql`
  fragment TaskList_query on Query
    @argumentDefinitions(cursor: { type: "String" }, first: { type: Int, defaultValue: 10 }, search: { type: String })
    @refetchable(queryName: "TaskListPaginationQuery") {
    tasks(after: $cursor, first: $first, search: $search) @connection(key: "TaskList_tasks") {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          description
          author {
            name
          }
          updatedAt
        }
      }
    }
  }
`;

const rootQuery = graphql`
  query TaskListQuery {
    ...TaskList_query
  }
`;

const preloadedQuery = preloadQuery<TaskListQuery>(Environment, rootQuery, {});

const TaskList: React.FC = () => {
  const rootData = usePreloadedQuery<TaskListQuery>(rootQuery, preloadedQuery);
  const { data, isLoadingNext, hasNext, loadNext, refetch } = usePaginationFragment<
    TaskListPaginationQuery,
    TaskList_query$key
  >(fragmentQuery, rootData);

  useEffect(() => {
    const subscribe = TaskAddedSubscription();

    return () => {
      subscribe.dispose();
    };
  }, []);

  const [searchText, setSearchText] = useState('');
  const [startTransition] = useTransition();

  const loadMore = useCallback(() => {
    // Don't fetch again if we're already loading the next page
    if (isLoadingNext) return;
    loadNext(10);
  }, [isLoadingNext, loadNext]);

  const search = () => {
    startTransition(() => {
      refetch({ search: searchText });
    });
  };

  return (
    <Wrapper>
      <Header>
        <Title>Tasks</Title>
        <LinkAdd to="add">add task</LinkAdd>
      </Header>
      <Search placeholder="search" onChange={(e) => setSearchText(e.target.value)} />
      <SearchButton onClick={search}>Search</SearchButton>

      <List>
        {data.tasks?.edges.map((task) => (
          <Task key={task?.node?.id}>
            <InfoTask>
              <h2>{task?.node?.title}</h2>
              <span>created by: {task?.node?.author?.name}</span>
              <span>updated: {task?.node?.updatedAt && dayjs(task?.node?.updatedAt).format('DD/MM/YYYY')}</span>
            </InfoTask>

            <Link to={`/task/${task?.node?.id}`}>access</Link>
          </Task>
        ))}
      </List>

      {isLoadingNext && <h2>loading</h2>}
      {hasNext && (
        <ButtonLoad
          onClick={() =>
            startTransition(() => {
              loadMore();
            })
          }
        >
          load more
        </ButtonLoad>
      )}
    </Wrapper>
  );
};

export default TaskList;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const LinkAdd = styled(Link)`
  padding: 10px;
  text-decoration: none;
  color: #fff;
  background-color: #565656;
  border-radius: 4px;

  &:hover {
    cursor: pointer;
  }
`;

const Search = styled.input`
  padding: 10px;
  margin-bottom: 10px;
`;

const SearchButton = styled.button`
  margin-bottom: 10px;
  padding: 8px;
`;

const List = styled.ul`
  min-width: 60vw;
  max-width: 60vw;
  list-style-type: none;
`;

const Task = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f4f4f4;

  h2 {
    font-size: 18px;
    color: #5b5b5b;
  }

  a {
    text-decoration: none;
  }
`;

const InfoTask = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonLoad = styled.button`
  padding: 10px;
  align-self: center;

  &:hover {
    cursor: pointer;
  }
`;
