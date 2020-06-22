<template>
  <el-row>
    <div class="clearfix btnGrpTitle itemWrap">
      <span class="el-icon-notebook-1"></span>
      <span>{{titleName}}</span>
    </div>
    <div class="btn_spilt_div_horizontal_to_right"></div>
    <div style="margin-bottom:50px;" class="btnGrpCon itemWrap">
      <!-- 遍历按钮-->
      <template v-for="(item ,idx) in objData.aBtn">
        <el-col :key="item.name" :span="4" class="dbclick_unchecked text-center hover_pointer">
          <div :class="[defaultColor,aBtnColor[idx]]" to="/documentation/index" @click="btnClick(item.name)">
            {{item.name}}
          </div>
        </el-col>
      </template>
    </div>
  </el-row>
</template>

<script>
export default {
  name: 'btn-grp',
  created () {
    console.log(this.objData)
  },
  computed: {
    titleName () {
      // console.log(this.objData.titleName)
      return this.objData.titleName
      // return ''
    }
  },
  props: {
    objData: {
      type: Object,
      // 传参默认值
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      defaultColor: 'pan-btn blue-btn',
      aBtnColor: ['blue-btn', 'light-blue-btn', 'pink-btn', 'green-btn', 'tiffany-btn', 'yellow-btn']
    }
  },
  methods: {
    btnClick (name) {
      console.log(name)
      this.$emit('btnGrpClick', name)
    }
  }
}
</script>

<style lang="scss" scoped>
// 加载样式
@import "@/styles/index.scss";
@import "@/styles/btn.scss";

.clearfix {
  &:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
  }
}

.btnGrpTitle {
  font-size: 20px;
  font-weight: 700;
}
.btnGrpCon {
  padding: 20px 0;
}

.bg_line {
  width: 100%;
  height: 10px;
  background: #f2f2f2;
}
</style>
