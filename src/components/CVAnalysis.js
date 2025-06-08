import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';

// Mock job description data
const mockJobDescription = {
  title: "Senior Full Stack Developer",
  requirements: [
    "5+ years of experience in web development",
    "Strong knowledge of React and Node.js",
    "Experience with cloud platforms (AWS/Azure)",
    "Database design and optimization",
    "Agile methodologies"
  ],
  responsibilities: [
    "Lead development of new features",
    "Mentor junior developers",
    "Architect scalable solutions",
    "Collaborate with cross-functional teams"
  ]
};

// Component for displaying the job description
const JobDescription = () => {
  const { jobs, selectedJob, selectJob } = useJobs();

  if (jobs.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">No Jobs Available</h2>
          <p className="mt-2 text-gray-600">
            Please create a job description in the Jobs section first.
          </p>
          <button
            onClick={() => window.location.href = '/jobs'}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Job
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Job Description
        </label>
        <div className="relative">
          <select
            value={selectedJob?.id || ''}
            onChange={(e) => selectJob(Number(e.target.value))}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none bg-white"
          >
            <option value="">Select a job...</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {selectedJob ? (
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedJob.title}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {selectedJob.location}
              </span>
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {selectedJob.workMode}
              </span>
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {selectedJob.experienceLevel}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Requirements</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {selectedJob.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {selectedJob.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedJob.technologies && selectedJob.technologies.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                <span className="font-medium">Salary Range:</span> ${selectedJob.salaryRange.min.toLocaleString()} - ${selectedJob.salaryRange.max.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-2 text-gray-600">Please select a job description to analyze CVs against.</p>
        </div>
      )}
    </div>
  );
};

// Component for displaying a single CV analysis result
const CVAnalysisResult = ({ result }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4 transform transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{result.name}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(result.score)}`}>
          Score: {result.score}/100
        </span>
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">Experience Summary</h4>
        <p className="text-gray-600">{result.experienceSummary}</p>
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">Job Compatibility</h4>
        <p className="text-gray-600">{result.compatibility}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Strengths</h4>
          <ul className="list-disc list-inside text-gray-600">
            {result.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Areas for Improvement</h4>
          <ul className="list-disc list-inside text-gray-600">
            {result.weaknesses.map((weakness, index) => (
              <li key={index}>{weakness}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Function to generate mock AI analysis results
const generateFakeAIResult = (fileName) => {
  const names = ['John Smith', 'Sarah Johnson', 'Michael Chen', 'Emma Rodriguez', 'David Kim'];
  const experiences = [
    'Senior developer with 8 years of experience in full-stack development',
    'Full-stack developer with 5 years of experience in React and Node.js',
    'Software engineer with 6 years of experience in cloud architecture',
    'Lead developer with 7 years of experience in enterprise applications',
    'Full-stack developer with 4 years of experience in modern web technologies'
  ];
  const compatibilities = [
    'Strong match for the role with relevant experience in all key areas',
    'Good match with some areas needing development',
    'Partial match with significant experience gaps',
    'Excellent match with leadership experience',
    'Moderate match with potential for growth'
  ];
  const strengths = [
    ['React/Node.js expertise', 'Cloud architecture', 'Team leadership'],
    ['Frontend development', 'API design', 'Agile methodologies'],
    ['Backend development', 'Database optimization', 'System architecture'],
    ['Full-stack development', 'Project management', 'Mentoring'],
    ['Modern frameworks', 'UI/UX design', 'Performance optimization']
  ];
  const weaknesses = [
    ['Limited cloud experience', 'Needs more team leadership'],
    ['Limited backend experience', 'Needs more architecture experience'],
    ['Limited frontend experience', 'Needs more team collaboration'],
    ['Limited cloud experience', 'Needs more modern framework experience'],
    ['Limited enterprise experience', 'Needs more architecture experience']
  ];

  const randomIndex = Math.floor(Math.random() * names.length);
  
  return {
    name: names[randomIndex],
    score: Math.floor(Math.random() * 40) + 60, // Score between 60-100
    experienceSummary: experiences[randomIndex],
    compatibility: compatibilities[randomIndex],
    strengths: strengths[randomIndex],
    weaknesses: weaknesses[randomIndex]
  };
};

// New component for displaying the Top 10 CVs
const TopCVs = ({ results }) => {
  const topResults = [...results]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Top 10 CVs</h2>
      {topResults.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No CVs analyzed yet</p>
      ) : (
        <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-3">
            {topResults.map((result, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-400 mr-3">#{index + 1}</span>
                  <span className="font-medium text-gray-700">{result.name}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.score >= 80 ? 'bg-green-100 text-green-800' :
                  result.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {result.score}/100
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CVAnalysis = () => {
  const { selectedJob } = useJobs();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState([]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleAnalyze = async () => {
    if (!selectedJob) {
      alert('Please select a job description first');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate fake results for each uploaded file
    const results = uploadedFiles.map(file => generateFakeAIResult(file.name));
    // Sort results by score in descending order
    const sortedResults = results.sort((a, b) => b.score - a.score);
    setAnalysisResults(sortedResults);
    setIsAnalyzing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Job Description Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <JobDescription />
            <TopCVs results={analysisResults} />
          </div>
        </div>

        {/* Upload Section Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Upload CVs</h2>
            
            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select CVs to analyze
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Uploaded Files</h3>
                <ul className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={uploadedFiles.length === 0 || isAnalyzing || !selectedJob}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                uploadedFiles.length === 0 || isAnalyzing || !selectedJob
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
            </button>
          </div>
        </div>

        {/* Analysis Results Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
              
              {analysisResults.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-2">Upload CVs and click analyze to see results</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {analysisResults.map((result, index) => (
                    <CVAnalysisResult key={index} result={result} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVAnalysis; 