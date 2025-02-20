<template>
  <div class="info-home">
    <div
      class="container"
      :style="{
        backgroundImage: 'url(' + require('@/assets/logo1.png') + ')',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '200px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }"
    ></div>
    <div class="container" id="news">
      <div class="newsItem" v-for="(news, index) in newsItems" :key="index">
        <div class="newsImage">
          <img :src="news.image" alt="" />
        </div>
        <div class="newsContent">
          <div class="info">
            <h5>{{ news.title }}</h5>
          </div>
          <h2>{{ news.content }}</h2>
          <router-link :to="news.link" class="btn btn-primary"
            >အသေးစိတ် ဒီမှာ နှိပ်ပြီး ကြည့်ရှုရန်</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newsItems: [
        {
          image: require("@/assets/combat.jpg"),
          title: "",
          content: "Welcome from Combat News Page",
          link: "/combathome",
        },
        {
          image: require("@/assets/factckeck.jpg"),
          title: "",
          content: "Welcome from Fact Check Page",
          link: "/factcheck",
        },
        {
          image: require("@/assets/infosheet.png"),
          title: "",
          content: "Welcome from Information Sheet Page",
          link: "/infohome",
        },
      ],
    };
  },
};
</script>

<style scoped>
.info-home {
  padding: 40px 0;
  background-color: #f8f9fa;
  max-width: auto;
  display: block;
}

#news {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
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
  height: 100%;
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
</style>
