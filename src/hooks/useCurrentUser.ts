import { useProjectSessionContext } from '~/components/CivitaiWrapped/ProjectSessionProvider';
import { postgresSlugify } from '~/utils/string-helpers';

export function useCurrentUser() {
  const user = useProjectSessionContext();
  return user;
}

export const useIsSameUser = (username?: string | string[]) => {
  const currentUser = useCurrentUser();
  if (!username || !currentUser) return false;
  const user =
    postgresSlugify(currentUser.username) ===
    postgresSlugify(typeof username === 'string' ? username : username[0]);
  return !!currentUser && user;
};
