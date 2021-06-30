<template >
  <el-tree :props="props" :load="loadNode" lazy>
    <span class="custom-tree-node" slot-scope="{ node, data }">
      <span>{{ node.label }}</span>
      <span>
        <el-button type="text" size="small" @click="() => append(node,data)">增加</el-button>
        <el-button type="text" size="small" @click="() => modify(node,data)">修改</el-button>
        <el-button type="text" size="small" @click="() => remove(node, data)">删除</el-button>
      </span>
    </span>
  </el-tree>

</template>

<script>
export default {
  data () {
    return {
      props: {
        val: 'key',
        label: 'name',
        children: 'children',
        isLeaf: 'leaf',
        superiorkey: 'superiorkey'
      }
    }
  },
  methods: {
    loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve([{
          name: 'region96',
          key: 1,
          children: [{
            name: 'region-1', key: 1 - 1
          }]
        }])
      }
      if (node.level > 1) return resolve([])

      setTimeout(() => {
        // const data = [{
        //   name: 'fef',
        //   key: 2,
        //   leaf: true
        // }, {
        //   name: 'zone',
        //   key: 3
        // }]

        const data = node.data.children

        resolve(data)
      }, 500)
    },
    append (node, data) {
      let val = 'SUPERIORKEY'.toLowerCase()
      'SUPERIORKEY'.toLocaleLowerCase()

      if (val === 'superiorkey') {
        console.log(true)
        return
      }
      console.log(false)
      console.log(data)
    }
  }
}
</script>
