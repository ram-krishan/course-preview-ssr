import React from 'react';
import { includes } from 'lodash';
import PropTypes from 'prop-types';
import UserTableRow from './UserTableRow';

const UserTableBody = ({
  selectedUserIds,
  usersList,
  handleUserSelectChange,
}) => (
  <tbody>
    {usersList.map(user => (
      <UserTableRow
        key={`add-user-${user.id}`}
        user={user}
        handleUserSelectChange={event => handleUserSelectChange(event, user.id)}
        isSelected={includes(selectedUserIds, user.id)}
      />
    ))}
  </tbody>
);

UserTableBody.propTypes = {
  selectedUserIds: PropTypes.instanceOf(Array).isRequired,
  usersList: PropTypes.instanceOf(Array).isRequired,
  handleUserSelectChange: PropTypes.func.isRequired,
};

export default UserTableBody;
