import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    // TODO AXIOS REQUEST WITH PARAM
    async ({ pageParam = null }: { pageParam?: string }) => {
      const response = await api.get(`/api/images`, {
        params: {
          after: pageParam,
        },
      });

      return response;
    },
    {
      getNextPageParam: response => {
        const { after } = response.data;
        return after ?? null;
      },
    }
  );

  const getMoreItems = (): void => {
    fetchNextPage();
  };

  const formattedData = useMemo(() => {
    return data?.pages
      .map(item => {
        return item.data.data;
      })
      .flat();
  }, [data]);

  if (isLoading) return <Loading />;

  if (isError) return <Error />;

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button onClick={getMoreItems}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
