import axios from 'axios';
import React, { useState } from 'react';

const DownloadDialog = ({
  isOpen,
  setIsOpen,
  uploadedFileName,
  formData,
  disableReportButton,
}) => {
  const closeModal = () => {
    setIsOpen(false);
    window.location.reload();
  };
  const handleFileDownload = async (type) => {
    const apiUrl =
      type === 'report'
        ? `http://localhost:5000/api/reports/download/${uploadedFileName}`
        : `http://localhost:5000/api/download/${uploadedFileName}`;
    const extension = type === 'report' ? 'png' : formData.resultFormat;
    const baseFileName = uploadedFileName.substring(
      0,
      uploadedFileName.lastIndexOf('.')
    );

    try {
      const response = await axios.get(apiUrl, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${baseFileName}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div>
      {/* Modal */}
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg max-w-sm w-full'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold'>Download File</h2>
              <button
                onClick={closeModal}
                className='background-transparent text-gray-500 hover:text-gray-700 w-[9%]'
              >
                &times;
              </button>
            </div>
            <div className='text-center mb-5'>
              <button
                onClick={() => handleFileDownload('download')}
                className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
              >
                Download
              </button>
            </div>
            <div className='text-center'>
              <button
                disabled={disableReportButton}
                onClick={() => handleFileDownload('report')}
                className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
              >
                Report Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadDialog;
