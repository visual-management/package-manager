<template>
  <div class="jobs">
    <a
      class="job"
      target="_blank"
      :href="job.url"
      v-for="job in jobs" :class="[ job.color, { blink: job.blink } ]">
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

  .jobs {
    overflow: auto;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 8px;
    box-sizing: border-box;
  }

  .jobs .job {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin: 0 0 8px;
    padding: 8px 10px;
    border-radius: 2px;
    text-decoration: none;
  }

  .jobs .job:last-child {
    margin: 0;
  }

  .job.blue { background-color: #8CC04F; }
  .job.yellow { background-color: #F6B44B; }
  .job.red { background-color: #D54C53; }
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
        host          : String,
        username      : String,
        apiToken      : String,
        jobs          : [ {
          name: String,
          id: String
        } ],
        scrollDuration: Number,
        updateInterval: Number
      }
    },

    data () {
      return {
        jobs: []
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
      this.update(true);
      setTimeout(this.autoScroll, 500); // Wait for component to be fully rendered

      setInterval(this.update.bind(this), this.config.updateInterval);
    },

    methods: {

      update (firstTime = false) {
        this.config.jobs.forEach(async (job) => {
          const jobRes = await this.$http.get(this.getUrl(job), this.httpOptions);
          const body = jobRes.body;

          let jobObj = {
            id     : job.id,
            name   : job.name,
            url    : this.getLastSuccessfulBuildUrl(job),
            color  : body.color.replace('_anime', ''),
            blink  : body.color.includes('anime'),
            weather: this.getWeather((body.healthReport && body.healthReport.length > 0) ? body.healthReport[ 0 ].score : 0)
          };

          if (body.lastBuild) {
            let buildRes = await this.getBuild(body.lastBuild.url);

            jobObj.timeSince = this.getTimeSince(new Date(buildRes.timestamp));
          }

          if (firstTime) {
            this.jobs.push(jobObj);
          } else {
            this.jobs = this.jobs.map((item) => {
              if (item.id === job.id) {
                item = jobObj;
              }

              return item;
            })
          }
        });

        const order = [ 'red', 'yellow', 'notbuilt', 'aborted', 'disabled', 'grey', 'blue' ];

        this.jobs.sort((a, b) => order.indexOf(a.color) - order.indexOf(b.color));
      },

      getUrl (job) {
        return `${this.host}/job/${job.id}/api/json`;
      },

      getLastSuccessfulBuildUrl (job) {
        return `${this.host}/job/${job.id}/lastSuccessfulBuild/console`
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

      autoScroll () {
        let direction, duration, start, startTime, destinationOffsetToScroll;

        const reset = () => {
          direction = (direction === 'bottom') ? 'top' : 'bottom';
          duration = (direction === 'bottom') ? this.config.scrollDuration * 2 : this.config.scrollDuration;
          start = this.$el.scrollTop;
          startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
          destinationOffsetToScroll = (direction === 'bottom') ? this.$el.scrollHeight : 0;
        };
        reset();

        const scroll = () => {
          const now = 'now' in window.performance ? performance.now() : new Date().getTime(),
            time = Math.min(1, ((now - startTime) / duration));

          this.$el.scrollTop = Math.ceil((time * (destinationOffsetToScroll - start)) + start);

          if (
            (direction === 'top' && this.$el.scrollTop === 0) ||
            (direction === 'bottom' && (this.$el.scrollTop + this.$el.clientHeight) === destinationOffsetToScroll)
          ) {
            reset();
          }

          requestAnimationFrame(scroll)
        };

        scroll();
      }

    }

  }
</script>
