<template>
  <div>
    <!--面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable placeholder="请输入内容" v-model="queryInfo.query">
            <el-button @click="getGoodsList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
            <el-button @click="goAddPage" type="primary">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column width="110px" prop="goods_price" label="商品价格(元)"></el-table-column>
        <el-table-column width="110px" prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column width="180px" prop="add_time" label="创建时间">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column width="130px" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button @click="removebyId(scope.row.goods_id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //查询参数对象
      queryInfo:{
        query:"",
        pagenum:1,
        pagesize:10
      },
      goodslist:[
        {
          goods_name:"冰箱",
          add_time:1582514345477
        }
      ],
      total:40,
    };
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //根据分页获取对应的商品列表
    async getGoodsList(){
      const {data:res}= await this.$http.get("goods",{
        params:this.queryInfo
      })
      if(res.data.status!==200){
        return this.$message.error("获取商品列表失败")
      }
      this.$message.success("获取商品列表成功")
      this.goodslist=res.data.goods
      this.total=res.data.total
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum=newPage
      this.getGoodsList()
    },
    async removebyId(goodsid){
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err=>err)
      if(confirmResult!="confirm"){
        return this.$message.error("已取消删除")
      }
      const {data:res}=await this.$http.delete(`goods/${goodsid}`)
      if(res.meta.status!==200){
        return this.$message.error("删除商品失败")
      }
      this.$message.success("删除商品成功!")
      this.getGoodsList()
    },
    goAddPage(){
      //通过编程式导航跳转道后台主页
      this.$router.push("/goods/add")
    }
  },
};
</script>
<style lang="less" scoped>
.el-pagination{
  margin-top: 15px;
}
</style>