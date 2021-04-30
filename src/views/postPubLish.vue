<template>
  <div class="pubPushList">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="">文章管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>文章发布</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card" style="margin-top: 20px">
      <el-form ref="form" :model="post" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="post.title"></el-input>
        </el-form-item>

        <el-form-item label="类型">
          <!-- 双向绑定 label的值赋给type  拿到type  -->
          <el-radio-group v-model="post.type">
            <el-radio :label="1">文章</el-radio>
            <el-radio :label="2">视频</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="内容">
          <!-- VueEditor 是富文本框 -->
          <VueEditor :config="config" v-if="post.type == 1" ref="myeditor" />

          <!-- 上传组件 -->
          <el-upload
            v-else
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-button type="success" @click="publishPost">发布</el-button>
    </el-card>
  </div>
</template>

<script>
import VueEditor from "vue-word-editor";
import "quill/dist/quill.snow.css";
import axios from "@/utils/request.js";
export default {
  components: { VueEditor },
  data() {
    return {
      post: {
        title: "",
        content: "",
        categories: [],
        cover: [],
        type: 1,
      },
      config: {
        // 上传图片的配置
        uploadImage: {
          url: axios.defaults.baseURL + "/upload",
          name: "file",
          headers: this.getToken(),
          // res是结果，insert方法会把内容注入到编辑器中，res.data.url是资源地址
          uploadSuccess(res, insert) {
            console.log(res);
            insert(axios.defaults.baseURL + res.data.data.url);
          },
        },

        // 上传视频的配置
        uploadVideo: {
          url: axios.defaults.baseURL + "/upload",
          name: "file",
          headers: this.getToken(),
          uploadSuccess(res, insert) {
            insert(axios.defaults.baseURL + res.data.data.url);
          },
        },
      },
    };
  },
  methods: {
    publishPost() {
      if (this.post.type == 1) {
        this.post.content = this.$refs.myeditor.editor.root.innerHTML;
      }
      console.log(this.post);
    },
    // 封装token
    getToken() {
      let token = localStorage.getItem("hmtt_ht_token");
      return { Authorization: token };
    },
  },
};
</script>

<style lang="less">
</style>