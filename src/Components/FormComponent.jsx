import axios from 'axios';
import React, { useState } from 'react';
import DownloadDialog from './DownloadDialog';

const FormComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [fileFormat, setFileFormat] = useState('');
  const [aggregation, setAggregation] = useState('');
  const [aggregationVisible, setAggregationVisible] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
      setUploadedFileName(response.data.filename);
      setFormData({
        ...formData,
        fileName: file.name,
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const jsonOutput = {
      fileName: formData.fileName,
      fileFormat,
      aggregation,
      aggregationColumn: formData.aggregationColumn,
      aggregationCondition: formData.aggregationCondition,
      newColumn: `${aggregation} ${formData.aggregationColumn} `,
      resultFormat: formData.resultFormat,
      report: formData.report,
    };
    submitFormData(jsonOutput);
    console.log('JSON Output:', jsonOutput);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className='p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg space-y-4'
      >
        <div>
          <label className='block text-sm font-medium text-gray-700 text-left'>
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

        {/* <div>
        <label className='block text-sm font-medium text-gray-700 text-left'>
          Upload File
        </label>
        <input
          type='file'
          name='fileName'
          accept={fileFormat ? `.${fileFormat}` : '*'}
          onChange={handleInputChange}
          className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500'
          disabled={!fileFormat}
        />
        {!fileFormat && (
          <p className='text-red-500 text-sm mt-2'>
            Please select a file format first.
          </p>
        )}
      </div> */}
        <div>
          <label className='block text-sm font-medium text-gray-700 text-left'>
            Upload File
          </label>
          <input
            type='file'
            accept={fileFormat ? `.${fileFormat}` : '*'}
            onChange={handleFileUpload}
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 text-left'>
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
              <label className='block text-sm font-medium text-gray-700 text-left'>
                Aggregation Column
              </label>
              <input
                type='text'
                name='aggregationColumn'
                value={formData.aggregationColumn}
                onChange={handleInputChange}
                className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 text-left'>
                Aggregation Condition
              </label>
              <input
                type='text'
                name='aggregationCondition'
                value={formData.aggregationCondition}
                onChange={handleInputChange}
                className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 text-left'>
                New Column
              </label>
              <input
                type='text'
                name='newColumn'
                value={`${aggregation} ${formData.aggregationColumn}`}
                onChange={handleInputChange}
                readOnly
                className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100'
              />
            </div>
          </>
        )}

        <div>
          <label className='block text-sm font-medium text-gray-700 text-left'>
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
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 text-left'>
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
          className='w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          Submit
        </button>
      </form>
      <DownloadDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        uploadedFileName={uploadedFileName}
      />
    </>
  );
};

export default FormComponent;
