import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

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
      <th><FormattedMessage id="admin.shared.assignUsersPopup.tableHeaders.name" /></th>
      <th><FormattedMessage id="admin.shared.assignUsersPopup.tableHeaders.isManager" /></th>
    </tr>
  </thead>
);

UserTableHeader.propTypes = {
  onSelectAllUsersChange: PropTypes.func.isRequired,
  isAllUsersSelected: PropTypes.bool.isRequired,
};

export default UserTableHeader;
