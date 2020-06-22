<template>
  <div id="index">
    <Editor v-model="article.content" />
  </div>
</template>
<script>
import Editor from './common/Editor'

export default {
  name: 'index',
  components: {
    Editor
  },
  data () {
    return {
      article: {
        content: null
      }
    }
  }
}
</script>
