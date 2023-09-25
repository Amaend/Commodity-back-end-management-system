<template>
    <div class="roles">
        <el-card>
            <el-button type="text" @click="dialogFormVisible = true" @click.native="editRoleFlag = true">添加角色</el-button>
            <el-table border stripe :data="rolesList" height="459">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row v-for="(item1, index) in scope.row.children" :key="item1.id + index"
                            :class="['bdbottom', index == 0 ? 'bdtop' : '', 'vcenter']">
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row v-for="(item2, index) in item1.children" :key="item2.id + index"
                                    :class="[index == 0 ? '' : 'bdtop', 'vcenter']">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{
                                            item2.authName
                                        }}</el-tag>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag v-for="(item3, index) in item2.children" :key="item3.id + index"
                                            type="warning" closable @close="removeRightById(scope.row, item3.id)">{{
                                                item3.authName }}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" width="50">
                </el-table-column>
                <el-table-column prop="roleName" label="角色名称" width="172">
                    <template v-slot="scope">
                        <div class="cell" @dblclick="showUserInput(scope.row, scope.$index, scope.column.id)">
                            <input type="text" v-model="scope.row.roleName"
                                v-if="changeRoleId == scope.row.id + scope.column.id" @blur="hideUserInput"
                                @change="getRoleChangeInfo(scope.row)">
                            <span v-else>{{ scope.row.roleName }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="roleDesc" label="角色描述">
                    <template v-slot="scope">
                        <div class="cell" @dblclick="showUserInput(scope.row, scope.$index, scope.column.id)">
                            <input type="text" v-model="scope.row.roleDesc"
                                v-if="changeRoleId == scope.row.id + scope.column.id" @blur="hideUserInput"
                                @change="getRoleChangeInfo(scope.row)">
                            <span v-else>{{ scope.row.roleDesc }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="level" label="操作" width="350">
                    <template v-slot="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                            @click="editRoleInfo(scope.row.id)">编辑</el-button>
                        <el-button type="warning" icon="el-icon-delete" size="mini"
                            @click="deleteRole(scope.row.id)">删除</el-button>
                        <el-button type="danger" icon="el-icon-setting" size="mini"
                            @click="assignRight(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 添加用户弹出框 -->
            <el-dialog :title="this.editRoleFlag ? '添加角色' : '编辑角色'" :visible.sync="dialogFormVisible">
                <el-form>
                    <el-form-item label="角色名称" :label-width="formLabelWidth">
                        <el-input autocomplete="off" v-model="RoleInfo.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" :label-width="formLabelWidth">
                        <el-input autocomplete="off" v-model="RoleInfo.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelRole">取 消</el-button>
                    <el-button type="primary" @click.native="addRoleInfo" @click="dialogFormVisible = false">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="分配权限" :visible.sync="showSetRoleDialog" width="50%" @close="closeDialog">
                <el-tree :props="props" show-checkbox :data="rightsTree" node-key="id" default-expand-all
                    :default-checked-keys="defaultKeys" ref="treeRef">
                </el-tree>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showSetRoleDialog = false">取 消</el-button>
                    <el-button type="primary" @click="showSetRoleDialog = false" @click.native="setRoleRight">确
                        定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { reqAddRole, reqGetRoleId, reqEditRole, reqDeleteRole, reqAssignRight, reqRemoveRight, reqRightsTree } from "@/api/index"
export default {
    data() {
        return {
            dialogFormVisible: false,
            editRoleFlag: true,
            formLabelWidth: '120px',
            RoleInfo: {
                roleName: '',
                roleDesc: '',
                roleId: null
            },
            showSetRoleDialog: false,
            rightsTree: [],
            props: {
                label: 'authName',
                children: 'children'
            },
            defaultKeys: [],
            changeRoleId: null
        }
    },
    created() {
        this.$store.dispatch('getRolesList')
    },
    computed: {
        ...mapState({
            rolesList: state => state.roles.rolesList
        })
    },
    methods: {
        async addRoleInfo() {
            if (!this.RoleInfo.roleName) return this.$message.error('请输入角色名称')
            if (this.editRoleFlag) {
                let reslut = await reqAddRole(this.RoleInfo)
                if (reslut.meta.status !== 201) {
                    this.$message.error(reslut.meta.msg)
                }
                this.$message.success(reslut.meta.msg)
            } else {
                let reslut = await reqEditRole(this.RoleInfo)
                if (reslut.meta.status !== 200) {
                    this.$message.error(reslut.meta.msg)
                }
                this.$message.success(reslut.meta.msg)
            }
            this.$store.dispatch('getRolesList')
            this.RoleInfo = {
                roleDesc: '',
                roleName: '',
                roleId: null
            };
        },
        async editRoleInfo(id) {
            this.editRoleFlag = false
            this.dialogFormVisible = true
            let reslut = await reqGetRoleId(id)
            if (reslut.meta.status == 200) {
                const { roleDesc, roleName, roleId } = reslut.data;
                this.RoleInfo = { roleDesc, roleName, roleId };
            }
        },
        cancelRole() {
            this.dialogFormVisible = false
            this.RoleInfo = {
                roleDesc: '',
                roleName: '',
                roleId: null
            };
        },
        async deleteRole(id) {
            this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                reqDeleteRole(id).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.$store.dispatch('getRolesList');
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        async removeRightById(row, rightId) {
            const confirmReslut = await
                this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).catch((err) => err);
            if (confirmReslut !== 'confirm') {
                return this.$message.info('你取消了删除！')
            }
            let reslut = await reqRemoveRight(row.id, rightId)
            if (reslut.meta.status !== 200) return this.$message.warning(reslut.meta.msg)
            this.$message.success(reslut.meta.msg)
            row.children = reslut.data
        },
        async assignRight(row) {
            // console.log(id)
            this.RoleInfo.roleId = row.id
            let reslut = await reqRightsTree()
            if (reslut.meta.status == 200) {
                this.rightsTree = reslut.data
            }
            this.getleafKeys(row, this.defaultKeys)
            this.showSetRoleDialog = true
        },
        getleafKeys(node, arr) {
            if (!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(child => {
                this.getleafKeys(child, arr)
            })
        },
        closeDialog() {
            this.defaultKeys = []
        },
        async setRoleRight() {
            let keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            let keysStr = keys.join(',')
            let reslut = await reqAssignRight(this.RoleInfo.roleId, keysStr)
            if (reslut.meta.status !== 200) return this.$message.warning(reslut.meta.msg)
            this.$message.success(reslut.meta.msg)
            this.$store.dispatch('getRolesList')
        },
        showUserInput(row, index, column) {
            this.changeRoleId = row.id + column
        },
        hideUserInput() {
            setTimeout(() => {
                this.changeRoleId = null
            }, 500)
        },
        async getRoleChangeInfo(row) {
            console.log(row)
            this.RoleInfo.roleDesc = row.roleDesc
            this.RoleInfo.roleName = row.roleName
            this.RoleInfo.roleId = row.id
            let reslut = await reqEditRole(this.RoleInfo)
            if (reslut.meta.status !== 200) {
                this.$message.error(reslut.meta.msg)
            }
            this.$message.success(reslut.meta.msg)
        }

    }
}
</script>

<style scoped>
.roles {
    padding: 20px;
    padding-bottom: 0;
    position: relative;
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

.el-tag {
    margin: 7px;
}

.vcenter {
    display: flex;
    align-items: center;
}

.el-button--text {
    background-color: #F5F7FA;
    width: 100px;
    color: #606266;
    border: 1px solid #DCDFE6;
    margin-bottom: 10px;
}

.el-button--text:hover {
    background-color: #fff !important;
}

.cell>input {
    width: 100%;
    outline: none;
    border: 1px solid #DCDFE6
}

.el-button {
    padding: 10px 5px;
}
</style>