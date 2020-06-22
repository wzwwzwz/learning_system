<template>
  <el-row>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Buttons</span>
      </div>
      <div style="margin-bottom:50px;">
        <el-col :span="4" class="text-center">
          <router-link class="pan-btn blue-btn" to="/documentation/index">
            Documentation
          </router-link>
        </el-col>
        <el-col :span="4" class="text-center">
          <router-link class="pan-btn light-blue-btn" to="/icon/index">
            Icons
          </router-link>
        </el-col>
        <el-col :span="4" class="text-center">
          <router-link class="pan-btn pink-btn" to="/excel/export-excel">
            Excel
          </router-link>
        </el-col>
        <el-col :span="4" class="text-center">
          <router-link class="pan-btn green-btn" to="/table/complex-table">
            Table
          </router-link>
        </el-col>
        <el-col :span="4" class="text-center">
          <router-link class="pan-btn tiffany-btn" to="/example/create">
            Form
          </router-link>
        </el-col>
        <el-col :span="4" class="text-center">
          <router-link class="pan-btn yellow-btn" to="/theme/index">
            Theme
          </router-link>
        </el-col>
      </div>
    </el-card>
  </el-row>
</template>

<script>

</script>

<style>

</style>
