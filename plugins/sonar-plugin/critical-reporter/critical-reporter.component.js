import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);

export default {
  props: {
    config: {
      url: String,
      projectId: Number
    }
  },
  computed: {
    url: {
      get() {
        return this.config.url.replace('{projectId}', this.config.projectId);
      }
    }
  },
  data() {
    return {
      nbViolation: 0
    }
  },
  created () {
    this.update();
    setInterval(this.update.bind(this), 60000);
  },
  methods: {
    update () {
      this.$http.get(this.url).then((data) => {
        for(let msr of data.body[0].msr) {
          if (msr.key === 'critical_violations') {
            this.nbViolation = msr.val;
          }
        }
      });


    }
  }
};
