<template>
  <div>
    <div class="header">
      <a class="title" :href="viewUrl" target="_blank">{{ config.name }}</a>
      <span class="full-size"></span>
      <div class="quality-gate">Quality Gate: <span :class="[ measures.qualityGate.toLowerCase() ]">{{ qualityGate }}</span></div>
    </div>

    <div class="measures">
      <div class="measure">
        <div :class="[ 'note', 'note-' + measures.reliability ]">{{ measures.reliability }}</div>
        <span class="name">Reliability</span>
      </div>
      <div class="measure">
        <div :class="[ 'note', 'note-' + measures.security ]">{{ measures.security }}</div>
        <span class="name">Security</span>
      </div>
      <div class="measure">
        <div :class="[ 'note', 'note-' + measures.maintainability ]">{{ measures.maintainability }}</div>
        <span class="name">Maintainability</span>
      </div>
      <div class="measure">
        <div class="value">{{ measures.coverage }}<small>%</small></div>
        <span class="name">Coverage</span>
      </div>
      <div class="measure">
        <div class="value">{{ measures.duplications }}<small>%</small></div>
        <span class="name">Duplications</span>
      </div>
      <div class="measure">
        <div class="value">{{ measures.linesOfCode }}</div>
        <span class="name">{{ measures.language }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .header {
    display: flex;
    padding: 15px 20px 0;
  }

  .header .title {
    font-size: 20px;
    text-decoration: none;
  }

  .header .title:hover {
    text-decoration: underline;
  }

  .header .full-size {
    flex: 1;
  }

  .header .quality-gate span {
    padding: 2px 8px;
    border-radius: 2px;
  }

  .header .quality-gate span.error { background-color: #F44336; }
  .header .quality-gate span.warn { background-color: #FF9800; }
  .header .quality-gate span.ok { background-color: #4CAF50; }

  .measures {
    display: flex;
    padding: 25px 20px 0 5px;
  }

  .measures .measure {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 15px;
  }

  .measures .measure .note {
    display: block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 50%;
    text-align: center;
    text-shadow: 0 0 1px rgba(0, 0, 0, .35);
    font-size: 24px;
  }

  .measures .measure .note.note-A { background-color: #00AA00; }
  .measures .measure .note.note-B { background-color: #B0D513; }
  .measures .measure .note.note-C { background-color: #EABE06; }
  .measures .measure .note.note-D { background-color: #ED7D20; }
  .measures .measure .note.note-E { background-color: #EE0000; }

  .measures .measure .value {
    display: block;
    height: 30px;
    line-height: 30px;
    text-align: center;
    text-shadow: 0 0 1px rgba(0, 0, 0, .35);
    font-size: 24px;
  }

  .measures .measure .name {
    margin-top: 4px;
  }

  .measure + .measure:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 0;
    height: 24px;
    margin-top: -12px;
    border-left: 1px solid #E6E6E6;
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
        projectKey    : String,
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
          return `${this.host}/api/measures/component?componentKey=${this.config.projectKey}&metricKeys=${this.metrics.join(',')}`;
        }
      },
      viewUrl: {
        get () {
          return `${this.host}/dashboard?id=${this.config.projectKey}`;
        }
      },
      qualityGate: {
        get () {
          switch (this.measures.qualityGate) {
            case 'ERROR':
              return 'Failed';

            case 'WARN':
              return 'Warning';

            case 'OK':
              return 'Passed';
          }
        }
      }
    },

    data () {
      return {
        metrics: [
          METRIC.ALERT_STATUS,
          METRIC.RELIABILITY_RATING,
          METRIC.SECURITY_RATING,
          METRIC.SQALE_RATING,
          METRIC.DUPLICATED_LINES_DENSITY,
          METRIC.COVERAGE,
          METRIC.NCLOC,
          METRIC.NCLOC_LANGUAGE_DISTRIBUTION
        ],
        measures: {
          qualityGate    : '',
          reliability    : '',
          security       : '',
          maintainability: '',
          coverage       : 0,
          duplications   : 0,
          language       : '',
          linesOfCode    : ''
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
          const body = data.body.component;

          this.measures.qualityGate = this.getMetric(METRIC.ALERT_STATUS, body.measures).value;
          this.measures.reliability = this.getNoteFromRating(this.getMetric(METRIC.RELIABILITY_RATING, body.measures).value);
          this.measures.security = this.getNoteFromRating(this.getMetric(METRIC.SECURITY_RATING, body.measures).value);
          this.measures.maintainability = this.getNoteFromRating(this.getMetric(METRIC.SQALE_RATING, body.measures).value);
          this.measures.coverage = this.getMetric(METRIC.COVERAGE, body.measures).value;
          this.measures.duplications = this.getMetric(METRIC.DUPLICATED_LINES_DENSITY, body.measures).value;
          this.measures.language = this.getTopLanguage(this.getMetric(METRIC.NCLOC_LANGUAGE_DISTRIBUTION, body.measures).value);
          this.measures.linesOfCode = this.kFormatter(this.getMetric(METRIC.NCLOC, body.measures).value);
        });
      },

      getMetric (metric, measures) {
        return measures.find((measure) => measure.metric === metric)
      },

      getNoteFromRating (rating) {
        switch (rating) {
          case '1.0':
            return 'A';
          case '2.0':
            return 'B';
          case '3.0':
            return 'C';
          case '4.0':
            return 'D';
          case '5.0':
            return 'E';
        }
      },

      getTopLanguage (languageDistribution) {
        const language = languageDistribution.split('=')[0];

        return language.charAt(0).toUpperCase() + language.slice(1);
      },

      kFormatter (num) {
        return num > 999 ? (num / 1000).toFixed(1) + 'k' : num
      }
    }

  };

  class METRIC {
    static ALERT_STATUS = 'alert_status';
    static RELIABILITY_RATING = 'reliability_rating';
    static SECURITY_RATING = 'security_rating';
    static SQALE_RATING = 'sqale_rating';
    static DUPLICATED_LINES_DENSITY = 'duplicated_lines_density';
    static COVERAGE = 'coverage';
    static NCLOC = 'ncloc';
    static NCLOC_LANGUAGE_DISTRIBUTION = 'ncloc_language_distribution';
  }
</script>
