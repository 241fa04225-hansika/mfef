
import React from "react";
import "./DashboardPage.css";

const learningModules = [
  {
    icon: "🌐",
    title: "Computer Networks",
    description: "Understand networking concepts step by step.",
    tag: "COMPUTER SCIENCE",
    color: "lavender",
  },
  {
    icon: "🤖",
    title: "Machine Learning",
    description: "Explore algorithms, models, and AI concepts.",
    tag: "ARTIFICIAL INTELLIGENCE",
    color: "mint",
  },
  {
    icon: "💻",
    title: "Modern Front-End Frameworks",
    description: "Learn React and modern web development.",
    tag: "WEB DEVELOPMENT",
    color: "peach",
  },
  {
    icon: "📐",
    title: "Mathematics",
    description: "Break complex problems into easy steps.",
    tag: "MATHEMATICS",
    color: "yellow",
  },
];

function DashboardPage({ setActiveTab }) {
  const user = JSON.parse(
    localStorage.getItem("understandx_current_user") || "null"
  );

  const userName =
    user?.name ||
    user?.username ||
    user?.fullName ||
    "Learner";

  const openSection = (section) => {
    if (typeof setActiveTab === "function") {
      setActiveTab(section);
    } else {
      window.dispatchEvent(
        new CustomEvent("understandx:navigate", {
          detail: { section },
        })
      );
    }
  };

  return (
    <main className="ux-dashboard">
      <header className="ux-topbar">
        <div className="ux-brand">
          <div className="ux-brand-icon">U</div>
          <div>
            <h2>UNDERSTANDX</h2>
            <span>Learn it. Understand it.</span>
          </div>
        </div>

        <div className="ux-profile">
          <div className="ux-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <strong>{userName}</strong>
            <span>Your learning space</span>
          </div>
        </div>
      </header>

      <section className="ux-hero">
        <div className="ux-hero-content">
          <span className="ux-eyebrow">✦ YOUR PERSONAL LEARNING SPACE</span>
          <h1>
            Learn with curiosity.
            <br />
            <span>Understand with confidence.</span>
          </h1>
          <p>
            Turn difficult questions into clear explanations.
            Start with a hint, explore the steps, and discover
            the answer at your own pace.
          </p>

          <button
            className="ux-primary-btn"
            onClick={() => openSection("learning")}
          >
            Start Learning <span>↗</span>
          </button>
        </div>

        <div className="ux-hero-art" aria-hidden="true">
          <div className="ux-orbit ux-orbit-one"></div>
          <div className="ux-orbit ux-orbit-two"></div>
          <div className="ux-float-card ux-float-top">✦ Think</div>
          <div className="ux-brain">🧠</div>
          <div className="ux-float-card ux-float-bottom">
            ✓ Understand
          </div>
        </div>
      </section>

      <section className="ux-welcome-row">
        <div>
          <span className="ux-section-label">YOUR JOURNEY STARTS HERE</span>
          <h2>What would you like to learn today?</h2>
          <p>Choose a learning tool and move forward one step at a time.</p>
        </div>
        <div className="ux-live-badge">
          <span></span> Ready to explore
        </div>
      </section>

      <section className="ux-tool-grid">
        <button
          className="ux-tool-card"
          onClick={() => openSection("learning")}
        >
          <div className="ux-tool-icon purple">💡</div>
          <span className="ux-card-arrow">↗</span>
          <h3>Learning Ladder</h3>
          <p>
            Start with a hint, understand the explanation,
            and reveal the answer when you're ready.
          </p>
          <span className="ux-card-link">Explore learning →</span>
        </button>

        <button
          className="ux-tool-card"
          onClick={() => openSection("verification")}
        >
          <div className="ux-tool-icon green">🔎</div>
          <span className="ux-card-arrow">↗</span>
          <h3>Answer Verification</h3>
          <p>
            Review your answers and identify concepts
            that may need further checking.
          </p>
          <span className="ux-card-link">Verify an answer →</span>
        </button>

        <button
          className="ux-tool-card"
          onClick={() => openSection("flashcards")}
        >
          <div className="ux-tool-icon orange">🗂️</div>
          <span className="ux-card-arrow">↗</span>
          <h3>Smart Flashcards</h3>
          <p>
            Practise important terms and reinforce
            what you have learned.
          </p>
          <span className="ux-card-link">Practise now →</span>
        </button>

        <button
          className="ux-tool-card"
          onClick={() => openSection("history")}
        >
          <div className="ux-tool-icon pink">📈</div>
          <span className="ux-card-arrow">↗</span>
          <h3>Learning History</h3>
          <p>
            Revisit previous learning sessions and
            continue reviewing difficult topics.
          </p>
          <span className="ux-card-link">View your progress →</span>
        </button>
      </section>

      <section className="ux-modules-section">
        <div className="ux-section-heading">
          <div>
            <span className="ux-section-label">FIND YOUR NEXT TOPIC</span>
            <h2>Explore learning areas</h2>
          </div>
          <span className="ux-module-count">
            {learningModules.length} learning areas
          </span>
        </div>

        <div className="ux-module-grid">
          {learningModules.map((module) => (
            <article
              className="ux-module-card"
              key={module.title}
            >
              <div className={`ux-module-icon ${module.color}`}>
                {module.icon}
              </div>
              <span className="ux-module-tag">{module.tag}</span>
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <button
                className="ux-text-btn"
                onClick={() => openSection("learning")}
              >
                Learn this topic <span>→</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      <footer className="ux-footer">
        <div className="ux-footer-mark">U</div>
        <p>
          <strong>UNDERSTANDX</strong>
          <span>Every question is an opportunity to understand.</span>
        </p>
        <span className="ux-footer-note">Built for curious minds ✨</span>
      </footer>
    </main>
  );
}

export default DashboardPage;
