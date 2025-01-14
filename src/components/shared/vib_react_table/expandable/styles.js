import styled from 'styled-components';

const Styles = styled.div`
  padding: 1rem;
  table {
    width: 100%;
    border-spacing: 0;
    tr {
      border-bottom: 1px solid #e6e6e6;
      border-right: 1px solid #e6e6e6;
      border-left: 1px solid #e6e6e6;
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      padding: .5em .75em;
      :last-child {
        border-right: 0;
      }
    }
    th {
      color: #a8a8a8;
      font-weight: 400;
      border-top: 1px solid #e6e6e6;
      border-right: 1px solid #e6e6e6;
      border-bottom: 1px solid #e6e6e6;
      background-color: #fafafa;
    }
    .collapse-icon{
      border: 0;
      background-color: transparent;
      padding: 0;
      outline: 0;
      svg{
        filter: invert(0.7);
      }
      &.expanded svg {
        transform: rotate(45deg);
      }
    }
    td {
      padding: 1em .75em;
    }
    .empty-spn{
      color: #fff;
      font-size: 7px;
    }
    .diff-indicator{
      color: #F19803;
    }
  }
`;

export default Styles;
