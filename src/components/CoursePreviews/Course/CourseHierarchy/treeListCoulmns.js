import NameCell from './NameCell';
import CmsCell from './CmsCell';
import PreviewCell from './PreviewCell';

const treeListColummns = (selectedLocale) => {
  return [
    {
      "title": "Name",
      "field": "name",
      "type": "string",
      "width": 500,
      formatter: (row) => (
        <NameCell
          objectType={row.objectType}
          parentId={row.parentId}
          name={row.name}
          isLoadingData={row.isLoadingData}
        />
      )
    },
    {
      "title": "Measurement Category",
      "field": "measurementCategory",
      "type": "string"
    },
    {
      "title": "Activity Points",
      "field": "activityPoints",
      "type": "number"
    },
    {
      "title": "CMS",
      "field": "cms",
      "type": "string",
      "width": 150,
      formatter: (row) => <CmsCell
        objectId={row.objectId}
        objectType={row.objectType}
        locale={selectedLocale.value} />
    },
    {
      "title": "Preview",
      "field": "preview",
      "type": "string",
      "width": 100,
      formatter: (row) => <PreviewCell
        id={row.id}
        objectId={row.objectId}
        locale={selectedLocale.value}
        objectType={row.objectType} />
    }
  ];
};

export default treeListColummns;
