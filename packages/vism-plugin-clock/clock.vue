<template>
  <div class="container">
    <div class="clock-day">{{ date }}</div>
    <div class="clock-time">{{ time }}</div>
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
</style>

<script>
  const DAYS = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ],
    MONTHS = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

  export default {

    data () {
      return {
        date: '',
        time: ''
      };
    },

    created () {
      this.update();
      setInterval(this.update.bind(this), 1000);
    },

    methods: {

      update () {
        let now = new Date(),
          day = now.getDate(),
          month = now.getMonth(),
          year = now.getFullYear();

        this.date = `${day} ${MONTHS[month]} ${year}`;
        this.time = now.toLocaleTimeString();
      }

    }
  }
</script>
