<template>
  <div class="container-fluid">
    <div class="row">
      <h3 class="alert alert-info">{{ subcategoryName }} နှင့်ဆိုင်သောသတင်းများ</h3>
      <div class="container row" id="news">
        <div class="newsItem" v-for="news in newsItems" :key="news.id">
          <div class="newsImage">
            <img :src="news.photos[0]?.photo" alt="News Image">
          </div>
          <div class="newsContent">
            <div class="info">
              <h5>{{ news.newsdate }}</h5>
            </div>
            <h2>{{ news.headtitle }}</h2>
            <!-- <p>{{ news.summary }}</p> -->
            <a href="" @click.prevent="openModal(news)">Read More</a>
          </div>
        </div>
      </div>
      <!-- Modal -->
      <div class="modal fade" id="infosheetModal" tabindex="-1" aria-labelledby="infosheetModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="infosheetModalLabel">{{ selectedNews?.headtitle }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div v-if="selectedNews">
                <img :src="selectedNews.photos[0]?.photo" alt="Infosheet Image" class="img-fluid mb-3">
                <p><strong>Date:</strong> {{ selectedNews.newsdate }}</p>
                <!-- <p>{{ selectedNews.headtitle }}</p> -->
                <p align="justify">{{ selectedNews.description }}</p>
                <!-- <p><strong>Summary:</strong> {{ selectedNews.summary }}</p> -->
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

    </div>
    <Modal v-if="isModalVisible" :isVisible="isModalVisible" :photoSrc="modalPhoto" @close="closeModal"/>
  </div>
</template>
  
  <script>
  import axios from 'axios';
  import Modal from './Modal.vue';
  import api from './api';
  import * as bootstrap from 'bootstrap';
  export default {
    components: {
      Modal
    },
    name: 'CategoryNews',
    data() {
      return {
        subcategoryName: '',
        newsItems: [],
        isModalVisible: false,
        modalPhoto: '',
        selectedNews: null,
      };
    },
    watch: {
      $route: {
        immediate: true,
        handler() {
          this.fetchNews();
        }
      }
    },
    methods: {
        openModal(news) {
        this.selectedNews = news;
        const modal = new bootstrap.Modal(document.getElementById('infosheetModal'), {
          keyboard: true
        });
        modal.show();
      },
      closeModal() {
        this.isModalVisible = false;
      },
      async fetchNews() {
        const subcategoryId = this.$route.params.category;
        try {
          const subCategoryResponse = await axios.get(`${api.API_URL}api/subcategory/${subcategoryId}/`);
          this.subcategoryName = subCategoryResponse.data.name;
  
          const newsResponse = await axios.get(`${api.API_URL}api/infosheet/?subcategory=${subcategoryId}`);
          this.newsItems = newsResponse.data.sort((a, b) => b.id - a.id);
        } catch (error) {
          console.error('Error fetching news:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .container-fluid {
    background-color: #f9f9f9;
    padding: 30px;
  }
  
  .alert-info {
    margin-bottom: 20px;
  }
  
  .table {
    margin-top: 20px;
  }
  
  .table-responsive {
    overflow-x: auto;
  }
  
  .table-bordered {
    border: 1px solid #dee2e6;
  }
  
  .table-hover tbody tr:hover {
    background-color: #f5f5f5;
  }
  
  .table thead th {
    vertical-align: middle;
    text-align: center;
  }
  
  .table tbody td {
    vertical-align: middle;
  }
  .newsItem {
  display: flex;
  align-items: center;
  margin-top: 40px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 20px;
}
.newsImage {
  flex: 1;
  max-width: 300px;
}

.newsImage img {
  max-width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
}
.newsContent {
  flex: 2;
  margin-left: 20px;
}

.newsContent .info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #888;
  margin-bottom: 12px;
}

.newsContent .info h5 {
  margin: 0;
  font-weight: 400;
}

.newsContent h2 {
  font-size: 18px;
  color: #444;
  margin-top: 0;
  max-height: 44px;
  overflow: hidden;
}

.newsContent p {
  color: #777;
  margin: 10px 0 20px;
  font-size: 14px;
  max-height: 33px;
  overflow: hidden;
}

.newsContent a {
  background-color: #000;
  color: #fff;
  padding: 8px 14px;
  font-size: 13px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
}
  </style>
  
