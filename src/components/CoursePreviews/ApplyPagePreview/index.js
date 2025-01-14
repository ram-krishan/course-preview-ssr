/* eslint-disable react/jsx-indent-props */
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';

import AlertMessage from '../../shared/AlertMessage';
import Loader from '../../shared/Loader';
import styles from './apply-page.module.scss';
import TitleBlock from '../../shared/pageTitle';
import classNames from 'classnames';
import ToolsContent from './ToolsContent';
import useApplyPageQuery from './hooks/useApplyPageQuery';


const ApplyPagePreview = () =>{
  const {
    courseCmsId,
    courseType,
    locale,
  } = useParams();

  const {
    learningResourceData,
    loading,
    error,
  } = useApplyPageQuery(courseCmsId, courseType, locale);
  if (loading) return <Loader />;

  if (error) {
    return (
      <AlertMessage
        alertType="danger"
        customClass="m-3"
        message={!isEmpty(error) && error.graphQLErrors}
      />
    );
  }

  return (
    <Container className={classNames(styles['base-container'], 'p-0 mt-0')}>
      <Row className="mb-5 pb-4">
        <Col sm={12} className="p-0 content-container">
          <Col md={12} className="mt-4 justify-content-between mb-4">
            <div className={classNames(styles['title-container'])}>
              <TitleBlock
                pageTitle={<FormattedMessage id="apply.pageTitle" />}
                courseTitle={<FormattedMessage id="apply.courseTitle" />}
                bottomTxtClassNames={styles['bottom-txt']}
              />
            </div>
          </Col>
            <ToolsContent
              learningResourceFormattedData={learningResourceData}
            />
        </Col>
      </Row>
    </Container>
  );
};

export default ApplyPagePreview;
