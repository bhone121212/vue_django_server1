<template>
  <div class="container-fluid">
    <div class="form-container mb-3 row">
      <div class="col-md-2">
        <VueDatePicker v-model="startDate" :style="{ width: '100%' }" :enable-time="false" class="form-control" placeholder="Start Date"/>
      </div>
      <div class="col-md-2">
        <VueDatePicker v-model="endDate" :style="{ width: '100%' }" :enable-time="false" class="form-control" placeholder="End Date"/>
      </div>
      <div class="col-md-2">
        <input v-model="keyword" type="text" class="form-control" placeholder="Keyword"/>
      </div>
      <div class="col-md-1  ">
        <button @click="searchByDateRange" class="btn btn-primary w-100"><i class="fa-solid fa-magnifying-glass"></i></button>
      </div>
      <div class="col-md-1">
        <button @click="refreshPage" class="btn btn-secondary">
          <i class="fas fa-sync-alt"></i> 
        </button>
      </div>
      <div class="col-md-2 col-sm-2">
        <button type="button" class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#exampleModal" @click="addClick">
          သတင်းအသစ်ထည့်ရန်
        </button>
      </div>
      <div class="col-md-2 ml-auto">
        <router-link to="/fileupload" class="btn btn-primary w-100">ဖိုင်များ</router-link>
      </div>
    </div>
    <div class="row">
  <!-- Combat News Table -->
  <div class="col-lg-12 col-md-12 mb-4">
    <div class="header-container alert alert-success">
      <h3 class="header-title">Combat News</h3>
      <span class="notification">
        <i class="fa-regular fa-bell"></i>
        <span class="icon-button__badge">{{ infosheets.length }}</span> 
      </span>
    </div>
    <div class="table-responsive">
      <table class="table table-bordered table-striped table-hover mt-4">
        <thead class="thead-dark">
          <tr>
            <th scope="col">စဉ်</th>
            <th scope="col">ရက်စွဲ</th>
            <th scope="col">သတင်းခေါင်းစဉ်</th>
            <th scope="col">မြို့နယ်</th>
            <th scope="col">တိုင်းစစ်ဌာနချုပ်</th>
            <th scope="col">သေ</th>
            <th scope="col">ရှင်</th>
            <th scope="col">အလင်းဝင်</th>
            <th scope="col">လက်နက်ငယ်</th>
            <th scope="col">လက်နက်ကြီး</th>
            <th scope="col">ကျည်မျိုးစုံ</th>
            <th scope="col">ဗုံးသီး</th>
            <th scope="col">မိုင်း</th>
            <th scope="col">ဆက်စပ်ပစ္စည်း</th>
            <th scope="col">ဓာတ်ပုံများ</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(info, index) in infosheets" :key="info.id">
            <td>{{ index + 1 }}</td>
            <td>{{ info.date }}</td>
            <td class="text-left">{{ info.description }}</td>
            <td>{{ info.township }}</td>
            <td>{{ info.headq }}</td>
            <td>{{ info.dead }}</td>
            <td>{{ info.live }}</td>
            <td>{{ info.alinn }}</td>
            <td>{{ info.small }}</td>
            <td>{{ info.big }}</td>
            <td>{{ info.bullet }}</td>
            <td>{{ info.bomb }}</td>
            <td>{{ info.mine }}</td>
            <td>{{ info.accessory }}</td>
            <td>
              <div v-for="photo in info.photos" :key="photo.id">
                    <img :src="photo.photo" alt="Combat Photo" class="img-thumbnail" @click="openModal(photo.photo)" />
                  </div>
              <!-- <img :src="info.photo" alt="Info Photo" class="img-thumbnail" width="100" @click="openModal(info.photo)" /> -->
            </td>
            <td>
                  <div class="d-flex">
                    <button class="btn btn-warning btn-sm me-2" @click="editBtn(info)">
                      <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" @click="deleteBtn(info.id)">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Modal v-if="isModalVisible" :isVisible="isModalVisible" :photoSrc="modalPhoto" @close="closeModal"/>
  </div>
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addCombatnews" enctype="multipart/form-data">
              <div class="form-group">
                <label class="form-label float-left ml-2">ရက်စွဲ</label><br />
                <input type="date" v-model="newCombatnews.date" class="form-control" id="date" required />
              </div>
              <div class="form-group">
                <textarea v-model="newCombatnews.description" class="form-control" name="" id="" placeholder="အကြောင်းအရာ" required></textarea>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <input v-model="newCombatnews.township" type="text" class="form-control" placeholder="မြို့နယ်" />
                </div>
                <div class="form-group col-md-6">
                  <input v-model="newCombatnews.headq" type="text" class="form-control" placeholder="တိုင်းစစ်ဌာနချုပ်" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-4">
                  <label for="dead" class="form-label">သေ</label>
                  <input v-model="newCombatnews.dead" type="number" class="form-control" placeholder="Dead" />
                </div>
                <div class="form-group col-md-4">
                  <label for="live" class="form-label">ရှင်</label>
                  <input v-model="newCombatnews.live" type="number" class="form-control" placeholder="Live" />
                </div>
                <div class="form-group col-md-4">
                  <label for="alinn" class="form-label">အလင်းဝင်</label>
                  <input v-model="newCombatnews.alinn" type="number" class="form-control" placeholder="Alinn" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-4">
                  <label for="small" class="form-label">လက်နက်ငယ်</label>
                  <input v-model="newCombatnews.small" type="number" class="form-control" placeholder="Small Weapons" />
                </div>
                <div class="form-group col-md-4">
                  <label for="big" class="form-label">လက်နက်ကြီး</label>
                  <input v-model="newCombatnews.big" type="number" class="form-control" placeholder="Big Weapons" />
                </div>
                <div class="form-group col-md-4">
                  <label for="bullet" class="form-label">ကျည်မျိုးစုံ</label>
                  <input v-model="newCombatnews.bullet" type="number" class="form-control" placeholder="Bullets" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-4">
                  <label for="bomb" class="form-label">ဗုံးသီး</label>
                  <input v-model="newCombatnews.bomb" type="number" class="form-control" placeholder="Bombs" />
                </div>
                <div class="form-group col-md-4">
                  <label for="mine" class="form-label">မိုင်း</label>
                  <input v-model="newCombatnews.mine" type="number" class="form-control" placeholder="Mines" />
                </div>
                <div class="form-group col-md-4">
                  <label for="accessory" class="form-label">ဆက်စပ်ပစ္စည်း</label>
                  <input v-model="newCombatnews.accessory" type="text" class="form-control" placeholder="Accessories" />
                </div>
              </div>
              <div class="form-group">
                <label for="photos" class="form-label float-left ml-2">Upload Photos</label>
                <input type="file" class="form-control" id="photos" @change="onFileChange" multiple />
              </div>
              <button type="submit" class="btn btn-primary btn-block">Submit</button>
            </form>
            <!-- Upload Excel File -->
            <!-- Upload Excel File -->
            <div class="form-group mt-4">
              <h4 class="alert alert-info text-center">Upload Excel File</h4>
              <input type="file" class="form-control-file" @change="onFileChange($event)" />
              <button class="btn btn-primary btn-block mt-2" @click="uploadFile">Upload</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Upload Excel File -->
            <div class="form-group mt-4">
              <h4 class="alert alert-info text-center">ဖိုင်များသိမ်းဆည်းရန်</h4>
              <input type="file" class="form-control-file" @change="onFileChange($event)" />
              <button class="btn btn-primary btn-block mt-2" @click="uploadFile">Upload</button>
            </div>
          </div>
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
import * as XLSX from 'xlsx';
import Modal from './Modal.vue';
import { Modal as BootstrapModal } from 'bootstrap';
import api from './api';

