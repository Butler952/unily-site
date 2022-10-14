import { useEffect, useState } from 'react';
import fire from '../../../config/fire-config';
import ICONS from '../../../components/icon/IconPaths';
import { Modal } from 'react-bootstrap';
import mixpanel from 'mixpanel-browser';
import { PDFDownloadLink, PDFViewer, BlobProvider } from '@react-pdf/renderer';
import BasicResume from '../../../components/resumeExports/basicResume';
import { toast } from 'react-toastify';

const DownloadSection = ({userData, allUserData}) => {
  const [showModal, setShowModal] = useState(false);
  const [sendingData, setSendingData] = useState(false);
  const [fileType, setFileType] = useState('');
  const [notificationRequested, setNotificationRequested] = useState(false);
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleClose = () => {
    setShowModal(false)
    setFileType('')
  };
  const handleShow = () => setShowModal(true);

  const handleDownloadPdf = () => {
    // Send mixpanel event for PDF Download
    mixpanel.init('61698f9f3799a059e6d59e26bbd0138e'); 
    mixpanel.track("False door", {
      "experiment": "Download profile",
      "stage": "click",
      "fileType": "PDF",
    });
    setFileType('PDF')
    handleShow()
  }
  const handleDownloadDocx = () => {
    mixpanel.init('61698f9f3799a059e6d59e26bbd0138e'); 
    mixpanel.track("False door", {
      "experiment": "Download profile",
      "stage": "click",
      "fileType": "DOCX",
    });
    setFileType('DOCX')
    handleShow()
  }

  const handleNotifyMe = () => {
    // make new document in 
    setSendingData(true)
      fire.firestore().collection('falseDoors').doc('downloadProfile').collection('responses').add({
        userId: userData.uid,
        fileType: fileType,
        requestedAt: fire.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        mixpanel.init('61698f9f3799a059e6d59e26bbd0138e'); 
        mixpanel.track("False door", {
          "experiment": "Download profile",
          "stage": "notify",
          "fileType": fileType,
        });
        setSendingData(false)
        setNotificationRequested(true)
      })
      .catch((err) => {
        console.log(err.code, err.message)
        toast(err.message)
      })
  }

  return (
    <div>
      <div className="card mx-auto mb-5">
        <div className="p-4">
          <h5 className="text-dark-high mb-0">Download resume</h5>
          <p className="text-dark-low mb-0">Export you resume as a PDF or DOCX file</p>
        </div>
        <hr className="m-0"/>
        <div className="d-flex flex-column flex-md-row m-4" style={{gap: '16px'}}>
          {/* <button type="button" onClick={() => handleDownloadPdf()} className="btn primary medium icon-left w-100 w-md-auto">
            <svg viewBox="0 0 24 24">
              <path d={ICONS.DOWNLOAD}></path>
            </svg>
            PDF
          </button> */}
          {isClient && allUserData && (
            <PDFDownloadLink 
              document={<BasicResume allUserData={allUserData} />} 
              fileName={`${allUserData.profile.first_name}_${allUserData.profile.last_name}_resume.pdf`}
            >
              {({ blob, url, loading, error }) => (
                <button type="button" disabled={loading} className="btn primary medium icon-left w-100 w-md-auto">
                  <svg viewBox="0 0 24 24">
                    <path d={ICONS.DOWNLOAD}></path>
                  </svg>
                  PDF
                </button>
                )}
            </PDFDownloadLink>
          )}
          <button type="button" onClick={() => handleDownloadDocx()} className="btn primary medium icon-left w-100 w-md-auto">
            <svg viewBox="0 0 24 24">
              <path d={ICONS.DOWNLOAD}></path>
            </svg>
            DOCX
          </button>
        </div>
        {/* {isClient && allUserData && (
          <div className="d-flex flex-column">
            <PDFViewer height={1000}>
              <BasicResume allUserData={allUserData} />
            </PDFViewer >
          </div>
        )} */}
      </div>
      <Modal 
        show={showModal} 
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        { !notificationRequested ?
          <Modal.Body>
            <div className="d-flex flex-column align-items-center">
              <div className="bg-primary-200 p-4 radius-5 mb-4" style={{width: 'fit-content'}}>
                <svg viewBox="0 0 24 24" style={{width: '64px'}}>
                  <path d={ICONS.BOLT} className="fill-primary-900"></path>
                </svg>
              </div>
              <div className="mx-auto" style={{maxWidth: '320px'}}>
                <h4 className="text-dark-high text-center mb-3">Wow, you're fast!</h4>
                <p className="text-center mb-4">Unfortunately downloading your profile is not quite ready yet</p>
              </div>
              <button type="button" className="btn primary high small w-100 mt-3" disabled={sendingData} onClick={() => handleNotifyMe(fileType)}>{ !sendingData ? 'Notify me when this is ready' : 'Saving...'}</button>
              <button type="button" className="btn dark low small w-100 mt-3" onClick={handleClose}>No thanks</button>
            </div>
          </Modal.Body>
        : 
          <Modal.Body>
            <div className="d-flex flex-column align-items-center">
              <div className="mx-auto">
                <h4 className="text-dark-high text-center mb-3">You're first in line</h4>
                <p className="text-center mb-4">Thanks for letting us know that you're interested. Once the feature is ready to go, you'll be the first to know!</p>
              </div>
              <button type="button" className="btn primary high small w-100 mt-3" onClick={handleClose}>Close</button>
            </div>
          </Modal.Body>
        }
      </Modal>
    </div>
  )
}

export default DownloadSection