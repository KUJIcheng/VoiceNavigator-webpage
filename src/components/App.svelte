<script>
  import { onMount, tick } from "svelte";

  let agents = ["greeter", "OCR", "selfOperating"];

  // 动态大小（基于窗口宽度）
  let userSize = "8vw";  // User 大小
  let agentSize = "6vw"; // Agent 大小
  let radius = "14vw";   // 旋转半径

  const positions = [
    { bottom: "10%", left: "46%", transform: `translate(-${radius}, 0) scale(1)` }, // 左下角
    { bottom: "50%", left: "50%", transform: `translateX(-50%) scale(1.5)` },   // 正下方（放大）
    { bottom: "10%", left: "46%", transform: `translate(${radius}, 0) scale(1)` }  // 右下角
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
              <li>Engages with users to understand their needs</li>
              <li>Determines whether tasks require system control or content interpretation</li>
              <li>Seamlessly hands off tasks to other agents</li>
              <li>Provides contextual follow-ups for smoother interactions</li>
            </ul>
          {:else if agents[activeAgentIndex] === "OCR"}
            <h3>OCR Agent</h3>
            <p>
              The OCR Agent processes on-screen content and converts it into structured descriptions, 
              making information more accessible.
            </p>
            <ul>
              <li>Extracts text and graphical information from the screen</li>
              <li>Provides descriptions of UI elements for better navigation</li>
              <li>Assists visually impaired users by narrating content</li>
              <li>Works alongside the Self-Operating System Agent for interactive tasks</li>
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(135deg, #12172A, #0A2E5D);
    color: white;
    text-align: center;
    padding-top: 4vh;
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

  /* 👥 团队成员部分 */
  .team-container {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
    flex-wrap: wrap;
  }

  .team-member {
      background: rgba(255, 255, 255, 0.1);
      padding: 10px;
      border-radius: 8px;
      text-align: center;
      width: 100px; /* 调整缩小 */
      transition: transform 0.3s ease-in-out, background 0.3s;
  }

  .team-member:hover {
      transform: translateY(-4px);
      background: rgba(255, 255, 255, 0.2);
  }

  /* 🎭 头像 */
  .team-photo {
      width: 100%;
      aspect-ratio: 1; /* 确保正方形 */
      border-radius: 8px;
      object-fit: cover;
  }

  /* 🏷️ 名字 */
  .team-member h4 {
      font-size: 1.6vh;
      margin-top: 8px;
  }

  /* 📧 邮箱 */
  .team-member p {
      font-size: 1.3vh;
      color: #ccc;
  }

  .framework-section {
    display: flex;
    justify-content: flex-start; /* 整体靠左 */
    align-items: center;
    height: 90vh;
    padding: 50px;
    background: linear-gradient(135deg, #12172A, #0A2E5D);
    color: white;
  }

  .animation-container {
    position: relative;
    width: 50%; /* 让动画区域稍微靠左 */
    height: 400px;
  }

  /* 用户图像 */
  .user {
    position: absolute;
    top: 0%;
    left: 50%;
    transform: translateX(-50%);
  }

  /* 3 个 agent 图标 */
  .agent {
    position: absolute;
    transition: all 1s ease-in-out;
  }

  /* 右侧 UI */
  .info-container {
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .agent-buttons {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
  }

  .agent-buttons button {
    background: none;
    border: 2px solid transparent;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
  }

  .agent-buttons button img {
    width: 50px;
  }

  .agent-buttons button:hover,
  .agent-buttons button.selected {
    border-color: #FFD700;
    background: rgba(255, 255, 255, 0.2);
  }

  .agent-description {
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 10px;
    width: 420px;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .framework-intro-text {
    font-family: 'Orbitron', sans-serif; /* 现代科技字体 */
    font-size: 18px; /* 适当放大字体 */
    font-weight: 500; /* 加粗提升可读性 */
    text-align: center; /* 居中显示 */
    letter-spacing: 1px; /* 增加字间距，让文本更有科技感 */
    background: linear-gradient(90deg, #FFD700, #FFA500, #FF4500); /* 金色->橙色->红色渐变 */
    -webkit-background-clip: text; /* 让背景仅应用于文本 */
    background-clip: text;
    -webkit-text-fill-color: transparent; /* 让文本变成渐变色 */
    text-shadow: 0px 0px 10px rgba(255, 215, 0, 0.8); /* 发光效果 */
    padding-bottom: 10px; /* 与按钮部分保持一定距离 */
  }

  .agent-description ul {
    padding-left: 20px;
  }

  .agent-description li {
    margin: 0px 0;
  }

  .usage-section {
    text-align: center;
    height: 90vh;
    padding: 50px 10%;
    background: linear-gradient(135deg, #2e60a1, #3f5c81); /* 比框架部分更浅的蓝色 */
    color: white;
  }

  .usage-section h2 {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .usage-section p {
    font-size: 18px;
    color: #DDD; /* 稍微降低亮度，防止过度对比 */
    margin-bottom: 40px;
  }

  /* 3 个圆角矩形容器 */
  .usage-container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* 每个使用场景的卡片 */
  .usage-card {
    flex: 1;
    background: rgba(255, 255, 255, 0.15); /* 半透明浅色背景 */
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    transition: transform 0.3s ease-in-out, background 0.3s;
  }

  /* 悬停时让卡片有一点亮度变化和缩放 */
  .usage-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.25);
  }

  /* 圆角矩形中的 Icon */
  .usage-icon {
    width: 80px; /* 适中的尺寸 */
    margin-bottom: 15px;
    opacity: 0.9;
  }

  /* 标题 */
  .usage-card h3 {
    font-size: 20px;
    margin-bottom: 10px;
    font-weight: bold;
  }

  /* 文字描述 */
  .usage-card p {
    font-size: 16px;
    color: #EEE;
    line-height: 1.5;
  }
</style>
