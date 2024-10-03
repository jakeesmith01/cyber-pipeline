<template>
  <div class="p-layout">
    <aside class="p-sidebar">
      <nav class="p-tabview-nav-container">
        <ul>
          <li 
            class="p-tabview-nav-content" 
            :class="{ 'p-highlight': activeTab === 'curriculum' }"
          >
            <a @click.prevent="setActiveTab('curriculum')">Curriculum</a>
          </li>
          <li 
            class="p-tabview-nav-content" 
            :class="{ 'p-highlight': activeTab === 'online-instruction' }"
          >
            <a @click.prevent="setActiveTab('online-instruction')">Online Instruction</a>
          </li>
          <li 
            class="p-tabview-nav-content" 
            :class="{ 'p-highlight': activeTab === 'teacher-training' }"
          >
            <a @click.prevent="setActiveTab('teacher-training')">Teacher Training</a>
          </li>
        </ul>
      </nav>
    </aside>
    <main class="p-main-content">
      <header class="mb-2">
        <h1 class="p-title">Kansas State University: Cyber Pipeline Program</h1>
        <p class="p-text-secondary">Making quality computer science education available to all high school students at little or no cost.</p>
      </header>
      <section v-if="activeTab === 'curriculum'" class="p-section">
        <h2 class="p-subtitle">Curriculum</h2>
        <p class="p-text">
          The Cyber Pipeline Curriculum contains several courses from K-State's Computational Core that have been aligned with AP curriculum standards. 
          These are the same courses we use in our Computer Science Certificate and Integrated Computer Science degree programs, 
          so students are getting the real college experience!
        </p>
      </section>
      <section v-if="activeTab === 'online-instruction'" class="p-section">
        <h2 class="p-subtitle">Online Instruction</h2>
        <p class="p-text">
          Innovative online instruction that includes video, text, and automatically graded hands-on exercises and projects. The curriculum is designed to use lectures and text from K-State faculty, as well as in-class activities and examples led by high school teachers.
        </p>
      </section>
      <section v-if="activeTab === 'teacher-training'" class="p-section">
        <h2 class="p-subtitle">Teacher Training</h2>
        <p class="p-text">
          The Cyber Pipeline program includes an engaging and robust professional development program designed to prepare a teacher with no background in computer science to teach the CC 110 and/or CC 210 courses in under a year. 
          The training is delivered asynchronously online, allowing you to fit it into your schedule. 
          Additionally, there is a synchronous (but also available as a recording) online seminar series held the first Friday of each month. 
          Finally, teachers engaging in the program have continuous access to mentoring by Computer Science and Pedagogy experts drawn from K-State faculty through instant messaging, email, and video collaboration.
        </p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('curriculum');

function setActiveTab(tab) {
  activeTab.value = tab;
}
</script>

<style scoped>
.p-layout {
  display: flex;
}

.p-sidebar {
  width: 250px;
  background-color: var(--sidebar-bg-color);
  padding: 20px;
}

.p-main-content {
  flex: 1;
  padding: 20px;
}

.p-tabview-nav-container {
  list-style: none;
  padding: 0;
}

.p-tabview-nav-content {
  margin-bottom: 10px;
}

.p-tabview-nav-content a {
  color: var(--link-color);
  text-decoration: none;
}

.p-tabview-nav-content a:hover {
  text-decoration: underline;
}

.p-highlight {
  font-weight: bold;
}

.mb-2 {
  margin-bottom: 20px;
}

.p-title {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.p-subtitle {
  font-size: 1.8em;
  margin-bottom: 10px;
}

.p-text-secondary {
  font-size: 1.2em;
  color: var(--text-secondary-color, #666);
}

.p-text {
  font-size: 1.2em;
  line-height: 1.6;
}
</style>