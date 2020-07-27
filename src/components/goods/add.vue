<template>
  <div>
    <!--面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" :closable="false" center show-icon></el-alert>
      <el-steps align-center :space="200" :active="activeIndex-0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- Tab栏区域 -->
      <el-form
        label-position="top"
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-tabs
          @tab-click="tabclick"
          :before-leave="beforeTabLeave"
          v-model="activeIndex"
          :tab-position="'left'"
        >
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id',children:'children' }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <el-form-item :key="item.attr_id" v-for="item in manyTable" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :key="i" v-for="(cb,i) in item.attr_vals" :label="cb"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">
            <el-form-item :label="item.attr_name" :key="item.attr_id" v-for="item in onlyTable">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品图片">
            <!-- action表示图片上传到的后台API地址 -->
            <!-- list-type="picture"指定缩略图 -->
            <el-upload
              :headers="headerObj"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handleSuccess"
            >
              <el-button type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button @click="Add" type="primary" class="btnAdd">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-row>
        <el-col></el-col>
      </el-row>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
      <img :src="previewPath" class="previewimg">
    </el-dialog>
  </div>
</template>
<script>
import _ from "lodash"
export default {
  data() {
    return {
      //商品分类列表
      cateList: [],
      activeIndex: "0",
      //添加商品的表单数据对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品所属的分类数组
        goods_cat: [],
        //图片数组
        pics: [],
        //商品的详情描述
        goods_introduce:"",
        attrs:[]
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" },
        ],
      },
      manyTable: [],
      onlyTable: [],
      //图片请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewPath: "",
      dialogVisible:false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categoires");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败！");
      }
      this.cateList = res.data;
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    beforeTabLeave(activename, oldactivename) {
      console.log("即将离开的标签页是" + oldactivename);
      console.log("即将进入的标签页是" + activename);
      //如果在第一栏 且未选中商品分类
      if (oldactivename === "0" && this.addForm.goods_cat.length === 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    async tabclick() {
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateID}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数列表失败！");
        }
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTable = res.data;
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateID}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取静态参数列表失败！");
        }
        this.onlyTable = res.data;
      }
    },
    //处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.dialogVisible=true
    },
    //处理图片移除效果
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex((x) => {
        x.pic === filePath;
      });
      this.addForm.pics.splice(i, 1);
    },
    //图片上传成功的事件
    handleSuccess(response) {
      //得到图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      //将图片信息对象的push到pics数组中
      this.addForm.pics.push(picInfo);
    },
    //添加商品
    async Add(){
      console.log(this.addForm)
      this.$refs.addFormRef.validate(vaild=>{
        if(!vaild){
          return this.$message.error("请填写必要的表单数据")
        }
      })
      //lodash cloneDeep()
      //获得拷贝对象
      const from =  _.cloneDeep(this.addForm)
      from.goods_cat = from.goods_cat.join(",")
      //处理动态参数和静态属性
      this.manyTable.forEach(item=>{
        const newInfo={
          attr_id:item.attr_id,
          attr_value:item.attr_vals.join(" ")
        }
        this.addForm.attrs.push(newInfo)
      })
      this.onlyTable.forEach(item=>{
        const newInfo={
          attr_id:item.attr_id,
          attr_value:item.attr_vals
        }
        this.addForm.attrs.push(newInfo)
      })
      //赋值给拷贝对象
      from.attrs=this.addForm.attrs
      const {data:res} = await this.$http.post(`goods`,from)
      if(res.meta.status!==201){
        return this.$message.error("添加商品失败")
      }
      this.$message.success("添加商品成功")
      this.$router.push("/goods")
    }
  },
  computed: {
    cateID() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewimg{
  width: 100%;
}
.btnAdd{
  margin-top: 15px;
}
</style>