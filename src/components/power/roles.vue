<template>
  <div>
    <!--面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',i1===0?'bdtop':'','.vcenter']"
              v-for=" (item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 1级权限 -->
              <el-col :span="5">
                <el-tag closable @close="remove(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 2、3级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2===0?'':'bdtop','.vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 2级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="remove(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 3级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3,i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="remove(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template>
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button @click="showLog(scope.row)" size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="50%" @close="reset">
      <!-- 树形控件 -->
      <el-tree ref="treeRef" :default-checked-keys="defKeys" :data="rightsList" :props="defaultProps" show-checkbox node-key="id" default-expand-all></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allowRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [{ roleName: "主管", roleDesc: "技术负责人" }],
      dialogVisible:false,
      rightsList:[],
      defaultProps:{
        label:"authName",
        children:"children"
      },
      defKeys:[],
      roleId:""
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户权限列表失败");
      }
      this.rolesList = res.data;
    },
    async remove(role, Id) {
      const confirm = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirm !== confirm) {
        return this.$message.info("取消删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${Id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败");
      }
      role.children = res.data;
    },
    async showLog(role) {
      this.roleId=role
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限失败");
      }
      this.rightsList=res.data
      getLeafKeys(role,this.defKeys)
      this.dialogVisible=true     
    },
    getLeafKeys(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item,arr)
      })
    },
    //监听分配权限对话框的关闭事件
    reset(){
      this.defKeys=[]
    },
    async allowRights(){
      const keys=[
        ...this.$ref.treeRef.getCheckedKeys(),
        ...this.$ref.treeRef.getHalfCheckedKeys(),
      ]
      const idStr=keys.join(",")
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限失败");
      }
      this.$message.success("权限分配成功")
      this.getRolesList();
      this.dialogVisible=false
    }
  }
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eeeeee;
}
.bdbottom {
  border-bottom: 1px solid #eeeeee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>