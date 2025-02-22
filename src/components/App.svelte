<script>
  import { onMount } from "svelte";

  let activeSection = "intro"; // 默认高亮 Introduction

  function navigateTo(section) {
    document.getElementById(section).scrollIntoView({ behavior: "smooth" });
  }

  onMount(() => {
    function handleScroll() {
      const sections = document.querySelectorAll("section");
      let currentSection = "intro"; // 默认

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
          currentSection = section.id;
        }
      });

      activeSection = currentSection;
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });
</script>

<main>
  <div class="top-bar">
    <div class="logo-container">
      <img src="VoiceNavigatorIcon.png" alt="VoiceNavigator Logo" class="logo">
      <span class="project-name">VoiceNavigator</span>
    </div>
    
    <nav class="nav">
      <button class="nav-item {activeSection === 'intro' ? 'active' : ''}" on:click={() => navigateTo('intro')}>Introduction</button>
      <button class="nav-item {activeSection === 'framework' ? 'active' : ''}" on:click={() => navigateTo('framework')}>Agent Framework</button>
      <button class="nav-item {activeSection === 'usage' ? 'active' : ''}" on:click={() => navigateTo('usage')}>Usage Scenarios</button>
      <button class="nav-item {activeSection === 'impact' ? 'active' : ''}" on:click={() => navigateTo('impact')}>Social Impact</button>
      <button class="nav-item {activeSection === 'performance' ? 'active' : ''}" on:click={() => navigateTo('performance')}>Performance</button>
    </nav>
  </div>

  <div class="container">
    <section id="intro" class="intro-section">
      <div class="intro-content">
        <h1 class="intro-title">AI-Powered Assistance for Smarter Interaction</h1>
        <p class="intro-text">
          Our multi-agent framework seamlessly integrates AI-powered assistants to enhance digital interactions. 
          From hands-free computer control to intelligent on-screen content reading, experience the next level of accessibility and automation.
        </p>
        <div class="features">
          <div class="feature-card">
            <h3>⚙️ Smart AI Agents</h3>
            <p>Interact dynamically with multi-agent systems that understand and execute tasks.</p>
          </div>
          <div class="feature-card">
            <h3>🎙️ Voice-Controlled Operations</h3>
            <p>Operate your computer through natural language commands without using a keyboard or mouse.</p>
          </div>
          <div class="feature-card">
            <h3>📄 Intelligent Screen Reading</h3>
            <p>AI-powered OCR to interpret and describe on-screen content in real-time.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="framework">
      <h2>All-in-One Multi-Agent System in Harmony</h2>
      <p>Introducing our multi-agent framework and how it collaborates to offer the best user experience.</p>
    </section>

    <section id="usage">
      <h2>From Visual Assistance to Hands-Free Control</h2>
      <p>Showcasing use cases for visually impaired users, elderly users, and general users.</p>
    </section>

    <section id="impact">
      <h2>Closing the Digital Divide with AI</h2>
      <p>Discussing how AI helps reduce the digital divide and improves technology accessibility.</p>
    </section>

    <section id="performance">
      <h2>Performance Benchmarking and Comparisons</h2>
      <p>Presenting performance evaluations and comparisons with other systems.</p>
    </section>
  </div>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

  :global(body) {
    margin: 0;
    font-family: Arial, sans-serif;
    scrollbar-color: #1D4D82 #f0f0f0;
    scrollbar-width: thin;
  }

  .top-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 8vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    backdrop-filter: blur(12px);
    background: linear-gradient(to right, rgba(20, 20, 50, 0.9), rgba(29, 77, 130, 0.95));
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    z-index: 1000; /* 确保导航栏始终在最上层 */
  }

  .logo-container {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .logo {
    height: 5vh;
  }

  .project-name {
    font-size: 3vh;
    color: #FFD700;
    font-weight: bold;
    font-family: 'Orbitron', sans-serif;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .nav {
    display: flex;
    gap: 20px;
    margin-right: 50px;
  }

  .nav-item {
    background: none;
    border: none;
    color: white;
    font-size: 2vh;
    cursor: pointer;
    padding: 10px 15px;
    transition: all 0.3s ease-in-out;
    border-radius: 5px;
  }

  .nav-item:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .nav-item.active {
    background: rgba(255, 255, 255, 0.3);
    border: 2px solid #FFD700;
    font-weight: bold;
  }

  .intro-section {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(135deg, #12172A, #0A2E5D);
    color: white;
    text-align: center;
    padding-top: 4vh; /* 确保 introduction 内容不会被 top-bar 遮住 */
  }

  .intro-content {
    max-width: 800px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    backdrop-filter: blur(10px);
  }

  .intro-title {
    font-size: 3.5vh;
    font-weight: bold;
    text-transform: uppercase;
    font-family: 'Orbitron', sans-serif;
    letter-spacing: 2px;
  }

  .intro-text {
    font-size: 2vh;
    margin-top: 15px;
    line-height: 1.6;
  }

  .features {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 30px;
  }

  .feature-card {
    background: rgba(255, 255, 255, 0.2);
    padding: 15px;
    border-radius: 10px;
    width: 30%;
    text-align: center;
    font-size: 1.6vh;
  }

  .feature-card h3 {
    font-size: 2vh;
  }

  .feature-card p {
    font-size: 1.5vh;
  }
</style>
