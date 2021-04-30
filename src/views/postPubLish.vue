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
          <!-- action 必选参数，上传的地址
              on-success 文件上传成功时的钩子
           -->
          <el-upload
            v-else
            class="upload-demo"
            :headers="getToken()"
            :action="axios.defaults.baseURL + '/upload'"
            :on-success="videoSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传视频文件</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="栏目">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-model="checkedCateList"
            @change="handleCheckedCatesChange"
          >
            <el-checkbox
              v-for="value in cateList"
              :label="value.id"
              :key="value.id"
              >{{ value.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="封面">
          <el-upload
            :action="axios.defaults.baseURL + '/upload'"
            :headers="getToken()"
            list-type="picture-card"
            :on-success="handlerPoster"
            :on-remove="removePoster"
            :limit="3"
            :on-exceed="max"
          >
            <i class="el-icon-plus"></i>
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
import { getCateList } from "@/apis/category.js";
import { publishPost } from "@/apis/post.js";
export default {
  components: { VueEditor },
  data() {
    return {
      axios,
      checkAll: false,
      isIndeterminate: false,
      cateList: [],
      checkedCateList: [],
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
      },
    };
  },
  async mounted() {
    let res = await getCateList();
    this.cateList = res.data.data;
    // console.log(this.cateList);
    if (localStorage.getItem("hmtt_ht_token")) {
      this.cateList.splice(0, 2);
    } else {
      this.cateList.splice(0, 1);
    }
  },
  methods: {
    videoSuccess(response, file, fileList) {
      console.log(response, file, fileList);
      this.post.content = this.axios.defaults.baseURL + response.data.url;
    },
    // 封装token
    getToken() {
      let token = localStorage.getItem("hmtt_ht_token");
      return { Authorization: token };
    },
    // 全选
    handleCheckAllChange(val) {
      // val 是布尔值  表示是否点击了全选按钮
      console.log("handleCheckAllChange", val);
      // 如果val 是true
      // 循环拿到栏目数组里面所有数据的id 返回所有id
      // 拿到所有id 就会全选
      // 如果val 是false
      // 就返回一个空数组
      // 就是全不选
      this.checkedCateList =
        val == true
          ? this.cateList.map((v) => {
              return v.id;
            })
          : [];
      this.isIndeterminate = false;
    },

    // 单选
    handleCheckedCatesChange(value) {
      console.log("handleCheckedCatesChange", value);
      // 拿到当前被选中的总长度
      let checkCount = value.length;
      // 把栏目数组的长度赋值给checkAll和checkCount
      this.checkAll = checkCount == this.cateList.length;
      // 如果总长度大于0且小于栏目数组的长度
      // isIndeterminate 意思是不确定 就为false
      this.isIndeterminate =
        checkCount > 0 && checkCount < this.cateList.length;
    },

    //封面  增加
    handlerPoster(response) {
      console.log(response);
      this.post.cover.push({ id: response.data.id });
    },
    // 封面 删除
    removePoster(file) {
      console.log(file);
      let id = file.response.data.id;
      //  保留id不相等的其余数据   去掉这个id所在的那条数据
      this.post.cover = this.post.cover.filter((v) => {
        return id != v.id;
      });
    },
    // 封面上传数量最大限制
    max(files, fileList) {
      console.log(files, fileList);
      if (fileList.length == 3) {
        this.$message({
          message: "封面上传数量已达最大",
          type: "warning",
        });
      }
    },

    // 发布
    async publishPost() {
      // 拿到内容 content
      if (this.post.type == 1) {
        this.post.content = this.$refs.myeditor.editor.root.innerHTML;
      }
      // 拿到当前选中的数组做循环 返回一个对象给categories
      this.post.categories = this.checkedCateList.map((v) => {
        return { id: v };
      });
      console.log(this.post);
      let res = await publishPost(this.post);
      console.log(res);
      if (res.data.message === "文章发布成功") {
        this.$message.success("文章发布成功");
        this.$router.push({ name: "postList" });
      }
    },
  },
};
</script>

<style lang="less">
</style>