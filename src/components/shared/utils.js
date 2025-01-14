import { isEmpty } from 'lodash';

export function formatTitle(cmsObject) {
  return isEmpty(cmsObject.metadata.display_title)? cmsObject.title : cmsObject.metadata.display_title  
}
