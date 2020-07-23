<template>
  <div>
    <!--面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert :closable="false" title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="seleteCateList"
            :options="catelist"
            :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name', children:'children'}"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- Tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            @click="dialogVisible=true"
            :disabled="isBtndisabled"
            type="primary"
            size="mini"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTable" border stripe>
            <el-table-column type="expand">
              <!-- 循环渲染Tag标签 -->
              <template slot-scope="scope">
                <el-tag @close="handleclose(i,scope.row)" v-for="(item,i) in scope.row.attr_vals" :key="i" closable>{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row.)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                >编辑</el-button>
                <el-button
                  @click="removeParams(scope.row.attr_id)"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            @click="dialogVisible=true"
            :disabled="isBtndisabled"
            type="primary"
            size="mini"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTable" border stripe>
            <el-table-column type="expand">
              <!-- 循环渲染Tag标签 -->
              <template slot-scope="scope">
                <el-tag @close="handleclose(i,scope.row)" v-for="(item,i) in scope.row.attr_vals" :key="i" closable>{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row.)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                >编辑</el-button>
                <el-button
                  @click="removeParams(scope.row.attr_id)"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="dialogVisible" width="50%">
      <el-form :model="addForm" :rules="addFormrules" ref="addFormref" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editdialogClosed"
    >
      <el-form :model="editForm" :rules="editFormrules" ref="editFormref" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      catelist: [],
      //级联选择器双向绑定到的数组
      seleteCateList: [],
      activeName: "many",
      manyTable: [],
      onlyTable: [],
      dialogVisible: false,
      addForm: {
        attr_name: ""
      },
      addFormrules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      editdialogVisible: false,
      editForm: {},
      editFormrules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      this.catelist = res.data;
    },
    handleChange() {
      this.getParamsData();
    },
    handleClick() {
      console.log(this.activeName);
      this.getParamsData();
    },
    async getParamsData() {
      //选中的不是三级分类
      if (this.seleteCateList.length !== 3) {
        this.manyTable=[];
        this.onlyTable=[];
        this.seleteCateList = [];
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        //控制文本框的显示与隐藏
        item.inputVisible=false
        //文本框输入的内容
        item.inputValue=""
      });
      //获取到的数据需要判断，根据不同的Tab标签分别保存数据
      if (this.activeName === "many") {
        this.manyTable = res.data;
      } else {
        this.onlyTable = res.data;
      }
    },
    addParams() {
      this.$refs.addFormref.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `catrgoires/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败");
        }
        this.$message.success("添加参数成功");
        this.dialogVisible = false;
        this.getParamsData();
      });
    },
    async showEditDialog(attr_id) {
      this.editdialogVisible = true;
      const { data: res } = await this.$http.get(
        `catrgoires/${this.cateId}/attributes/${attr_id}`,
        {
          attr_sel: this.activeName
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数信息失败");
      }
      this.editForm = res.data;
      this.editdialogVisible = true;
    },
    editdialogClosed() {
      this.$refs.editFormref.resetFields();
    },
    editParams() {
      this.$refs.editFormref.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `catrgoires/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取参数信息失败");
        }
        this.$message.success("修改参数成功");
        this.getParamsData();
        this.editdialogVisible = false;
      });
    },
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete(
        `catrgoires/${this.cateId}/attributes/${this.attr_id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除参数信息失败");
      }
      this.$message.success("删除参数成功！");
      this.getParamsData();
    },
    async handleInputConfirm(itselfid){
      if(itselfid.inputValue.trim().length===0){
        itselfid.inputValue=""
        itselfid.inputVisible=false
        return
      }
      //如果没有return则要进行后续结果
      itselfid.attr_vals.push(itselfid.inputValue.trim())
      itselfid.inputVisible=false
      itselfid.inputValue=""
      this.saveAttrValue(itselfid)
    },
    showInput(itselfid){
      itselfid.inputVisible=true
      //让文本框自动获取焦点
      //$nextTick方法的作用，就是当页面上的元素被重新渲染之后，才指定回调函数中的代码
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    handleclose(i,itself){
       itself.attr_vals.splice(i,1)
       this.saveAttrValue(itselfid)
    },
    async saveAttrValue(itselfid){
      const { data: res } = await this.$http.put(`catrgoires/${this.cateId}/attributes/${itselfid.attr_id}`,{
        attr_name:itselfid.attr_name,
        attr_vals:itselfid.attr_vals.join(" "),
        attr_sel:itselfid.attr_sel
      })
      if (res.meta.status !== 200) {
        return this.$message.error("修改参数信息失败");
      }
      this.$message.success("修改参数成功！");
    }
  },
  computed: {
    //计算属性 如果按钮需要被禁用则返回true
    isBtndisabled() {
      if (this.seleteCateList.length !== 3) {
        return true;
      }
      return false;
    },
    cateId() {
      if (this.seleteCateList.length === 3) {
        return this.seleteCateList[2];
      }
      return null;
    },
    //动态标题
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  }
};
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag{
  width: 120px;
}
</style>