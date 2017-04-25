<template>
  <div :class="{'has-error': count > 0}">
    <h1>{{ violation }}</h1>
    <span>{{ count }}</span>
  </div>
</template>

<style scoped>
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100%;
  }

  span {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 3vw;
  }
</style>

<script>
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
          return `${this.config.host}/api/resources?resource=${this.config.projectId}&depth=0&format=json&metrics=${this.config.violation}_violations`;
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
      this.config.host = (this.config.host.endsWith('/')) ? this.config.host.substring(0, this.config.host.length - 1) : this.config.host;

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
          const body = data.body[0];

          this.count = body.msr[0].val;
        });
      }
    }

  };
</script>
