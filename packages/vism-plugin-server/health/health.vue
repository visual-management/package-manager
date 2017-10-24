<template>
  <div class="healths">
    <div class="everything-is-ok" v-show="urls.length === 0">
      <img src="../assets/health/ok.svg" />
    </div>

    <div :class="[ 'health', url.status, { hidden: hidden } ]" v-for="url in urls" @click="goTo(url.url)">
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

  .healths .everything-is-ok {
    overflow: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .healths .everything-is-ok > img {
    height: 50%;
  }

  .health {
    cursor: pointer;
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
        pages: 0,
        hidden: false,
        allUrls: [],
        urls: [],
        paginationIntervalRef: null
      }
    },

    computed: {
      host () {
        return (this.config.host.endsWith('/')) ? this.config.host.substring(0, this.config.host.length - 1) : this.config.host;
      }
    },

    mounted () {
      setTimeout(this.update, 100); // Wait for the element to be fully displayed
      setInterval(this.update, this.config.updateInterval);
    },

    methods: {

      goTo (url) {
        window.open(url)
      },

      async update () {
        this.allUrls = [];

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

          if (this.config.showWorkingUrls || (!this.config.showWorkingUrls && urlObj.status !== 'ok')) {
            this.allUrls.push(urlObj);
          }
        }

        // Sort jobs
        const order = [ 'ko', 'ok' ];
        this.allUrls.sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));

        // Calculate the number of pages
        // Check if the number of pages has changed since the last update
        const newPages = (this.allUrls.length === 0) ? 0 : Math.ceil(this.allUrls.length / this.howMuchJobsPerPage()) - 1;
        const pagesChanged = this.pages !== newPages;
        this.pages = newPages;

        // Paginate jobs
        this.autoPagination(pagesChanged);
      },

      howMuchJobsPerPage () {
        return Math.floor((this.$el.offsetWidth - 8) / 146); // 130px + 4px of margin + 8px of padding for health element width
      },

      autoPagination (pagesChanged) {

        // Do a manual pagination in case there is only 1 page
        if (this.pages === 0) {
          this.paginate();
        }

        if (pagesChanged && this.paginationIntervalRef !== null) {
          clearInterval(this.paginationIntervalRef);
        }

        // Interval only if their is more than 1 page, otherwise the same page will fadeOut/In every 5 seconds, kind of boring
        if (pagesChanged && this.pages > 0) {
          this.paginationIntervalRef = setInterval(this.paginate, 5000);
        }
      },

      paginate () {
        this.fadeOut(() => {
          this.urls = [];

          const urlsPerPage = this.howMuchJobsPerPage();

          this.urls = this.allUrls.slice(this.page * urlsPerPage, (this.page * urlsPerPage) + urlsPerPage);

          this.page++;
          if (this.page > this.pages) {
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
