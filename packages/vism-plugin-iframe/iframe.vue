<template>
  <iframe :src="config.url">
    <p>Your browser does not support iframes.</p>
  </iframe>
</template>

<style scoped>
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>

<script>

  export default {

    props: {
      config: {
        url: String
      }
    }

  };
</script>
