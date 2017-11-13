<template>
  <div class="container">
    <button type="button" class="btn-stop" v-if="alarmActive" v-on:click="stopAlarm"></button>
    <div class="clock-day">{{ date }}</div>
    <div class="clock-time">{{ time }}</div>
    <iframe ref="alarm" v-if="alarmActive" class="alarm" :src="'https://www.youtube.com/embed/' + config.youtubeId + '?autoplay=1'"></iframe>
  </div>
</template>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .container .clock-day {
    font-size: 2vw;
  }

  .container .clock-time {
    font-size: 6vw;
  }

  .alarm {
    visibility: hidden;
    width: 0;
    height: 0;
  }

  .btn-stop {
    background: #313131;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 9;
    border: 0;
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
  }

  .btn-stop:after {
    content: ' ';
    border-radius: 2px;
    width: 15px;
    height: 15px;
    background: #fff;
    display: block;
  }

</style>

<script>
  const DAYS = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ],
    MONTHS = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

  export default {

    props: {
      config: {
        alarmTime: String,
        youtubeId  : String
      }
    },

    data () {
      return {
        date: '',
        time: '',
        alarmActive: false
      };
    },

    created () {
      this.update();
      setInterval(this.update.bind(this), 1000);
      if(this.config && this.config.alarmTime) {
        setInterval(this.alarm.bind(this), 1000);
      }
    },

    methods: {

      update () {
        let now = new Date(),
          day = now.getDate(),
          month = now.getMonth(),
          year = now.getFullYear();

        this.date = `${day} ${MONTHS[month]} ${year}`;
        this.time = now.toLocaleTimeString();
      },

      alarm () {
        let currentHours = ('0' + new Date().getHours()).slice(-2),
            currentMinutes = ('0' + new Date().getMinutes()).slice(-2),
            currentSeconds = new Date().getSeconds(),
            currentTime = currentHours + 'h' + currentMinutes;

        if (this.config.alarmTime === currentTime && currentSeconds < 5) {
          this.alarmActive = true;
          setTimeout(() => {
            this.alarmActive = false;
          }, 600000);
        }
      },

      stopAlarm() {
          this.alarmActive = false;
      }

    }
  }
</script>
