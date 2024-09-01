import axios from 'axios';
import React, { useState } from 'react';
import DownloadDialog from './DownloadDialog';
import { motion } from 'framer-motion';
const FormComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [fileFormat, setFileFormat] = useState('');
  const [aggregation, setAggregation] = useState('');
  const [aggregationVisible, setAggregationVisible] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [disableReportButton, setDisableReportButton] = useState(true);
  const [showValidation, setShowValidation] = useState({
    upload: false,
    resultFormat: false,
    aggCol: false,
    aggCon: false,
  });
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setShowValidation((prev) => ({ ...prev, upload: false }));
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setUploadedFileName(response.data.uniqueFilename);
      setFormData({
        ...formData,
        fileName: response.data.uniqueFilename,
      });
      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const [formData, setFormData] = useState({
    fileName: '',
    aggregationColumn: '',
    aggregationCondition: '',
    newColumn: '',
    resultFormat: '',
    report: '',
  });

  const submitFormData = async (formData) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/reports',
        formData
      );
      setIsOpen(true);
      console.log('Form data saved:', response);
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  const handleFileFormatChange = (e) => {
    setFileFormat(e.target.value);
    setFormData({ ...formData, fileName: '' }); // Reset file input on format change
  };

  const handleAggregationChange = (e) => {
    const value = e.target.value;

    setAggregation(value);
    setAggregationVisible(value !== 'None');
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'report') {
      if (e.target.value === '' || e.target.value === 'None') {
        setDisableReportButton(true);
      } else {
        setDisableReportButton(false);
      }
    }
    if (e.target.name === 'resultFormat') {
      if (e.target.value === '' || e.target.value === 'None') {
        setShowValidation((prev) => ({ ...prev, resultFormat: true }));
      } else {
        setShowValidation((prev) => ({ ...prev, resultFormat: false }));
      }
    }
    if (aggregationVisible) {
      if (e.target.name === 'aggregationColumn') {
        if (e.target.value === '' || e.target.value === 'None') {
          setShowValidation((prev) => ({ ...prev, aggCol: true }));
        } else {
          setShowValidation((prev) => ({ ...prev, aggCol: false }));
        }
      }

      if (e.target.name === 'aggregationCondition') {
        if (e.target.value === '' || e.target.value === 'None') {
          setShowValidation((prev) => ({ ...prev, aggCon: true }));
        } else {
          setShowValidation((prev) => ({ ...prev, aggCon: false }));
        }
      }
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const aggrValue = () => {
    if (!aggregation) {
      return '';
    } else if (!aggregation && !formData?.aggregationColumn) {
      return '';
    } else if (aggregation && !formData?.aggregationColumn) {
      return aggregation;
    } else {
      return `${aggregation} ${formData?.aggregationColumn}`;
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fileName) {
      setShowValidation((prev) => ({ ...prev, upload: true }));
      return;
    }

    if (aggregationVisible && !formData.aggregationColumn) {
      setShowValidation((prev) => ({ ...prev, aggCol: true }));
      return;
    }
    if (aggregationVisible && !formData.aggregationCondition) {
      setShowValidation((prev) => ({ ...prev, aggCon: true }));
      return;
    }
    if (!formData.resultFormat) {
      setShowValidation((prev) => ({ ...prev, resultFormat: true }));
      return;
    }
    const jsonOutput = {
      fileName: formData.fileName,
      fileFormat,
      aggregation,
      aggregationColumn: formData.aggregationColumn,
      aggregationCondition: formData.aggregationCondition,
      newColumn: aggrValue(),
      resultFormat: formData.resultFormat ? formData.resultFormat : '',
      report: formData?.report ? formData?.report : '',
    };
    submitFormData(jsonOutput);
    console.log('JSON Output:', jsonOutput);
  };

  return (
    <>
      <motion.form
        onSubmit={handleSubmit}
        className='form-container p-6 max-w-lg mx-auto space-y-4'
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <div>
          <label className='block text-sm font-medium text-white text-left'>
            File Format
          </label>
          <select
            value={fileFormat}
            onChange={handleFileFormatChange}
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500'
          >
            <option value=''>Select Format</option>
            <option value='csv'>CSV</option>
            <option value='xml'>XML</option>
            <option value='json'>JSON</option>
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-white text-left'>
            Upload File
          </label>
          <input
            type='file'
            accept={fileFormat ? `.${fileFormat}` : '*'}
            onChange={handleFileUpload}
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500'
          />
          {showValidation.upload && (
            <span className='block text-red-500 text-left mt-1'>
              Please select a file
            </span>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium text-white text-left'>
            Aggregation
          </label>
          <select
            value={aggregation}
            onChange={handleAggregationChange}
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500'
          >
            <option value='None'>None</option>
            <option value='Average'>Average</option>
            <option value='Sum'>Sum</option>
            <option value='Mean'>Mean</option>
          </select>
        </div>

        {aggregationVisible && (
          <>
            <div>
              <label className='block text-sm font-medium text-white text-left'>
                Aggregation Column
              </label>
              <input
                type='text'
                name='aggregationColumn'
                value={formData.aggregationColumn}
                onChange={handleInputChange}
                className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500'
              />
              {showValidation.aggCol && (
                <span className='block text-red-500 text-left mt-1'>
                  field is required
                </span>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-white text-left'>
                Aggregation Condition
              </label>
              <input
                type='text'
                name='aggregationCondition'
                value={formData.aggregationCondition}
                onChange={handleInputChange}
                className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500'
              />
              {showValidation.aggCon && (
                <span className='block text-red-500 text-left mt-1'>
                  field is required
                </span>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-white text-left'>
                New Column
              </label>
              <input
                type='text'
                name='newColumn'
                value={`${aggregation} ${
                  formData?.aggregationColumn ? formData?.aggregationColumn : ''
                }`}
                onChange={handleInputChange}
                readOnly
                className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 '
              />
            </div>
          </>
        )}

        <div>
          <label className='block text-sm font-medium text-white text-left'>
            Result File Format
          </label>
          <select
            value={formData.resultFormat}
            name='resultFormat'
            onChange={handleInputChange}
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500'
          >
            <option value=''>Select Format</option>
            <option value='CSV'>CSV</option>
            <option value='XML'>XML</option>
            <option value='JSON'>JSON</option>
          </select>
          {showValidation.resultFormat && (
            <span className='block text-red-500 text-left mt-1'>
              Please select a format
            </span>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium text-white text-left'>
            Report
          </label>
          <select
            value={formData.report}
            name='report'
            onChange={handleInputChange}
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500'
          >
            <option value='None'>None</option>
            <option value='Chart'>Chart</option>
          </select>
        </div>

        <button
          type='submit'
          className='submit-button w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          Submit
        </button>
      </motion.form>
      <DownloadDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        uploadedFileName={uploadedFileName}
        formData={formData}
        disableReportButton={disableReportButton}
      />
    </>
  );
};

export default FormComponent;
