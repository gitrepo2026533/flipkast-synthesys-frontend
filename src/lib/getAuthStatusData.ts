import { parseISO } from "date-fns";

interface GetAuthStatusDataProps {
  access: string;
  accessExpiration: string;
}

export const getAuthStatusData = ({ access, accessExpiration }: GetAuthStatusDataProps) => {
  const isAuthorized =
    access && accessExpiration && parseISO(new Date().toISOString()).getTime() < parseISO(accessExpiration).getTime();

  const nextAuthData = isAuthorized
    ? {
        isAuthorized: true,
        tokens: {
          access,
          accessExpiration: parseISO(accessExpiration),
        },
      }
    : {
        isAuthorized: false,
        tokens: {
          access: "",
          accessExpiration: null,
        },
      };

  return nextAuthData;
};
