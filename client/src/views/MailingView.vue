<template>
  <div class="mailing-view">
    <h1>Send Email</h1>
    <form @submit.prevent="sendEmail">
      <TextField
        label="Recipients"
        field="recipients"
        icon="pi pi-envelope"
        v-model="recipientDisplay"
        class="form-field-recipient"
        @click="showRecipientDialog"
        :errors="[]"
      >
        <InputText
            id="recipient"
            v-model="recipientDisplay"
            placeholder="Recipients"
            readonly
        />    
      </TextField>
      <TextField
        label="Subject"
        field="subject"
        icon="pi pi-bookmark"
        v-model="subject"
        class="form-field"
        :errors="[]"
      >
        <InputText
          id="subject"
          v-model="subject"
          placeholder="Enter subject"
        />
      </TextField>
      <Editor
        v-model="text"
        class="editor"
        :placeholder="''"
      />
      <Button
        label="Send"
        icon="pi pi-check"
        type="submit"
        class="form-field"
      />
    </form>
    <Message
      v-if="message"
      severity="error"
      >{{ message }}</Message
    >

    <!-- Dialog for selecting recipients -->
    <!-- @show set to 'focusCloseButton' to prevent the user from typing in the TextField after closing the dialog (bandaid fix) -->
    <Dialog
      v-model:visible="recipientDialog"
      header="Select Recipients"
      :modal="true"
      style="width: 50vw"
      :closeOnEscape="true"
      @show="focusCloseButton" 
    >
      <div>
        <div class="search-container">
          <Select 
            v-model="selectedCohort"
            :options="cohorts"
            option-label="name"
            option-value="id"
            placeholder="Select a cohort"
            class="cohort-select"
            @change="selectCohort"
          />

          <Select 
            v-model="selectedCourse"
            :options="courses"
            option-label="name"
            option-value="id"
            placeholder="Select a course"
            class="course-select"
            @change="selectCourse"
          />

          <div class="p-inputgroup">
            <InputText
              v-model="searchTerm"
              placeholder="Search by name or email"
              @input="filterTeachers"
            />
          </div>
        </div>
        <DataTable
          :value="filteredTeachers"
          paginator
          :rows="5"
          tableStyle="min-width: 50rem"
        >
          <Column field="name" header="Name"></Column>
          <Column field="email" header="Email"></Column>
          <Column header="Actions">
            <template #body="slotProps">
              <Button
                v-if="!recipient.includes(slotProps.data.email)"
                label="Add"
                icon="pi pi-check"
                @click="selectRecipient(slotProps.data)"
                class="p-button-success"
              />
              <Button
                v-else
                label="Remove"
                icon="pi pi-times"
                @click="removeRecipient(slotProps.data)"
                class="p-button-danger"
              />
            </template>
          </Column>
        </DataTable>
      </div>
      <div class="dialog-footer">
        <Button
          ref="closeButton"
          label="Close"
          icon="pi pi-times"
          @click="recipientDialog = false"
          class="p-button-text"
        />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useEmailsStore } from '../stores/Emails.js'
import { useTeachersStore } from '@/stores/Teachers.js'
import { useCohortsStore } from '@/stores/Cohorts.js'
import { useCoursesStore } from '@/stores/Courses.js'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Message from 'primevue/message'
import TextField from '@/components/forms/TextField.vue'
import Editor from 'primevue/editor'
import Select from 'primevue/select'

const emailStore = useEmailsStore()
const teachersStore = useTeachersStore()
const cohortsStore = useCohortsStore()
const coursesStore = useCoursesStore()

const recipient = ref([]) // Array of recipients email addresses
const recipientDisplay = ref('') 
const subject = ref('') // Email subject
const text = ref('') // Email body
const message = ref('')
const recipientDialog = ref(false)
const searchTerm = ref('') // Search term for filtering recipients
const filteredTeachers = ref([]) // Filtered teachers based on search term
const cohorts = ref([]) // List of all cohorts for recipient selection
const selectedCohort = ref(null) // Selected cohort for recipient selection
const optInTeachers = ref([]) // All teachers that are opted in to receive emails

