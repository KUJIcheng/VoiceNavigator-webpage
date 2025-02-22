<script>
  function navigateTo(section) {
    document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
  }
</script>

<main>
  <div class="top-bar">
    <nav class="nav">
      <button class="nav-item" on:click={() => navigateTo('intro')}>Introduction</button>
      <button class="nav-item" on:click={() => navigateTo('framework')}>Agent Framework</button>
      <button class="nav-item" on:click={() => navigateTo('usage')}>Usage Scenarios</button>
      <button class="nav-item" on:click={() => navigateTo('impact')}>Social Impact</button>
      <button class="nav-item" on:click={() => navigateTo('performance')}>Performance</button>
    </nav>
  </div>

  <div class="container">
    <section id="intro">
      <h2>AI-Powered Assistance for Smarter Interaction</h2>
      <p>Leveraging AI for enhanced user experience and seamless multi-agent collaboration.</p>
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
  :global(body) {
    margin: 0;
    font-family: Arial, sans-serif;
    scrollbar-color: #1D4D82 #f0f0f0;
    scrollbar-width: thin;
  }
  :global(body)::-webkit-scrollbar {
    width: 8px;
  }
  :global(body)::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 10px;
  }
  :global(body)::-webkit-scrollbar-thumb {
    background: #1D4D82;
    border-radius: 10px;
  }
  .top-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #1D4D82;
    padding: 15px;
    text-align: right;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  .nav {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-right: 20px;
  }
  .nav-item {
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }
  .nav-item:hover {
    text-decoration: underline;
  }
  .container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    text-align: center;
    margin-top: 80px;
  }
  section {
    margin-top: 80px;
    padding: 40px 20px;
    border-bottom: 1px solid #ddd;
  }
</style>
