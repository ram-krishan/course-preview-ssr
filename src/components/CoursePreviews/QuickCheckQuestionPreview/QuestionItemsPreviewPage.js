
import React from "react";
import { Col, Row } from "react-bootstrap";
import { isEmpty } from 'lodash';

const getInnerText = (elementData) =>{
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = elementData;
  const textContent = tempDiv.innerText;
  return textContent;
};

const renderQuestionItemTopics = (data) => {
  return data.topics.map((topic, index) => (
    <p key={index}>{topic}</p>
  ));
}

const renderChoicesAndFeedback = (data) => {
  return data.choicesAndFeedback.map((choice, index) => (
    <div key={index}>
      {choice.correct ? (
        <b className="text-success mb-3">{getInnerText(choice.body)}</b>
      ) : (
        <b>{getInnerText(choice.body)}</b>
      )}
      <ul>
        <li>{getInnerText(choice.feedback)}</li>
      </ul>
    </div>
  ));
}

const QuestionItemsPreviewPage = ({ formattedData }) => {
  return (
    <> 
    <Row>
      <Col className="col-12">
        <h1>QuickCheck Questions</h1>
      </Col>
    </Row>
      {formattedData.map((data, index) => (
        <Row>
          <Col>
            <Row className="col-12">
              <Col><h3 className="mt-3">{data.title}</h3></Col>
            </Row>
            <Row className="p-3">
              <Col className="col-md-6">
                <div className="border h-100 p-3">
                    <h3 className="mb-3">STEM</h3>
                    {!isEmpty(data.stem) && (
                      <p>
                        {getInnerText(data.stem)}
                      </p>
                    )}
                </div>
              </Col>
              <Col className="col-md-6">
                <div className="border h-100 p-3">
                    <>
                      <h3 className="mb-4">TOPIC</h3>
                      <ul className="p-0">
                      {!isEmpty(data.topics) && (
                        <p>{renderQuestionItemTopics(data)}</p>
                      )}
                      </ul>
                    </>
                </div>
              </Col>
            </Row>
              <Col className="col-12">
                <div className="border p-3 mb-4" style={{ minHeight: '200px' }}>
                  <h3>CHOICES & FEEDBACK</h3>
                  {!isEmpty(data.choicesAndFeedback) && renderChoicesAndFeedback(data)}
                </div>
              </Col>
          </Col>
        </Row>
      ))}
    </>
  );
};
export default QuestionItemsPreviewPage;
