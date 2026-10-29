import { useEffect, useState } from "react";
import axios from "axios";
import {
  Link,
  Route,
  Routes,
} from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const backgroundImages = [
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2400&q=85",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2400&q=85",
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=2400&q=85",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2400&q=85",
];

function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage(
        (previous) =>
          (previous + 1) %
          backgroundImages.length
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="hero">
      {backgroundImages.map(
        (image, index) => (
          <div
            key={image}
            className={`background-image ${
              index === currentImage
                ? "active"
                : ""
            }`}
            style={{
              backgroundImage:
                `url("${image}")`,
            }}
          />
        )
      )}

      <div className="overlay" />

      <section className="hero-content">
        <div className="badge">
          CYBER SAFETY PORTAL
        </div>

        <h1>
          Report.
          <br />
          Protect.
          <br />
          Recover.
        </h1>

        <p>
          A secure platform for
          cyber-fraud reporting,
          awareness and case tracking.
        </p>

        <div className="buttons">
          <Link
            to="/report"
            className="btn primary"
          >
            Report Cyber Fraud
          </Link>

          <Link
            to="/track"
            className="btn secondary"
          >
            Track Case
          </Link>
        </div>
      </section>
    </main>
  );
}

function Page({ title, children }) {
  return (
    <main className="page">
      <section className="card">
        <Link
          to="/"
          className="back"
        >
          ← Home
        </Link>

        <h2>{title}</h2>

        {children}
      </section>
    </main>
  );
}

function Login() {
  return (
    <Page title="Secure Login">
      <form>
        <label>
          Mobile Number
        </label>

        <input
          type="tel"
          placeholder="+91 XXXXX XXXXX"
        />

        <label>
          Password
        </label>

        <input
          type="password"
          placeholder="Password"
        />

        <button
          type="button"
          className="btn primary"
        >
          Login
        </button>
      </form>
    </Page>
  );
}

function Register() {
  return (
    <Page title="Create Account">
      <form>
        <label>
          Full Name
        </label>

        <input
          placeholder="Full name"
        />

        <label>
          Mobile Number
        </label>

        <input
          type="tel"
          placeholder="+91 XXXXX XXXXX"
        />

        <label>
          Email
        </label>

        <input
          type="email"
          placeholder="Email address"
        />

        <label>
          Password
        </label>

        <input
          type="password"
          placeholder="Create password"
        />

        <button
          type="button"
          className="btn primary"
        >
          Create Account
        </button>
      </form>
    </Page>
  );
}

function Report() {
  const [form, setForm] =
    useState({
      fraudType: "",
      incidentDate: "",
      amount: "",
      phoneNumber: "",
      transactionReference: "",
      description: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const [error, setError] =
    useState("");

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response =
        await axios.post(
          `${API_URL}/fraud-reports`,
          form
        );

      setResult(
        response.data.report
      );

      setForm({
        fraudType: "",
        incidentDate: "",
        amount: "",
        phoneNumber: "",
        transactionReference: "",
        description: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit report."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page title="Report Cyber Fraud">
      {result && (
        <div className="success-box">
          <strong>
            Report submitted successfully.
          </strong>

          <p>
            Your case number:
          </p>

          <div className="case-number">
            {result.caseNumber}
          </div>

          <p>
            Save this number to track
            your report.
          </p>
        </div>
      )}

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
      >
        <label>
          Fraud Type
        </label>

        <select
          name="fraudType"
          value={form.fraudType}
          onChange={handleChange}
          required
        >
          <option value="">
            Select fraud type
          </option>

          <option value="UPI Fraud">
            UPI Fraud
          </option>

          <option value="Banking Fraud">
            Banking Fraud
          </option>

          <option value="Phishing">
            Phishing
          </option>

          <option value="Investment Fraud">
            Investment Fraud
          </option>

          <option value="Social Media Fraud">
            Social Media Fraud
          </option>

          <option value="Identity Theft">
            Identity Theft
          </option>

          <option value="Other">
            Other
          </option>
        </select>

        <label>
          Date of Incident
        </label>

        <input
          type="date"
          name="incidentDate"
          value={form.incidentDate}
          onChange={handleChange}
        />

        <label>
          Amount Involved
        </label>

        <input
          type="number"
          name="amount"
          min="0"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
        />

        <label>
          Phone Number Used
        </label>

        <input
          type="tel"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="If known"
        />

        <label>
          Transaction Reference
        </label>

        <input
          name="transactionReference"
          value={
            form.transactionReference
          }
          onChange={handleChange}
          placeholder="If applicable"
        />

        <label>
          Description
        </label>

        <textarea
          name="description"
          rows="7"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe what happened..."
          required
        />

        <button
          type="submit"
          className="btn primary"
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : "Submit Report"}
        </button>
      </form>
    </Page>
  );
}

function Track() {
  const [caseNumber, setCaseNumber] =
    useState("");

  const [report, setReport] =
    useState(null);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleTrack(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setReport(null);

    try {
      const response =
        await axios.get(
          `${API_URL}/fraud-reports/${caseNumber.trim()}`
        );

      setReport(
        response.data.report
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Case not found."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page title="Track Case">
      <form
        onSubmit={handleTrack}
      >
        <label>
          Case Reference Number
        </label>

        <input
          value={caseNumber}
          onChange={(event) =>
            setCaseNumber(
              event.target.value
            )
          }
          placeholder="CF-2026-XXXXXXXX"
          required
        />

        <button
          type="submit"
          className="btn primary"
          disabled={loading}
        >
          {loading
            ? "Checking..."
            : "Check Status"}
        </button>
      </form>

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {report && (
        <div className="case-result">
          <h3>
            Case Information
          </h3>

          <p>
            <strong>
              Case:
            </strong>{" "}
            {report.caseNumber}
          </p>

          <p>
            <strong>
              Status:
            </strong>{" "}
            {report.status}
          </p>

          <p>
            <strong>
              Fraud Type:
            </strong>{" "}
            {report.fraudType}
          </p>

          <p>
            <strong>
              Submitted:
            </strong>{" "}
            {new Date(
              report.createdAt
            ).toLocaleString()}
          </p>
        </div>
      )}
    </Page>
  );
}

function App() {
  return (
    <>
      <header className="navbar">
        <Link
          to="/"
          className="logo"
        >
          CYBER<span>SAFE</span>
        </Link>

        <nav>
          <Link to="/">
            Home
          </Link>

          <Link to="/report">
            Report
          </Link>

          <Link to="/track">
            Track
          </Link>

          <Link to="/login">
            Login
          </Link>

          <Link to="/register">
            Register
          </Link>
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/report"
          element={<Report />}
        />

        <Route
          path="/track"
          element={<Track />}
        />
      </Routes>
    </>
  );
}

export default App;