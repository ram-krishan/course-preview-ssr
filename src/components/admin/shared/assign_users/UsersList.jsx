import React from 'react';
import { includes } from 'lodash';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import VibTable from '../VibTable';

const markTick = (value) => {
  if (value) {
    return <FontAwesomeIcon icon={faCheck} />;
  }
  return '';
};

const confirmedStatusClassName = (confirmedValue) => {
  switch (confirmedValue) {
    case 'pending':
      return 'text-pagination-blue font-weight-bold text-uppercase';
    case 'not_sent':
      return 'text-danger font-weight-bold text-uppercase';
    default:
      return '';
  }
};

const getConfirmedStatus = (confirmedValue) => {
  switch (confirmedValue) {
    case 'pending':
    case 'not_sent':
      return <h1 id={`admin.userCollections.userTable.confirmed.${confirmedValue}`} />;
    default:
      return confirmedValue;
  }
};

const UsersList = ({
  users,
  objectType,
  selectedUserIds,
  handleRemoveUserChange,
  accountId,
}) => {
  const checkBox = (value) => (
    <input
      type="checkbox"
      defaultChecked={includes(selectedUserIds, value)}
      onChange={(event) => handleRemoveUserChange(event, value)}
    />
  );

  const getSharedColumnOptions = () => [
    {
      Header: () => '',
      accessor: 'id',
      disableSortBy: true,
      Cell: (props) => (
        <span>
          {checkBox(props.value)}
        </span>
      ),
    },
    {
      Header: <span><h1 id="admin.userCollections.userTable.name" /></span>,
      accessor: 'fullName',
      disableSortBy: false,
      Cell: (props) => (
        <a href={`/admin/accounts/${accountId}/users/${props.row.original.id}`}>
          {props.value}
        </a>
      ),
    },
  ];

  const getEmbeddedFieldColumnOptions = () => (
    [
      getSharedColumnOptions(),
      {
        Header: <span><h1 id="vib.admin.embeddedField.userTable.header.email" /></span>,
        accessor: 'email',
        disableSortBy: false,
        Cell: (props) => (
          <>
            <span>{props.value}</span>
          </>
        ),
      },
      {
        Header: <span>{users[0].embeddedFieldName}</span>,
        accessor: 'embeddedFieldValue',
        disableSortBy: false,
        Cell: (props) => (
          <>
            <span>{props.value}</span>
          </>
        ),
      },
    ].flat()
  );

  const getColumnOptions = () => (
    [
      getSharedColumnOptions(),
      {
        Header: <span><h1 id="admin.userCollections.userTable.confirmed" /></span>,
        accessor: 'confirmedStatus',
        disableSortBy: false,
        Cell: (props) => (
          <span className={confirmedStatusClassName(props.value)}>
            {getConfirmedStatus(props.value)}
          </span>
        ),
      },
      {
        Header: <span><h1 id="admin.userCollections.userTable.manager" /></span>,
        accessor: 'isManager',
        disableSortBy: false,
        Cell: (props) => (
          markTick(props.value)
        ),
      },
    ].flat()
  );

  return (
    <VibTable
      columns={objectType === 'Vib::EmbeddedField' ? getEmbeddedFieldColumnOptions() : getColumnOptions()}
      data={users}
    />
  );
};

UsersList.propTypes = {
  users: PropTypes.instanceOf(Array).isRequired,
  selectedUserIds: PropTypes.instanceOf(Array).isRequired,
  handleRemoveUserChange: PropTypes.func.isRequired,
  accountId: PropTypes.string.isRequired,
  objectType: PropTypes.string.isRequired,
};

export default UsersList;
