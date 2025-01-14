import React, { useState } from "react";
import { Button } from "react-bootstrap";
import ContentStackExportModal from "./CourseHierarchy/ContentStackExportModal";
import { useContentStackExport } from "./hooks/useContentStackExport";
import { useAdminPortal } from "./hooks/useAdminPortal";
import { FormattedMessage } from "react-intl";

const ContentStackExportContainer = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const {
    loading: startedContentStackExporting,
    startContentStackExport,
    showContentStackExportModal,
    setShowContentStackExportModal,
    successMessage,
    setSuccessMessage,
  } = useContentStackExport({ setErrorMessage });

  const isAdminPortal = useAdminPortal();

  return (
    <>
      {isAdminPortal ? (
        <Button
          className="text-right ml-3 px-3 py-2 workflowStage-btn export-button-style button-custom-mb"
          onClick={() => setShowContentStackExportModal(true)}
        >
          <FormattedMessage id="coursePreview.btn.ContentstackExport" />
        </Button>
      ) : null}
      <ContentStackExportModal
        loading={startedContentStackExporting}
        showModal={showContentStackExportModal}
        setShowModal={setShowContentStackExportModal}
        startContentStackExport={startContentStackExport}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
      />
    </>
  );
};

export default ContentStackExportContainer;
