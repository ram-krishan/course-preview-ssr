import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { CurrentUserConsumer } from '../../../../currentUserContext';
import { isEmpty, filter, groupBy, map, last } from 'lodash';

function useBreadCrumb(breadCrumbFor, title='') {
  const { breadCrumb: { data, setBreadCrumbs} } =  useContext(CurrentUserConsumer);
  let history = useHistory();
  let from = history.location.query && history.location.query.from

  useEffect(() => {
    switch (breadCrumbFor) {
      case "outline":
        setBreadCrumbForOutlinePage();
        break;
      case "learn":
        setBreadCrumbForLearnPage();
        break;
      case "lesson":
        setBreadCrumbForLessonPage();
        break;
      default:
        break;
    }
  }, [breadCrumbFor]);

  const setBreadCrumbForOutlinePage = () => {
    setBreadCrumbs([{
      key: 'outline',
      path: history.location.pathname,
      title: "Outline",
    }])
  }

  const setBreadCrumbForLearnPage = () => {
    let newData = [...data, {
      key: 'learn',
      path: history.location.pathname,
      title: title,
    }]
    let allowedBds = (from == "leftMenu") ? ['learn'] : ['outline', 'learn']
    newData = filter(newData, (breadCrumb) => allowedBds.includes(breadCrumb.key));
    const groupedNewData = groupBy(newData, 'key');
    const finalData = map(groupedNewData, (val) => last(val));
    setBreadCrumbs(finalData);
  }

  const setBreadCrumbForLessonPage = () => {
    if(isEmpty(data) || from == "todayPage") {
      setBreadCrumbs([])
    } else {
      let lessonBd = data.find(d => d.key == "lesson");
      if (lessonBd) {
        let newData = data.map(breadCrumb => {
          if(breadCrumb.key == "lesson") {
            return {
              key: 'lesson',
              path: history.location.pathname,
              title: title,
            }
          }
          return breadCrumb;
        })
        setBreadCrumbs(newData);
      } else {
        setBreadCrumbs([...data, {
          key: 'lesson',
          path: history.location.pathname,
          title: title,
        }]);
      }
    }
  }
}

export default useBreadCrumb;
