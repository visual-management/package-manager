<template>
  <div>
    <h4>{{ name }}</h4>
    <img :src="weather" />
    <span class="date">{{ date }}</span>
  </div>
</template>

<style scoped>

</style>

<script>
  import Vue from 'vue';
  import VueResource from 'vue-resource';

  Vue.use(VueResource);

  export default {

    props: {
      config: {
        host          : String,
        job           : String,
        name          : String,
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

    created () {
      this.update();
      setInterval(this.update.bind(this), this.config.updateInterval);
    },

    methods: {

      update () {
        this.$http.get(this.url).then((data) => {
          const body = data.body[0];

          console.log(body);
        });
      }

    }

  }
</script>
