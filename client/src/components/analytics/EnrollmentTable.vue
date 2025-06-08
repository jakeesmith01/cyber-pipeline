<script setup>
import { ref, onMounted, computed, pushScopeId } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useEnrollmentStore } from '@/stores/Enrollment';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import Panel from 'primevue/panel';
import ConfirmDialog from 'primevue/confirmdialog';
import { storeToRefs } from 'pinia'
import Select from 'primevue/select'
import { dt } from '@primevue/themes';

const enrollmentStore = useEnrollmentStore();

// Current year used to generate academic years
const currentYear = new Date().getFullYear()
const academicYears = ref([
  'All',
]);
const selectedAcademicYear = ref(null);
const { getAllCourses } = storeToRefs(enrollmentStore);



const dataTableRef = ref(null)

const populateAcademicYears = () => {
  const uniqueYears = new Set();
  getAllCourses.value.forEach((course) => {
    if (course.academic_year) {
      uniqueYears.add(course.academic_year); // Collect unique academic_year values
    }
  });

  // Add sorted unique years to the academicYears array
  academicYears.value = ['All', ...Array.from(uniqueYears).sort((a, b) => {
    const [aStart] = a.split('-').map(Number); // Extract the starting year as a number
    const [bStart] = b.split('-').map(Number); // Extract the starting year as a number
    return bStart - aStart; // Sort descending by the starting year
  })];
};

const filteredCourses = computed(() => {
  if (!selectedAcademicYear.value || selectedAcademicYear.value === 'All') {
    return getAllCourses.value;
  }
  return getAllCourses.value.filter(
    (course) => course.academic_year === selectedAcademicYear.value
  );
});

const filters = ref({
    global: {
        value: null,
        matchMode: 'contains'
    }
});

// Exports the current data table to CSV
const exportCSV = () => {
    dataTableRef.value.exportCSV();
}

onMounted(async () => {
  // Ensure data is loaded into the store
  await enrollmentStore.hydrate();

  populateAcademicYears();
  selectedAcademicYear.value = `All`;
});


</script>

<template>
    <ConfirmDialog></ConfirmDialog>

    <Panel header="Current Student Enrollment">
        <DataTable
            ref="dataTableRef"
            :value="filteredCourses"
            stripedRows
            tableStyle="min-width: 50rem"
            v-model:filters="filters"
            filterDisplay="row"
        >
            <template #header>
                <Toolbar
                    class="mb-2"
                    style="border: none"
                >
                    <template #start>
                        <Button
                            label="Export"
                            icon="pi pi-upload"
                            severity="help"
                            @click="exportCSV($event)"
                        />
                    </template>
                    <template #end>
                        <div class="flex justify-end gap-12">
                            <IconField iconPosition="left">
                            <InputIcon>
                                <i class="pi pi-search"/>
                            </InputIcon>
                            <InputText 
                                v-model="filters['global'].value"
                                placeholder="Keyword Search"
                            />
                            </IconField>

                            <IconField iconPosition="left">
                                <InputIcon>
                                    <i class="pi pi-calendar"/>
                                </InputIcon>
                                <Select
                                  v-model="selectedAcademicYear"
                                  :options="academicYears"
                                  placeholder="Academic Year"
                                />
                            </IconField>
                        </div>
                    </template>
                </Toolbar>
            </template>
            <template #empty>
                <div class="p-text-center">
                    <p>No Courses Found</p>
                </div>
            </template>
            <Column 
                field="name"
                sortable
                header="Course"
            />
            <Column 
                field="academic_year"
                sortable
                header="Academic Year"
            />
            <Column 
                field="numStudents"
                sortable
                header="Total Enrollment"
            />
            <Column
                field="numPassed"
                sortable
                header="Total Passed"
            />
            <Column
                field="numNotPassed"
                sortable
                header="Total Not Passed"
            />
            <Column
                field="numWithdrawn"
                sortable 
                header="Total Withdrawn"
            />
            <Column 
                field="numIncompleteOrInProgress"
                sortable 
                header="Total Incomplete/In Progress"
            />
        </DataTable>
    </Panel>



</template>

<style scoped>
/* Add your styles here */
</style>