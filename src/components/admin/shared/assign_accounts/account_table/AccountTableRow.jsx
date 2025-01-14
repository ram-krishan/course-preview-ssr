import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

const AccountTableRow = ({
  isSelected, handleAccountSelectChange,
  account: {
    id, name, status
  },
}) => (
  <tr>
    <td>
      <Form.Label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={event => handleAccountSelectChange(event, id)}
        />
      </Form.Label>
    </td>
    <td>{ name }</td>
    <td>{ status }</td>
  </tr>
);

AccountTableRow.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  handleAccountSelectChange: PropTypes.func.isRequired,
  account: PropTypes.instanceOf(Object).isRequired,
};

export default AccountTableRow;
