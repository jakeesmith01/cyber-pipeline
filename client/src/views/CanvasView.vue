<template>
    <!-- Location for confirmation dialog to be inserted -->
    <ConfirmDialog></ConfirmDialog>
  
    <!-- Main datatable for items -->
    <Panel header="Manage Teachers">
      <DataTable
        ref="dt"
        :value="teachers"
        stripedRows
        sortField="name"
        :sortOrder="1"
        tableStyle="min-width: 50rem"
        v-model:filters="filters"
        filterDisplay="row"
        :globalFilterFields="['name', 'email', 'eid', 'wid', 'all_districts', 'grade_level']"
        paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50, 100]" :paginatorPosition="'top'"
      >
        <template #header>
          <Toolbar
            class="mb-2"
            style="border: none"
          >
            <template #end>
              <div class="flex justify-end">
                <IconField iconPosition="left">
                  <InputIcon>
                    <i class="pi pi-search" />
                  </InputIcon>
                  <InputText
                    v-model="filters['global'].value"
                    placeholder="Keyword Search"
                  />
                </IconField>
              </div>
            </template>
          </Toolbar>
        </template>
        <template #empty>
          <div class="p-text-center">
            <p>No Teachers Found</p>
          </div>
        </template>
        <Column
          field="name"
          sortable
          header="Name"
        ></Column>
        <Column
          field="email"
          sortable
          header="Email"
        ></Column>
        <Column
          field="eid"
          sortable
          header="eID"
        ></Column>
        <Column
          field="wid"
          sortable
          header="WID"
        ></Column>
        <Column
          field="grade_level"
          header="Grade Level"
          sortable
        ></Column>
        <Column
          field="districts"
          header="Districts"
        >
          <template #body="slotProps">
            <Tag
              v-for="district in slotProps.data.districts"
              :key="district.id"
              :value="district.usdName"
              :severity="district.primary == true ? 'success' : 'secondary'"
              class="m-1"
            />
          </template>
        </Column>
        <Column
          field="cohorts"
          header="Cohorts"
        >
          <template #body="slotProps">
            <Tag
              v-for="cohort in slotProps.data.cohorts"
              :key="cohort.id"
              :value="cohort.name"
              class="m-1"
            />
          </template>
        </Column>
        <Column
          header="Actions"
          :exportable="false"
          style="min-width: 8rem"
        >
          <template #body="slotProps">
            <Button
              label="Show Courses"
              outlined
              @click="showCourses(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </Panel>

    <!-- Dialog for showing courses -->
    <Dialog
      v-model:visible="dialogVisible"
      :header="'Courses for ' + (selectedTeacher?.name || '')"
      :style="{ width: '50vw' }"
      modal
      draggable
      resizable
    >
      <DataTable :value="teacherCourses" stripedRows>
        <Column 
          field="name" 
          header="Course Name">
        </Column>
        <Column 
          header="Course Progress">
          <template #body="slotProps">
            <div>
              <ProgressBar
                :value="Math.round((slotProps.data.progress.requirement_completed_count / slotProps.data.progress.requirement_count) * 100) || 0"
                showValue
              ></ProgressBar>
              <div>
                {{  slotProps.data.progress.requirement_completed_count || 0 }} / {{ slotProps.data.progress.requirement_count || 0 }} 
              </div>
            </div>
          </template>
        </Column>
        <Column 
          header="Grades">
          <template #body="slotProps">
            <Button
              label="View Grades"
              icon="pi pi-external-link"
              class="p-button-outlined"
              @click="redirectToGrades(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
      <template #footer>
        <Button label="Close" icon="pi pi-times" @click="dialogVisible = false" />
      </template>
    </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCanvasStore } from '../stores/Canvas.js';
import { useTeachersStore } from '../stores/Teachers.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import { FilterMatchMode } from '@primevue/core/api';
import ConfirmDialog from 'primevue/confirmdialog';
import { useCoursesStore } from '../stores/Courses.js';
import ProgressBar from 'primevue/progressbar';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Toolbar from 'primevue/toolbar';
import Logger from 'js-logger';

const coursesStore = useCoursesStore();
const teachersStore = useTeachersStore();

const { courses } = storeToRefs(coursesStore);
const { teachers } = storeToRefs(teachersStore);
const searchQuery = ref('');

const canvasStore = useCanvasStore();

// State variables
const selectedTeacher = ref(null);
const filteredTeachers = ref([]);
const teacherEid = ref('');

const filters = ref({
  global: {
    value: '',
    matchMode: FilterMatchMode.CONTAINS
  },
  status: { value: null, matchMode: FilterMatchMode.IN },
  pd_status: { value: null, matchMode: FilterMatchMode.IN },
  cert_status: { value: null, matchMode: FilterMatchMode.IN },
  ms_status: { value: null, matchMode: FilterMatchMode.IN }
});

const dialogVisible = ref(false);
const teacherCourses = ref([]);
const teacherProgress = ref([]);

/**
 * Show courses for the selected teacher in a dialog.
 */
async function showCourses(teacher) {
  selectedTeacher.value = teacher;
  dialogVisible.value = true;

  try {
    // Fetch courses for the selected teacher
    const filteredCourses = courses.value.filter(course => 
      teacher.courses.some(teacherCourse => teacherCourse.id === course.id));

    if (filteredCourses.length === 0) {
      teacherCourses.value = [{ courseName: 'No courses found', courseProgress: 0 }];
      return;
    }

    // For each course in teacherCourses, fetch the progress from the canvas api and append it to the course
    const updatedCourses = await Promise.all(
      filteredCourses.map(async course => {
        const progress = await canvasStore.getCourseProgress(course.course_id, teacher.eid);

        console.log(progress.data);
        return {
          ...course,
          progress: {
            requirement_count: progress.data.requirement_count,
            requirement_completed_count: progress.data.requirement_completed_count,
          }
        };
      })
    )


    teacherCourses.value = updatedCourses;
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
}

function redirectToGrades(course){
  if(!course || !course.course_id || !selectedTeacher.value?.eid){
    return;
  }

  const courseID = course.course_id;
  const userID = selectedTeacher.value.eid;
  const gradesUrl = `https://k-state.instructure.com/courses/${courseID}/grades/${userID}`

  window.open(gradesUrl, '_blank');
}


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

.p-input {
  padding: 10px;
  font-size: 1em;
  margin-right: 10px;
}

.p-button {
  padding: 10px 20px;
  font-size: 1em;
  background-color: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
}

.p-button:hover {
  background-color: var(--primary-color-dark);
}
</style>
