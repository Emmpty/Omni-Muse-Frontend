import { Container, Loader, Center } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { createServerSideProps } from '~/server/utils/server-side-helpers';
import { EventUpsertForm } from '~/components/Events/EventUpsertForm';
import { useBrowserRouter } from '~/components/BrowserRouter/BrowserRouterProvider';
import { getEventsDetail as fetchEventsDetails } from '~/request/api/events';

export const getServerSideProps = createServerSideProps({
  useSession: true,
  resolver: async ({}) => {
    return { props: {} };
  },
});

export default function EventCreate() {
  const [isLoading, setIsLoading] = useState(true);
  const [eventsDetails, setEventsDetails] = useState();
  const browserRouter = useBrowserRouter();
  const { eventId } = browserRouter.query;

  const loadEventDetail = async () => {
    setIsLoading(true);
    try {
      const { code, result } = await fetchEventsDetails({ id: eventId });
      if (code === 200) {
        setEventsDetails(result.race);
      } else {
        // 可以处理错误情况
        console.error('Failed to fetch events:', result);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!eventId) return setIsLoading(false);
    loadEventDetail();
  }, [eventId]);

  return (
    <Container size="md">
      {isLoading ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        <EventUpsertForm eventData={eventsDetails} />
      )}
    </Container>
  );
}