export default {
  components: {
    VueDatePicker,
    Modal
  },
  data() {
    return {
      infosheets: [],
      startDate: null,
      endDate: null,
      keyword: '',
      photos: [],
      modalTitle: '',
      isModalVisible: false,
      modalPhoto: '',
      newCombatnews: {
        date: null,
        description: '',
        township: '',
        headq: '',
        dead: 0,
        live: 0,
        alinn: 0,
        small: 0,
        big: 0,
        bullet: 0,
        bomb: 0,
        mine: 0,
        accessory: 0,
        photos: [],
      },
      xlsxFile: null,
      searchClicked: false  // Track if search button has been clicked
    };
  },
  created() {
    this.fetchInfosheets();
  },
  methods: {
    async fetchInfosheets(startDate = null, endDate = null, keyword = null) {
      let url = `${api.API_URL}api/combat_news/`;
      const params = new URLSearchParams();

      if (startDate) {
        params.append('start_date', startDate);
      }
      if (endDate) {
        params.append('end_date', endDate);
      }
      if (keyword) {
        params.append('keyword', keyword);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      try {
        const response = await axios.get(url);
        this.infosheets = response.data;
        this.infosheets.sort((a, b) => new Date(b.id) - new Date(a.id));
        // this.searchClicked = true; 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    searchByDateRange() {
      const startDateFormat = this.startDate ? this.startDate.toISOString().split('T')[0] : null;
      const endDateFormat = this.endDate ? this.endDate.toISOString().split('T')[0] : null;
      this.fetchInfosheets(startDateFormat, endDateFormat, this.keyword);
    }, 
    async deleteBtn(id) {
      if (confirm('Are you sure you want to delete this combat_news?')) {
        await axios.delete(`${api.API_URL}api/combat_news/${id}/`);
        this.fetchInfosheets();
      }
    },
    addClick() {
      this.modalTitle = 'Add New combat_news';
      this.newCombatnews = {
        id: null,
        date: '',
        description: '',
        township: '',
        headq: '',
        dead: 0,
        live: 0,
        alinn: 0,
        small: 0,
        big: 0,
        bullet: 0,
        bomb: 0,
        mine: 0,
        accessory: 0,
        photos: [],
      };
    },
    editBtn(info) {
      this.modalTitle = 'Edit combat_news';
      this.newCombatnews = { ...info }; 
      const modalElement = document.getElementById('exampleModal');
      const modal = new BootstrapModal(modalElement); 
      modal.show();
    },
    async addCombatnews() {
      const formData = new FormData();
      formData.append('date', this.newCombatnews.date);
      formData.append('description', this.newCombatnews.description);
      formData.append('township', this.newCombatnews.township);
      formData.append('headq', this.newCombatnews.headq);
      formData.append('dead', this.newCombatnews.dead);
      formData.append('live', this.newCombatnews.live);
      formData.append('alinn', this.newCombatnews.alinn);
      formData.append('small', this.newCombatnews.small);
      formData.append('big', this.newCombatnews.big);
      formData.append('bullet', this.newCombatnews.bullet);
      formData.append('bomb', this.newCombatnews.bomb);
      formData.append('mine', this.newCombatnews.mine);
      formData.append('accessory', this.newCombatnews.accessory);
      // Append photos
      this.newCombatnews.photos.forEach(photo => {
        formData.append('photos', photo);
      });
      let method = 'post';
      let url = `${api.API_URL}api/combat_news/`;
      if (this.newCombatnews.id) {
        method = 'patch';
        url += `${this.newCombatnews.id}/`;
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
        await this.fetchInfosheets();
        
        // Close the modal
        const modalElement = document.getElementById('exampleModal');
        const modal = new BootstrapModal(modalElement);
        modal.hide();
      } catch (error) {
        console.error('Error saving combat_news:', error);
      }
    },
    resetForm() {
      this.newCombatnews = {
        id: null,
        date: '',
        description: '',
        township: '',
        headq: '',
        dead: 0,
        live: 0,
        alinn: 0,
        small: 0,
        big: 0,
        bullet: 0,
        bomb: 0,
        mine: 0,
        accessory: 0,
        photos: [],
      };
      this.photos = [];
    },
    onFileChange(event) {
      const files = event.target.files;
      this.newCombatnews.photos = []; // Reset photos array
      this.xlsxFile = event.target.files[0];
      for (let i = 0; i < files.length; i++) {
        this.newCombatnews.photos.push(files[i]);
       
      }
    },
    openModal(photoSrc) {
      this.modalPhoto = photoSrc;
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    async refreshPage() {
      this.startDate = null;
      this.endDate = null;
      this.keyword = '';
      await this.fetchInfosheets();
    },
    // refreshPage() {
    //   this.startDate = null;
    //   this.endDate = null;
    //   this.keyword = '';
    //   this.infosheets = [];
    //   this.searchClicked = false; 
    // },
    uploadFile() {
    if (!this.xlsxFile) {
        alert("Please select a file first.");
        return;
    }

    let reader = new FileReader();
    reader.onload = async (e) => {
        try {
            let data = new Uint8Array(e.target.result);
            let workbook = XLSX.read(data, { type: 'array' });
            let firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            let excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            let combatNews = excelData.slice(1).map(row => ({
                date: this.formatDate(row[0]),
                description: row[1],
                township: row[2],
                headq: row[3],
                dead: parseInt(row[4]) || 0,
                live: parseInt(row[5]) || 0,
                alinn: parseInt(row[6]) || 0,
                small: parseInt(row[7]) || 0,
                big: parseInt(row[8]) || 0,
                bullet: parseInt(row[9]) || 0,
                bomb: parseInt(row[10]) || 0,
                mine: parseInt(row[11]) || 0,
                accessory: row[12] || 0,
            }));
            const response = await axios.post(`${api.API_URL}api/bulk-upload/`, combatNews);
            console.log(response.data);
            this.fetchInfosheets(); // Refresh the combat news list after upload
            alert("Upload successful!");
        } catch (error) {
            console.error("There was an error uploading the file!", error);
            alert("There was an error uploading the file. Please check the console for details.");
        }
    };
    reader.onerror = (error) => {
        console.error("There was an error reading the file!", error);
        alert("There was an error reading the file. Please check the console for details.");
    };
    reader.readAsArrayBuffer(this.xlsxFile);
},

    formatDate(dateStr) {
        const parts = dateStr.split('.');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        return dateStr; // return original if the format is unexpected
    }
  },
  computed: {
    summaryByHeadq() {
      return this.infosheets.reduce((acc, info) => {
        if (!acc[info.headq]) {
          acc[info.headq] = {
            dead: 0,
            live: 0,
            alinn: 0,
            small: 0,
            big: 0,
            bullet: 0,
            bomb: 0,
            mine: 0,
            accessory: 0
          };
        }
        acc[info.headq].dead += info.dead;
        acc[info.headq].live += info.live;
        acc[info.headq].alinn += info.alinn;
        acc[info.headq].small += info.small;
        acc[info.headq].big += info.big;
        acc[info.headq].bullet += info.bullet;
        acc[info.headq].bomb += info.bomb;
        acc[info.headq].mine += info.mine;
        acc[info.headq].accessory += info.accessory;
        return acc;
      }, {});
    },
    summary() {
      return this.infosheets.reduce((acc, info) => {
        acc.dead += info.dead;
        acc.live += info.live;
        acc.alinn += info.alinn;
        acc.small += info.small;
        acc.big += info.big;
        acc.bullet += info.bullet;
        acc.bomb += info.bomb;
        acc.mine += info.mine;
        acc.accessory += info.accessory;
        return acc;
      }, {
        dead: 0,
        live: 0,
        alinn: 0,
        small: 0,
        big: 0,
        bullet: 0,
        bomb: 0,
        mine: 0,
        accessory: 0
      });
    }
  },
};
</script>

<style scoped>
.container-fluid {
  background-color: #f9f9f9;
  padding: 30px;
}

.table {
  margin-top: 20px;
}

.alert-info {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}
</style>

