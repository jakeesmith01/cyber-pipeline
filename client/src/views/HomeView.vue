<template>
  <div class="p-layout">
    <aside class="p-sidebar">
      <Menu :model="items" class="w-full md:w-50">
        <template #submenulabel="{ item }">
            <span class="text-primary font-bold">{{ item.label }}</span>
        </template>
        <template #item="{ item, props }">
            <a class="flex items-center" v-bind="props.action">
                <span :class="item.icon"></span> 
                <span>{{ item.label }}</span>
                <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
                <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
            </a>
        </template>
      </Menu>
    </aside>
    <main class="p-main-content">
      <!-- Dynamically show content based on selectedContent -->
      <div v-if="selectedContent === 'info'">
        <header class="mb-2">
          <h1 id="top" class="p-title">Kansas State University: Cyber Pipeline Program</h1>
          <h2 class="text-lg">
            Learn and Teach Computer Science
          </h2>
        </header>
        <Divider />
        <p class="mt-4 p-text">
          The Cyber Pipeline program, a part of the larger K-State Computational Core program, 
          has the goal of making quality computer science education available to all high school 
          students at little or no cost to them. The Cyber Pipeline curriculum uses the basic Computational 
          Core state-of-the-art curriculum with the latest technologies and educational practices. 
          And best of all, the curriculum is completely free.
        </p>
        <p class="mt-4 p-text">
          However, the Cyber Pipeline program also provides innovative online instruction that includes 
          video, text, and automatically graded hands-on exercises and projects. The curriculum is designed 
          to use lectures and text from K-State faculty, as well as in-class activities and examples led by 
          high school teachers.
        </p>
        <p class="mt-4 p-text">
          Since qualified computer science teachers are hard to find, the Cyber Pipeline program also provides 
          a teacher training program. This includes a five- to six-week program where high school teachers go through 
          the course material individually and have weekly interactive sessions where they can discuss the material, 
          and share teaching strategies and more with K-State faculty and other teachers. There will also be a 
          teacher's guide with additional instructional strategies and examples that teachers can use in the classroom.
        </p>
        <p class="mt-8 p-text">
          To learn more about the Cyber Pipeline program, watch our video and please contact us using the form below. 
          We will send you a packet on how to get the Cyber Pipeline courses up and running at your school. In addition, 
          we can also set you up with a trial version of a few modules from one of our Cyber Pipeline courses.
        </p>
        <div class="mt-6 flex justify-center">
          <iframe 
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/xx4M6WRxjrQ" 
            title="Cyber Pipeline Program Video"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
        <h2 class="text-xl mt-4">
          Contact Us:
        </h2>
        <form>TODO: add form to contact us</form>
      </div>

      <div v-if="selectedContent === 'curriculum'">
        <!-- Course List Section -->
        <section>
          <h1 id="top" class="p-title">Course List</h1>
          <p class="text-lg mb-4">The Cyber Pipeline Curriculum contains several courses from K-State's Computational Core that have been aligned with AP curriculum standards. These are the same courses we use in our Computer Science Certificate and Integrated Computer Science degree programs, so students are getting the real college experience! Currently available courses include:</p>

          <ul class="list-disc pl-8 space-y-2">
            <li class="text-lg font-bold">CC 110 – Introduction to Computing</li>
            <li class="text-lg font-bold">CC 210 – Fundamental Computer Programming Concepts</li>
          </ul>

          <p class="text-lg mt-4 mb-4">Beyond the introductory courses, many advanced courses are also available for schools wanting to go further or bolster their existing curricula. These include:</p>

          <ul class="list-disc pl-8 space-y-2 mb-4">
            <li class="text-lg font-bold">CC 120 – Web Page Design</li>
            <li class="text-lg font-bold">CC 310 – Data Structures & Algorithms</li>
            <li class="text-lg font-bold">CC 410 – Advanced Programming</li>
          </ul>
        </section>

        <!-- College Credit Options Section -->
        <section class="mb-4">
          <h2 class="text-2xl font-semibold mb-2">College Credit Options</h2>
          <p class="text-lg ">Students taking these courses may choose to take the associated AP exam to gain college credit that is accepted nationwide. We can also work with your local community or technical college to explore options for college credit through the Kansas Career and Technical Education (CTE) program. Finally, any students who attend K-State in a CS degree or certificate program may also earn credit by examination for many of these courses, jumpstarting their college career.</p>
        </section>

        <!-- Courses Section -->
        <section>
          <h2 class="text-2xl font-semibold mb-4">Course Descriptions</h2>

          <div class="mb-8">
            <h3 class="text-xl font-semibold mb-2">CC 110 – Introduction to Computing</h3>
            <p class="text-lg mb-2">CC 110 is the first course in our sequence, primarily for students with little to no experience in programming or computer science. The target audience is students in high school with at least some experience in Algebra.</p>
            <p class="text-lg mb-2">The course serves as a broad introduction to the field of computer science, covering many of the big ideas and innovators throughout history, as well as the various subfields of computer science such as artificial intelligence, cybersecurity, and more.</p>
            <p class="text-lg mb-2">In addition, students will learn the basics of programming in both pseudocode and Python, preparing them for future courses that dive deeper into the core concepts of programming.</p>
            <p class="text-lg ">This course is targeted to align with the AP Computer Science Principles (CS P) curriculum. See the AP Syllabus for a detailed overview of how the CC 110 course aligns with AP CS P.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-2">CC 210 – Fundamental Computer Programming Concepts</h3>
            <p class="text-lg mb-2">CC 210 is intended to be the second course in the sequence, but it can also be used with students who have prior programming experience.</p>
            <p class="text-lg mb-2">This course introduces programming concepts in-depth using Java, starting with basic data types and variables, conditional and loop statements, functions, strings, and aggregate data types (arrays and lists). Students then shift to object-oriented programming, learning about classes, objects, and inheritance to set the stage for future coursework in data structures and algorithms.</p>
            <p class="text-lg mb-2">This course is targeted to align with the AP Computer Science A (CS A) curriculum. See the AP Syllabus (link coming soon) for a detailed overview of how the CC 210 course aligns with AP CS A.</p>
          </div>
        </section>

      </div>

      <div v-if="selectedContent === 'teacher-support'">
        <!-- Course List Section -->
        <section>
          <h1 id="top" class="p-title">Teacher Support</h1>

          <h2 class="text-2xl font-semibold mb-1">Training</h2>
          <p class="text-lg mb-4">The Cyber Pipeline program includes an engaging and robust professional development program 
            designed to prepare a teacher with no background in computer science to teach the 
            <span class="font-bold">CC 110 and/or CC 210 courses in under a year.</span> 
            The training is delivered asynchronously online, allowing you to fit it into your schedule. 
            Additionally, there is a synchronous (but also available as a recording) online seminar series held the first Friday of each month. 
            Finally, teachers engaging in the program have continuous access to mentoring by Computer Science and Pedagogy experts drawn from 
            K-State faculty through instant messaging, email, and video collaboration.
          </p>

          <h2 class="text-2xl font-semibold mb-1">Professional Development</h2>
          <p class="text-lg mb-4">This professional development is offered in a partnership between the K-State Computer Science Department 
            and the College of Education, and awards 10 graduate credit hours that can also be applied to a Graduate Interdisciplinary
            Certificate in Computer Science Education* and/or a Masters in Curriculum and Instruction with a focus on Computer Science Education.
          </p>

        </section>

      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Menu from 'primevue/menu';
