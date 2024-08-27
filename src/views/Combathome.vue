<template>
  <div class="info-home">
    <div class="container"
      :style="{ 
        backgroundImage: 'url(' + require('@/assets/CombatLogo.png') + ')', 
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '200px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }">  
    </div>
    <div class="container" id="next">
        <router-link to="/combatnews" class="btn btn-primary">နောက်စာမျက်နှာသို့သွားရန်</router-link>
    </div><br>
    <div class="container carousel slide" id="carouselDemo" data-bs-wrap="true" data-bs-ride="carousel" :style="{backgroundColor:'green'} " >
      <div class="carousel-inner">
        <div 
          class="carousel-item" 
          v-for="(news, index) in filteredNews" 
          :key="news.id"
          :class="{ active: index === 0 }"
          @click="openModal(news)">
          <img :src="news.file" :alt="'Slide ' + index">
          <div class="carousel-caption">
            <p>{{ news.note }}</p>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselDemo" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselDemo" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
      </button>
      <div class="carousel-indicators">
        <button 
          type="button" 
          v-for="(news, index) in filteredNews" 
          :key="index" 
          :class="{ active: index === 0 }"
          :data-bs-target="'#carouselDemo'"
          :data-bs-slide-to="index">
          <img :src="news.file" :alt="'Slide ' + index + ' Thumbnail'" />
        </button>
      </div>
    </div>
    <div class="container" id="news">
      <div class="newsItem" v-for="news in filteredNews" :key="news.id">
        <div class="newsImage">
          <img :src="news.file" alt="News Image" />
        </div>
        <div class="newsContent">
          <div class="info">
            <h5>{{ news.date }}</h5>
          </div>
          <h2>{{ news.note }}</h2>
          <a href="" @click.prevent="openModal(news)">Read More</a>
        </div>
      </div>
    </div> 
    <!-- Modal Structure -->
    <div class="modal fade" id="infosheetModal" tabindex="-1" aria-labelledby="infosheetModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="infosheetModalLabel">{{ selectedNews?.headtitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel"> 
              <div>
                <img :src="selectedNews?.file" class="d-block w-100 modal-image" alt="News Image" />
              </div> 
            </div>
            <p>{{ selectedNews?.note }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import api from './api';
import * as bootstrap from 'bootstrap';
export default {
  name: 'InfoHome',
  data() {
    return {
      newsData: [],
      selectedNews: null,
    };
  },
  computed: {
    filteredNews() {
      return this.newsData.filter(news =>
        news.file.match(/\.(jpeg|jpg|gif|png|svg)$/i)
	).slice(-5);
      
    }
  },
  created() {
    this.fetchNews();
  },
  methods: {
    async fetchNews() {
      try {
        const response = await axios.get(`${api.API_URL}api/combatfiles/`);
        this.newsData = response.data.sort((a, b) => b.id - a.id);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    },
    openModal(news) {
      this.selectedNews = news;
      const modal = new bootstrap.Modal(document.getElementById('infosheetModal'), {
        keyboard: true
      });
      modal.show();
    }
  }
};
</script>

<style scoped>
.info-home {
  padding: 40px 0;
  background-color: #f8f9fa;
  max-width: auto;
  display: block;
}

.carousel .carousel-inner{
  width: 400px;
  max-height: 400px;
  object-fit: cover;
  display: block;
  margin: 0 auto;
}

.carousel .carousel-item img {
  width: 100%;
  max-height: 100%;
  object-fit: cover;
  display: block;
  margin: 0 auto;
}

.carousel-caption {
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 10px;
}

#news {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}
#carouselDemo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}
#next {
  text-align: right;
}

#next .btn {
  width: auto; /* Reset the width if necessary */
  display: inline-block;
}
.newsItem {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
}

.newsItem:hover {
  transform: translateY(-5px);
}

.newsImage {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.newsImage img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
}

.newsImage img:hover {
  transform: scale(1.05);
}

.newsContent {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.newsContent .info {
  margin-bottom: 10px;
}

.newsContent .info h5 {
  margin: 0;
  font-weight: 400;
}

.newsContent h2 {
  font-size: 20px;
  color: #343a40;
  margin-top: 0;
  max-height: 44px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.newsContent p {
  color: #6c757d;
  margin: 10px 0 20px;
  font-size: 14px;
  max-height: 33px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.newsContent a {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.newsContent a:hover {
  background-color: #0056b3;
}

.carousel-indicators img {
  width: 70px;
  display: block;
  border: 2px solid #007bff;
  border-radius: 5px;
  transition: border 0.3s ease;
}

.carousel-indicators button {
  width: auto !important;
  height: auto !important;
  background: none;
  border: none;
}

.carousel-indicators button.active img {
  border-color: #0056b3;
}

.carousel-indicators {
  position: unset;
  margin-top: 10px;
}

/* Modal Image Styling */
.modal-image {
  max-width: 100%;
  max-height: 100%; /* Set the maximum height of the image */
  object-fit: cover; /* Ensure the image covers the area without distorting */
  margin: 0 auto; /* Center the image */
  display: block; /* Ensure the image is displayed as a block element */
}
</style>


