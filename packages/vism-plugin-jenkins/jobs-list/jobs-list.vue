<template>
  <div class="jobs">
    <div class="everything-is-ok" :hidden="jobs.length > 0">
      <h1 class="title">Jenkins ({{ config.jobs.length }} jobs)</h1>

      <img src="../assets/weather/sunny.svg" />
    </div>

    <a
      class="job specimen"
      :hidden="specimenHidden">
      <img class="weather sunny" />
      <h4>Specimen</h4>
      <span class="time-since">1d</span>
    </a>

    <a
      class="job"
      target="_blank"
      :href="job.url"
      :class="[ job.color, { blink: job.blink, hidden: hidden } ]"
      v-for="job in jobs">
      <img class="weather" :class="[ job.weather ]" />
      <h4>{{ job.name }}</h4>
      <span class="time-since">{{ job.timeSince }}</span>
    </a>
  </div>
</template>

<style scoped>
  ::-webkit-scrollbar {
    display: none;
  }

  [hidden] {
    display: none !important;
  }

  .everything-is-ok {
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .everything-is-ok > .title {
    margin: 0;
    text-transform: none;
    text-align: right;
  }

  .everything-is-ok > img {
    flex: 1;
  }

  .jobs {
    overflow: auto;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 8px;
    box-sizing: border-box;
  }

  .jobs .job {
    opacity: 1;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin: 0 0 8px;
    padding: 8px 10px;
    border-radius: 2px;
    text-decoration: none;
    transition: opacity 1s;
  }

  .jobs .job.hidden {
    opacity: 0;
  }

  .jobs .job:last-child {
    margin: 0;
  }

  .job.blue { background-color: #8CC04F; }
  .job.yellow { background-color: #F6B44B; }
  .job.yellow h4, .job.yellow .time-since { color: #333333; }
  .job.red { background-color: #D54C53; }
  .job.red h4, .job.red .time-since { color: #333333; }
  .job.grey,
  .job.disabled,
  .job.aborted,
  .job.notbuilt { background-color: #A3A2A2; }

  .job.blue.blink { animation-name : blue-blink; }
  .job.yellow.blink { animation-name : yellow-blink; }
  .job.red.blink { animation-name : red-blink; }
  .job.grey.blink,
  .job.disabled.blink,
  .job.aborted.blink,
  .job.notbuilt.blink { animation-name : grey-blink; }

  .job .weather {
    height: 3vw;
    margin-right: 15px;
  }

  .job .weather.sunny { content: url('../assets/weather/sunny.svg'); }
  .job .weather.partially-sunny { content: url('../assets/weather/partially-sunny.svg'); }
  .job .weather.cloudy { content: url('../assets/weather/cloudy.svg'); }
  .job .weather.raining { content: url('../assets/weather/raining.svg'); }
  .job .weather.storm { content: url('../assets/weather/storm.svg'); }

  .job h4 {
    flex: 1;
    margin: 0;
  }

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
        host              : String,
        username          : String,
        apiToken          : String,
        jobs              : [ {
          name: String,
          id  : String
        } ],
        showSuccessful    : Boolean,
        paginationInterval: Number,
        updateInterval    : Number
      }
    },

    data () {
      return {
        specimenHidden: false,
        specimenHeight: 0,
        page: 0,
        pages: 0,
        hidden: false,
        allJobs: [],
        jobs: [],
        paginationIntervalRef: null
      }
    },

    computed: {
      host () {
        return (this.config.host.endsWith('/')) ? this.config.host.substring(0, this.config.host.length - 1) : this.config.host;
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

    mounted () {

      // Retrieve the specimen height to know how much jobs we can show
      this.specimenHeight = this.$el.querySelector('.job.specimen').offsetHeight;
      this.specimenHidden = true;

      setTimeout(this.update, 100); // Wait for the element to be fully displayed
      setInterval(this.update, this.config.updateInterval);
    },

    methods: {

      async update () {
        this.allJobs = [];

        for (const job of this.config.jobs) {
          const jobRes = await this.$http.get(this.getUrl(job), this.httpOptions);
          const body = jobRes.body;

          let jobObj = {
            id     : job.id,
            name   : job.name,
            url    : this.getLastBuildUrl(job, body.color.replace('_anime', '') === 'blue'),
            color  : body.color.replace('_anime', ''),
            blink  : body.color.includes('anime'),
            weather: this.getWeather((body.healthReport && body.healthReport.length > 0) ? body.healthReport[ 0 ].score : 0)
          };

          if (this.config.showSuccessful || (!this.config.showSuccessful && jobObj.color !== 'blue')) {

            if (body.lastBuild) {
              let buildRes = await this.getBuild(body.lastBuild.url);

              jobObj.timeSince = this.getTimeSince(new Date(buildRes.timestamp));
            }

            this.allJobs.push(jobObj);
          }
        }

        // Sort jobs
        const order = [ 'red', 'yellow', 'notbuilt', 'aborted', 'disabled', 'grey', 'blue' ];
        this.allJobs.sort((a, b) => order.indexOf(a.color) - order.indexOf(b.color));

        // Calculate the number of pages
        // Check if the number of pages has changed since the last update
        const newPages = (this.allJobs.length === 0) ? 0 : Math.ceil(this.allJobs.length / this.howMuchJobsPerPage()) - 1;
        const pagesChanged = this.pages !== newPages;
        this.pages = newPages;

        // Paginate jobs
        this.autoPagination(pagesChanged);
      },

      getUrl (job) {
        return `${this.host}/job/${job.id}/api/json`;
      },

      getLastBuildUrl (job, success) {
        return `${this.host}/job/${job.id}/${(success) ? 'lastSuccessfulBuild' : 'lastFailedBuild'}/console`
      },

      getWeather (score) {
        // Sunny
        if (score > 80) {
          return 'sunny';
        }

        // Partially Sunny
        if (score > 60 && score <= 80) {
          return 'partially-sunny';
        }

        // Cloudy
        if (score > 40 && score <= 60) {
          return 'cloudy';
        }

        // Raining
        if (score > 20 && score <= 40) {
          return 'raining';
        }

        // Storm
        if (score <= 20) {
          return 'storm';
        }
      },

      getTimeSince (date) {
        let seconds = Math.floor((new Date() - date) / 1000),
          interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
          return `${interval}y`;
        }

        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
          return `${interval}mo`;
        }

        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
          return `${interval}d`;
        }

        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
          return `${interval}h`;
        }

        interval = Math.floor(seconds / 60);
        if (interval > 1) {
          return `${interval}m`;
        }

        return `${Math.floor(seconds)}s`;
      },

      getBuild (url) {
        return this.$http.get(`${url}api/json?pretty=true`, this.httpOptions).then((data) => data.body);
      },

      howMuchJobsPerPage () {
        return Math.floor(this.$el.offsetHeight / this.specimenHeight);
      },

      autoPagination (pagesChanged) {

        // Do a manual pagination in case there is only 1 page
        if (this.pages === 0) {
          this.paginate();
        }

        if (pagesChanged && this.paginationIntervalRef !== null) {
          clearInterval(this.paginationIntervalRef);
        }

        // Interval only if their is more than 1 page, otherwise the same page will fadeOut/In every 5 seconds (or so), kind of boring
        if (pagesChanged && this.pages > 0) {
          this.paginationIntervalRef = setInterval(this.paginate, this.config.paginationInterval);
        }
      },

      paginate () {
        this.fadeOut(() => {
          this.jobs = [];

          const jobsPerPage = this.howMuchJobsPerPage();

          this.jobs = this.allJobs.slice(this.page * jobsPerPage, (this.page * jobsPerPage) + jobsPerPage);

          this.page++;
          if (this.page > this.pages) {
            this.page = 0;
          }

          setTimeout(this.fadeIn, 50);
        });
      },

      fadeOut (cb) {
        this.hidden = true;

        setTimeout(() => {
          if (cb) {
            cb();
          }
        }, 1100);
      },

      fadeIn (cb) {
        this.hidden = false;

        setTimeout(() => {
          if (cb) {
            cb();
          }
        }, 1000);
      }

    }

  }
</script>
