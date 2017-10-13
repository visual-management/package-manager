<template>
  <div class="container">
    <div class="status" v-for="item in status" :style="{ width: config.card.width + 'px', height: config.card.height + 'px' }">
      <h4 class="name">{{ item.name }}</h4>
      <span class="value">{{ item.value }}</span>
    </div>
  </div>
</template>

<style scoped>
  .status {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 8px 8px 0;
    padding: 8px;
    background-color: #3F51B5;
  }

  .status .name {
    margin: 0 0 8px;
    color: #FFFFFF;
    text-transform: uppercase;
  }

  .status .value {
    font-family: 'Roboto Mono', 'Product Sans', sans-serif;
    font-size: 55px;
    color: #FFFFFF;
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
        password      : String,
        card          : {
          width : Number,
          height: Number
        },
        values        : Array,
        updateInterval: Number
      }
    },

    data () {
      return {
        status: []
      }
    },

    computed: {

      host () {
        return (this.config.host.endsWith('/')) ? this.config.host.substring(0, this.config.host.length - 1) : this.config.host;
      },

      url () {
        return `${this.host}/api/ticket/all`;
      },

      httpOptions () {
        if (this.config.username === undefined || this.config.username === undefined || this.config.username === '') {
          return {};
        }

        return {
          headers: {
            'Authorization': `Basic ${btoa(this.config.username + ':' + this.config.password)}`
          }
        };
      }

    },

    created () {
      this.update();

      setInterval(this.update.bind(this), this.config.updateInterval);
    },

    methods: {

      async update () {
        const tickets = await this.$http.get(this.url, this.httpOptions);
        const body = tickets.body;

        this.status = [];

        for (const value of this.config.values) {
          const status = {
            name: value.name
          };

          switch (value.type) {
            case 'status':
              status.value = this.countForStatus(body.items, value.status);
              break;

            case 'count_evolution':
              status.value = this.countForTycketType(body.items, 'Evolution');
              break;
          }

          this.status.push(status);
        }
      },

      countForStatus (items, status) {
        return items.reduce((count, item) => {
          if (status.indexOf(item.nameStatus) !== -1) {
            count++;
          }

          return count;
        }, 0);
      },

      countForTycketType (items, type) {
        return items.reduce((count, item) => {
          if (item.nameTicketType === type) {
            count++;
          }

          return count;
        }, 0);
      }

    }

  }
</script>
