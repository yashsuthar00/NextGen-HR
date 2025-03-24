import React, { useState } from 'react';

const ApplyForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    job_id: '',
    resume: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'resume' && files && files[0]) {
      if (files[0].type !== 'application/pdf') {
        setErrors({ ...errors, resume: 'Only PDF files are allowed' });
        return;
      }
      setFormData({
        ...formData,
        resume: files[0]
      });
      setFileName(files[0].name);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.job_id.trim()) {
      newErrors.job_id = 'Job ID is required';
    }

    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('job_id', formData.job_id);
    formDataToSend.append('pdf', formData.resume);

    try {
      await onSubmit(formDataToSend);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
          }`}
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
          }`}
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="job_id" className="block text-gray-700 font-medium mb-2">
          Job ID <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="job_id"
          name="job_id"
          value={formData.job_id}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.job_id ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
          }`}
          placeholder="Enter the Job ID"
        />
        {errors.job_id && (
          <p className="text-red-500 text-sm mt-1">{errors.job_id}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="resume" className="block text-gray-700 font-medium mb-2">
          Resume <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center w-full">
          <label 
            className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <span className="text-gray-500">{fileName || 'Choose your resume file'}</span>
            <input
              type="file"
              id="resume"
              name="resume"
              onChange={handleChange}
              className="hidden"
              accept=".pdf"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              setFormData({ ...formData, resume: null });
              setFileName('');
            }}
            className={`ml-2 px-3 py-2 text-gray-500 hover:text-gray-700 ${!fileName ? 'hidden' : ''}`}
          >
            ✕
          </button>
        </div>
        {errors.resume && (
          <p className="text-red-500 text-sm mt-1">{errors.resume}</p>
        )}
        <p className="text-gray-500 text-sm mt-1">
          Accepted format: PDF
        </p>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
};

export default ApplyForm;