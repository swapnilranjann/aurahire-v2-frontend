import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/SkillTests.css';

const SkillTests = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testQuestions, setTestQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    fetchTests();
    if (isAuthenticated) {
      fetchMyResults();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (testQuestions && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testQuestions, timeLeft]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/skill-tests');
      console.log('Skill tests API response:', response);
      const testsData = response.data || [];
      console.log('Tests data:', testsData);
      setTests(testsData);
      
      if (testsData.length === 0) {
        console.warn('No skill tests found. Backend may need to seed data.');
      } else {
        console.log(`✅ Loaded ${testsData.length} skill tests`);
      }
    } catch (error) {
      console.error('❌ Error fetching skill tests:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error message:', error.message);
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyResults = async () => {
    try {
      const response = await api.get('/skill-tests/results/my-tests');
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const startTest = async (test) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/skill-tests' } });
      return;
    }

    try {
      setLoadingQuestions(true);
      // Fetch random questions for this test
      const response = await api.get(`/skill-tests/${test.id}/questions`);
      setTestQuestions(response.data);
      setSelectedTest(response.data.test);
      setCurrentQuestion(0);
      setAnswers({});
      setTimeLeft(response.data.test.duration_minutes * 60);
      setShowResults(false);
      setTestResult(null);
    } catch (error) {
      alert('Failed to load test questions. Please try again.');
      console.error('Error fetching questions:', error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleNext = () => {
    if (currentQuestion < testQuestions.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitTest = async () => {
    try {
      if (!testQuestions) return;
      
      const timeTaken = Math.floor((selectedTest.duration_minutes * 60 - timeLeft) / 60);
      const questionIds = testQuestions.questions.map(q => q.id);
      const answerArray = questionIds.map(id => answers[id] !== undefined ? answers[id] : -1);
      
      const response = await api.post(`/skill-tests/${selectedTest.id}/submit`, {
        answers: answerArray,
        question_ids: questionIds,
        time_taken_minutes: timeTaken,
      });
      
      setTestResult(response.data.result);
      setShowResults(true);
      fetchMyResults();
    } catch (error) {
      alert('Failed to submit test. Please try again.');
      console.error('Error submitting test:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="skill-tests-loading">Loading skill tests...</div>;
  }

  if (testQuestions && !showResults) {
    const question = testQuestions.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / testQuestions.questions.length) * 100;
    const answeredCount = Object.keys(answers).filter(key => answers[key] !== undefined).length;

    return (
      <div className="skill-tests-page">
        <div className="test-container">
          <div className="test-header">
            <h2>{selectedTest.title}</h2>
            <div className="test-timer">⏱️ {formatTime(timeLeft)}</div>
          </div>

          <div className="test-progress">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            <div className="progress-info">
              <span>Question {currentQuestion + 1} of {testQuestions.questions.length}</span>
              <span>Answered: {answeredCount}/{testQuestions.questions.length}</span>
            </div>
          </div>

          <div className="question-card">
            <div className="question-header">
              <span className="difficulty-badge">{question.difficulty || 'medium'}</span>
              <span className="points-badge">{question.points || 1} point{question.points > 1 ? 's' : ''}</span>
            </div>
            <h3>{question.question}</h3>
            <div className="options-list">
              {question.options.map((option, index) => (
                <label
                  key={index}
                  className={`option-item ${answers[question.id] === index ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    checked={answers[question.id] === index}
                    onChange={() => handleAnswer(question.id, index)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="test-navigation">
            <button onClick={handlePrevious} disabled={currentQuestion === 0}>
              ← Previous
            </button>
            <div className="question-jump">
              {testQuestions.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`question-number ${answers[q.id] !== undefined ? 'answered' : ''} ${idx === currentQuestion ? 'current' : ''}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            {currentQuestion === testQuestions.questions.length - 1 ? (
              <button onClick={handleSubmitTest} className="btn-submit">
                Submit Test
              </button>
            ) : (
              <button onClick={handleNext}>Next →</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showResults && testResult) {
    return (
      <div className="skill-tests-page">
        <div className="test-results-container">
          <div className={`result-card ${testResult.passed ? 'passed' : 'failed'}`}>
            <h2>{testResult.passed ? '🎉 Congratulations!' : 'Keep Learning!'}</h2>
            <div className="result-score">
              <div className="score-circle">
                <span className="score-number">{testResult.score}%</span>
              </div>
              <p>You scored {testResult.correct_answers} out of {testResult.total_questions}</p>
              {testResult.earned_points && (
                <p className="points-info">Points: {testResult.earned_points}/{testResult.total_points}</p>
              )}
              <p className="result-status">
                {testResult.passed ? 'You passed!' : `You need ${selectedTest.passing_score}% to pass`}
              </p>
            </div>

            {testResult.detailed_results && testResult.detailed_results.length > 0 && (
              <div className="detailed-results">
                <h3>Question Review</h3>
                <div className="results-list">
                  {testResult.detailed_results.map((detail, idx) => (
                    <div key={idx} className={`result-item ${detail.is_correct ? 'correct' : 'incorrect'}`}>
                      <div className="result-question">
                        <strong>Q{idx + 1}:</strong> {detail.question}
                      </div>
                      <div className="result-answer">
                        <span className={detail.is_correct ? 'correct-answer' : 'wrong-answer'}>
                          {detail.is_correct ? '✓' : '✗'} Your Answer: {detail.user_answer !== -1 ? `Option ${detail.user_answer + 1}` : 'Not answered'}
                        </span>
                        {!detail.is_correct && (
                          <span className="correct-answer">
                            Correct Answer: Option {detail.correct_answer + 1}
                          </span>
                        )}
                        {detail.explanation && (
                          <p className="explanation">{detail.explanation}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="result-actions">
              <button onClick={() => { setSelectedTest(null); setTestQuestions(null); setShowResults(false); }}>
                Back to Tests
              </button>
              <button onClick={() => startTest(selectedTest)} className="btn-retake">
                Retake Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="skill-tests-page">
      <div className="skill-tests-container">
        <div className="tests-header">
          <h1>Skill Tests</h1>
          <p>Test your skills and showcase your expertise to employers. Each test has 1000+ questions in the pool!</p>
        </div>

        {loading ? (
          <div className="loading-tests" style={{ textAlign: 'center', padding: '60px' }}>
            <div className="loading-spinner"></div>
            <p>Loading skill tests...</p>
          </div>
        ) : tests.length === 0 ? (
          <div className="no-tests-message" style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)'
          }}>
            <h3 style={{ color: '#1e293b', marginBottom: '12px' }}>No Skill Tests Available</h3>
            <p style={{ color: '#64748b', marginBottom: '8px' }}>
              Skill tests are being set up. Please check back soon!
            </p>
            <p style={{ fontSize: '14px', color: '#94a3b8' }}>
              Make sure the backend server is running and tests are seeded.
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '24px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
              Found {tests.length} skill test{tests.length !== 1 ? 's' : ''} available
            </div>
            <div className="tests-grid">
              {tests.map((test) => {
                const userResult = results.find(r => r.test_id === test.id);
                return (
                  <div key={test.id} className="test-card">
                    <div className="test-card-header">
                      <div className="test-icon">{test.icon || '📊'}</div>
                      <div>
                        <h3>{test.title}</h3>
                        <span className="skill-badge">{test.skill_name}</span>
                      </div>
                    </div>
                    <p className="test-description">{test.description}</p>
                    <div className="test-info">
                      <span>⏱️ {test.duration_minutes} min</span>
                      <span>❓ {test.questions_per_test || 25} questions per test</span>
                      <span>📚 {test.total_questions_in_db || 0}+ questions in pool</span>
                      <span>✅ {test.passing_score || 70}% to pass</span>
                    </div>
                    {userResult && (
                      <div className="test-result-badge">
                        <strong>Best Score: {userResult.score}%</strong>
                        {userResult.passed && <span className="passed-badge">✓ Passed</span>}
                        <span className="attempts-info">Last attempt: {new Date(userResult.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    <button 
                      onClick={() => startTest(test)} 
                      className="btn-start-test"
                      disabled={loadingQuestions}
                    >
                      {loadingQuestions ? 'Loading...' : userResult ? 'Retake Test' : 'Start Test'}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {isAuthenticated && results.length > 0 && (
          <div className="my-results-section">
            <h2>My Test Results</h2>
            <div className="results-list">
              {results.map((result) => (
                <div key={result.id} className="result-item">
                  <div className="result-info">
                    <h4>{result.SkillTest?.title || result.title || 'Test'}</h4>
                    <span className={`result-score-badge ${result.passed ? 'passed' : 'failed'}`}>
                      {result.score}% {result.passed ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="result-details">
                    <span>{result.correct_answers}/{result.total_questions} correct</span>
                    <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                    <button 
                      onClick={() => {
                        const test = tests.find(t => t.id === result.test_id);
                        if (test) startTest(test);
                      }}
                      className="btn-retake-small"
                    >
                      Retake
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillTests;
