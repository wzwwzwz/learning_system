<template>
  <div class=''>
    <el-page-header @back="goBack" :content="AnswerDate.name"></el-page-header>

    <!-- 所有回答 -->

    <el-input type="textarea" :rows="2" placeholder="写下你的回答" v-model="textarea"></el-input>

    <div class="ql-container ql-snow">
      <!-- <div class="ql-editor" v-html="list.content"> -->
      <div class="ql-editor" v-html="AnswerTest"></div>
    </div>

    <el-button type="primary" icon="el-icon-edit" @click="submit()">提交</el-button>

    <div class="editTest">
      <Editor v-model="article.content" />
    </div>

  </div>
</template>

<script>
import Editor from '@/components/common/Editor'

export default {
  name: 'btnGrp',
  components: { Editor },
  props: {
    AnswerDate: {
      type: Object,
      default: () => { return {} }
    },
    idx: {
      type: Number,
      default: () => { return null }
    }
  },
  computed: {},
  data () {
    return {
      qusTitle: '',
      textarea: 'dddddd',
      article: {
        content: null
      },
      AnswerTest: ''
    }
  },
  created () {
    console.log('ddddddddddddd', this.AnswerDate)
  },
  mounted () { },
  methods: {
    goBack () {
      //   console.log('go back')
      //   this.$router.go(-1)
      this.qusTitle = 'ss'
      console.log(this.idx)

      this.$emit('goBack')

      //   console.log(this.$options.name)
    },
    submit () {
      console.log(this.article.content)
      this.AnswerTest = this.article.content
    }
  }
}
</script>
<style lang='scss' scoped>
.editTest {
  height: 500px;
}

.ql-container.ql-snow {
  border: 1px solid #ccc;
  border: none;
}
</style>
