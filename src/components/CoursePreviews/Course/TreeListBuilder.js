import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTable, useExpanded } from 'react-table';
import { FormattedMessage } from 'react-intl';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import {
  groupBy,
  filter,
  isEmpty,
  split,
  join,
  find,
} from 'lodash';
import { getEntryName, getContentType } from './shared';

const TreeListBuilder = ({
  treeData,
  loadAll,
  setLoadAll,
  selectedCourse,
  setTreeData,
}) => {
  if (!loadAll) {
    setLoadAll(true);
  }

  const buildHierarchicalData = (rootObjs, groupedData) => (
    rootObjs.map((obj) => {
      let object = { ...obj };
      if (!isEmpty(groupedData[object.id])) {
        object = { ...object, subRows: buildHierarchicalData(groupedData[object.id], groupedData) };
      }
      return object;
    })
  );

  const getReactTableFormattedData = () => {
    const groupedData = groupBy(treeData, 'parentId');
    if (treeData.length === 0 || groupedData === {}) {
      return [];
    }

    const rootObjs = filter(treeData, (obj) => obj.parentId === null);
    const data = buildHierarchicalData(rootObjs, groupedData);
    const lastIndex = data.length - 1;
    data[lastIndex] = { ...data[lastIndex], dupObject: treeData };
    return data;
  };

  const formattedData = getReactTableFormattedData();

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
    }
  `;

  const toggleRowExpanded = (props) => {
    const { data, row } = props;
    const { original, isExpanded } = row;
    const { dupObject } = data[data.length - 1];
    const object = dupObject.find((obj) => obj.id === original.id);
    const objectIndex = dupObject.findIndex((obj) => obj.id === original.id);
    const newTreeData = [...dupObject];
    object.expanded = !isExpanded;
    newTreeData[objectIndex] = { ...object };
    setTreeData(newTreeData);
  };

  function Table({ columns: userColumns, data }) {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      state: { expanded },
    } = useTable(
      {
        columns: userColumns,
        data,
        // autoResetExpanded: false,
      },
      useExpanded, // Use the useExpanded plugin hook
    );

    return (
      <>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => <td {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  }

  const showObjectErrorMessages = (errorMessages) => {
    if (isEmpty(errorMessages)) return null;

    return (
      <>
        <div className="text-danger ml-4 mt-2 pl-2">Errors: </div>
        <ul className="mt-2 ml-3">
          {
            errorMessages.map((errorMessage) => (
              <li className="text-danger text-wrap text-break">
                {errorMessage}
              </li>
            ))
          }
        </ul>
      </>
    );
  };

  const getInValidBadgeHtml = (object) => (
    object.isValid !== null && !object.isValid
      ? (
        <>
          <span className="badge badge-danger mx-2">
            <FormattedMessage id="coursePreview.label.inValid" />
          </span>
          { showObjectErrorMessages(object.errorMessages) }
        </>
      )
      : ''
  );

  const formateName = (value) => {
    if (value.parentId === null) {
      return (
        <>
          { value.name }
          { getInValidBadgeHtml(value) }
        </>
      );
    }
    return (
      <span>
        <span className="badge badge-info mr-2">
          {getContentType(value.typename)}
        </span>
        { value.name }
        { getInValidBadgeHtml(value) }
      </span>
    );
  };

  const l2BreakRoomPath = (mainObj, entry) => {
    switch (selectedCourse.typename) {
      case 'Level2Course':
        return (
          `/course-preview/${selectedCourse.typename}/${selectedCourse.value}/${entry.type}/l2/${entry.objectId}/preview`);
      case 'Level3Course': {
        const l3Id = join(split(mainObj.row.id, '.', mainObj.row.depth), '.');
        const level3 = find(mainObj.rows, ['id', l3Id]);
        return (
          `/course-preview/${selectedCourse.typename}/${selectedCourse.value}/${entry.type}/l3/${level3.original.objectId}/l2/${entry.objectId}/preview`); }
        default:
        throw new Error(`Sorry, we are out of ${selectedCourse.typename}.`);
    }
  };

  const pagePath = (mainObj, entry) => {
    let level1 = null;
    let level2 = null;
    let level3 = null;
    let l1Id = null;
    let l2Id = null;
    let l3Id = null;

    l1Id = join(split(mainObj.row.id, '.', mainObj.row.depth), '.');
    level1 = find(mainObj.rows, ['id', l1Id]);
    l2Id = join(split(level1.id, '.', level1.depth), '.');
    level2 = find(mainObj.rows, ['id', l2Id]);

    switch (selectedCourse.typename) {
      case 'Level2Course':
        return (`/course-preview/${selectedCourse.typename}/${selectedCourse.value}/${level2.original.type}/l2/${level2.original.objectId}/l1/${level1.original.objectId}/page/${entry.objectId}/preview`);
      case 'Level3Course':
        l3Id = join(split(level2.id, '.', level2.depth), '.');
        level3 = find(mainObj.rows, ['id', l3Id]);
        return (`/course-preview/${selectedCourse.typename}/${selectedCourse.value}/${level2.original.type}/l3/${level3.original.objectId}/l2/${level2.original.objectId}/l1/${level1.original.objectId}/page/${entry.objectId}/preview`);
        default:
        throw new Error(`Sorry, we are out of ${selectedCourse.typename}.`);
    }
  };

  const assessmentQuestionPath = (entry) => `/course-preview/assessment/${entry.parentOfParentCmsId}/exam/${entry.parentCmsId}/question/${entry.objectId}/preview`;

  const practiceQuestionPath = (entry) => (`/course-preview/practice_question/${entry.objectId}/preview`);


  const cmsPath = (entry) => (
    `${process.env.REACT_APP_CONTENT_STACK_ENDPOINT}/#!/stack/${process.env.REACT_APP_CONTENT_STACK_GQL_API_KEY}/content-type/${getEntryName(entry.typename)}/en-us/entry/${entry.objectId}/edit`
  );

  const questionPath = (mainObj, entry) => {
    let examId = null;
    let l2Id = null;
    let l3Id = null;
    let exam = null;
    let level2 = null;
    let level3 = null;
    examId = join(split(mainObj.row.id, '.', mainObj.row.depth), '.');
    exam = find(mainObj.rows, ['id', examId]);
    l2Id = join(split(exam.id, '.', exam.depth), '.');
    level2 = find(mainObj.rows, ['id', l2Id]);
    const lastLevel1 = filter(level2.subRows, (l1) => l1.original.typename === 'Level1').slice(-1)[0];
    const lastPage = lastLevel1.subRows.slice(-1)[0];

    switch (selectedCourse.typename) {
      case 'Level2Course':
        return (`/course-preview/${selectedCourse.typename}/${selectedCourse.value}/${level2.original.type}/l2/${level2.original.objectId}/ll1/${lastLevel1.original.objectId}/lp/${lastPage.original.objectId}/exam/${exam.original.objectId}/preview?question=${entry.objectId}`);
      case 'Level3Course':
        l3Id = join(split(level2.id, '.', level2.depth), '.');
        level3 = find(mainObj.rows, ['id', l3Id]);
        return (`/course-preview/${selectedCourse.typename}/${selectedCourse.value}/${level2.original.type}/l3/${level3.original.objectId}/l2/${level2.original.objectId}/ll1/${lastLevel1.original.objectId}/lp/${lastPage.original.objectId}/exam/${exam.original.objectId}/preview?question=${entry.objectId}`);
        default:
        throw new Error(`Sorry, we are out of ${selectedCourse.typename}.`);
    }
  };

  const l2ExamRoomPath = (mainObj, entry) => {
    let l2Id = null;
    let l3Id = null;
    let level2 = null;
    let level3 = null;
    l2Id = join(split(mainObj.row.id, '.', mainObj.row.depth), '.');
    level2 = find(mainObj.rows, ['id', l2Id]);
    const lastLevel1 = filter(level2.subRows, (l1) => l1.original.typename === 'Level1').slice(-1)[0];
    const lastPage = lastLevel1.subRows.slice(-1)[0];

    switch (selectedCourse.typename) {
      case 'Level2Course':
        return (`/course-preview/${selectedCourse.typename}/${selectedCourse.value}/${level2.original.type}/l2/${level2.original.objectId}/ll1/${lastLevel1.original.objectId}/lp/${lastPage.original.objectId}/exam/${entry.objectId}/preview`);
      case 'Level3Course':
        l3Id = join(split(level2.id, '.', level2.depth), '.');
        level3 = find(mainObj.rows, ['id', l3Id]);
        return (`/course-preview/${selectedCourse.typename}/${selectedCourse.value}/${level2.original.type}/l3/${level3.original.objectId}/l2/${level2.original.objectId}/ll1/${lastLevel1.original.objectId}/lp/${lastPage.original.objectId}/exam/${entry.objectId}/preview`);
        default:
        throw new Error(`Sorry, we are out of ${selectedCourse.typename}.`);
    }
  };

  const columnsL = React.useMemo(
    () => [
      {
        id: 'expander',
        Header: 'Name',
        accessor: 'name',
        Cell: (props) => (
          <>
            <div className="d-flex flex-wrap align-items-center">
              <span
                {...props.row.getToggleRowExpandedProps({
                  style: {
                    // We can even use the row.depth property
                    // and paddingLeft to indicate the depth
                    // of the row
                    paddingLeft: `${(props.row.depth + 1) > 8 ? '80px' : `${props.row.depth * 15}px`}`,
                    // paddingLeft: `${row.original.depth <= 7} ? ${row.depth * 2}rem : ${7 * 2}`,
                  },
                })}
              >
                { props.row.canExpand ? (
                  <button type="button" className={`collapse-icon ${props.row.isExpanded ? 'expanded' : 'collapsed'}`} onClick={() => toggleRowExpanded(props)}>
                    <ArrowRightIcon />
                  </button>
                ) : <span className="empty-spn">NA</span>}
              </span>
              <span>
                {formateName(props.row.original)}
              </span>
            </div>
          </>
        ),
      },
      {
        Header: () => <span className="d-block">Measurement Category</span>,
        accessor: 'measurementCategory',
        Cell: (props) => (
          <span>{props.row.original.measurementCategoryTitles}</span>
        ),
      },
      {
        Header: () => <span className="d-block">Activity Points</span>,
        accessor: 'activityPoints',
        Cell: (props) => (
          <span>{props.row.original.activityPoints}</span>
        ),
      },
      {
        Header: () => <span className="d-block">CMS</span>,
        accessor: 'cms',
        Cell: (props) => {
          if (props.row.original.parentId === null) {
            return ('');
          }
          return (
            <div>
              <div>
                <Link to={{ pathname: cmsPath(props.row.original) }} target="_blank">
                  Open CMS
                </Link>
              </div>
            </div>
          );
        },
      },
      {
        Header: () => <span className="d-block">Preview</span>,
        accessor: 'preview',
        Cell: (props) => {
          const value = props.row.original;
          if (value.typename === 'Exam') {
            return (
              <div>
                <div>
                  <Link
                    to={l2ExamRoomPath(props, value)}
                    target="_blank"
                  >
                    Preview
                  </Link>
                </div>
              </div>
            );
          }
          if (value.typename === 'Level2') {
            return (
              <div>
                <div>
                  <Link
                    to={l2BreakRoomPath(props, value)}
                    target="_blank"
                  >
                    Preview
                  </Link>
                </div>
              </div>
            );
          }
          if (value.typename === 'Pagev4') {
            return (
              <div>
                <div>
                  <Link to={pagePath(props, value)} target="_blank">
                    Preview
                  </Link>
                </div>
              </div>
            );
          } if (value.typename === 'Question') {
            return (
              <div>
                <div>
                  <Link to={questionPath(props, value)} target="_blank">
                    Preview
                  </Link>
                </div>
              </div>
            );
          }
          if (value.typename === 'AssessmentQuestion') {
            return (
              <div>
                <div>
                  <Link to={assessmentQuestionPath(value)} target="_blank">
                    Preview
                  </Link>
                </div>
              </div>
            );
          }
          if (value.typename === 'PracticeQuestion') {
            return (
              <div>
                <div>
                  <Link to={practiceQuestionPath(value)} target="_blank">
                    Preview
                  </Link>
                </div>
              </div>
            );
          }
          return ('');
        },
      },
    ],
    [],
  );

  return (
    <Styles>
      <Table
        columns={columnsL}
        data={formattedData}
        expandedRows
        isAllRowsExpanded
      />
    </Styles>
  );
};
export default TreeListBuilder;
