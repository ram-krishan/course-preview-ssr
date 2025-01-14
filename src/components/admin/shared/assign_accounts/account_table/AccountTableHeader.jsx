import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

const AccountTableHeader = ({
  onSelectAllAccountsChange,
  isAllAccountsSelected,
}) => (
  <thead>
    <tr>
      <th>
        <Form.Label check>
          <input
            type="checkbox"
            checked={isAllAccountsSelected}
            onChange={onSelectAllAccountsChange}
          />
        </Form.Label>
      </th>
      <th><FormattedMessage id="admin.shared.assignAccountsPopup.tableHeaders.account" /></th>
      <th><FormattedMessage id="admin.shared.assignAccountsPopup.tableHeaders.status" /></th>
    </tr>
  </thead>
);

AccountTableHeader.propTypes = {
  onSelectAllAccountsChange: PropTypes.func.isRequired,
  isAllAccountsSelected: PropTypes.bool.isRequired,
};

export default AccountTableHeader;
