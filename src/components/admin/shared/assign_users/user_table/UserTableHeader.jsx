import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';


const UserTableHeader = ({
  onSelectAllUsersChange,
  isAllUsersSelected,
}) => (
  <thead>
    <tr>
      <th>
        <Form.Label check>
          <input
            type="checkbox"
            checked={isAllUsersSelected}
            onChange={onSelectAllUsersChange}
          />
        </Form.Label>
      </th>
      <th><h1 id="admin.shared.assignUsersPopup.tableHeaders.name" /></th>
      <th><h1 id="admin.shared.assignUsersPopup.tableHeaders.isManager" /></th>
    </tr>
  </thead>
);

UserTableHeader.propTypes = {
  onSelectAllUsersChange: PropTypes.func.isRequired,
  isAllUsersSelected: PropTypes.bool.isRequired,
};

export default UserTableHeader;
