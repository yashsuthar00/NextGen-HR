# NextGen-HR 🚀

An intelligent AI-powered HR interview system that revolutionizes the recruitment process through automated candidate evaluation and real-time interview analysis.

## 🌟 Overview

NextGen-HR is a comprehensive human resources management platform that combines the power of MERN stack with AI microservices to deliver seamless interview experiences. The system provides automated candidate screening, intelligent question generation, and detailed performance analytics to help organizations make data-driven hiring decisions.

## ✨ Key Features

### 🎯 AI-Powered Interview System
- **Intelligent Question Generation**: Dynamic question creation based on job requirements and candidate profiles
- **Real-time Performance Analysis**: Live evaluation of candidate responses using natural language processing
- **Multi-format Support**: Text, voice, and video interview capabilities
- **Automated Scoring**: AI-driven candidate evaluation with detailed feedback reports

### 👥 Comprehensive User Management
- **Role-based Access Control**: Separate dashboards for HR managers, interviewers, and candidates
- **Candidate Portal**: Self-service platform for application submission and interview scheduling
- **Interview Management**: Complete interview lifecycle management from scheduling to feedback
- **Analytics Dashboard**: Comprehensive insights into recruitment metrics and candidate performance

### 🔧 Advanced Features
- **Resume Parsing**: Automatic extraction and analysis of candidate information
- **Interview Recording**: Secure storage and playback of interview sessions
- **Customizable Evaluation Criteria**: Flexible scoring parameters based on role requirements
- **Integration Support**: API endpoints for third-party HR tools and applicant tracking systems

## 🛠️ Technology Stack

### Frontend
- **React.js**: Modern user interface with component-based architecture
- **JavaScript**: Dynamic client-side functionality
- **CSS3**: Responsive and intuitive design
- **Material-UI/Bootstrap**: Professional UI components

### Backend
- **Node.js**: Server-side runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for flexible data storage
- **Flask**: Python microservices for AI processing

### AI & Machine Learning
- **Natural Language Processing**: Advanced text analysis and understanding
- **Speech Recognition**: Voice-to-text conversion for audio interviews
- **Sentiment Analysis**: Emotional intelligence evaluation
- **Machine Learning Models**: Predictive analytics for candidate assessment

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Python (v3.8 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yashsuthar00/NextGen-HR.git
cd NextGen-HR
```

2. **Install Frontend Dependencies**
```bash
cd client
npm install
```

3. **Install Backend Dependencies**
```bash
cd ../server
npm install
```

4. **Install Python Dependencies**
```bash
cd ../ai-service
pip install -r requirements.txt
```

5. **Environment Configuration**
Create `.env` files in both server and client directories:

**Server (.env)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nextgen-hr
JWT_SECRET=your_jwt_secret_key
AI_SERVICE_URL=http://localhost:8000
```

**Client (.env)**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AI_SERVICE_URL=http://localhost:8000
```

6. **Start the Services**

**Backend Server**
```bash
cd server
npm start
```

**AI Microservice**
```bash
cd ai-service
python app.py
```

**Frontend Application**
```bash
cd client
npm start
```

Access the application at `http://localhost:3000`

## 📱 Usage Guide

### For HR Managers
1. **Dashboard Access**: Login with admin credentials to access the HR dashboard
2. **Job Posting**: Create new job positions with detailed requirements
3. **Interview Scheduling**: Set up interview sessions and assign interviewers
4. **Candidate Review**: Monitor candidate performance and review AI-generated assessments
5. **Analytics**: Access comprehensive recruitment metrics and insights

### For Candidates
1. **Registration**: Create candidate profile with resume upload
2. **Application**: Apply for available positions through the portal
3. **Interview Preparation**: Access practice questions and preparation materials
4. **Interview Participation**: Join scheduled interviews via web browser or mobile device
5. **Feedback Access**: View detailed performance reports and recommendations

## 🏗️ Project Structure

```
NextGen-HR/
├── client/                 # React.js frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API service calls
│   │   ├── contexts/       # React context providers
│   │   └── utils/          # Utility functions
│   └── package.json
├── server/                 # Node.js/Express backend
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── package.json
├── ai-service/             # Python/Flask AI microservice
│   ├── models/             # Machine learning models
│   ├── services/           # AI processing services
│   ├── utils/              # Utility functions
│   └── requirements.txt
└── README.md
```

## 🔌 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Token verification

### Interview Management
- `GET /api/interviews` - Fetch all interviews
- `POST /api/interviews` - Create new interview
- `PUT /api/interviews/:id` - Update interview
- `DELETE /api/interviews/:id` - Delete interview

### AI Processing
- `POST /ai/analyze-response` - Analyze candidate response
- `POST /ai/generate-questions` - Generate interview questions
- `POST /ai/evaluate-candidate` - Complete candidate evaluation

## 🤝 Contributing

We welcome contributions from the developer community! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration for code consistency
- Write unit tests for new features
- Update documentation for API changes
- Ensure mobile responsiveness for UI components

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Author

**Yash Suthar** - [@yashsuthar00](https://github.com/yashsuthar00)

## 🔗 Links

- **Portfolio**:  [yashsuthar.com](https://yashsuthar.com)
- **LinkedIn**:  [@yashsuthar00](https://linkedin.com/in/yashsuthar00)
- **Email**: [yashsuthar0309@gmail.com]

## 🙏 Acknowledgments

- Thanks to the open-source community for the amazing tools and libraries
- Special appreciation to contributors who helped improve the platform
- Inspiration from modern HR technology solutions and AI advancements

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yashsuthar00/NextGen-HR/issues) page for existing problems
2. Create a new issue with detailed description and steps to reproduce
3. For urgent matters, contact the maintainer directly

## 🔄 Version History

- **v1.0.0** - Initial release with core HR interview functionality
- **v1.1.0** - Added AI-powered candidate evaluation
- **v1.2.0** - Enhanced user interface and mobile responsiveness

---

⭐ **Star this repository if you find it helpful!** ⭐