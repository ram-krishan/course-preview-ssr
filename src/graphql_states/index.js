import { merge } from 'lodash';

import * as sessionState from './session';
import * as flashMessageState from './flash_message';
import * as redirectionState from './redirection';
import * as userState from './user';
import * as activityStat from './activity_stat';
import * as vibGraphqlStates from './vib';

const rootResolvers = merge(
  flashMessageState.resolvers,
);

const rootDefaults = merge(
  flashMessageState.defaults,
);

export {
  flashMessageState,
  redirectionState,
  rootDefaults,
  rootResolvers,
  sessionState,
  userState,
  activityStat,
  vibGraphqlStates,
};
