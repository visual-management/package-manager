<template>
  <div :class="config.classes" :style="{justifyContent: hAlign, alignItems: vAlign}">{{ config.title }}</div>
</template>

<style scoped>
  div {
    display: flex;
    height: 100%;
    font-size: 2vw;
  }
</style>

<script>
  const ALLOWED_HORIZONTAL_ALIGNMENT = [ 'flex-start', 'center', 'flex-end', 'space-around', 'space-between' ],
    ALLOWED_VERTICAL_ALIGNMENT = [ 'flex-start', 'center', 'flex-end', 'stretch' ];

  export default {

    props: {
      config: {
        title: String,
        classes: Array,
        align: String
      }
    },

    data () {
      return {
        vAlign: 'center',
        hAlign: 'center'
      }
    },

    created () {
      let align = this.config.align.split(' ');

      if (align.length !== 2) {
        throw new Error(`Missing alignment information. Upgrade 'align' property to something like 'center center'`);
      }

      this.hAlign = align[0];
      this.vAlign = align[1];

      if (!ALLOWED_HORIZONTAL_ALIGNMENT.includes(this.hAlign)) {
        throw new Error(`Unknown '${this.hAlign}' for horizontal alignment. Please use one of there: ${ALLOWED_HORIZONTAL_ALIGNMENT.join(', ')}`);
      }

      if (!ALLOWED_VERTICAL_ALIGNMENT.includes(this.vAlign)) {
        throw new Error(`Unknown '${this.vAlign}' for vertical alignment. Please use one of there: ${ALLOWED_VERTICAL_ALIGNMENT.join(', ')}`);
      }
    }

  };
</script>
