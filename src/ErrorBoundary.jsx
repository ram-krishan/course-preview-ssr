import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  static isChunkLoadFailedError(error) {
    const isError =
      /^[A-Z]+_CHUNK_LOAD_FAILED$/.test(error.code) ||
      error.name == 'ChunkLoadError';
    console.log('isChunkLoadFailedError', { isError, error });
    return isError;
  }

  constructor(props) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: ErrorBoundary.isChunkLoadFailedError(error) };
  }

  componentDidCatch(error, _info) {
    const { hasError } = this.state;
    console.log('componentDidCatch hasError', { hasError, error, _info });
    if (hasError) {
      console.log('refreshing page.... current_page', window.location.href);
      window.location.reload();
    }
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return <center>Refreshing...</center>;
    }

    return <Fragment>{children}</Fragment>;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
