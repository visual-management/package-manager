<template>
  <div :class="[ config.metric, {'has-error': config.onError !== 0 && count >= config.onError}]">
    <h1>{{ config.name }}</h1>
    <span class="total">
      <span class="val">{{ count }}</span>
      <small>{{ config.unit }}</small>
    </span>
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

  .total .val {
    text-align: center;
    font-size: 2vw;
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
        projectId     : Number,
        name          : String,
        unit          : String,
        metric        : String,
        onError       : Number,
        updateInterval: Number
      }
    },

    computed: {
      host: {
        get () {
          return (this.config.host.endsWith('/')) ? this.config.host.substring(0, this.config.host.length - 1) : this.config.host;
        }
      },
      url: {
        get() {
          return `${this.host}/api/resources?resource=${this.config.projectId}&depth=0&format=json&metrics=${this.config.metric}`;
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
      this.violation = this.config.violation;

      this.update();
      setInterval(this.update.bind(this), this.config.updateInterval);
    },

    methods: {
      update () {
        this.$http.get(this.url).then((data) => {
          const body = data.body[0],
            frmtVal = (body.msr && body.msr.length > 0) ? body.msr[0].frmt_val : 0;

          let [ val, unit ] = frmtVal.split(' ');

          this.count = parseInt(val);
          this.config.unit = (unit) ? unit : this.config.unit;
        });
      }
    }

  };
</script>
