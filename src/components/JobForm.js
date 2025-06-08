import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';

// Reusable input component
const Input = ({ label, type, value, onChange, error, required = false, id }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      id={id}
      type={type}
      value={value}
      onChange={onChange}
    />
    {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
  </div>
);

// Reusable textarea component
const TextArea = ({ label, value, onChange, error, required = false, minLength = 0, id }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      id={id}
      value={value}
      onChange={onChange}
      rows="4"
      minLength={minLength}
    />
    {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
  </div>
);

// Reusable select component
const Select = ({ label, value, onChange, error, required = false, id, children }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      id={id}
      value={value}
      onChange={onChange}
    >
      {children}
    </select>
    {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
  </div>
);

// Technology tag component
const TechnologyTag = ({ tech, onRemove }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-2 mb-2">
    {tech}
    <button
      type="button"
      onClick={() => onRemove(tech)}
      className="ml-2 text-blue-600 hover:text-blue-800"
    >
      ×
    </button>
  </span>
);

// Job preview component
const JobPreview = ({ jobData }) => (
  <div className="bg-white p-6 rounded-lg shadow-md h-full sticky top-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">{jobData.title || 'Job Title'}</h2>
    
    <div className="flex flex-wrap gap-4 mb-4">
      {jobData.location && (
        <span className="text-sm text-gray-600">
          <i className="fas fa-map-marker-alt mr-1"></i> {jobData.location}
        </span>
      )}
      {jobData.workMode && (
        <span className="text-sm text-gray-600">
          <i className="fas fa-briefcase mr-1"></i> {jobData.workMode}
        </span>
      )}
      {jobData.experienceLevel && (
        <span className="text-sm text-gray-600">
          <i className="fas fa-user-tie mr-1"></i> {jobData.experienceLevel}
        </span>
      )}
    </div>

    {jobData.description && (
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Requirements</h3>
        <ul className="list-disc list-inside text-gray-600">
          {jobData.description.split('\n').filter(line => line.trim()).map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>
    )}

    {jobData.objectives && (
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Responsibilities</h3>
        <ul className="list-disc list-inside text-gray-600">
          {jobData.objectives.split('\n').filter(line => line.trim()).map((obj, index) => (
            <li key={index}>{obj}</li>
          ))}
        </ul>
      </div>
    )}

    {jobData.technologies && jobData.technologies.length > 0 && (
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Technologies</h3>
        <div className="flex flex-wrap gap-2">
          {jobData.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    )}

    {(jobData.salaryMin || jobData.salaryMax) && (
      <div className="text-gray-600">
        <p>
          Salary Range: ${jobData.salaryMin ? jobData.salaryMin.toLocaleString() : '0'} - ${jobData.salaryMax ? jobData.salaryMax.toLocaleString() : '0'}
        </p>
      </div>
    )}
  </div>
);

const JobForm = () => {
  const navigate = useNavigate();
  const { addJob } = useJobs();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    objectives: '',
    location: '',
    workMode: '',
    experienceLevel: '',
    salaryMin: '',
    salaryMax: '',
    technologies: []
  });

  const [errors, setErrors] = useState({});
  const [techInput, setTechInput] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const handleTechInputChange = (e) => {
    setTechInput(e.target.value);
  };

  const handleTechInputKeyPress = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      const newTech = techInput.trim();
      if (!formData.technologies.includes(newTech)) {
        setFormData(prev => ({
          ...prev,
          technologies: [...prev.technologies, newTech]
        }));
      }
      setTechInput('');
    }
  };

  const removeTechnology = (tech) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }
    if (!formData.objectives.trim()) {
      newErrors.objectives = 'Job objectives are required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.workMode) {
      newErrors.workMode = 'Work mode is required';
    }
    if (!formData.experienceLevel) {
      newErrors.experienceLevel = 'Experience level is required';
    }
    if (!formData.salaryMin) {
      newErrors.salaryMin = 'Minimum salary is required';
    }
    if (!formData.salaryMax) {
      newErrors.salaryMax = 'Maximum salary is required';
    }
    if (formData.technologies.length === 0) {
      newErrors.technologies = 'At least one technology is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Create job object
    const job = {
      title: formData.title,
      requirements: formData.description.split('\n').filter(line => line.trim()),
      responsibilities: formData.objectives.split('\n').filter(line => line.trim()),
      location: formData.location,
      workMode: formData.workMode,
      experienceLevel: formData.experienceLevel,
      salaryRange: {
        min: formData.salaryMin,
        max: formData.salaryMax
      },
      technologies: formData.technologies
    };

    // Add job to context
    addJob(job);

    // Show success message
    alert('Job posted successfully!');
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      objectives: '',
      location: '',
      workMode: '',
      experienceLevel: '',
      salaryMin: '',
      salaryMax: '',
      technologies: []
    });
    setTechInput('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Post a New Job</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="title"
                label="Job Title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                required
              />
              
              <Input
                id="location"
                label="Location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
                required
              />

              <Select
                id="workMode"
                label="Work Mode"
                value={formData.workMode}
                onChange={handleChange}
                error={errors.workMode}
                required
              >
                <option value="">Select work mode</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </Select>

              <Select
                id="experienceLevel"
                label="Experience Level"
                value={formData.experienceLevel}
                onChange={handleChange}
                error={errors.experienceLevel}
                required
              >
                <option value="">Select experience level</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="lead">Lead Level</option>
              </Select>

              <Input
                id="salaryMin"
                label="Minimum Salary"
                type="number"
                value={formData.salaryMin}
                onChange={handleChange}
                error={errors.salaryMin}
                required
              />

              <Input
                id="salaryMax"
                label="Maximum Salary"
                type="number"
                value={formData.salaryMax}
                onChange={handleChange}
                error={errors.salaryMax}
                required
              />
            </div>

            <div className="mt-6">
              <TextArea
                id="description"
                label="Job Requirements"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                required
                placeholder="Enter each requirement on a new line"
              />
            </div>

            <div className="mt-6">
              <TextArea
                id="objectives"
                label="Job Responsibilities"
                value={formData.objectives}
                onChange={handleChange}
                error={errors.objectives}
                required
                placeholder="Enter each responsibility on a new line"
              />
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Technologies <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.technologies.map((tech, index) => (
                  <TechnologyTag
                    key={index}
                    tech={tech}
                    onRemove={removeTechnology}
                  />
                ))}
              </div>
              <input
                type="text"
                value={techInput}
                onChange={handleTechInputChange}
                onKeyPress={handleTechInputKeyPress}
                placeholder="Type technology and press Enter"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {errors.technologies && (
                <p className="text-red-500 text-xs italic mt-1">{errors.technologies}</p>
              )}
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Post Job
              </button>
            </div>
          </form>

          {/* Live Preview */}
          <div className="hidden lg:block">
            <JobPreview jobData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobForm; 