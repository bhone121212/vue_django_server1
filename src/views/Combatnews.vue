  <template>
    <div class="container-fluid">
      <h4 class="alert alert-success">တိုင်းစစ်ဌာနချုပ်အလိုက် အကျိုးအမြတ်ရရှိမှုများ</h4>
      <div class="form-container mb-3 row">
        <div class="col-md-2">
          <VueDatePicker v-model="startDate" :style="{ width: '100%' }" :enable-time="false" class="form-control" placeholder="Start Date"/>
        </div>
        <div class="col-md-2">
          <VueDatePicker v-model="endDate" :style="{ width: '100%' }" :enable-time="false" class="form-control" placeholder="End Date"/>
        </div>
        <div class="col-md-1">
          <button @click="searchByDateRange" class="btn btn-primary w-100"><i class="fa-solid fa-magnifying-glass"></i></button>
        </div>
        <div class="col-md-1">
          <button @click="refreshPage" class="btn btn-secondary"><i class="fas fa-sync-alt"></i> </button>
        </div>
        <div class="col-md-2 ml-auto">
          <router-link to="/combatnewsadd" class="btn btn-primary w-100">သတင်းများထည့်ရန်</router-link>
        </div>
      </div> 
      <div class="data-display">
        <div class="row mt-4">
          <div class="col-md-12">
            <BarChart :data="summaryByHeadq" />
          </div>  
        </div>
        <div class="row mt-4">
          <div class="col-md-12">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th style="background-color:#599e81">တိုင်း</th>
                  <th style="background-color:#599e81">သေ</th>
                  <th style="background-color:#599e81">ရှင်</th>
                  <th style="background-color:#599e81">အလင်းဝင်</th>
                  <th style="background-color:#599e81">လက်နက်ငယ်</th>
                  <th style="background-color:#599e81">လက်နက်ကြီး</th>
                  <th style="background-color:#599e81">ကျည်မျိုးစုံ</th>
                  <th style="background-color:#599e81">ဗုံးသီး</th>
                  <th style="background-color:#599e81">မိုင်း</th>
                  <th style="background-color:#599e81">ဆက်စပ်</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, headq) in summaryByHeadq" :key="headq">
                  <td style="background-color:#459c25">{{ headq }}</td>
                  <td>{{ data.dead }}</td>
                  <td>{{ data.live }}</td>
                  <td>{{ data.alinn }}</td>
                  <td>{{ data.small }}</td>
                  <td>{{ data.big }}</td>
                  <td>{{ data.bullet }}</td>
                  <td>{{ data.bomb }}</td>
                  <td>{{ data.mine }}</td>
                  <td>{{ data.accessory }}</td>
                </tr>
                <tr>
                  <td style="background-color:#599e81">စုစုပေါင်း</td>
                  <td style="background-color:#599e81">{{ summary.dead }}</td>
                  <td style="background-color:#599e81">{{ summary.live }}</td>
                  <td style="background-color:#599e81">{{ summary.alinn }}</td>
                  <td style="background-color:#599e81">{{ summary.small }}</td>
                  <td style="background-color:#599e81">{{ summary.big }}</td>
                  <td style="background-color:#599e81">{{ summary.bullet }}</td>
                  <td style="background-color:#599e81">{{ summary.bomb }}</td>
                  <td style="background-color:#599e81">{{ summary.mine }}</td>
                  <td style="background-color:#599e81">{{ summary.accessory }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
              </td>
              <td>
                <!-- Add action buttons or links here -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Modal v-if="isModalVisible" :isVisible="isModalVisible" :photoSrc="modalPhoto" @close="closeModal"/>
    </div>
  </template>

  <script>
  import axios from 'axios';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import BarChart from './BarChart.vue';
  import api from './api';
  import Modal from './Modal.vue';
  export default {
    components: {
      VueDatePicker,
      BarChart,
      Modal
    },
    data() {
      return {
        startDate: '',
        endDate: '',
        summaryByHeadq: {},
        isModalVisible: false,
        modalPhoto: '',
        summary: {
          dead: 0,
          live: 0,
          alinn: 0,
          small: 0,
          big: 0,
          bullet: 0,
          bomb: 0,
          mine: 0,
          accessory: 0
        },
        infosheets: [],
        searchClicked: false
      };
    },
    computed: {
      startDateFormat() {
        return this.startDate ? this.startDate.toISOString().split('T')[0] : '';
      },
      endDateFormat() {
        return this.endDate ? this.endDate.toISOString().split('T')[0] : '';
      }
    },
    methods: {
      async fetchData(startDate = null, endDate = null) {
        try {
          const response = await axios.get(`${api.API_URL}api/combat_news/`, {
            params: {
              start_date: startDate,
              end_date: endDate
            }
          });

          const data = response.data;

          // Reset summaries
          this.summaryByHeadq = {};
          this.infosheets = data; // Set the fetched data to infosheets

          this.resetSummary();

          data.forEach(item => {
            const headq = item.headq;
            if (!this.summaryByHeadq[headq]) {
              this.summaryByHeadq[headq] = {
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

            this.summaryByHeadq[headq].dead += item.dead;
            this.summaryByHeadq[headq].live += item.live;
            this.summaryByHeadq[headq].alinn += item.alinn;
            this.summaryByHeadq[headq].small += item.small;
            this.summaryByHeadq[headq].big += item.big;
            this.summaryByHeadq[headq].bullet += item.bullet;
            this.summaryByHeadq[headq].bomb += item.bomb;
            this.summaryByHeadq[headq].mine += item.mine;
            this.summaryByHeadq[headq].accessory += item.accessory;

            // Update overall summary
            this.summary.dead += item.dead;
            this.summary.live += item.live;
            this.summary.alinn += item.alinn;
            this.summary.small += item.small;
            this.summary.big += item.big;
            this.summary.bullet += item.bullet;
            this.summary.bomb += item.bomb;
            this.summary.mine += item.mine;
            this.summary.accessory += item.accessory;
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
      resetSummary() {
        this.summary = {
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
      },
      searchByDateRange() {
        this.searchClicked = true;
        if (this.startDateFormat && this.endDateFormat) {
          this.fetchData(this.startDateFormat, this.endDateFormat);
        } else {
          this.fetchData();
        }
      },
      refreshPage() {
        this.startDate = '';
        this.endDate = '';
        this.searchClicked = false;
        this.fetchData();
      },
      openModal(photoSrc) {
        this.modalPhoto = photoSrc;
        this.isModalVisible = true;
      },
      closeModal() {
        this.isModalVisible = false;
      },
    },
    mounted() {
      this.fetchData();
    }
  };
  </script>

  <style scoped>
  .img-thumbnail {
    max-width: 100px;
    margin: 5px;
  }
  .table-responsive {
    margin-top: 20px;
  }
  </style>

