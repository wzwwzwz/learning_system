
<template>
  <div class="editorComp">
    <!-- 图片上传组件辅助 -->
    <el-upload class="avatar-uploader" :action="serverUrl" name="img" :headers="header" :show-file-list="false" :on-success="uploadSuccess"
      :on-error="uploadError" :before-upload="beforeUpload"></el-upload>

    <quill-editor class="editor" v-model="content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)" @change="onEditorChange($event)"></quill-editor>

    <template>
      <!-- 使用改组件外框必须包裹样式 ql-container ql-snow && 渲染的文本 必须包含类 ql-editor -->
      <!-- <div class="ql-container ql-snow">
        <div class="ql-editor" v-html="AnswerTest"></div>
      </div> -->
    </template>
  </div>

</template>
<script>
// 安装命令：富文本编辑器
// npm i vue-quill-editor

// 工具栏配置
// 引入富文本编辑器
import { quillEditor } from 'vue-quill-editor'
import { addQuillTitle } from '@/utils/modules/quill-title'

// require styles 引入样式； 富文本编辑器外部引用样式  三种样式三选一引入即可
// import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

// 导航栏选项
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
  ['blockquote', 'code-block'], // 引用  代码块
  [{ header: 1 }, { header: 2 }], // 1、2 级标题
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
  [{ script: 'sub' }, { script: 'super' }], // 上标/下标
  [{ indent: '-1' }, { indent: '+1' }], // 缩进
  // [{'direction': 'rtl'}],                         // 文本方向
  [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  //   [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ font: [] }], // 字体种类
  [{ align: [] }], // 对齐方式
  ['clean'], // 清除文本格式
  // ['link', 'image', 'video'] // 链接、图片、视频
  ['link', 'image'] // 链接、图片、视频
]

// 内容清掉换行符
// const content = this.content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')

export default {
  props: {
    /* 编辑器的内容 */
    value: {
      type: String,
      default: ''
    },
    /* 图片大小 */
    maxSize: {
      type: Number,
      default: 4000 // kb
    },
    placeholderVal: {
      type: String,
      default: '请输入内容'
    }
  },
  components: {
    quillEditor
  },
  computed: {
    updateContent () {
      return this.content
    }
  },
  created () {
    // console.log('dddd编辑器dddddddd', this.placeholderVal)
  },
  mounted () {
    addQuillTitle()
  },
  data () {
    return {
      // 富文本编辑器默认内容
      content: this.value,
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      editorOption: {
        placeholder: this.placeholderVal,
        theme: 'snow', // or 'bubble'
        // placeholder: '您想说点什么？',
        modules: {
          toolbar: {
            container: toolbarOptions,
            // container: "#toolbar",
            handlers: {
              image: function (value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
              // link: function (value) {
              //   if (value) {
              //     var href = prompt('请输入url')
              //     this.quill.format('link', href)
              //   } else {
              //     this.quill.format('link', false)
              //   }
              // }
            }
          }
        }
      },
      serverUrl: '/v1/blog/imgUpload', // 这里写你要上传的图片服务器地址
      header: {
        // token: sessionStorage.token
      } // 有的图片服务器要求请求头需要有token
    }
  },
  methods: {
    onEditorBlur () {
      // 失去焦点事件
      // console.log('失焦时内容', this.content)
      // console.log('editor blur!', quill)
      let e = document.querySelector('.ql-tooltip,.ql-editing')
      if (e) {
        let left = e.style.left
        // 链接div偏移量
        if (left.indexOf('-') === 0) {
          // e.style.left =
        }
      }
    },
    onEditorFocus () {
      // 获得焦点事件
    },
    onEditorChange () {
      // console.log('内容改变事件', this.content)
      // 内容改变事件
      this.$emit('input', this.content)
    },

    // 富文本图片上传前
    beforeUpload () {
      // 显示loading动画
      this.quillUpdateImg = true
    },

    uploadSuccess (res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res.code === 200) {
        // 获取光标所在位置
        let length = quill.getSelection().index
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, 'image', res.url)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error('图片插入失败')
      }
      // loading动画消失
      this.quillUpdateImg = false
    },
    // 富文本图片上传失败
    uploadError () {
      // console.log(err, err.message)
      // loading动画消失
      this.quillUpdateImg = false
      this.$message.error('图片插入失败')
    },
    clearContent () {
      this.content = ''
    }
  }
}
</script>

<style lang="scss">
// quill add content val,font-size
@mixin m-ql-content($class, $dateVal, $contentVal, $fontVal: "") {
  // label
  .ql-snow
    .ql-picker#{$class}
    .ql-picker-label[data-value="#{$dateVal}"]::before,
  // item
  .ql-snow
    .ql-picker#{$class}
    .ql-picker-item[data-value="#{$dateVal}"]::before {
    content: $contentVal;
    font-size: $fontVal;
  }
}

// cover quill font-size
@mixin m-font-size($class, $val) {
  #{$class} {
    font-size: $val;
  }
}

// show quill .ql-tooltip
@mixin m-tooltip($class: null, $contentVal: "") {
  .ql-snow .ql-tooltip#{$class} {
    content: $contentVal;
  }
}

// 编辑器样式
.editor {
  line-height: normal !important;
  /* height: 800px; */

  // 大小
  @include m-ql-content(".ql-size", "small", "12px", 12px);
  @include m-ql-content(".ql-size", "large", "16px", 16px);
  @include m-ql-content(".ql-size", "huge", "18px", 18px);
  // 标题
  @include m-ql-content(".ql-header", "1", "标题1");
  @include m-ql-content(".ql-header", "2", "标题2");
  @include m-ql-content(".ql-header", "3", "标题3");
  @include m-ql-content(".ql-header", "4", "标题4");
  @include m-ql-content(".ql-header", "5", "标题5");
  @include m-ql-content(".ql-header", "6", "标题6");
  // 字体
  @include m-ql-content(".ql-font", "serif", "衬线字体");
  @include m-ql-content(".ql-font", "monospace", "等宽字体");

  // 覆盖富文本编辑器
  .ql-container {
    font-size: 14px !important;
  }

  // 覆盖编辑器字体大小
  .ql-editor {
    @include m-font-size(".ql-size-small", 12px);
    @include m-font-size(".ql-size-large", 16px);
    @include m-font-size(".ql-size-huge", 18px);
  }

  // tooltip
  @include m-tooltip("[data-mode='link']::before", "请输入链接地址:");
  @include m-tooltip(".ql-editing a.ql-action::after", "保存");
  @include m-tooltip("::before", "访问网址:");
  @include m-tooltip(" a.ql-action::after", "编辑");
  @include m-tooltip(" a.ql-remove::before", "移除");
  @include m-tooltip("[data-mode='video']::before", "请输入视频地址:");

  // cover picker
  .ql-snow {
    .ql-picker.ql-header,
    .ql-picker.ql-size {
      width: 65px;
    }

    .ql-picker.ql-font {
      width: 84px;
    }
  }
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}

/* 覆盖样式 */
.editorComp .ql-container {
  // min-height: 300px;

  .ql-editor {
    height: 100%;
    min-height: 300px;
  }
}
</style>
