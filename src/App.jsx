import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    fetch("https://jsonfakery.com/jobs")
      .then((response) => response.json())
      .then((data) => {
        setJobs(data);
        setFilteredJobs(data);
        const uniqueCompanies = [...new Set(data.map((job) => job.company))];
        setCompanies(["All", ...uniqueCompanies]);
      })
      .catch((error) => console.error("Error fetching jobs:", error));
  }, []);

  useEffect(() => {
    let filtered = jobs.filter((job) =>
      job.title.toLowerCase().includes(searchTitle.toLowerCase())
    );
    if (selectedCompany !== "All") {
      filtered = filtered.filter((job) => job.company === selectedCompany);
    }
    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [searchTitle, selectedCompany, jobs]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div style={{ backgroundColor: darkMode ? "#121212" : "#f8f9fa", color: darkMode ? "#e0e0e0" : "#212529", minHeight: "100vh" }}>
      {/* Navbar with Dark Mode Toggle */}
      <nav className={`navbar navbar-expand-lg ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"} shadow`}>
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">JOB FINDER</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="d-flex ms-auto">
              <input
                type="text"
                className="form-control me-2"
                placeholder="🔍 Search Job Title..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
              />
              <select className="form-select me-2" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
                {companies.map((company, index) => (
                  <option key={index} value={company}>{company}</option>
                ))}
              </select>
              <button className={`btn ${darkMode ? "btn-light" : "btn-dark"}`} onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        {/* Job List */}
        <div className="row">
          {filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage).map((job) => (
            <div key={job.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card shadow-lg border-0" style={{ backgroundColor: darkMode ? "#1e1e1e" : "#ffffff", color: darkMode ? "#e0e0e0" : "#212529" }}>
                <div className="card-body">
                  <h5 className="card-title text-primary">{job.title}</h5>
                  <p className="card-text"><strong> Company:</strong> {job.company}</p>
                  <p className="card-text"><strong> Location:</strong> {job.location}</p>
                  <p className="card-text"><strong> Salary:</strong> {job.salary ? job.salary : "Not Disclosed"}</p>
                  <p className="card-text"><strong> Employment Type:</strong> {job.employment_type ? job.employment_type : "Not Specified"}</p>
                  <a href={job.url} className="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
                    View Job
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-outline-primary mx-2" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
             Previous
          </button>
          <span className="align-self-center mx-2">Page {currentPage}</span>
          <button className="btn btn-outline-primary mx-2" onClick={() => setCurrentPage((prev) => (prev * jobsPerPage < filteredJobs.length ? prev + 1 : prev))}>
            Next 
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
