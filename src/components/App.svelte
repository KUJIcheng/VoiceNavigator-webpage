<script>
  import { onMount, tick } from "svelte";

  let agents = ["greeter", "OCR", "selfOperating"];

  // 动态大小（基于窗口宽度）
  let userSize = "8vw";  // User 大小
  let agentSize = "6vw"; // Agent 大小
  let radius = "14vw";   // 旋转半径

  const positions = [
    { bottom: "-10%", left: "46%", transform: `translate(-${radius}, 0) scale(1)` }, // 左下角
    { bottom: "30%", left: "50%", transform: `translateX(-50%) scale(1.5)` },   // 正下方（放大）
    { bottom: "-10%", left: "43%", transform: `translate(${radius}, 0) scale(1)` }  // 右下角
  ];

  // 初始位置：greeter(中间) -> OCR(左下) -> selfOperating(右下)
  let order = [1, 0, 2];

  // 当前在 user 下方的 Agent
  let activeAgentIndex = 0;

  // 是否自动轮换
  let autoRotate = true;
  let rotateInterval;

  // 页面挂载后，每 3 秒轮换
  onMount(() => {
    rotateInterval = setInterval(rotateAgents, 3000);
    return () => clearInterval(rotateInterval);
  });

  async function rotateAgents() {
    if (!autoRotate) return;

    setTimeout(async () => {
      const last = order.pop();
      order.unshift(last);
      order = [...order]; // 触发响应式
      activeAgentIndex = order.findIndex(posIndex => posIndex === 1);
      await tick();
    }, 50);
  }

  async function switchAgent(agent) {
    let index = agents.indexOf(agent);
    if (index === -1 || index === activeAgentIndex) return;

    autoRotate = false;

    let safetyCounter = 0;
    while (order[index] !== 1 && safetyCounter < 6) {
      const last = order.pop();
      order.unshift(last);
      order = [...order];

      await tick();
      safetyCounter++;
    }

    activeAgentIndex = order.findIndex(posIndex => posIndex === 1);

    setTimeout(() => {
      autoRotate = true;
    }, 3000);
  }

  // 监听窗口大小变化，动态调整大小
  function updateSizes() {
    const width = window.innerWidth;
    userSize = `${Math.max(60, width * 0.08)}px`;
    agentSize = `${Math.max(50, width * 0.05)}px`;
    radius = `${Math.max(100, width * 0.05)}px`;
  }

  onMount(() => {
    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  });

  // 监听滚动 & activeSection
  let activeSection = "intro";
  onMount(() => {
    function handleScroll() {
      const sections = document.querySelectorAll("section");
      let currentSection = "intro";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (
          rect.top <= window.innerHeight * 0.5 &&
          rect.bottom >= window.innerHeight * 0.5
        ) {
          currentSection = section.id;
        }
      });
      activeSection = currentSection;
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  function navigateTo(section) {
    document.getElementById(section).scrollIntoView({ behavior: "smooth" });
  }
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

      <div class="team-container">
        <div class="team-member">
            <img src="zyx.jpg" alt="ZYX" class="team-photo" />
            <h4>Yuxuan Zhang</h4>
            <p>yuz165@ucsd.edu</p>
        </div>
        <div class="team-member">
            <img src="xxc.jpg" alt="XXC" class="team-photo" />
            <h4>Xuecheng Xu</h4>
            <p>xuxu@ucsd.edu</p>
        </div>
        <div class="team-member">
            <img src="lyh.jpg" alt="LYH" class="team-photo" />
            <h4>Yihong Li</h4>
            <p>yil168@ucsd.edu</p>
        </div>
        <div class="team-member">
            <img src="zh.jpg" alt="Hao Zhang (Mentor)" class="team-photo" />
            <h4>Hao Zhang (Mentor)</h4>
            <p>haozhang@ucsd.edu</p>
        </div>
    </div>
    </section>

    <section id="framework" class="framework-section">
    
      <!-- 左侧动画 -->
      <div class="animation-container">
        <img src="user.png" alt="User" class="user" style="width: {userSize}; height: {userSize};"/>
    
        {#each agents as agent, i (agent)}
          <img
            src="{agent}.png"
            alt="{agent}"
            class="agent"
            style="
              bottom: {positions[order[i]].bottom}; 
              left: {positions[order[i]].left}; 
              transform: {positions[order[i]].transform};
              width: {agentSize}; 
              height: {agentSize};
            "
          />
        {/each}
      </div>
    
      <!-- 右侧介绍 -->
      <div class="info-container">
        <p class="framework-intro-text">
          The Agent Framework intelligently identifies user intent and dynamically switches between specialized agents 
          to accomplish tasks.
        </p>
        <div class="agent-buttons">
          {#each agents as agent, i}
            <button
              class="{activeAgentIndex === i ? 'selected' : ''}"
              on:click={() => switchAgent(agent)}
            >
              <img src="{agent}.png" alt="{agent}" />
            </button>
          {/each}
        </div>
    
        <!-- 详细的 Agent 描述 -->
        <div class="agent-description">
          {#if agents[activeAgentIndex] === "greeter"}
            <h3>Greeter Agent</h3>
            <p>
              The Greeter Agent serves as the central coordinator, analyzing user intent and routing tasks to 
              the appropriate agent.
            </p>
            <ul>
              <li>Interacts with users to identify their needs</li>
              <li>Decides if tasks need system control or content processing</li>
              <li>Efficiently delegates tasks to the right agent</li>
              <li>Offers follow-ups for a smoother experience</li>
            </ul>
          {:else if agents[activeAgentIndex] === "OCR"}
            <h3>OCR Agent</h3>
            <p>
              The OCR Agent processes on-screen content, converting it into structured descriptions, 
              making information more accessible.
            </p>
            <ul>
              <li>Extracts text and images from the screen</li>
              <li>Describes UI elements for easier navigation</li>
              <li>Helps visually impaired users with screen narration</li>
              <li>Collaborates with the Self-Operating System Agent for interactive tasks</li>
            </ul>
          {:else if agents[activeAgentIndex] === "selfOperating"}
            <h3>Self-Operating System Agent</h3>
            <p>
              The Self-Operating System Agent enables users to control their computer using natural language commands, 
              automating various system interactions.
            </p>
            <ul>
              <li>Executes user commands for application control</li>
              <li>Automates routine tasks and workflows</li>
              <li>Adjusts system settings based on voice instructions</li>
              <li>Integrates with the OCR Agent for adaptive screen interactions</li>
            </ul>
          {/if}
        </div>
      </div>
    </section>

    <section id="usage" class="usage-section">
      <h2>From Visual Assistance to Hands-Free Control</h2>
      <p>Showcasing use cases for visually impaired users, elderly users, and general users.</p>
  
      <div class="usage-container">
          <!-- 视觉障碍人群 -->
          <div class="usage-card">
              <img src="blind.png" alt="Visually Impaired Users" class="usage-icon" />
              <h3>Visually Impaired Users</h3>
              <p>The Agent Framework provides hands-free computer control and screen narration, making digital content accessible to visually impaired users.</p>
          </div>
  
          <!-- 老年用户 -->
          <div class="usage-card">
              <img src="elder.png" alt="Elderly Users" class="usage-icon" />
              <h3>Elderly Users</h3>
              <p>For older adults, the system simplifies complex online processes, such as bill payments, medical appointments, and digital navigation.</p>
          </div>
  
          <!-- 一般用户 -->
          <div class="usage-card">
              <img src="normaluser.png" alt="General Users" class="usage-icon" />
              <h3>General Users</h3>
              <p>Allows users to operate their computer through voice commands when their hands are occupied, such as cooking or exercising.</p>
          </div>
      </div>
    </section>
  
    <!-- <section id="usage">
      <h2>From Visual Assistance to Hands-Free Control</h2>
      <p>Showcasing use cases for visually impaired users, elderly users, and general users.</p>
    </section> -->

    <section id="impact" class="impact-section">
      <h2 class="impact-title">Closing the Digital Divide with AI</h2>
      <p class="impact-intro">
          AI is transforming the way people interact with technology, making it more intuitive, accessible, and inclusive. 
          Our intelligent multi-agent framework redefines digital interaction by breaking barriers and expanding accessibility.
      </p>
  
      <div class="impact-content">
          <!-- 中央 AI 核心图像 -->
          <div class="impact-core">
              <img src="VoiceNavigatorIcon.png" alt="AI Core" class="core-image">
          </div>
  
          <!-- 影响点：围绕 AI 核心布局 -->
          <div class="impact-items">
              <div class="impact-item">
                  <img src="accessibility.png" alt="Accessibility" class="impact-icon" />
                  <h3>Universal Accessibility</h3>
                  <p>Empowers individuals with disabilities through voice-controlled operations and real-time content interpretation.</p>
              </div>
  
              <div class="impact-item">
                  <img src="automation.png" alt="Automation" class="impact-icon" />
                  <h3>Task Automation</h3>
                  <p>Reduces the complexity of digital tasks by automating workflows with AI-powered commands.</p>
              </div>
  
              <div class="impact-item">
                  <img src="adaptive.png" alt="Adaptive Assistance" class="impact-icon" />
                  <h3>Adaptive Assistance</h3>
                  <p>AI adapts to different user needs, providing personalized and context-aware interaction.</p>
              </div>
  
              <div class="impact-item">
                  <img src="digital-inclusion.png" alt="Digital Inclusion" class="impact-icon" />
                  <h3>Bridging the Gap</h3>
                  <p>Expands digital literacy and enables a more inclusive technological ecosystem.</p>
              </div>
          </div>
      </div>
    </section>
  
    <!-- <section id="impact">
      <h2>Closing the Digital Divide with AI</h2>
      <p>Discussing how AI helps reduce the digital divide and improves technology accessibility.</p>
    </section> -->

    <section id="performance" class="performance-section">
      <h2 class="performance-title">Performance Benchmarking and Comparisons</h2>
      <p class="coming-soon">Coming Soon...</p>
    </section>
  

    <!-- <section id="performance">
      <h2>Performance Benchmarking and Comparisons</h2>
      <p>Presenting performance evaluations and comparisons with other systems.</p>
    </section> -->
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
    padding: 0 1vw;
    backdrop-filter: blur(12px);
    background: linear-gradient(to right, rgba(20, 20, 50, 0.7), rgba(29, 77, 130, 0.7));
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

  @media (max-width: 800px) {
    .nav {
        display: none;
    }

    .top-bar {
        justify-content: center;
        padding: 0 0px;
    }

    .logo-container {
        justify-content: center;
        width: 100%;
    }
  }

  /* 简介部分----------------------------------------------------------------------------------------------------------------- */
  .intro-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 90vh;
    padding: 5vh 5vw;
    background: linear-gradient(135deg, #12172A, #0A2E5D);
    color: white;
    text-align: center;
    padding-top: 9vh;
  }

  /* 主要介绍框架的大框 */
  .intro-content {
      max-width: 1000px;
      padding: clamp(20px, 2vw, 40px);
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      backdrop-filter: blur(10px);
  }

  /* 动态标题 */
  .intro-title {
      font-size: clamp(1.2rem, 1.7vw, 2.5rem);
      font-weight: bold;
      text-transform: uppercase;
      font-family: 'Orbitron', sans-serif;
      letter-spacing: 2px;
  }

  /* 动态正文 */
  .intro-text {
      font-size: clamp(1rem, 1vw, 1.5rem);
      margin-top: 15px;
      line-height: 1.6;
  }

  /* 3 个特点卡片 */
  .features {
      display: flex;
      justify-content: center;
      gap: 1vw;
      margin-top: 20px;
      flex-wrap: wrap;
  }

  /* 每个功能介绍卡片 */
  .feature-card {
      background: rgba(255, 255, 255, 0.2);
      padding: clamp(10px, 1vw, 15px);
      border-radius: 10px;
      width: clamp(150px, 30%, 280px);
      text-align: center;
      font-size: clamp(0.1rem, 0.2vw, 0.2rem);
  }

  /* 卡片标题 */
  .feature-card h3 {
      font-size: clamp(1rem, 0.95vw, 1.6rem);
  }

  /* 卡片正文 */
  .feature-card p {
      font-size: clamp(0.8rem, 0.75vw, 1.1rem);
  }

  /* 团队成员部分 */
  .team-container {
      display: flex;
      justify-content: center;
      gap: 0.8vw;
      margin-top: 25px;
      flex-wrap: wrap;
  }

  /* 团队成员卡片 */
  .team-member {
      background: rgba(255, 255, 255, 0.1);
      padding: clamp(5px, 1vw, 10px);
      border-radius: 8px;
      text-align: center;
      width: clamp(80px, 12vw, 120px);
      transition: transform 0.3s ease-in-out, background 0.3s;
  }

  /* 悬停效果 */
  .team-member:hover {
      transform: translateY(-4px);
      background: rgba(255, 255, 255, 0.2);
  }

  /* 头像 */
  .team-photo {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 8px;
      object-fit: cover;
  }

  /* 名字 */
  .team-member h4 {
      font-size: clamp(0.9rem, 0.2vw, 1.4rem);
      margin-top: 8px;
  }

  /* 邮箱 */
  .team-member p {
      font-size: clamp(0.7rem, 0.2vw, 1.1rem);
      color: #ccc;
  }

  /* 小屏幕优化 */
  @media (max-width: 800px) {
      .features {
          flex-direction: column;
          gap: 15px;
          align-items: center;
      }

      .feature-card {
          width: 80%;
      }

      .team-container {
          flex-direction: column;
          align-items: center;
      }

      .team-member {
          width: 50%;
      }
  }

  @media (max-width: 500px) {
      .team-member {
          width: 70%;
      }
  }

  /* 架构介绍----------------------------------------------------------------------------------------------------------------- */
  .framework-section {
    display: flex;
    justify-content: space-evenly; /* 让左右两部分均匀分布 */
    align-items: center;
    min-height: 90vh;
    padding: 5vh 6vw;
    background: linear-gradient(135deg, #12172A, #0A2E5D);
    color: white;
    text-align: center;
    gap: clamp(100px, 20vw, 300px); /* 适当拉开左右间距 */
  }

  /* 左侧动画区域 */
  .animation-container {
      position: relative;
      width: clamp(350px, 42vw, 500px);
      height: clamp(380px, 50vh, 550px);
      display: flex;
      align-items: center;
      justify-content: center;
  }

  /* 用户头像 */
  .user {
      position: absolute;
      top: calc(30% - 8vw);
      left: 50%;
      transform: translateX(-50%);
      width: clamp(60px, 6vw, 120px);
  }

  /* Agent 图标 */
  .agent {
      position: absolute;
      transition: all 1s ease-in-out;
      width: clamp(50px, 7vw, 110px);
  }

  /* 右侧 UI 容器 */
  .info-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: clamp(320px, 48vw, 500px);
  }

  /* 介绍文本 */
  .framework-intro-text {
      font-family: 'Orbitron', sans-serif;
      font-size: clamp(1rem, 1.3vw, 1.7rem);
      font-weight: 500;
      text-align: center;
      letter-spacing: 1px;
      background: linear-gradient(90deg, #FFD700, #FFA500, #FF4500);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0px 0px 10px rgba(255, 215, 0, 0.8);
      padding-bottom: 15px;
  }

  /* 选择按钮 */
  .agent-buttons {
      display: flex;
      gap: clamp(12px, 1.5vw, 24px);
      margin-bottom: 25px;
  }

  .agent-buttons button {
      background: none;
      border: 2px solid transparent;
      padding: 12px;
      border-radius: 10px;
      cursor: pointer;
      width: clamp(55px, 12vw, 90px);
      height: clamp(55px, 12vw, 90px);
  }

  .agent-buttons button img {
      width: 100%;
  }

  .agent-buttons button:hover,
  .agent-buttons button.selected {
      border-color: #FFD700;
      background: rgba(255, 255, 255, 0.2);
  }

  /* 详细描述 */
  .agent-description {
      background: rgba(255, 255, 255, 0.1);
      padding: clamp(12px, 2vw, 35px);
      border-radius: 10px;
      width: clamp(320px, 48vw, 500px);
      min-height: clamp(220px, 32vh, 500px);
      display: flex;
      flex-direction: column;
      justify-content: center;
  }

  .agent-description ul {
      padding-left: 10px;
      font-size: clamp(1rem, 1vw, 1rem);
  }

  .agent-description li {
      margin: 6px 0;
  }

  /* 小屏幕适配 */
  @media (max-width: 900px) {
      .framework-section {
          flex-direction: column;
          align-items: center;
          gap: clamp(40px, 8vw, 60px);
      }

      .animation-container {
          width: 100%;
          height: clamp(250px, 40vh, 280px);
      }

      .info-container {
          width: 90%;
          margin-top: 50px;
      }

      .agent-buttons {
          justify-content: center;
      }

      .agent-description {
          width: 100%;
      }
  }

  /* 应用场景----------------------------------------------------------------------------------------------------------------- */
  .usage-section {
    text-align: center;
    min-height: 90vh;
    padding: 8vh 5vw; /* 根据屏幕大小调整内边距 */
    background: linear-gradient(135deg, #2e60a1, #3f5c81);
    color: white;
  }

  /* 动态标题大小 */
  .usage-section h2 {
      font-size: clamp(2rem, 4vw, 3.5rem); /* 根据屏幕大小动态调整 */
      font-weight: 600;
      margin-bottom: 10px;
  }

  /* 动态段落字体 */
  .usage-section p {
      font-size: clamp(1rem, 2vw, 1.5rem);
      color: #DDD;
      margin-bottom: 40px;
  }

  /* 3 个卡片的容器 */
  .usage-container {
      display: flex;
      justify-content: space-between;
      gap: 2vw;
      max-width: 1200px;
      margin: 0 auto;
      flex-wrap: wrap;
  }

  /* 每个卡片 */
  .usage-card {
      flex: 1;
      background: rgba(255, 255, 255, 0.15);
      padding: clamp(15px, 3vw, 30px); /* 卡片内边距动态变化 */
      border-radius: 15px;
      text-align: center;
      transition: transform 0.3s ease-in-out, background 0.3s;
      min-width: 250px; /* 防止太小 */
  }

  /* 悬停效果 */
  .usage-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.25);
  }

  /* 图标大小动态变化 */
  .usage-icon {
      width: clamp(50px, 10vw, 80px);
      margin-bottom: 15px;
      opacity: 0.9;
  }

  /* 卡片标题 */
  .usage-card h3 {
      font-size: clamp(1.2rem, 2.5vw, 2rem);
      margin-bottom: 10px;
      font-weight: bold;
  }

  /* 卡片描述 */
  .usage-card p {
      font-size: clamp(1rem, 2vw, 1.2rem);
      color: #EEE;
      line-height: 1.5;
  }

  @media (max-width: 800px) {
      .usage-container {
          flex-direction: column;
          gap: 15px;
          align-items: center;
      }
      
      .usage-card {
          width: 80%;
      }
  }

  @media (max-width: 500px) {
      .usage-card {
          width: 90%;
      }
  }

  /* 社会影响----------------------------------------------------------------------------------------------------------------- */
  .impact-section {
      text-align: center;
      padding: 8vh 6vw; /* 缩小 padding 使内容更集中 */
      min-height: 90vh;
      background: linear-gradient(135deg, #0A2956, #135BA0);
      color: white;
      position: relative;
  }

  /* 标题 */
  .impact-title {
      font-size: clamp(1.6rem, 2vw, 2.6rem); /* 字体略缩小 */
      font-weight: bold;
      margin-bottom: 1vh;
  }

  /* 概述 */
  .impact-intro {
      font-size: clamp(0.85rem, 1vw, 1.3rem); /* 字体变小一些 */
      max-width: 750px;
      margin: 0 auto 3vh auto; /* 减少底部间距 */
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.85);
  }

  /* 主体内容：大屏时左右排布 */
  .impact-content {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 2.5vw; /* 缩小间距 */
      position: relative;
  }

  /* AI 核心（左侧） */
  .impact-core {
      width: clamp(90px, 16vw, 200px); /* 整体略缩小 */
      height: clamp(90px, 16vw, 200px);
      background: rgba(203, 216, 228, 0.6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0px 0px 12px rgba(255, 255, 255, 0.35);
  }

  .core-image {
      width: 65%;
      opacity: 0.85;
  }

  /* 影响点布局 */
  .impact-items {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.2vw; /* 缩小间距 */
      max-width: 680px;
  }

  /* 影响点卡片 */
  .impact-item {
      background: rgba(255, 255, 255, 0.1);
      padding: clamp(8px, 1.2vw, 18px); /* 适当缩小 */
      border-radius: 10px;
      text-align: center;
      transition: transform 0.3s ease-in-out, background 0.3s;
  }

  /* 悬停效果 */
  .impact-item:hover {
      transform: translateY(-4px);
      background: rgba(255, 255, 255, 0.2);
  }

  /* 影响点图标 */
  .impact-icon {
      width: clamp(35px, 4.5vw, 70px);
      margin-bottom: 10px;
      opacity: 0.8;
  }

  /* 影响点标题 */
  .impact-item h3 {
      font-size: clamp(0.9rem, 1.2vw, 1.6rem);
      margin-bottom: 6px;
      font-weight: bold;
  }

  /* 影响点描述 */
  .impact-item p {
      font-size: clamp(0.8rem, 0.9vw, 1.2rem);
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.4;
  }

  /* 小屏幕适配 */
  @media (max-width: 900px) {
      .impact-content {
          flex-direction: column;
          align-items: center;
      }

      .impact-core {
          width: clamp(80px, 14vw, 180px);
          height: clamp(80px, 14vw, 180px);
          margin-bottom: 2.5vh; /* 略微减少间距 */
      }

      .impact-items {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px; /* 减少间距 */
      }

      .impact-item {
          width: 80%;
      }
  }

  @media (max-width: 500px) {
      .impact-item {
          width: 90%;
      }
  }

  /* 性能方面----------------------------------------------------------------------------------------------------------------- */
  .performance-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      height: 90vh;
      padding: 5vh 6vw;
      background: linear-gradient(135deg, #042a55, #054c81);
      color: white;
  }

  /* 标题 */
  .performance-title {
      font-size: clamp(1.8rem, 2vw, 2.8rem);
      font-family: 'Orbitron', sans-serif; /* 现代感科技字体 */
      font-weight: bold;
      margin-bottom: 3vh;
  }

  /* "Coming Soon..." 样式 */
  .coming-soon {
      font-size: clamp(2rem, 3vw, 4rem); /* 让字体大一些 */
      font-weight: 700;
      font-family: 'Orbitron', sans-serif; /* 现代感科技字体 */
      letter-spacing: 2px;
      background: linear-gradient(90deg, #FFD700, #FFA500, #FF4500); /* 金橙红渐变 */
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0px 0px 15px rgba(255, 215, 0, 0.7); /* 柔和发光效果 */
  }
</style>
