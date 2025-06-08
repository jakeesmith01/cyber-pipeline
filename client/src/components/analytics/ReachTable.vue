<script setup>
import { ref, onMounted, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import Panel from 'primevue/panel';
import ConfirmDialog from 'primevue/confirmdialog';
import { useDistrictsStore } from '@/stores/Districts';
import { useTeachersStore } from '@/stores/Teachers';

const districtStore = useDistrictsStore();
const teacherStore = useTeachersStore();

const dataTableRef = ref(null)

const districts = districtStore.districts
const teachers = teacherStore.teachers

const teachersPassedOneClass = (computed(() => {
    return teachers.filter(teacher => 
        teacher.courses.some(course => 
            course.status === 1)).length
}))


const teachersPassedCertClasses = (computed(() => {
    const requiredCourses = ['CC 710', 'CC 711', 'CC 730', 'EDCI 765']

    return teachers.filter(teacher => 
        requiredCourses.every(courseName => 
            teacher.courses.some(course => 
                course.name === courseName && course.status === 1
            )
        )
    ).length
}))

const districtCount = (computed(() => {
    return districts.length
}))

const townRuralDistricts = (computed(() => {
    return districts.filter(district => 
        district.locale === 31 || 
        district.locale === 32 || 
        district.locale === 33 || 
        district.locale === 41 || 
        district.locale === 42 || 
        district.locale === 43
    ).length
}))

const urbanSuburbanDistricts = (computed(() => {
    return districts.filter(district => 
        district.locale === 11 || 
        district.locale === 12 || 
        district.locale === 13 || 
        district.locale === 21 || 
        district.locale === 22 || 
        district.locale === 23
    ).length
}))

const exportCSV = () => {
    dataTableRef.value.exportCSV();
}

const filters = ref({
    global: {
        value: null,
        matchMode: 'contains'
    }
});

const tableData = computed(() => [
  { label: 'Teachers that passed one class', count: teachersPassedOneClass.value },
  { label: 'Teachers that completed 10 credit hours', count: teachersPassedCertClasses.value },
  { label: 'Total Districts', count: districtCount.value },
  { label: 'Urban/Suburban Districts', count: urbanSuburbanDistricts.value },
  { label: 'Town/Rural Districts', count: townRuralDistricts.value },
]);


</script>

<template>
    <ConfirmDialog></ConfirmDialog>

    <Panel header="Current Program Impact">
        <DataTable
            ref="dataTableRef"
            :value="tableData"
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
                        <!-- Put academic year filtering here if we add it at a later point -->
                    </template>
                </Toolbar>
            </template>
            <template #empty>
                <div class="p-text-center">
                    <p>No Districts Found</p>
                </div>    
            </template>
            <Column
                field="label"
                header="Group"
                sortable
            />
            <Column
                field="count"
                header="Total"
                sortable
            />
        </DataTable>
    </Panel>
</template>