<template>
  <div class="container" :class="[ color, {
      blink: blink
    } ]">
    <h4>{{ config.name }}</h4>
    <img class="weather" :class="[ weather ]" />
    <span class="date">{{ timeSince }}</span>
  </div>
</template>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 15px 0;
    box-sizing: border-box;
  }

  h4 {
    margin: 0;
  }

  .weather {
    height: 3vw;
  }

  .weather.sunny { content: url('../assets/weather/sunny.svg'); }
  .weather.partially-sunny { content: url('../assets/weather/partially-sunny.svg'); }
  .weather.cloudy { content: url('../assets/weather/cloudy.svg'); }
  .weather.raining { content: url('../assets/weather/raining.svg'); }
  .weather.storm { content: url('../assets/weather/storm.svg'); }

  .blink {
    animation        : jenkins-blue-blink normal 2s infinite ease-in-out;
    -moz-animation   : jenkins-blue-blink normal 2s infinite ease-in-out;
    -webkit-animation: jenkins-blue-blink normal 2s infinite ease-in-out;
  }

  .blue { background-color: #8CC04F; }
  .yellow { background-color: #F6B44B; }
  .red { background-color: #D54C53; }
  .grey,
  .disabled,
  .aborted,
  .notbuilt { background-color: #A3A2A2; }

  .blue.blink { animation-name : blue-blink; }
  .yellow.blink { animation-name : yellow-blink; }
  .red.blink { animation-name : red-blink; }
  .grey.blink,
  .disabled.blink,
  .aborted.blink,
  .notbuilt.blink { animation-name : grey-blink; }

  @-webkit-keyframes blue-blink {
    0%   { background-color: #8CC04F; }
    33%  { background-color: #6A9B30; }
    66%  { background-color: #6A9B30; }
    100% { background-color: #8CC04F; }
  }

  @-webkit-keyframes yellow-blink {
    0%   { background-color: #F6B44B; }
    33%  { background-color: #D2912B; }
    66%  { background-color: #D2912B; }
    100% { background-color: #F6B44B; }
  }

  @-webkit-keyframes red-blink {
    0%   { background-color: #D54C53; }
    33%  { background-color: #A52930; }
    66%  { background-color: #A52930; }
    100% { background-color: #D54C53; }
  }

  @-webkit-keyframes grey-blink {
    0%   { background-color: #A3A2A2; }
    33%  { background-color: #666666; }
    66%  { background-color: #666666; }
    100% { background-color: #A3A2A2; }
  }
</style>

<script>
  import Vue from 'vue';
  import VueResource from 'vue-resource';

  Vue.use(VueResource);

  export default {

    props: {
      config: {
        host          : String,
        username      : String,
        apiToken      : String,
        job           : String,
        name          : String,
        updateInterval: Number
      }
    },

    data () {
      return {
        score: 0,
        date : new Date(),
        color: '',
        blink: false
      }
    },

    computed: {
      host () {
        return (this.config.host.endsWith('/')) ? this.config.host.substring(0, this.config.host.length - 1) : this.config.host;
      },
      url () {
        return `${this.host}/job/${this.config.job}/api/json`;
      },
      lastSuccessfulBuild () {
        return `${this.host}/job/${this.config.job}/lastSuccessfulBuild/console`
      },
      weather () {
        // Sunny
        if (this.score > 80) {
          return 'sunny';
        }

        // Partially Sunny
        if (this.score > 60 && this.score <= 80) {
          return 'partially-sunny';
        }

        // Cloudy
        if (this.score > 40 && this.score <= 60) {
          return 'cloudy';
        }

        // Raining
        if (this.score > 20 && this.score <= 40) {
          return 'raining';
        }

        // Storm
        if (this.score <= 20) {
          return 'storm';
        }
      },
      timeSince () {
        let seconds = Math.floor((new Date() - this.date) / 1000),
          interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
          return interval + ' years';
        }

        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
          return interval + ' months';
        }

        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
          return interval + ' days';
        }

        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
          return interval + ' hours';
        }

        interval = Math.floor(seconds / 60);
        if (interval > 1) {
          return interval + ' minutes';
        }

        return Math.floor(seconds) + ' seconds';
      },
      httpOptions () {
        if (this.config.username === undefined || this.config.username === undefined || this.config.username === '') {
          return {};
        }

        return {
          headers: {
            'Authorization': `Basic ${btoa(this.config.username + ':' + this.config.apiToken)}`
          }
        };
      }
    },

    created () {
      this.update();
      setInterval(this.update.bind(this), this.config.updateInterval);
    },

    methods: {

      update () {
        this.$http.get(this.url, this.httpOptions).then((data) => {
          const body = data.body;

          this.color = body.color.replace('_anime', '');
          this.blink = body.color.includes('anime');

          if (body.healthReport && body.healthReport.length > 0) {
            this.score = body.healthReport[0].score;
          }

          if (body.lastBuild !== undefined) {
            this.getBuild(body.lastBuild.url);
          }
        });
      },

      getBuild (url) {
        this.$http.get(`${url}api/json?pretty=true`, this.httpOptions).then((data) => {
          const body = data.body;

          this.date = new Date(body.timestamp);
        });
      }

    }

  }
</script>
