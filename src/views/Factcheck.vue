<template>
  <div class="container-fluid">
    <h3 class="alert alert-success">သတင်းမီဒီယာအလိုက်အနှစ်ချုပ်များ</h3>
    <div class="form-container mb-3 row">
      <div class="col-md-2 col-sm-3 mb-2 mb-md-0">
        <VueDatePicker v-model="startDate" :style="{ width: '100%' }" :enable-time="false" class="form-control" placeholder="Start Date" />
      </div>
      <div class="col-md-2 col-sm-3 mb-2 mb-md-0">
        <VueDatePicker v-model="endDate" :style="{ width: '100%' }" :enable-time="false" class="form-control" placeholder="End Date" />
      </div>
      <div class="col-md-1 col-sm-2 mb-2 mb-md-0">
        <button @click="searchByDateRange" class="btn btn-primary w-100">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
      <div class="col-md-1 col-sm-2 mb-2 mb-md-0">
        <button @click="refreshPage" class="btn btn-secondary w-100">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
      <div class="col-md-2 col-sm-2">
        <button type="button" class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#exampleModal" @click="addClick">
          Add New
        </button>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-lg-6 col-md-12 mb-4">
        <BarChartFactCheck :data="sourceCounts" />
      </div>
      <div class="col-lg-6 col-md-12 mb-4">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Source</th>
              <th>သတင်းအမှား</th>
              <th>တစ်ဝက် မှား/မှန်</th>
              <th>သတင်းအမှန်</th>
              <th>စုစုပေါင်း</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(summary, source) in sourceCounts" :key="source">
              <td>{{ source }}</td>
              <td>{{ summary.false_news }}</td>
              <td>{{ summary.half_news }}</td>
              <td>{{ summary.true_news }}</td>
              <td class="table-primary">{{ summary.total }}</td>
            </tr>
            <tr>
              <td></td>
              <td class="table-secondary">{{ counts.false_news }}</td>
              <td class="table-secondary">{{ counts.half_news }}</td>
              <td class="table-secondary">{{ counts.true_news }}</td>
              <td class="table-danger">{{ totalSum }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 col-md-12 mb-4">
        <div class="header-container alert alert-success d-flex justify-content-between align-items-center">
          <h3 class="header-title m-0">Fact Check News</h3>
          <span class="notification">
            <i class="fa-regular fa-bell"></i>
            <span class="icon-button__badge">{{ factChecks.length }}</span>
          </span>
        </div>
        <div class="table-responsive">
          <table class="table table-bordered mt-4">
            <thead>
              <tr>
                <th scope="col">စဉ်</th>
                <th scope="col">ရက်စွဲ</th>
                <th scope="col">Source</th>
                <th scope="col">သတင်းခေါင်းစဉ်</th>
                <th scope="col">သတင်းအမှား</th>
                <th scope="col">တစ်ဝက် မှား/မှန်</th>
                <th scope="col">သတင်းအမှန်</th>
                <th scope="col">မှတ်ချက်</th>
                <th scope="col">Photos</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(fact, index) in factChecks" :key="fact.id">
                <td>{{ index + 1 }}</td>
                <td>{{ fact.date }}</td>
                <td style="text-align:left">{{ fact.source }}</td>
                <td style="text-align:left">{{ fact.description }}</td>
                <td>{{ fact.false_news ? '✔' : '' }}</td>
                <td>{{ fact.half_news ? '✔' : '' }}</td>
                <td>{{ fact.true_news ? '✔' : '' }}</td>
                <td>{{ fact.note }}</td>
                <td>
                  <div v-for="photo in fact.photos" :key="photo.id">
                    <img :src="photo.photo" alt="Fact Check Photo" class="img-thumbnail" @click="openModal(photo.photo)" />
                  </div>
                </td>
                <td>
                  <div class="d-flex">
                    <button class="btn btn-warning btn-sm me-2" @click="editBtn(fact)">
                      <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" @click="deleteBtn(fact.id)">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Modal v-if="isModalVisible" :isVisible="isModalVisible" :photoSrc="modalPhoto" @close="closeModal" />
    </div>
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="form-group">
                <label class="form-label float-left ml-2">ရက်စွဲ</label><br />
                <input type="date" v-model="currentfactCheck.date" class="form-control" id="date" required />
              </div>
              <div class="form-group">
                <input type="text" v-model="currentfactCheck.source" class="form-control" id="source" placeholder="Source" required />
              </div>
              <div class="form-group">
                <textarea v-model="currentfactCheck.description" class="form-control" id="description" placeholder="သတင်းအကြောင်းအရာ" required></textarea>
              </div>
              <div class="form-row">
                <div class="form-check form-group col-md-4 col-sm-4">
                  <input type="checkbox" v-model="currentfactCheck.false_news" class="form-check-input" id="false_news" />
                  <label for="false_news" class="form-check-label ml-1">&#10007;</label>
                </div>
                <div class="form-check form-group col-md-4 col-sm-4">
                  <input type="checkbox" v-model="currentfactCheck.half_news" class="form-check-input" id="half_news" />
                  <label for="half_news" class="form-check-label ml-2">&#10004; &#10007;</label>
                </div>
                <div class="form-check form-group col-md-4 col-sm-4 mb-3">
                  <input type="checkbox" v-model="currentfactCheck.true_news" class="form-check-input" id="true_news" />
                  <label for="true_news" class="form-check-label ml-2">&#10004;</label>
                </div>
              </div>
              <div class="form-group">
                <textarea v-model="currentfactCheck.note" class="form-control" id="note" placeholder="Note"></textarea>
              </div>
              <div class="form-group">
                <label for="photos" class="form-label float-left ml-2">Upload Photos</label>
                <input type="file" class="form-control" id="photos" @change="onFileChange" multiple />
              </div>
              <button type="submit" class="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import BarChartFactCheck from './BarChartFactCheck.vue';
import Modal from './Modal.vue';
import { Modal as BootstrapModal } from 'bootstrap';
import api from './api';

export default {
  components: {
    VueDatePicker,
    Modal,
    BarChartFactCheck,
  },
  data() {
    return {
      factChecks: [],
      startDate: null,
      endDate: null,
      counts: {
        false_news: 0,
        half_news: 0,
        true_news: 0,
      },
      sourceCounts: {},
      totalSum: 0,
      currentfactCheck: {
        id: null,
        date: '',
        source: '',
        description: '',
        false_news: false,
        half_news: false,
        true_news: false,
        note: '',
        photos: [], 
      },
      photos: [],
      modalTitle: '',
      isModalVisible: false,
      modalPhoto: '',
    };
  },
  created() {
    this.fetchFactChecks();
  },
  methods: {
    async fetchFactChecks(startDate = null, endDate = null) {
      let url = `${api.API_URL}api/fact_check/`;
      if (startDate && endDate) {
        url += `?start_date=${startDate}&end_date=${endDate}`;
      }

      const response = await axios.get(url);
      this.factChecks = response.data;
      this.factChecks.sort((a, b) => new Date(b.date) - new Date(a.date));
      this.counts = {
        false_news: 0,
        half_news: 0,
        true_news: 0,
      };
      this.sourceCounts = {};

      this.factChecks.forEach((fact) => {
        if (fact.false_news) this.counts.false_news++;
        if (fact.half_news) this.counts.half_news++;
        if (fact.true_news) this.counts.true_news++;

        if (!this.sourceCounts[fact.source]) {
          this.sourceCounts[fact.source] = {
            false_news: 0,
            half_news: 0,
            true_news: 0,
            total: 0,
          };
        }
        if (fact.false_news) this.sourceCounts[fact.source].false_news++;
        if (fact.half_news) this.sourceCounts[fact.source].half_news++;
        if (fact.true_news) this.sourceCounts[fact.source].true_news++;
        this.sourceCounts[fact.source].total++;
      });

      this.totalSum = this.counts.false_news + this.counts.half_news + this.counts.true_news;
    },
    async searchByDateRange() {
      if (this.startDate && this.endDate) {
        const startDateStr = this.startDate.toISOString().split('T')[0];
        const endDateStr = this.endDate.toISOString().split('T')[0];
        await this.fetchFactChecks(startDateStr, endDateStr);
      } else {
        await this.fetchFactChecks();
      }
    },
    async deleteBtn(id) {
      if (confirm('Are you sure you want to delete this fact_check?')) {
        await axios.delete(`${api.API_URL}api/fact_check/${id}/`);
        this.fetchFactChecks();
      }
    },
    addClick() {
      this.modalTitle = 'Add New FactCheck';
      this.currentfactCheck = {
        id: null,
        date: '',
        source: '',
        description: '',
        false_news: false,
        half_news: false,
        true_news: false,
        note: '',
        photos: [], 
      };
    },
    editBtn(fact) {
      this.modalTitle = 'Edit FactCheck';
      this.currentfactCheck = { ...fact }; 
      const modalElement = document.getElementById('exampleModal');
      const modal = new BootstrapModal(modalElement); 
      modal.show();
    },
    async submitForm() {
      const formData = new FormData();
      formData.append('date', this.currentfactCheck.date);
      formData.append('source', this.currentfactCheck.source);
      formData.append('description', this.currentfactCheck.description);
      formData.append('false_news', this.currentfactCheck.false_news);
      formData.append('half_news', this.currentfactCheck.half_news);
      formData.append('true_news', this.currentfactCheck.true_news);
      formData.append('note', this.currentfactCheck.note);
      // Append photos
      this.currentfactCheck.photos.forEach(photo => {
        formData.append('photos', photo);
      });
      let method = 'post';
      let url = `${api.API_URL}api/fact_check/`;
      if (this.currentfactCheck.id) {
        method = 'patch';
        url += `${this.currentfactCheck.id}/`;
      }
      try {
        // Make the request
        await axios({
          method: method,
          url: url,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Fetch updated fact checks after successful save/update
        await this.fetchFactChecks();
        
        // Close the modal
        const modalElement = document.getElementById('exampleModal');
        const modal = new BootstrapModal(modalElement);
        modal.hide();
      } catch (error) {
        console.error('Error saving fact check:', error);
      }
    },
    resetForm() {
      this.currentfactCheck = {
        id: null,
        date: '',
        source: '',
        description: '',
        false_news: false,
        half_news: false,
        true_news: false,
        note: '',
        photos: [], 
      };
      this.photos = [];
    },
    onFileChange(event) {
      const files = event.target.files;
      this.currentfactCheck.photos = []; // Reset photos array
      
      for (let i = 0; i < files.length; i++) {
        this.currentfactCheck.photos.push(files[i]);
       
      }
    },
    openModal(photoSrc) {
      this.modalPhoto = photoSrc;
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    refreshPage() {
      this.startDate = null;
      this.endDate = null;
      this.fetchFactChecks();
    },
  },
};
</script>

<style scoped>
.table-primary {
  background-color: #e3f2fd;
}
.table-secondary {
  background-color: #f8f9fa;
}
.table-danger {
  background-color: #f5c6cb;
}
.table-bordered td,
.table-bordered th {
  border: 1px solid #dee2e6;
}
.container-fluid {
  padding: 20px;
}
.form-container {
  margin-bottom: 20px;
}
.img-thumbnail {
  max-width: 100px;
  max-height: 100px;
  cursor: pointer;
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

