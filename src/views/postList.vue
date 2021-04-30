<template>
  <div class="pubList">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>

      <el-breadcrumb-item><a href="">文章管理</a></el-breadcrumb-item>

      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 表格 -->
    <el-card class="box-card">
      <!-- :data 用于指定数据源， 数据源是一个数组 -->
      <el-table :border="true" :data="postList" style="width: 380">
        <!-- prop 用于指定这一列展示数据属性的名称 -->
        <el-table-column type="index" width="50"></el-table-column>

        <el-table-column prop="title" label="标题" width="480">
        </el-table-column>

        <el-table-column prop="type" label="类型" width="180">
          <!-- 重点细节：type值的处理：需要根据当前行数据中的type属性进行处理，所以可以使用自定义列模板 -->
          <template slot-scope="scope">{{
            scope.row.type == 1 ? "文章" : "视频"
          }}</template>
        </el-table-column>

        <el-table-column prop="user.nickname" label="作者" width="180">
        </el-table-column>

        <el-table-column label="操作">
          <!-- slot-scope 插槽 -->
          <!-- 结论：以后在使用表格的时候，凡是要获取数据进行处理的场景，都会使用到自定义列模板 -->

          <template slot-scope="scope">
            <el-button size="mini">编辑</el-button>
            <!-- scope.$index 拿到当前行数据的index
              scope.row 拿到当前行的数据
            -->
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      :background="true"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getPostList } from "@/apis/post.js";
export default {
  data() {
    return {
      postList: [],
      pageIndex: 1,
      pageSize: 4,
    };
  },
  async mounted() {
    this.init();
  },
  methods: {
    async init() {
      let res = await getPostList({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      });
      this.postList = res.data.data;
      console.log(this.postList);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.init();
      // console.log(val, "每页多少条");
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.init();
      // console.log(val, "当前页");
    },
  },
};
</script>

<style lang="less" scoped>
.box-card {
  width: 100%;
  margin-top: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>
