import { BrowserRouter, Routes, Route } from 'react-router-dom';
import JobApplyFormPage from './pages/jobApplyFormPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Hello World</h1>} />
        <Route path="/job/apply" element={<JobApplyFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;