import React, { createContext, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { sessionState } from './graphql_states';
import Loader from './components/shared/Loader';
import AlertMessage from './components/shared/AlertMessage';

// const initializePendo = ({ id, accountId, accountName }, formattedRailsAppName) => {
//   if (typeof pendo !== 'undefined') {
//     pendo.initialize({
//       visitor: {
//         id,
//       },
//       account: {
//         id: accountId,
//         account_name: accountName,
//         environment: formattedRailsAppName,
//       },
//     });
//   }
// };

const CurrentAdminUserContext = createContext({
  isAuthenticated: false,
  currentAdminUser: null,
  enabledFeatures: null,
  globalSetting: null,
  breadCrumb: {
    data: [],
    setBreadCrumbs: () => {},
  },
});

const CurrentAdminUserConsumer = CurrentAdminUserContext.Consumer;

const CurrentAdminUserProvider = ({ children }) => {

  const [isCurrentAdminUserLoaded, setIsCurrentAdminUserLoaded] = useState(false);
  const [currentAdminUser, setCurrentAdminUser] = useState({});
  const [breadCrumbs, setBreadCrumbs] = useState([]);
  // Later we will remove no-cache once it will fixed in library.
  // https://github.com/apollographql/react-apollo/issues/3361
  // https://github.com/apollographql/react-apollo/issues/3774
  const {
    loading, error, data, refetch,
  } = useQuery(
    sessionState.queries.GET_CURRENT_ADMIN_USER,
    {
      fetchPolicy: 'no-cache',
    },
  );
  if (loading) return <Loader/>;
  if (error) { return <AlertMessage alertType="danger" message={error.graphQLErrors} />; }
  if (!isCurrentAdminUserLoaded) {
    setIsCurrentAdminUserLoaded(true);
    setCurrentAdminUser(data.currentAdminUser);
    // initializePendo(data.currentAdminUser, data.formattedRailsAppName);
    return <Loader/>;
  }
  return (
    <CurrentAdminUserContext.Provider
      value={{
        isAuthenticated: !isEmpty(currentAdminUser),
        currentAdminUser,
        setCurrentAdminUser,
        refetch,
        breadCrumb: {
          data: breadCrumbs,
          setBreadCrumbs,
        },
      }}
    >
      {children}
    </CurrentAdminUserContext.Provider>
  );
};
CurrentAdminUserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default CurrentAdminUserContext;
export { CurrentAdminUserProvider, CurrentAdminUserConsumer };
