const DAYS = [ 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche' ],
  MONTHS = [ 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre' ];

export default {

  data () {
    return {
      date: '',
      time: ''
    };
  },

  created () {
    setInterval(this.updateClock.bind(this), 1000);
  },

  methods: {

    updateClock () {
      let now = new Date(),
        day = now.getDate(),
        month = now.getMonth(),
        year = now.getFullYear();

      this.date = `${day} ${MONTHS[month]} ${year}`;
      this.time = now.toLocaleTimeString();
    }

  }
}
