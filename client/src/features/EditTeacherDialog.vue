<script setup>
import { useCanvasStore } from '../stores/Canvas.js';
const canvasStore = useCanvasStore();


  function enrollTeacher(courseID, teacherID){
    if(canvasStore.enrollTeacherInClass(courseID, teacherID)){
      return true;
    }

    return false;
  }

  const emit = defineEmits(["close-modal", "save"]);

  // Define the props for dialog visibility and header
  const props = defineProps({
    teacherDialog: Boolean,
    teacherDialogHeader: String,
    message: String,
    teacher: Object,
    errors: Object,
    statuses: Object,
    districts: Array,
    cohorts: Array,
    courses: Array,
    grades: Array,
    loading: Boolean,
  });

  const closeModal = () => {
    emit("close-modal");
  };

  const save = () => {
    emit("save");
  }
</script>

<template>
  <Dialog
    :visible="props.teacherDialog"
    :style="{ width: '850px' }"
    :header="props.teacherDialogHeader"
    :modal="true"
    class="p-fluid"
    :closeOnEscape="true"
    @update:visible="closeModal"
  >
    <Message
      v-if="message"
      severity="error"
      >{{ message }}
    </Message>
    <div
      class="flex flex-col items-center gap-y-8 w-full pt-6 mt-1"
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
      <div class="flex flex-row flex-wrap items-center gap-y-8 w-full">
        <div class="w-6/12 pr-1">
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
        <div class="w-6/12 pl-1">
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
        <div class="w-6/12 pr-1">
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
        <div class="w-6/12 pl-1">
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
      <div class="w-full flex flex-col gap-y-8 -mt-6">
        <div class="w-full flex flex-row items-center">
          <label class="w-11/12 grow text-center">School Districts</label>
            <div class="pl-1">
              <Button
                icon="pi pi-plus"
                class="p-button-success"
                @click="teacher.districts.push({ id: '', notes: '', primary: false })"
              />
            </div>
        </div>
        <div
            class="w-full flex flex-row items-center"
            v-for="(item, index) in teacher.districts"
            :key="item.id"
        >
          <div class="w-4/12 pr-1">
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
          <div class="w-5/12 grow px-1">
            <TextField
              v-model="teacher.districts[index].notes"
              field="notes"
              label="Notes"
              icon="pi pi-file"
              :errors="errors"
            />
          </div>
          <div class="w-1/12 pl-1">
            <!-- This check box is to clarify what district is primary district but it probably needs to be more clear -->
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
      <div class="w-full flex flex-col gap-y-8 -mt-6">
        <div class="w-full flex flex-row items-center">
          <label class="w-11/12 grow text-center">Cohorts</label>
          <div class="pl-1">
            <Button
              icon="pi pi-plus"
              class="p-button-success"
              @click="teacher.cohorts.push({ id: '', notes: '' })"
            />
          </div>
        </div>
        <div
            class="w-full flex flex-row items-center"
            v-for="(item, index) in teacher.cohorts"
            :key="item.id"
        >
          <div class="w-5/12 pr-1">
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
          <div class="w-5/12 grow px-1">
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
      <div class="w-full flex flex-col gap-y-8 -mt-6">
        <div class="w-full flex flex-row items-center">
          <label class="w-11/12 grow text-center">Courses</label>
            <div class="pl-1">
              <Button
                icon="pi pi-plus"
                class="p-button-success"
                @click="teacher.courses.push({ id: '', notes: '', status: 0 })"
              />
            </div>
        </div>
        <div
            class="w-full flex flex-row items-center"
            v-for="(item, index) in teacher.courses"
            :key="item.id"
        >
          <div class="w-4/12 pr-1">
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
          <div class="w-3/12 px-1">
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
          <div class="w-4/12 grow px-1">
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
          <div class="pl-1">
            <Button 
              icon="pi pi-plus"
              class="p-button-success"
              @click="enrollTeacher(teacher.courses[index].id, teacher.eid)"
              v-tooltip.bottom="'Enrolls the teacher in Canvas'"
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
/* Scoped styles for EditTeacherDialog */
</style>
