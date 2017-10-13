<template>
  <div class="healths">
    <div :class="[ 'health', url.status, { hidden: hidden } ]" v-for="url in urls">
      <div class="title">{{ url.name }} </div>
      <img :class="url.status" />
    </div>
  </div>
</template>

<style scoped>
  .healths {
    display: flex;
    height: 100%;
    padding: 8px 8px 8px 4px;
    box-sizing: border-box;
  }

  .health {
    opacity: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 4px;
    padding: 8px;
    transition: opacity 1s;
  }

  .health.hidden {
    opacity: 0;
  }

  .health.ok { background-color: #4CAF50; }
  .health.ko { background-color: #F44336; }

  .health .title {
    width: 130px;
    margin-bottom: 15px;
    text-align: center;
  }

  .health img {
    height: 55px;
  }

  .health img.ok { content: url('../assets/health/ok.svg'); }
  .health img.ko { content: url('../assets/health/ko.svg'); }
</style>

<script>
  import Vue from 'vue';
  import VueResource from 'vue-resource';

  Vue.use(VueResource);

  export default {

    props: {
      config: {
        urls           : [ {
          name: String,
          url : String
        } ],
        showWorkingUrls: Boolean,
        updateInterval : Number
      }
    },

    data () {
      return {
        page: 0,
        maxPage: 0,
        hidden: false,
        allUrls: [],
        urls: []
      }
    },

    computed: {
      host () {
        return (this.config.host.endsWith('/')) ? this.config.host.substring(0, this.config.host.length - 1) : this.config.host;
      }
    },

    mounted () {

      // Wait for the element to be fully displayed
      setTimeout(() => {
        this.update(true);
      }, 100);
      setInterval(this.update, this.config.updateInterval);
    },

    methods: {
      async update (firstTime = false) {
        for (const url of this.config.urls) {
          const urlObj = {
            name: url.name,
            url: url.url
          };

          try {
            await this.$http.get(url.url);

            urlObj.status = 'ok';
          } catch (err) {
            urlObj.status = 'ko';
          }

          if (this.config.showWorkingUrls || (!this.config.showWorkingUrls && urlObj.status !== 'ok'))
          if (firstTime) {
            this.allUrls.push(urlObj);
          } else {
            this.allUrls = this.allUrls.map((item) => {
              if (item.url === urlObj.url) {
                item = urlObj;
              }

              return item;
            });
          }
        }

        // Sort jobs
        const order = [ 'ko', 'ok' ];
        this.allUrls.sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));

        // Paginate jobs
        if (firstTime) {
          this.autoPagination();
        }
      },

      howMuchJobsPerPage () {
        return Math.floor((this.$el.offsetWidth - 8) / 146); // 130px + 4px of margin + 8px of padding for health element width
      },

      autoPagination () {
        this.maxPage = Math.ceil(this.allUrls.length / this.howMuchJobsPerPage()) - 1;
        this.paginate();

        if (this.maxPage > 0) {
          setInterval(this.paginate, 5000);
        }
      },

      paginate () {
        this.fadeOut(() => {
          this.urls = [];

          const urlsPerPage = this.howMuchJobsPerPage();

          this.urls = this.allUrls.slice(this.page * urlsPerPage, (this.page * urlsPerPage) + urlsPerPage);

          this.page++;
          if (this.page > this.maxPage) {
            this.page = 0;
          }

          setTimeout(this.fadeIn, 50);
        });
      },

      fadeOut (cb) {
        this.hidden = true;

        setTimeout(() => {
          if (cb) {
            cb();
          }
        }, 1100);
      },

      fadeIn (cb) {
        this.hidden = false;

        setTimeout(() => {
          if (cb) {
            cb();
          }
        }, 1000);
      }

    }

  }
</script>
