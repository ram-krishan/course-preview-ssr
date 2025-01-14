import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form, FormGroup } from 'react-bootstrap';
import Select from 'react-select';

const LocaleSelect = ({
  LocaleOptions,
  handleChangeLocale,
  selectedLocale,
  fieldTitle,
}) => {

  return (
    <Col md="4">
      <Form>
        <FormGroup>
          <Form.Label htmlFor="locale">
            {fieldTitle}
          </Form.Label>
          <Select
            name="locale"
            value={selectedLocale}
            options={LocaleOptions}
            onChange={handleChangeLocale}
            menuPlacement="auto"
            minMenuHeight="400"
            inputId='locale'
          />
        </FormGroup>
      </Form>
    </Col>
  );
};

LocaleSelect.propTypes = {
  handleChangeLocale: PropTypes.func.isRequired,
  LocaleOptions: PropTypes.instanceOf(Array).isRequired,
  selectedLocale: PropTypes.instanceOf(Object).isRequired,
  fieldTitle: PropTypes.string.isRequired,
};

export default LocaleSelect;