const courses = ref([])
const selectedCourse = ref(null)

const closeButton = ref(null)

// Fetch the teachers list when the component is mounted
onMounted(async () => {
  // await teachersStore.hydrate()
  optInTeachers.value = teachersStore.teachers.filter(teacher => !teacher.email_opt_out)
  filteredTeachers.value = optInTeachers.value

  // await cohortsStore.hydrate()
  cohorts.value = [{ id: null, name: "None" }, ...cohortsStore.cohorts]

  // await coursesStore.hydrate()
  courses.value = [{ id: null, name: "None" }, ...coursesStore.courses]
})

// Show dialog for recipient selection
const showRecipientDialog = () => {
  recipientDialog.value = true
}

// Filter teachers based on search term
const filterTeachers = () => {
  const term = searchTerm.value.toLowerCase()
  filteredTeachers.value = teachersStore.teachers.filter(teacher =>
    !teacher.email_opt_out &&
    (teacher.name.toLowerCase().includes(term) ||
    teacher.email.toLowerCase().includes(term))
  )
}

// Select a course and update the recipient list to include all opted in teachers within the course
const selectCourse = async () => {
  if(selectedCourse.value === null){
    recipient.value = []
    updateRecipientDisplay()
    return
  }

  if(selectedCourse.value){
    recipient.value = []
    updateRecipientDisplay()
    const courseData = await coursesStore.getCourse(selectedCourse.value)
    courseData.teachers.forEach(teacher => {
      const teacherDetails = teachersStore.getTeacher(teacher.id)
      if(teacherDetails && !teacherDetails.email_opt_out){
        selectRecipient(teacherDetails)
      }
    })
  }

}

// Select a cohort and update the recipient list to include all opted in teachers within the cohort
const selectCohort = async () => {
  if(selectedCohort.value === null){
    recipient.value = []
    updateRecipientDisplay()
    return
  }

  if(selectedCohort.value){
    recipient.value = []
    updateRecipientDisplay()
    const cohortData = await cohortsStore.getCohort(selectedCohort.value)
    cohortData.teachers.forEach(teacher => {
      const teacherDetails = teachersStore.getTeacher(teacher.id)
      if(teacherDetails && !teacherDetails.email_opt_out){
        selectRecipient(teacherDetails)
      }
    })
  }
}

// Select a recipient and update the display
const selectRecipient = (teacher) => {
  if (!recipient.value.includes(teacher.email)) {
    recipient.value.push(teacher.email)
    recipientDisplay.value = recipient.value.join(', ')
    updateRecipientDisplay()
  }
}

// Removes a recipient from the list
const removeRecipient = (teacher) => {
  if(recipient.value.includes(teacher.email)){
    recipient.value = recipient.value.filter(email => email !== teacher.email)
    updateRecipientDisplay()
  }
}

// Updates the recipient input field after removing a recipient
const updateRecipientDisplay = () => {
  recipientDisplay.value = recipient.value.join(', ')
}

// Changes focus to the close button of the dialog to prevent the user from typing in the recipient text field after closing the dialog
const focusCloseButton = () => {
  if(closeButton.value){
    closeButton.value.$el.focus()
  }
}


// Send email function
const sendEmail = async () => {
  try {
    if (!recipient.value.length) {
      message.value = 'At least one recipient is required'
      return
    }
    await emailStore.sendEmail({
      to: recipient.value,
      subject: subject.value,
      text: text.value,
      html: text.value,
    })
    recipient.value = []
    recipientDisplay.value = ''
    subject.value = ''
    text.value = ''
    message.value = 'Email sent successfully'
  } catch (error) {
    message.value = 'Failed to send email'
    console.error('Failed to send email', error)
  }
}
</script>

<style scoped>
.mailing-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-field {
  margin-bottom: 30px;
  text-align: left;
  width: 100%;
}

.form-field-recipient {
  margin-bottom: 30px;
  cursor: pointer;
}

.editor{
  width:100%;
  text-align: left;
  height: 320px;
  margin-bottom: 70px;
}

.search-container{
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}


.dialog-footer {
  text-align: right;
  padding: 1rem;
}
</style>
