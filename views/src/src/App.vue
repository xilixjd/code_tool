<template>
  <el-container :style="{ height: clientHeight+'px', border: '1px solid #eee' }">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="tagsNameArray" :router="false" :default-active="path">
        <el-submenu :index="tag.tagName" v-for="(tag, index) in tags" :key="index">
          <template slot="title">{{tag.tagName}}</template>
          <el-menu-item-group v-for="(component, index1) in tag.components" :key="index + index1">
            <el-menu-item
              @click="clickTemplate(tag.tagName, component.name)" 
              :index="'/tag/'+tag.tagName+'/component/'+component.name"
            >
              {{component.name}}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header>
        <i class="el-icon-back" style="vertical-align: middle; font-size: 2rem;"></i>
        <router-link to="/tag">
          <el-button style="vertical-align: middle; margin-left: 25px;">主页</el-button>
        </router-link>
        <router-link to="/history">
          <el-button style="vertical-align: middle; margin-left: 25px;">历史</el-button>
        </router-link>
      </el-header>
      <el-main ref="elMain">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }

  .div-header {
    font-size: 2rem;
    padding: 20px;
    padding-bottom: 0;
  }
</style>

<script>
  import request from './util/request.js'

  export default {
    data() {
      return {
        path: this.$route.path,
        tags: [],
        clientHeight: 0,
      }
    },
    computed: {
      tagsNameArray() {
        const tags = this.tags
        return tags.map((tag) => tag.tagName)
      },
    },
    watch: {
      $route(to, from) {
        this.path = to.path
      }
    },
    methods: {
      clickTemplate(tagName, componentName) {
        this.$router.push(`/tag/${tagName}/component/${componentName}`)
      }
    },
    async mounted() {
      const data = await request("/component/all")
      this.tags = data.data
      const clientHeight = document.documentElement.clientHeight
      this.clientHeight = clientHeight < 600 ? 600 : clientHeight - 20
      // 自定义事件，跨组件通信
      document.addEventListener("scrollDown", () => {
        this.$refs.elMain.$el.scrollTop += 150
      })
    }
  };
</script>