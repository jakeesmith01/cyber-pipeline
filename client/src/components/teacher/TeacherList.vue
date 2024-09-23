<script setup>
// Libraries
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

// PrimeVue Components
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
const confirm = useConfirm()
import { useToast } from 'primevue/usetoast'
const toast = useToast()
import { FilterMatchMode } from '@primevue/core/api'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

// Custom Components
import DropDownField from '../forms/DropDownField.vue'

// Token
import { useTokenStore } from '@/stores/Token'
const tokenStore = useTokenStore()
const { is_admin } = storeToRefs(tokenStore)

// Stores
import { useTeachersStore } from '@/stores/Teachers'
const teachersStore = useTeachersStore()
import { useDistrictsStore } from '@/stores/Districts'
const districtsStore = useDistrictsStore()
import { useCohortsStore } from '@/stores/Cohorts'
const cohortsStore = useCohortsStore()
import { useCoursesStore } from '@/stores/Courses'
const coursesStore = useCoursesStore()

// Setup Stores
teachersStore.hydrate()
const { teachers } = storeToRefs(teachersStore)
districtsStore.hydrate()
const { districts } = storeToRefs(districtsStore)
const { cohorts } = storeToRefs(cohortsStore)
if (is_admin.value) {
  cohortsStore.hydrate()
  coursesStore.hydrate()
}
const { courses } = storeToRefs(coursesStore)

// Variables
const teacherDialog = ref(false) // controls opening the dialog
const teacherDialogHeader = ref('') // controls header for dialog
const loading = ref(false) // controls loading message
const message = ref('') // error message on dialog form
const teacher = ref({}) // item to be edited
const errors = ref({}) // form errors
const dt = ref() // datatable reference
const notesDialog = ref(false) // controls notes dialog
const notes = ref('') // notes for selected item

// Filters
const filters = ref({
  global: {
    value: '',
    matchMode: FilterMatchMode.CONTAINS
  },
  status: { value: null, matchMode: FilterMatchMode.IN },
  pd_status: { value: null, matchMode: FilterMatchMode.IN },
  cert_status: { value: null, matchMode: FilterMatchMode.IN },
  ms_status: { value: null, matchMode: FilterMatchMode.IN }
})

/**
 * Click handler to edit an item in the datatable
 * @param {Teacher} aTeacher
 */
const editTeacher = (aTeacher) => {
  teacher.value = { ...aTeacher }
  teacherDialogHeader.value = 'Edit Teacher'
  teacherDialog.value = true
}

/**
 * Click handler for new button
 */
const newTeacher = () => {
  teacher.value = {
    name: '',
    email: '',
    eid: '',
    wid: '',
    districts: [],
    cohorts: [],
    courses: [],
    status: 0,
    pd_status: 0,
    cert_status: 0,
    ms_status: 0
  }
  teacherDialogHeader.value = 'New Teacher'
  teacherDialog.value = true
}

/**
 * Click handler to delete an item in the datatable
 *
 * @param {Teacher} aTeacher
 */
const deleteTeacher = (aTeacher) => {
  confirm.require({
    message: 'Are you sure you want to delete ' + aTeacher.name + '?',
    header: 'Danger Zone',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await teachersStore.delete(aTeacher.id)
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Teacher Deleted!',
          life: 3000
        })
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response.data.error,
          life: 3000
        })
      }
    },
    reject: () => {
      // do nothing
    }
  })
}

/**
 * Show notes handler
 *
 * @param {String} notes notes to display
 */
const toggleNotes = (aTeacher, event) => {
  notes.value = aTeacher.notes
  notesDialog.value.toggle(event)
}

/**
 * Save button handler in edit form dialog
 */
const save = async () => {
  loading.value = true
  errors.value = {}
  message.value = ''
  teacher.value.districts = teacher.value.districts.filter((item) => item.id)
  try {
    if (teacher.value.id) {
      await teachersStore.update(teacher.value)
    } else {
      await teachersStore.new(teacher.value)
    }
    toast.add({ severity: 'success', summary: 'Success', detail: 'Teacher Updated!', life: 3000 })
    teacherDialog.value = false
  } catch (error) {
    console.log(error)
    if (error.response.data.data) {
      errors.value = error.response.data.data
      message.value = 'The server rejected this submission. Please correct errors listed below'
    } else if (error.response.data.message) {
      message.value = error.response.data.message
    } else {
      message.value =
        'The server rejected this submission due to an SQL Error. Refresh and try again'
    }
  }
  loading.value = false
}

