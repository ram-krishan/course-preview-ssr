import React from 'react';
import WordIcon from './WordIcon';

const WordBlockIcon = (props) => (
  <span data-testid="word-block-icon" {...props}>
    <WordIcon />
  </span>
);
export default WordBlockIcon;
