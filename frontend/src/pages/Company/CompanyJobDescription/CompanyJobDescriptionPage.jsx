import React from "react";
import "./CompanyJobDescription.css";

export default function CompanyJobDescriptionPage() {
  const job = {
    title: "Social Media Assistant",
    subtitle: "Design · Full-Time · 4 / 11 Hired",
    description:
      "Stripe is looking for Social Media Marketing expert to help manage our online networks. You will be responsible for monitoring our social media channels, creating content, finding effective ways to engage the community and incentivize others to engage on our channels.",
    responsibilities: [
      "Community engagement to ensure that is supported and actively represented online",
      "Focus on social media content development and publication",
      "Marketing and strategy support",
      "Stay on top of trends on social media platforms, and suggest content ideas to the team",
      "Engage with online communities"
    ],
    whoYouAre: [
      "You get energy from people and building the ideal work environment",
      "You have a sense for beautiful spaces and office experiences",
      "You are a confident office manager, ready for added responsibilities",
      "You're detail-oriented and creative",
      "You're a growth marketer and know how to run campaigns",
    ],
    niceToHave: [
      "Fluent in English",
      "Project management skills",
      "Copy editing skills",
    ],
    aboutRole: {
      applied: 5,
      capacity: 10,
      applyBefore: "July 31, 2021",
      postedOn: "July 1, 2021",
      jobType: "Full-Time",
      salary: "$75k–$85k USD",
    },
    categories: ["Marketing", "Design"],
    requiredSkills: [
      "Project Management",
      "Copywriting",
      "English",
      "Social Media Marketing",
      "Copy Editing",
    ],
  };

  const progressPct =
    job.aboutRole.capacity > 0
      ? Math.min(100, Math.round((job.aboutRole.applied / job.aboutRole.capacity) * 100))
      : 0;

  return (
    <div className="jd-wrapper">
      {/* Top row: back arrow + page title + right actions */}
      <header className="jd-top">
        <div className="jd-back">
          <button className="back-btn" aria-label="back">
            ←
          </button>
          <div className="back-text">
            <div className="title">{job.title}</div>
            <div className="subtitle">{job.subtitle}</div>
          </div>
        </div>

      </header>

      <main className="jd-main">
        <section className="jd-left">
          <div className="company-row">
            <div className="company-badge">S</div>
            <div className="company-name">{job.title}</div>
            <button className="post-job-btn">+ Post a job</button>
          </div>

          <div className="section description">
            <h3>Description</h3>
            <p>{job.description}</p>
          </div>

          <div className="section">
            <h3>Responsibilities</h3>
            <ul className="check-list">
              {job.responsibilities.map((r, i) => (
                <li key={i}>
                  <span className="check" />
                  <span className="li-text">{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h3>Who You Are</h3>
            <ul className="check-list">
              {job.whoYouAre.map((w, i) => (
                <li key={i}>
                  <span className="check" />
                  <span className="li-text">{w}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h3>Nice-To-Haves</h3>
            <ul className="check-list">
              {job.niceToHave.map((n, i) => (
                <li key={i}>
                  <span className="check" />
                  <span className="li-text">{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="jd-right">
          <div className="card about-role">
            <div className="card-head">
              <h4>About this role</h4>
            </div>

            <div className="applied-row">
              <div className="applied-text">
                <strong>{job.aboutRole.applied} applied</strong> of{" "}
                <span className="muted">{job.aboutRole.capacity} capacity</span>
              </div>

              <div className="progress-bar" role="progressbar" aria-valuenow={progressPct} aria-valuemin="0" aria-valuemax="100">
                <div className="progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            <div className="meta">
              <div className="meta-line">
                <span className="meta-title">Apply Before</span>
                <span className="meta-value">{job.aboutRole.applyBefore}</span>
              </div>
              <div className="meta-line">
                <span className="meta-title">Job Posted On</span>
                <span className="meta-value">{job.aboutRole.postedOn}</span>
              </div>
              <div className="meta-line">
                <span className="meta-title">Job Type</span>
                <span className="meta-value">{job.aboutRole.jobType}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h4>Categories</h4>
            <div className="pill-row">
              {job.categories.map((c, i) => (
                <span key={i} className="pill">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="card">
            <h4>Required Skills</h4>
            <div className="skill-tags">
              {job.requiredSkills.map((s, i) => (
                <span key={i} className="skill-tag">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
