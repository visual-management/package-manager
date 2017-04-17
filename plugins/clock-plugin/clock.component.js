export default {
  data () {
    return {
      datetime: ''
    };
  },

  created () {
    setInterval(this.updateClock.bind(this), 1000);
  },
  methods: {
    updateClock () {
      let date = new Date();
      this.datetime = `${this.pad(date.getHours())}:${this.pad(date.getMinutes())}:${this.pad(date.getSeconds())}`;
    },

    pad (n) {
      return n < 9 ? '0' + n : n;
    }
  }
}
