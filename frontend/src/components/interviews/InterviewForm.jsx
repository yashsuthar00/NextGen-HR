import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const InterviewForm = ({ interview = null }) => {
  const isEditMode = !!interview;
  const { user } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    position: '',
    candidateId: '',
    scheduledAt: '',
    duration: 60,
    description: '',
    questions: ['']
  });
  
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/users?role=candidate');
        setCandidates(response.data);
      } catch (err) {
        console.error('Error fetching candidates:', err);
        setError('Failed to load candidates. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
    
    if (isEditMode) {
      // Format the date for the input
      const scheduledDate = new Date(interview.scheduledAt);
      const formattedDate = scheduledDate.toISOString().slice(0, 16);
      
      setFormData({
        position: interview.position,
        candidateId: interview.candidateId,
        scheduledAt: formattedDate,
        duration: interview.duration || 60,
        description: interview.description || '',
        questions: interview.questions || ['']
      });
    }
  }, [isEditMode, interview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = value;
    
    setFormData(prevState => ({
      ...prevState,
      questions: updatedQuestions
    }));
  };

  const handleAddQuestion = () => {
    setFormData(prevState => ({
      ...prevState,
      questions: [...prevState.questions, '']
    }));
  };

  const handleRemoveQuestion = (index) => {
    if (formData.questions.length === 1) return;
    
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(index, 1);
    
    setFormData(prevState => ({
      ...prevState,
      questions: updatedQuestions
    }));
  };

  const validateForm = () => {
    if (!formData.position) {
      setError('Position is required');
      return false;
    }
    if (!formData.candidateId) {
      setError('Candidate selection is required');
      return false;
    }
    if (!formData.scheduledAt) {
      setError('Interview date and time are required');
      return false;
    }
    
    // Check if any question is empty (except the last one)
    const nonEmptyQuestions = formData.questions.filter((q, i) => 
      q.trim() !== '' || i === formData.questions.length - 1
    );
    
    if (nonEmptyQuestions.length < formData.questions.length) {
      setError('Please fill in all questions or remove empty ones');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setError('');
    setSubmitLoading(true);
    
    try {
      // Filter out empty questions at the end
      const filteredQuestions = formData.questions.filter(q => q.trim() !== '');
      const dataToSubmit = {
        ...formData,
        questions: filteredQuestions,
      };
      
      if (isEditMode) {
        await axios.put(`/api/interviews/${interview.id}`, dataToSubmit);
      } else {
        await axios.post('/api/interviews', dataToSubmit);
      }
      
      router.push('/interviews');
    } catch (err) {
      console.error('Error submitting interview:', err);
      setError(err.response?.data?.message || 'Failed to save interview. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Interview' : 'Schedule New Interview'}
      </h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="position">
            Position *
          </label>
          <input
            id="position"
            name="position"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g. Frontend Developer"
            value={formData.position}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="candidateId">
            Candidate *
          </label>
          <select
            id="candidateId"
            name="candidateId"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.candidateId}
            onChange={handleChange}
            required
          >
            <option value="">Select a candidate</option>
            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name} ({candidate.email})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="scheduledAt">
            Date and Time *
          </label>
          <input
            id="scheduledAt"
            name="scheduledAt"
            type="datetime-local"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.scheduledAt}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
            Duration (minutes)
          </label>
          <input
            id="duration"
            name="duration"
            type="number"
            min="15"
            step="15"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.duration}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter any additional details about the interview..."
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Interview Questions
          </label>
          
          {formData.questions.map((question, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 mr-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder={`Question ${index + 1}`}
                value={question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
              />
              
              <button
                type="button"
                onClick={() => handleRemoveQuestion(index)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={formData.questions.length === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleAddQuestion}
            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Question
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/interviews')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            disabled={submitLoading}
          >
            {submitLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                {isEditMode ? 'Update' : 'Create'} Interview
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InterviewForm;