/**
 * Export datatable to CSV
 */
const exportCSV = () => {
  dt.value.exportCSV()
}

/**
 * Statuses
 */
const statuses = [
  { label: 'New', id: 0, severity: 'warning', icon: 'pi pi-star', hidden: 'false' },
  { label: 'Active', id: 1, severity: 'primary', icon: 'pi pi-sync', hidden: 'false' },
  { label: 'Inactive', id: 2, severity: 'secondary', icon: 'pi pi-times', hidden: 'true' },
  { label: 'Complete', id: 3, severity: 'success', icon: 'pi pi-check', hidden: 'false' }
]

const grades = [
  { label: 'Enrolled', id: 0, severity: 'primary', icon: 'pi pi-circle' },
  { label: 'Pass', id: 1, severity: 'success', icon: 'pi pi-check' },
  { label: 'Incomplete', id: 2, severity: 'warning', icon: 'pi pi-info' },
  { label: 'Fail', id: 3, severity: 'danger', icon: 'pi pi-times' },
  { label: 'Withdrawn', id: 4, severity: 'secondary', icon: 'pi pi-minus' }
]

/**
 * Custom export function to handle exporting datatable data
 *
 * @param {Teacher} row
 */
const exportFunction = (row) => {
  if (row.field == 'districts') {
    return row.data.find((item) => item.primary == true)?.usdName || ''
  } else if (row.field == 'cohorts') {
    return row.data.map((item) => item.name).join(' ')
  } else if (row.field == 'courses') {
    return row.data
      .map((item) => item.name + ': ' + grades.find((grade) => grade.id == item.status).label)
      .join('","')
  } else if (row.field.endsWith('status')) {
    return statuses.find((status) => status.id == row.data)?.label || ''
  } else {
    return row.data
  }
}
</script>

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
      :exportFunction="exportFunction"
    >
      <template #header>
        <Toolbar
          class="mb-2"
          style="border: none"
        >
          <template #start>
            <Button
              v-if="is_admin"
              label="New"
              icon="pi pi-plus"
              severity="success"
              class="mr-2"
              @click="newTeacher"
            />
            <Button
              label="Export"
              icon="pi pi-upload"
              severity="help"
              @click="exportCSV($event)"
            />
          </template>
          <template #end>
            <div class="flex justify-content-end">
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
        v-if="is_admin"
        header="Status"
        field="status"
        sortable
      >
        <template #body="slotProps">
          <Tag
            :value="statuses[slotProps.data.status].label"
            :severity="statuses[slotProps.data.status].severity"
            :icon="statuses[slotProps.data.status].icon"
            v-if="statuses[slotProps.data.status].hidden != 'true'"
            class="m-1"
          />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="statuses"
            optionLabel="label"
            optionValue="id"
            placeholder="Any"
            class="p-column-filter"
            :maxSelectedLabels="2"
          >
          </MultiSelect>
        </template>
      </Column>
      <Column
        v-if="is_admin"
        header="PD"
        field="pd_status"
        sortable
      >
        <template #body="slotProps">
          <Tag
            :value="statuses[slotProps.data.pd_status].label"
            :severity="statuses[slotProps.data.pd_status].severity"
            :icon="statuses[slotProps.data.pd_status].icon"
            v-if="statuses[slotProps.data.pd_status].hidden != 'true'"
            class="m-1"
          />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="statuses"
            optionLabel="label"
            optionValue="id"
            placeholder="Any"
            class="p-column-filter"
            :maxSelectedLabels="2"
          >
          </MultiSelect>
        </template>
      </Column>
      <Column
        v-if="is_admin"
        header="Cert"
        field="cert_status"
        sortable
      >
        <template #body="slotProps">
          <Tag
            :value="statuses[slotProps.data.cert_status].label"
            :severity="statuses[slotProps.data.cert_status].severity"
            :icon="statuses[slotProps.data.cert_status].icon"
            v-if="statuses[slotProps.data.cert_status].hidden != 'true'"
            class="m-1"
          />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="statuses"
            optionLabel="label"
            optionValue="id"
            placeholder="Any"
            class="p-column-filter"
            :maxSelectedLabels="2"
          >
          </MultiSelect>
        </template>
      </Column>
      <Column
        v-if="is_admin"
        header="MS"
        field="ms_status"
        sortable
      >
        <template #body="slotProps">
          <Tag
            :value="statuses[slotProps.data.ms_status].label"
            :severity="statuses[slotProps.data.ms_status].severity"
            :icon="statuses[slotProps.data.ms_status].icon"
            v-if="statuses[slotProps.data.ms_status].hidden != 'true'"
            class="m-1"
          />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="statuses"
            optionLabel="label"
            optionValue="id"
            placeholder="Any"
            class="p-column-filter"
            :maxSelectedLabels="2"
          >
          </MultiSelect>
        </template>
      </Column>
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
        v-if="is_admin"
        field="courses"
        header="Courses"
      >
        <template #body="slotProps">
          <Tag
            v-for="course in slotProps.data.courses"
            :key="course.id"
            :value="course.name"
            :severity="grades[course.status].severity"
            :icon="grades[course.status].icon"
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
            v-if="is_admin"
            icon="pi pi-pencil"
            outlined
            rounded
            class="mr-2"
            @click="editTeacher(slotProps.data)"
            v-tooltip.bottom="'Edit'"
          />
          <Button
            v-if="is_admin"
            icon="pi pi-trash"
            outlined
            rounded
            class="mr-2"
            severity="danger"
            @click="deleteTeacher(slotProps.data)"
            v-tooltip.bottom="'Delete'"
          />
          <Button
            v-if="slotProps.data.notes && slotProps.data.notes.length > 0"
            icon="pi pi-file"
            outlined
            rounded
            severity="info"
            @click="toggleNotes(slotProps.data, $event)"
            v-tooltip.bottom="'Notes'"
          />
        </template>
      </Column>
    </DataTable>
  </Panel>

  <!-- Notes dialog -->
  <OverlayPanel ref="notesDialog">
    <div class="flex flex-column gap-1 w-25rem">
      <div class="w-full">
        <span>Notes</span>
        <hr class="w-full" />
      </div>
      <span>{{ notes }}</span>
    </div>
  </OverlayPanel>

  <!-- Edit item dialog -->
  <Dialog
    v-if="is_admin"
    v-model:visible="teacherDialog"
    :style="{ width: '850px' }"
    :header="teacherDialogHeader"
    :modal="true"
    class="p-fluid"
    :closeOnEscape="true"
  >
    <Message
      v-if="message"
      severity="error"
      >{{ message }}</Message
    >
    <div
      class="flex flex-column align-items-center row-gap-5 w-full pt-3 mt-1"
      v-focustrap
      v-on:keyup.enter="save"
    >
      <TextField
        v-model="teacher.name"
        field="name"
        label="Name"
        icon="pi pi-user"
        :errors="errors"
      />
      <TextField
        v-model="teacher.email"
        field="email"
        label="Email"
        icon="pi pi-envelope"
        :errors="errors"
      />
      <TextField
        v-model="teacher.eid"
        field="eid"
        label="eID"
        icon="pi pi-at"
        :errors="errors"
      />
      <TextField
        v-model="teacher.wid"
        field="wid"
        label="WID"
        icon="pi pi-key"
        :errors="errors"
      />
      <div class="flex flex-row flex-wrap align-items-center row-gap-5 w-full">
        <div class="w-6 pr-1">
          <DropDownField
            v-model="teacher.status"
            field="status"
            label="Status"
            icon="pi pi-filter"
            :errors="errors"
            :values="statuses"
            valueLabel="label"
          />
        </div>
        <div class="w-6 pl-1">
          <DropDownField
            v-model="teacher.pd_status"
            field="pd_status"
            label="PD Status"
            icon="pi pi-briefcase"
            :errors="errors"
            :values="statuses"
            valueLabel="label"
          />
        </div>
        <div class="w-6 pr-1">
          <DropDownField
            v-model="teacher.cert_status"
            field="cert_status"
            label="Certificate Status"
            icon="pi pi-bookmark"
            :errors="errors"
            :values="statuses"
            valueLabel="label"
          />
        </div>
        <div class="w-6 pl-1">
          <DropDownField
            v-model="teacher.ms_status"
            field="ms_status"
            label="MS Status"
            icon="pi pi-star"
            :errors="errors"
            :values="statuses"
            valueLabel="label"
          />
        </div>
      </div>
      <TextField
        v-model="teacher.grade_level"
        field="grade_level"
        label="Grade Level"
        icon="pi pi-globe"
        :errors="errors"
      />
      <div class="w-full flex flex-column row-gap-5 -mt-3">
        <div class="w-full flex flex-row align-items-center">
          <label class="w-11 flex-grow-1 text-center">School Districts</label>
          <div class="pl-1">
            <Button
              icon="pi pi-plus"
              class="p-button-success"
              @click="teacher.districts.push({ id: '', notes: '', primary: false })"
            />
          </div>
        </div>
        <div
          class="w-full flex flex-row align-items-center"
          v-for="(item, index) in teacher.districts"
          :key="item.id"
        >
          <div class="w-4 pr-1">
            <DropDownField
              v-model="teacher.districts[index].id"
              field="id"
              label="District"
              icon="pi pi-building"
              :errors="errors"
              :values="districts"
              valueLabel="usdName"
            />
          </div>
          <div class="w-5 flex-grow-1 px-1">
            <TextField
              v-model="teacher.districts[index].notes"
              field="notes"
              label="Notes"
              icon="pi pi-file"
              :errors="errors"
            />
          </div>
          <div class="w-1 pl-1">
            <BooleanField
              v-model="teacher.districts[index].primary"
              field="primary"
              label="P"
              :errors="errors"
            />
          </div>
          <div class="pl-1">
            <Button
              icon="pi pi-trash"
              class="p-button-danger"
              @click="teacher.districts.splice(index, 1)"
            />
          </div>
        </div>
      </div>
      <div class="w-full flex flex-column row-gap-5 -mt-3">
        <div class="w-full flex flex-row align-items-center">
          <label class="w-11 flex-grow-1 text-center">Cohorts</label>
          <div class="pl-1">
            <Button
              icon="pi pi-plus"
              class="p-button-success"
              @click="teacher.cohorts.push({ id: '', notes: '' })"
            />
          </div>
        </div>
        <div
          class="w-full flex flex-row align-items-center"
          v-for="(item, index) in teacher.cohorts"
          :key="item.id"
        >
          <div class="w-5 pr-1">
            <DropDownField
              v-model="teacher.cohorts[index].id"
              field="id"
              label="Cohort"
              icon="pi pi-building"
              :errors="errors"
              :values="cohorts"
              valueLabel="name"
            />
          </div>
          <div class="w-5 flex-grow-1 px-1">
            <TextField
              v-model="teacher.cohorts[index].notes"
              field="notes"
              label="Notes"
              icon="pi pi-file"
              :errors="errors"
            />
          </div>
          <div class="pl-1">
            <Button
              icon="pi pi-trash"
              class="p-button-danger"
              @click="teacher.cohorts.splice(index, 1)"
            />
          </div>
        </div>
      </div>
      <div class="w-full flex flex-column row-gap-5 -mt-3">
        <div class="w-full flex flex-row align-items-center">
          <label class="w-11 flex-grow-1 text-center">Courses</label>
          <div class="pl-1">
            <Button
              icon="pi pi-plus"
              class="p-button-success"
              @click="teacher.courses.push({ id: '', notes: '', status: 0 })"
            />
          </div>
        </div>
        <div
          class="w-full flex flex-row align-items-center"
          v-for="(item, index) in teacher.courses"
          :key="item.id"
        >
          <div class="w-4 pr-1">
            <DropDownField
              v-model="teacher.courses[index].id"
              field="id"
              label="Course"
              icon="pi pi-building"
              :errors="errors"
              :values="courses"
              valueLabel="name"
            />
          </div>
          <div class="w-3 px-1">
            <DropDownField
              v-model="teacher.courses[index].status"
              field="status"
              label="Grade"
              icon="pi pi-circle"
              :errors="errors"
              :values="grades"
              valueLabel="label"
            />
          </div>
          <div class="w-4 flex-grow-1 px-1">
            <TextField
              v-model="teacher.courses[index].notes"
              field="notes"
              label="Notes"
              icon="pi pi-file"
              :errors="errors"
            />
          </div>
          <div class="pl-1">
            <Button
              icon="pi pi-trash"
              class="p-button-danger"
              @click="teacher.courses.splice(index, 1)"
            />
          </div>
        </div>
      </div>
      <TextAreaField
        v-model="teacher.notes"
        field="notes"
        label="Notes"
        icon="pi pi-file"
        :errors="errors"
      />
      <Button
        label="Save"
        icon="pi pi-check"
        @click="save"
        :loading="loading"
      />
    </div>
  </Dialog>
</template>

<style scoped>
:deep(.p-datatable-header) {
  padding: 0px !important;
}
</style>