import Badge from 'primevue/badge';
import { useRouter } from 'vue-router';

const selectedContent = ref('info'); // Default content is 'info'
const items = ref([]);

onMounted(() => {
  items.value = [
    {
      label: 'Info',
      icon: 'pi pi-fw pi-info-circle',
      command: () => {
        selectedContent.value = 'info'; // Show the info content
      }
    },
    {
      label: 'Curriculum',
      icon: 'pi pi-fw pi-book',
      command: () => {
        selectedContent.value = 'curriculum'; // Show the curriculum content
      }
    },
    {
      label: 'Teacher Support',
      icon: 'pi pi-fw pi-video',
      command: () => {
        selectedContent.value = 'teacher-support'; // Show the curriculum content
      }
    },
    {
      label: 'How To Join',
      icon: 'pi pi-fw pi-users',
      command: () => alert('How To Join page coming soon!')
    }
  ];
});
</script>

<style scoped>
.p-layout {
  display: flex;
}

.p-sidebar {
  position: sticky;
  top: 0;
  left: 0;
  height: 100vh;
  width: 200px;
  z-index: 1000;
  background-color: var(--surface-card);
  padding-right: 20px;
  padding-top: 20px;
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
  cursor: pointer;
}

.p-tabview-nav-content a {
  color: var(--link-color);
  text-decoration: none;
}

.p-tabview-nav-content a:hover {
  text-decoration: underline;
}

.p-map-and-text-container {
  display: flex;  
  flex-direction: column; /* Stacks map on top of text */
}

.p-map-container img{
  width: 100%;
  max-width: 1200px;
  height: auto;
}

.p-map-container,
.p-text-container {
  width: 50%; /* Full width when stacked */
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

.label-text{
  font-size: 0.8em;
  color: var(--text-secondary-color, #666);
}

.p-text {
  font-size: 1.2em;
  line-height: 1.6;
}
</style>
