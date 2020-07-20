<template>
  <div>
    <!--面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button @click="showDialog" type="primary">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        border
        index-text="#"
        show-index
        :expand-type="false"
        :selection-type="false"
        :data="catelist"
        :columns="columns"
      >
        <template slot="isok" slot-scope="scope">
          <i style="color:lightgreen" v-if="scope.row.cat_deleted===false" class="el-icon-success"></i>
          <i style="color:lightred" v-else class="el-icon-error"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" v-if="scope.row.cat_level===1" size="mini">二级</el-tag>
          <el-tag type="warning" v-if="scope.row.cat_level===2" size="mini">三级</el-tag>
        </template>
        <template slot="option" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogVisible" width="50%" @close="addCateClosed">
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="ruleForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options用来指定数据源 props用来指定配置对象 -->
          <el-cascader
            v-model="selectvalue"
            :options="parentCateList"
            :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }"
            @change="handleChange"
            clearable change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //商品分类数据列表
      catelist: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 5,
      columns: [
        {
          label: "分类名称",
          props: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "option"
        }
      ],
      dialogVisible: false,
      ruleForm: {
        cat_name: "",
        cat_level: 0,
        cat_pid: 0
      },
      rules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      parentCateList: [],
      selectvalue:[]
    };
  },
  created() {
    this.getCatelist();
  },
  methods: {
    //获取商品分类数据
    async getCatelist() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      (this.catelist = res.data.result), (this.total = res.data.total);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCatelist();
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getCatelist();
    },
    showDialog() {
      this.getParentCateList();
      this.dialogVisible = true;
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败");
      }
      this.parentCateList = res.data;
    },
    handleChange(){
      // console.log(this.selectvalue)
      if(this.selectvalue.length>0){
       this.ruleForm.cat_pid = this.selectvalue[this.selectvalue.length-1]
       this.ruleForm.cat_level=this.selectvalue.length
       return
      }else{
        this.ruleForm.cat_pid =0
        this.ruleForm.cat_level=0
      }
    },
    addCate(){
      this.$ref.ruleFormRef.validate(async vaild=>{
        if(!vaild)return
        const {data: res} =await this.$http.post("categories",this.ruleForm)
        if(res.meta.status!=201){
          return this.$message.error("添加分类失败")
        }
        this.$message.success("添加分类成功！")
        this.getCatelist()
        this.dialogVisible=false
      })
    },
    addCateClosed(){
      this.$ref.ruleFormRef.resetFields()
      this.selectvalue=[]
      this.ruleForm.cat_level=0
      this.ruleForm.cat_pid=0
    }
  }
};
</script>
<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
.el-cascader{
  width: 100%;
}
</style>