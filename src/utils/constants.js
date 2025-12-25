// ========================================
// Application Constants
// ========================================

export const APP_CONFIG = {
  name: 'JobPortal',
  tagline: 'Find Your Dream Career',
  description: 'Your gateway to amazing career opportunities',
  email: 'support@jobportal.com',
  phone: '+91 1234 567 890',
  address: '123 Business Park, Bangalore, India 560001',
};

export const FEATURED_JOBS = [
  {
    title: "Software Engineer",
    company: "Tech Corp",
    location: "Bangalore",
    description: "Looking for a skilled software engineer with 3+ years experience in React and Node.js."
  },
  {
    title: "Product Manager",
    company: "Innovate Inc.",
    location: "Mumbai",
    description: "Seeking a product manager to lead our product development team and drive strategy."
  },
  {
    title: "UI/UX Designer",
    company: "Designify",
    location: "Pune",
    description: "Hiring a creative UI/UX designer to work on exciting new projects and apps."
  }
];

export const NEWS_ARTICLES = [
  {
    title: "New Job Opportunities in Tech",
    summary: "Explore the latest job opportunities in the technology sector with top companies.",
    link: "https://www.naukri.com/campus/career-guidance/latest-technology-trends-for-freshers"
  },
  {
    title: "How to Improve Your Resume",
    summary: "Tips and tricks to enhance your resume and land your dream job faster.",
    link: "https://enhancv.com/resources/resume-fixer/"
  },
  {
    title: "Interview Preparation Guide",
    summary: "Prepare for your next interview with our comprehensive step-by-step guide.",
    link: "https://www.interviewbit.com/practice/"
  }
];

export const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    feedback: "An amazing platform that helped me find my perfect job within weeks!"
  },
  {
    name: "Priya Patel",
    feedback: "Great user experience and excellent support. Highly recommended for job seekers!"
  },
  {
    name: "Amit Kumar",
    feedback: "A fantastic resource for job seekers. Very user-friendly and effective!"
  }
];

export const ALL_JOBS = [
  {
    title: 'Senior Software Engineer',
    category: 'Engineering',
    company: 'Google India',
    location: 'Bangalore, Karnataka',
    date: 'Dec 20, 2025',
    description: 'Join our team to build next-generation cloud solutions. 5+ years experience required.',
  },
  {
    title: 'Product Manager',
    category: 'Product',
    company: 'Microsoft',
    location: 'Hyderabad, Telangana',
    date: 'Dec 19, 2025',
    description: 'Lead product strategy and roadmap for enterprise solutions. MBA preferred.',
  },
  {
    title: 'UX Designer',
    category: 'Design',
    company: 'Flipkart',
    location: 'Bangalore, Karnataka',
    date: 'Dec 18, 2025',
    description: 'Create beautiful user experiences for millions of users. Portfolio required.',
  },
  {
    title: 'Data Scientist',
    category: 'Data Science',
    company: 'Amazon',
    location: 'Chennai, Tamil Nadu',
    date: 'Dec 17, 2025',
    description: 'Build ML models to optimize logistics and customer experience.',
  },
  {
    title: 'Frontend Developer',
    category: 'Engineering',
    company: 'Swiggy',
    location: 'Bangalore, Karnataka',
    date: 'Dec 16, 2025',
    description: 'Build responsive web applications using React. 2+ years experience.',
  },
  {
    title: 'DevOps Engineer',
    category: 'Engineering',
    company: 'Infosys',
    location: 'Pune, Maharashtra',
    date: 'Dec 15, 2025',
    description: 'Manage CI/CD pipelines and cloud infrastructure. AWS certification preferred.',
  },
  {
    title: 'Marketing Manager',
    category: 'Marketing',
    company: 'Zomato',
    location: 'Delhi NCR',
    date: 'Dec 14, 2025',
    description: 'Drive growth through innovative marketing campaigns. 4+ years experience.',
  },
  {
    title: 'Backend Developer',
    category: 'Engineering',
    company: 'Paytm',
    location: 'Noida, UP',
    date: 'Dec 13, 2025',
    description: 'Build scalable APIs using Node.js and Python. Fintech experience a plus.',
  },
  {
    title: 'HR Business Partner',
    category: 'Human Resources',
    company: 'TCS',
    location: 'Mumbai, Maharashtra',
    date: 'Dec 12, 2025',
    description: 'Partner with business leaders to drive people strategy and culture.',
  },
  {
    title: 'Mobile Developer',
    category: 'Engineering',
    company: 'PhonePe',
    location: 'Bangalore, Karnataka',
    date: 'Dec 11, 2025',
    description: 'Develop iOS/Android apps using React Native. 3+ years experience.',
  },
  {
    title: 'Business Analyst',
    category: 'Analytics',
    company: 'Wipro',
    location: 'Hyderabad, Telangana',
    date: 'Dec 10, 2025',
    description: 'Analyze business requirements and translate to technical specifications.',
  },
  {
    title: 'Cloud Architect',
    category: 'Engineering',
    company: 'IBM India',
    location: 'Bangalore, Karnataka',
    date: 'Dec 09, 2025',
    description: 'Design enterprise cloud solutions. Multi-cloud experience required.',
  },
];

export const ABOUT_STATS = [
  { number: '10K+', label: 'Jobs Posted' },
  { number: '50K+', label: 'Job Seekers' },
  { number: '1K+', label: 'Companies' },
  { number: '95%', label: 'Success Rate' },
];

export const NAV_LINKS = [
  { path: '/home', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/contact', label: 'Contact Us' },
  { path: '/jobs', label: 'All Jobs' },
];

export const CONTACT_INFO = [
  {
    icon: '📧',
    title: 'Email Us',
    content: APP_CONFIG.email,
    link: `mailto:${APP_CONFIG.email}`
  },
  {
    icon: '📞',
    title: 'Call Us',
    content: APP_CONFIG.phone,
    link: `tel:${APP_CONFIG.phone.replace(/\s/g, '')}`
  },
  {
    icon: '📍',
    title: 'Visit Us',
    content: APP_CONFIG.address,
    link: null
  }
];


