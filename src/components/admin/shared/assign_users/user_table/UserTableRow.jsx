import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const UserTableRow = ({
  isSelected, handleUserSelectChange,
  user: {
    id, fullName, salesRoles, territoryName, businessUnitName, isManager,
  },
}) => (
  <tr>
    <td>
      <Form.Label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(event) => handleUserSelectChange(event, id)}
        />
      </Form.Label>
    </td>
    <td>{ fullName }</td>
    <td>{ isManager ? <FontAwesomeIcon icon={faCheck} /> : '' }</td>
  </tr>
);

UserTableRow.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  handleUserSelectChange: PropTypes.func.isRequired,
  user: PropTypes.instanceOf(Object).isRequired,
};

export default UserTableRow;
