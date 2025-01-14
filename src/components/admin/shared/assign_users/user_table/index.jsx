import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

import UserTableHeader from './UserTableHeader';
import UserTableBody from './UserTableBody';

const UserTable = ({
  onSelectAllUsersChange,
  isAllUsersSelected,
  selectedUserIds,
  usersList,
  handleUserSelectChange,
}) => (
  <Table responsive>
    <UserTableHeader
      onSelectAllUsersChange={onSelectAllUsersChange}
      isAllUsersSelected={isAllUsersSelected}
    />

    <UserTableBody
      selectedUserIds={selectedUserIds}
      usersList={usersList}
      handleUserSelectChange={handleUserSelectChange}
      isAllUsersSelected={isAllUsersSelected}
    />
  </Table>
);

UserTable.propTypes = {
  onSelectAllUsersChange: PropTypes.func.isRequired,
  isAllUsersSelected: PropTypes.bool.isRequired,
  selectedUserIds: PropTypes.instanceOf(Array).isRequired,
  usersList: PropTypes.instanceOf(Array).isRequired,
  handleUserSelectChange: PropTypes.func.isRequired,
};

export default UserTable;
