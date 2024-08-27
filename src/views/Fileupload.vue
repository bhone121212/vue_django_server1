<template>
  <div class="file-upload container">
    <div class="header-container alert alert-success">
      <h3 class="header-title">တိုက်ပွဲသတင်းဖိုင်များ</h3>
      <span class="notification">
        <i class="fa-regular fa-bell"></i>
        <span class="icon-button__badge">{{ files.length }}</span> 
      </span>
    </div>
    <div class="form-container mb-3 row">
      <div class="col-md-2 col-sm-3 mb-2 mb-md-0">
        <VueDatePicker v-model="startDate" class="form-control w-100" :enable-time="false" placeholder="Start Date" />
      </div>
      <div class="col-md-2 col-sm-3 mb-2 mb-md-0">
        <VueDatePicker v-model="endDate" class="form-control w-100" :enable-time="false" placeholder="End Date" />
      </div>
      <div class="col-md-2 col-sm-3 mb-2 mb-md-0">
        <input v-model="keyword" type="text" class="form-control w-100" placeholder="Keyword" />
      </div>
      <div class="col-md-1 col-sm-3  mb-2 mb-md-0">
        <button @click="searchByDateRange" class="btn btn-primary w-100"><i class="fa-solid fa-magnifying-glass"></i></button>
      </div>
      <div class="col-md-1 col-sm-1 mb-2 mb-md-0">
        <button @click="refreshPage" class="btn btn-secondary w-100">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
      <div class="col-md-3 col-sm-1 mb-2 mb-md-0 ml-auto">
      <button @click="openModal(null)" class="btn btn-primary">ဖိုင်အသစ်ထည့်ရန်</button>
    </div>
    </div>
    
    <!-- Modal for file upload and edit -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>{{ isEditing ? 'Edit File' : 'Upload New File' }}</h2>
        <form @submit.prevent="isEditing ? updateFile() : uploadFiles()" enctype="multipart/form-data">
          <div class="mb-3">
            <label for="date" class="form-label">Date:</label>
            <input type="date" id="date" v-model="date" required class="form-control" />
          </div>
          <div class="mb-3">
            <label for="file" class="form-label">File:</label>
            <input type="file" id="file" @change="onFileChange" class="form-control" />
            <div v-if="isEditing && existingFileUrl">
              <p>Current file: <a :href="existingFileUrl" target="_blank">{{ existingFileUrl.split('/').pop() }}</a></p>
            </div>
          </div>
          <div class="mb-3">
            <label for="note" class="form-label">Note:</label>
            <textarea id="note" v-model="note" class="form-control" placeholder="Enter note"></textarea>
          </div>
          <div class="d-flex justify-content-between">
            <button type="button" @click="closeModal" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update' : 'Upload' }}</button>
          </div>
        </form>
      </div>
    </div>
    <div v-if="files.length" class="table-responsive">
      <table class="table table-bordered table-hover mt-3">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>File</th>
            <th>Uploaded At</th>
            <th>မှတ်ချက်</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(file, index) in files" :key="file.id">
            <td>{{ index + 1 }}</td>
            <td>{{ file.date }}</td>
            <td style="text-align:left" class="file-cell">
              <a :href="file.file" target="_blank">{{ file.file.split('/').pop() }}</a>
            </td>
            <td style="text-align:left">{{ file.uploaded_at }}</td>
            <td style="text-align:left">{{ file.note }}</td>
            <td>
              <div class="d-flex justify-content-between">
                <button class="btn btn-primary btn-sm me-2" @click="openModal(file)"><i class="fa-regular fa-pen-to-square"></i></button>
                <button class="btn btn-danger btn-sm" @click="deleteFile(file.id)"><i class="fa-solid fa-trash"></i></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else>No files uploaded yet.</p>
  </div>
</template>

<script>
import axios from 'axios';
import api from './api';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
  name: 'FileUpload',
  components: {
    VueDatePicker,
  },
  data() {
    return {
      files: [],
      selectedFiles: null,
      date: '',
      note: '',
      showModal: false,
      isEditing: false,
      editingFileId: null,
      existingFileUrl: '',
      startDate: null,
      endDate: null,
      keyword: '',
    };
  },
  created() {
    this.fetchFiles();
  },
  methods: {
  async fetchFiles(startDate = null, endDate = null, keyword = '') {
      let url = `${api.API_URL}api/combatfiles/`;
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (keyword) params.append('keyword', keyword);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);
      this.files = response.data;
      this.files.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    async searchByDateRange() {
      const startDate = this.startDate ? this.startDate.toISOString().split('T')[0] : null;
      const endDate = this.endDate ? this.endDate.toISOString().split('T')[0] : null;
      await this.fetchFiles(startDate, endDate, this.keyword);
    },
    async refreshPage() {
      this.startDate = null;
      this.endDate = null;
      this.keyword = '';
      await this.fetchFiles();
    },
  onFileChange(event) {
    this.selectedFiles = event.target.files;
  },
  openModal(file) {
    if (file) {
      this.isEditing = true;
      this.editingFileId = file.id;
      this.date = file.date;
      this.note = file.note;
      this.existingFileUrl = file.file;
    } else {
      this.isEditing = false;
      this.editingFileId = null;
      this.date = '';
      this.note = '';
      this.selectedFiles = null;
      this.existingFileUrl = '';
    }
    this.showModal = true;
  },
  closeModal() {
    this.showModal = false;
    this.date = '';
    this.note = '';
    this.selectedFiles = null;
    this.existingFileUrl = '';
  },
  async uploadFiles() {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      alert('Please select at least one file.');
      return;
    }

    let formData = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('file', this.selectedFiles[i]);
    }
    formData.append('date', this.date);
    formData.append('note', this.note);

    try {
      await axios.post(`${api.API_URL}api/combatfiles/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      this.fetchFiles();
      this.closeModal();
      alert('Files uploaded successfully!');
    } catch (error) {
      console.error("There was an error uploading the files!", error);
      alert('Failed to upload files.');
    }
  },
  async updateFile() {
    let formData = new FormData();

    // Only append new file if it's selected
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('file', this.selectedFiles[i]);
      }
    } else {
      // Do not append 'file' if no new file is selected
    }

    formData.append('date', this.date);
    formData.append('note', this.note);

    try {
      await axios.put(`${api.API_URL}api/combatfiles/${this.editingFileId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      this.fetchFiles();
      this.closeModal();
      alert('File updated successfully!');
    } catch (error) {
      console.error("There was an error updating the file!", error);
      alert('Failed to update file.');
    }
  },
  async deleteFile(id) {
    if (confirm('Are you sure you want to delete this file?')) {
      await axios.delete(`${api.API_URL}api/combatfiles/${id}/`);
      this.fetchFiles();
    }
  }
}
};
</script>

<style scoped>
.file-cell {
  max-width: 200px; /* Adjust the width as needed */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.file-upload {
  padding: 20px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box; /* Ensures padding is included in width */
}

.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
  border: 1px solid #dee2e6;
}

.table th,
.table td {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}

.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.075);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 15px;
}

@media (max-width: 768px) {
  .table-responsive {
    display: block;
    width: 100%;
    overflow-x: auto;
  }

  .modal-content {
    width: 95%;
  }

  .form-container .btn {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>


