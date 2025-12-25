import React from 'react';
import '../styles/Alljobs.css';

const jobs = [
  {
    title: 'Senior Software Engineer',
    category: 'Engineering',
    company: 'Google India',
    rating: 4.3,
    location: 'Bangalore, Karnataka',
    experience: '5-8 yrs',
    salary: '₹25-45 LPA',
    date: '2 days ago',
    description: 'Join our team to build next-generation cloud solutions. Looking for engineers with strong problem-solving skills and experience in distributed systems.',
    skills: ['Java', 'Python', 'Cloud', 'Microservices']
  },
  {
    title: 'Product Manager',
    category: 'Product',
    company: 'Microsoft',
    rating: 4.1,
    location: 'Hyderabad, Telangana',
    experience: '4-7 yrs',
    salary: '₹30-50 LPA',
    date: '1 day ago',
    description: 'Lead product strategy and roadmap for enterprise solutions. MBA preferred with strong analytical skills.',
    skills: ['Product Strategy', 'Agile', 'Analytics', 'Stakeholder Management']
  },
  {
    title: 'UX Designer',
    category: 'Design',
    company: 'Flipkart',
    rating: 4.0,
    location: 'Bangalore, Karnataka',
    experience: '3-5 yrs',
    salary: '₹18-28 LPA',
    date: '3 days ago',
    description: 'Create beautiful user experiences for millions of users. Portfolio required showcasing mobile and web design projects.',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems']
  },
  {
    title: 'Data Scientist',
    category: 'Data Science',
    company: 'Amazon',
    rating: 4.2,
    location: 'Chennai, Tamil Nadu',
    experience: '3-6 yrs',
    salary: '₹22-38 LPA',
    date: '4 days ago',
    description: 'Build ML models to optimize logistics and enhance customer experience. Strong Python and statistics background required.',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow']
  },
  {
    title: 'Frontend Developer',
    category: 'Engineering',
    company: 'Swiggy',
    rating: 3.9,
    location: 'Bangalore, Karnataka',
    experience: '2-4 yrs',
    salary: '₹12-20 LPA',
    date: '1 day ago',
    description: 'Build responsive web applications using React. Looking for developers with strong JavaScript fundamentals.',
    skills: ['React', 'JavaScript', 'TypeScript', 'CSS']
  },
  {
    title: 'DevOps Engineer',
    category: 'Engineering',
    company: 'Infosys',
    rating: 3.8,
    location: 'Pune, Maharashtra',
    experience: '3-5 yrs',
    salary: '₹14-24 LPA',
    date: '5 days ago',
    description: 'Manage CI/CD pipelines and cloud infrastructure. AWS/Azure certification preferred.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins']
  },
  {
    title: 'Marketing Manager',
    category: 'Marketing',
    company: 'Zomato',
    rating: 3.7,
    location: 'Gurugram, Haryana',
    experience: '4-6 yrs',
    salary: '₹16-28 LPA',
    date: '2 days ago',
    description: 'Drive growth through innovative marketing campaigns. Experience in performance marketing required.',
    skills: ['Digital Marketing', 'SEO', 'Analytics', 'Campaign Management']
  },
  {
    title: 'Backend Developer',
    category: 'Engineering',
    company: 'Paytm',
    rating: 3.6,
    location: 'Noida, UP',
    experience: '2-5 yrs',
    salary: '₹15-25 LPA',
    date: '3 days ago',
    description: 'Build scalable APIs using Node.js and Python. Fintech experience is a plus.',
    skills: ['Node.js', 'Python', 'MongoDB', 'REST APIs']
  },
  {
    title: 'HR Business Partner',
    category: 'Human Resources',
    company: 'TCS',
    rating: 3.9,
    location: 'Mumbai, Maharashtra',
    experience: '5-8 yrs',
    salary: '₹18-30 LPA',
    date: '4 days ago',
    description: 'Partner with business leaders to drive people strategy and organizational culture.',
    skills: ['HR Strategy', 'Employee Relations', 'Talent Management', 'HRIS']
  },
  {
    title: 'Mobile Developer',
    category: 'Engineering',
    company: 'PhonePe',
    rating: 4.0,
    location: 'Bangalore, Karnataka',
    experience: '3-5 yrs',
    salary: '₹18-32 LPA',
    date: '1 day ago',
    description: 'Develop iOS/Android apps using React Native. Experience with payment systems preferred.',
    skills: ['React Native', 'iOS', 'Android', 'Redux']
  },
  {
    title: 'Business Analyst',
    category: 'Analytics',
    company: 'Wipro',
    rating: 3.7,
    location: 'Hyderabad, Telangana',
    experience: '2-4 yrs',
    salary: '₹10-18 LPA',
    date: '5 days ago',
    description: 'Analyze business requirements and translate to technical specifications.',
    skills: ['SQL', 'Excel', 'Power BI', 'Requirements Analysis']
  },
  {
    title: 'Cloud Architect',
    category: 'Engineering',
    company: 'IBM India',
    rating: 4.0,
    location: 'Bangalore, Karnataka',
    experience: '8-12 yrs',
    salary: '₹40-60 LPA',
    date: '2 days ago',
    description: 'Design enterprise cloud solutions. Multi-cloud experience required with AWS/Azure/GCP.',
    skills: ['AWS', 'Azure', 'Solution Architecture', 'Terraform']
  },
];

const JobCard = ({ job }) => (
  <article className="job-card">
    <div className="company-logo" aria-hidden="true">
      {job.company.charAt(0)}
    </div>
    
    <div className="job-content">
      <h2>{job.title}</h2>
      <div className="company-name">
        {job.company}
        <span className="rating">
          <span className="star">★</span> {job.rating}
        </span>
      </div>
      
      <div className="job-details">
        <div className="job-detail-item">
          <span className="icon">💼</span>
          <span>{job.experience}</span>
        </div>
        <div className="job-detail-item">
          <span className="icon">₹</span>
          <span>{job.salary}</span>
        </div>
        <div className="job-detail-item">
          <span className="icon">📍</span>
          <span>{job.location}</span>
        </div>
      </div>
      
      <p>{job.description}</p>
      
      <div className="job-skills">
        {job.skills.map((skill, i) => (
          <span className="skill" key={i}>{skill}</span>
        ))}
      </div>
      
      <div className="job-card-footer">
        <span className="posted-date">{job.date}</span>
        <p className="category">
          <a href="#" onClick={(e) => e.preventDefault()}>
            {job.category}
          </a>
        </p>
      </div>
    </div>
    
    <button>Apply</button>
  </article>
);

const Alljobs = () => {
  return (
    <div className="alljobs-page">
      <header className="jobs-hero">
        <h1>Find Your Perfect Job</h1>
        <p>Showing {jobs.length} jobs matching your preferences</p>
      </header>
      
      <div className="jobs-header" style={{padding: '16px 24px', maxWidth: '1200px', margin: '0 auto'}}>
        <div className="jobs-count">
          Showing <strong>1-{jobs.length}</strong> of <strong>{jobs.length}</strong> jobs
        </div>
        <div className="jobs-sort">
          Sort by:
          <select defaultValue="relevance">
            <option value="relevance">Relevance</option>
            <option value="date">Date Posted</option>
            <option value="salary">Salary</option>
          </select>
        </div>
      </div>
      
      <section className="jobs-container" aria-label="Job listings">
        {jobs.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </section>
    </div>
  );
};

export default Alljobs;
