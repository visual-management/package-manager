import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

const ALLOWED_VIOLATIONS = [ 'blocker', 'critical', 'major', 'minor', 'info' ];

export default {

  props: {
    config: {
      host          : String,
      projectId     : Number,
      violation     : String,
      updateInterval: Number
    }
  },

  computed: {
    url: {
      get() {
        return `${this.config.host}/sonar/api/resources?resource=${this.config.projectId}&depth=0&format=json&metrics=${this.config.violation}_violations`;
      }
    }
  },

  data () {
    return {
      violation: '',
      count    : 0
    }
  },

  created () {
    if (!ALLOWED_VIOLATIONS.includes(this.config.violation)) {
      throw new Error(`Unknown violation ${this.config.violation}. Please use one of these: ${ALLOWED_VIOLATIONS.join(', ')}`)
    }

    this.violation = this.config.violation;

    this.update();
    setInterval(this.update.bind(this), this.config.updateInterval);
  },

  methods: {
    update () {
      this.$http.get(this.url).then((data) => {
        console.log(data);
        // for(let msr of data.body[0].msr) {
        //   if (msr.key === 'critical_violations') {
        //     this.count = msr.val;
        //   }
        // }
      });
    }
  }

};
