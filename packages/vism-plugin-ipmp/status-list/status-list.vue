<template>
  <div class="container">
    <div class="list">
      <div class="project" v-for="project in projects">
        <p class="name">{{ project.name }}</p>

        <!--<span-->
        <!--class="counter none"-->
        <!--:class="{ inactive: project.criticityNone === 0 }"-->
        <!--@click="onCriticityClick(CRITICITY.NONE, project)"-->
        <!--&gt;{{ project.criticityNone }}</span>-->
        <span
          class="counter minor"
          :class="{ inactive: project.criticityMinor === 0 }"
          @click="onCriticityClick(CRITICITY.MINOR, project)"
        >{{ project.criticityMinor }}</span>
        <span
          class="counter major"
          :class="{ inactive: project.criticityMajor === 0 }"
          @click="onCriticityClick(CRITICITY.MAJOR, project)"
        >{{ project.criticityMajor }}</span>
        <span
          class="counter blocking"
          :class="{ inactive: project.criticityBlocking === 0 }"
          @click="onCriticityClick(CRITICITY.BLOCKING, project)"
        >{{ project.criticityBlocking }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .container {
    position: relative;
    min-height: 100%;
    box-sizing: border-box;
  }

  .container .list {
    box-sizing: border-box;
    overflow-y: hidden;
    position: absolute;
    width: 100%;
    padding: 8px;
  }

  .project {
    display: flex;
    align-items: center;
    height: 60px;
    border-bottom: 1px solid #FFFFFF;
  }

  .project .name {
    flex: 1;
    margin: 0;
    font-size: 22px;
  }

  .project .counter {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 50px;
    margin: 0 4px;
    font-size: 35px;
    font-weight: 700;
    background-color: #BBBBBB;
  }

  .project .counter:last-child {
    margin-right: 0;
  }

  .counter.none:not(.inactive) { background-color: #A3A2A2; color: #333333; }
  .counter.minor:not(.inactive) { background-color: #FDD835; color: #333333; }
  .counter.major:not(.inactive) { background-color: #FB8C00; color: #333333; }
  .counter.blocking:not(.inactive) { background-color: #E53935; color: #333333; }
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
        projects      : Array,
        updateInterval: Number
      }
    },

    data () {
      return {
        projects   : [],
        pauseScroll: false,
        TYPE       : {
          ANOMALY  : 'Anomaly',
          EVOLUTION: 'Evolution',
          SUPPORT  : 'Support'
        },
        CRITICITY  : {
          NONE    : '',
          BLOCKING: 'Bloquant',
          MAJOR   : 'Majeur',
          MINOR   : 'Mineur'
        },
        STATUS     : {
          RECORDED   : 'recorded',
          QUALIFIED  : 'qualified',
          ACCEPTED   : 'accepted',
          RE_OPENED  : 're-opened',
          IN_PROGRESS: 'in progress',
          DONE       : 'done',
          VERIFIED   : 'verified',
          DELIVERED  : 'delivered',
          VALIDATED  : 'validated',
          CLOSED     : 'closed',
          CANCELLED  : 'cancelled',
          PENDING    : 'pending'
        }
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

    updated () {
      this.initAutoScroll();
    },

    methods: {

      onCriticityClick (criticity, project) {
        console.log(`Show tickets for :: ${criticity}`, project);
      },

      async update () {
        const http$ = await this.$http.get(this.url, this.httpOptions);
        const tickets = http$.body.items;

        for (const project of this.config.projects) {
          const index = this.projects.findIndex((p) => p.id === project.id);
          const item = {
            ...project,
            ...this.countCriticityForProject(project, tickets)
          };

          // Push or Update
          if (index !== -1) {
            this.projects[index] = item;
          } else {
            this.projects.push(item);
          }
        }
      },

      getTicketsForProject (tickets, projectId) {
        return tickets.filter((ticket) => ticket.idProject === `${projectId}`);
      },

      countCriticityForProject (project, allTickets) {
        const tickets = this.getTicketsForProject(allTickets, project.id);

        return tickets.reduce((counter, ticket) => {
          if (
            this.and([
              ...project.ignoreTypes.map((type) => (ticket) => ticket.nameTicketType !== type),
              ...project.ignoreStatuses.map((status) => (ticket) => ticket.nameStatus !== status)
            ])(ticket)
          ) {
            switch (ticket.nameImpact) {
              case this.CRITICITY.MINOR:
                counter.criticityMinor++;
                break;

              case this.CRITICITY.MAJOR:
                counter.criticityMajor++;
                break;

              case this.CRITICITY.BLOCKING:
                counter.criticityBlocking++;
                break;

              default:
                counter.criticityNone++;
                break;
            }
          }

          return counter;
        }, {
          criticityNone: 0,
          criticityMinor: 0,
          criticityMajor: 0,
          criticityBlocking: 0
        });
      },

      and (predicates) {
        return (ticket) => predicates.every(p => p(ticket));
      },

      initAutoScroll () {
        this.$el.querySelector('.list').style.height = this.$el.clientHeight + 'px';

        this.$el.addEventListener('mouseenter', () => this.pauseScroll = true);
        this.$el.addEventListener('mouseleave', () => this.pauseScroll = false);

        window.requestAnimationFrame(() => this.autoScroll('down'));
      },

      autoScroll (direction) {
        const el = this.$el.querySelector('.list');
        const scrollDistancePerSecond = 10; // Scroll Xpx every second.
        const scrollDistancePerAnimationFrame = Math.ceil(scrollDistancePerSecond / 60); // Animate at 60 fps.

        if ((el.clientHeight + el.scrollTop) === el.scrollHeight) {
          setTimeout(() => {
            window.requestAnimationFrame(() => this.autoScroll('up'));
          }, 1000);
        } else if (el.scrollTop === 0) {
          setTimeout(() => {
            window.requestAnimationFrame(() => this.autoScroll('down'));
          }, 1000);
        } else {
          window.requestAnimationFrame(() => this.autoScroll(direction));
        }

        if (!this.pauseScroll) {
          switch (direction) {
            case 'up':
              el.scrollTop -= scrollDistancePerAnimationFrame;
              break;

            case 'down':
              el.scrollTop += scrollDistancePerAnimationFrame;
              break;
          }
        }

      }

    }

  }
</script>
