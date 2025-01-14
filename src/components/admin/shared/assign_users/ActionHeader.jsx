import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { FormattedMessage } from 'react-intl';
import { Button, Card, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import SearchBoxField from './user_filters/SearchBoxField';

const ActionHeader = ({
  searchText,
  handleInputChange,
  handleEnterPress,
  getFilteredResults,
  disableRemoveUsersBtn,
  disableRemoveAllBtn,
  removeSelectedUsers,
  totalPages,
  handlePageClick,
  toggleWarningModal,
  handleAddUsersClick,
  objectType,
}) => (
  <Card className="bg-faded card-block">
    <Card.Body className="px-0">
      <Row className="m-0">
        <Col xl={8} className="d-xl-flex flex-wrap">
          <Button
            className="btn btn-danger btn-sm navbar-btn mr-3 mb-2"
            onClick={() => removeSelectedUsers(false)}
            disabled={disableRemoveUsersBtn}
          >
            <i className="fa fa-remove" />
            {' '}
            <FormattedMessage id="admin.userCollections.btn.remove_selected" />
          </Button>

          <Button
            className="btn btn-danger btn-sm navbar-btn mr-3 mb-2"
            onClick={toggleWarningModal}
            disabled={disableRemoveAllBtn}
          >
            <i className="fa fa-remove" />
            {' '}
            <FormattedMessage id="admin.userCollections.btn.remove_all" />
          </Button>

          <Button className="btn btn-success btn-sm navbar-btn mr-3 mb-2" onClick={handleAddUsersClick}>
            <FontAwesomeIcon icon={faPlus} />
            {' '}
            { objectType === 'Vib::EmbeddedField'
              ? <FormattedMessage id="admin.embeddedField.btn.addUser" />
              : <FormattedMessage id="admin.userCollections.btn.addUsers" />
            }
          </Button>
          <div className="mb-2">
            <SearchBoxField
              searchText={searchText}
              handleInputChange={handleInputChange}
              handleEnterPress={handleEnterPress}
              getFilteredUsers={getFilteredResults}
            />
          </div>
        </Col>
        <Col xl={4} className="flex-end">
          <div className="navbar-btn pull-right">
            { totalPages <= 1 ? null
              : (
                <ReactPaginate
                  previousLabel={<FormattedMessage id="pagination.previousLabel" />}
                  nextLabel={<FormattedMessage id="pagination.nextLabel" />}
                  breakLabel="..."
                  breakClassName="break-me"
                  pageCount={totalPages}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={1}
                  onPageChange={handlePageClick}
                  containerClassName="pagination"
                  subContainerClassName="pages pagination"
                  activeClassName="active"
                  nextLinkClassName="p-0 border-0"
                  previousLinkClassName="p-0 border-0"
                />
              )}
          </div>
        </Col>
      </Row>
    </Card.Body>
  </Card>
);

ActionHeader.propTypes = {
  searchText: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleEnterPress: PropTypes.func.isRequired,
  getFilteredResults: PropTypes.func.isRequired,
  disableRemoveUsersBtn: PropTypes.bool.isRequired,
  disableRemoveAllBtn: PropTypes.bool.isRequired,
  removeSelectedUsers: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
  handlePageClick: PropTypes.func.isRequired,
  toggleWarningModal: PropTypes.func.isRequired,
  handleAddUsersClick: PropTypes.func.isRequired,
  objectType: PropTypes.string.isRequired,
};

export default ActionHeader;
