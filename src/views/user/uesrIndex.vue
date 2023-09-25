<template>
    <div class="users">
        <!-- 卡片视图区 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" clearable v-model="pageData.query">
                        <el-button slot="append" icon="el-icon-search" @click="searchUserData"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="text" @click="dialogFormVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区 -->
            <el-table border stripe :data="userData.users">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱">
                    <template v-slot="scope">
                        <div class="cell" @dblclick="showUserInput(scope.row, scope.$index, scope.column.id)">
                            <input type="text" v-model="scope.row.email"
                                v-if="changeUserId == scope.row.id + scope.column.id" @blur="hideUserInput"
                                @change="getUserChangeInfo(scope.row)">
                            <span v-else>{{ scope.row.email }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="电话">
                    <template v-slot="scope">
                        <div class="cell" @dblclick="showUserInput(scope.row, scope.$index, scope.column.id)">
                            <input type="text" v-model="scope.row.mobile"
                                v-if="changeUserId == scope.row.id + scope.column.id || changeUserId == scope.row.id + scope.$index"
                                @blur="hideUserInput" @change="getUserChangeInfo(scope.row)">
                            <span v-else>{{ scope.row.mobile }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="role_name" label="角色" v-slot="scope">
                    <div class="cell" @dblclick="showUserInput(scope.row, scope.$index, scope.column.id)">
                        <el-col :span="12" v-if="changeUserId == scope.row.id + scope.column.id">
                            <el-dropdown @command="(command) => { handleCommand(scope.row, command) }" trigger="click">
                                <span class="el-dropdown-link" @dblclick="hideUserInput">
                                    <input type="text" v-model="scope.row.role_name" @blur="hideUserInput">
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :command="item.id" v-for="(item, index) in rolesList" :key="item.id">
                                        <i :class="`${iconList[index]}`" class="iconfont"></i>
                                        {{ item.roleName }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-col>
                        <span v-else>{{ scope.row.role_name }}</span>
                    </div>
                </el-table-column>
                <el-table-column prop="mg_state" label="状态">
                    <template v-slot="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="mg_state" label="操作" width="200px" v-slot="scope">
                    <!-- 编辑按钮 -->
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="editUserInput(scope.row.id)"
                        autofocus></el-button>
                    <!-- 删除按钮 -->
                    <el-button type="warning" size="mini" icon="el-icon-delete" @click="deleteUser(scope.row)"
                        autofocus></el-button>
                    <el-button type="danger" size="mini" icon="el-icon-setting" @click="setRole(scope.row)"
                        autofocus></el-button>
                </el-table-column>
            </el-table>
            <!-- 分页器功能 -->
            <div class="block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :page-sizes="[1, 2, 3, 4]" :page-size="pageData.pagesize"
                    layout="total, sizes, prev, pager, next, jumper" :current-page="pageData.pagenum"
                    :total="this.userData.total">
                </el-pagination>
            </div>
            <!-- 添加用户 -->
            <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
                <el-form>
                    <el-form-item label="用户名称" :label-width="formLabelWidth">
                        <el-input autocomplete="off" v-model="addUserInfo.username"></el-input>
                    </el-form-item>
                    <el-form-item label="用户密码" :label-width="formLabelWidth">
                        <el-input autocomplete="off" v-model="addUserInfo.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" :label-width="formLabelWidth">
                        <el-input autocomplete="off" v-model="addUserInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" :label-width="formLabelWidth">
                        <el-input autocomplete="off" v-model="addUserInfo.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogFormVisible = false" @click.native="addUser">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
                <div>
                    <p>当前的用户：{{ userInfo.username }}</p>
                    <p>当前的角色：{{ userInfo.role_name }}</p>
                </div>
                <el-select v-model="selectedRoleId" placeHolder="请选择">
                    <el-option v-for="(item, index) in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
                        <i :class="`${iconList[index]}`" class="iconfont"></i>
                        <span style="margin-left: 10px;">{{ item.roleName }}</span>
                    </el-option>
                </el-select>
                <span slot="footer">
                    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 编辑用户弹出库 -->
            <el-dialog title="编辑用户" :visible.sync="editUserFormVisible">
                <el-form>
                    <el-form-item label="姓名" :label-width="formLabelWidth">
                        <el-input autocomplete="off" v-model="changeUserInfo.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" :label-width="formLabelWidth">
                        <el-input autocomplete="off" v-model="changeUserInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" :label-width="formLabelWidth">
                        <el-input autocomplete="off" v-model="changeUserInfo.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editUserFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="emitUserChangeInfo">确 定</el-button>
                </div>
            </el-dialog>
        </el-card>

    </div>
</template>

<script>
import { mapState } from 'vuex';
import { reqChangeUseState, reqAddUser, reqChangeUser, reqDeleteUser, reqChangeUserRole, reqFindUserById } from '@/api';
export default {
    data() {
        return {
            pageData: {
                query: '',
                pagenum: null,
                pagesize: null
            },
            dialogFormVisible: false,
            formLabelWidth: '120px',
            addUserInfo: {
                username: '',
                password: '',
                email: '',
                mobile: '',
            },
            changeUserInfo: {

            },
            changeUserId: null,
            userInfo: {},
            setRoleDialogVisible: false,
            selectedRoleId: null,
            iconList: ['icon-guanliyuanrenzheng', 'icon-erji-guanliyuanshouye', 'icon-yezhuguanli-', 'icon-vip1', 'icon-vip', 'icon-yonghuziliao', 'icon-dagongren'],
            editUserFormVisible: false
        };
    },
    methods: {
        handleSizeChange(val) {
            this.pageData.pagesize = val
            window.sessionStorage.setItem('pagesize', val)
            this.$store.dispatch('getUserData', this.pageData)
        },
        handleCurrentChange(val) {
            this.pageData.pagenum = val;
            window.sessionStorage.setItem('pagenum', val)
            this.$store.dispatch('getUserData', this.pageData)
        },
        async userStateChange(userinfo) {
            const reslut = await reqChangeUseState(userinfo.id, userinfo.mg_state)
            if (reslut.meta.status !== 200) {
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error(reslut.meta.msg)
            }
            return this.$message.success(reslut.meta.msg)
        },
        searchUserData() {
            this.$store.dispatch('getUserData', this.pageData)
        },
        async addUser() {
            const reslut = await reqAddUser(this.addUserInfo)
            if (reslut.meta.status !== 201) {
                return this.$message.error(reslut.meta.msg)
            }
            this.$store.dispatch('getUserData', this.pageData)
            return this.$message.success(reslut.meta.msg)
        },
        showUserInput(row, index, column) {
            this.changeUserId = row.id + column
        },
        hideUserInput() {
            setTimeout(() => {
                this.changeUserId = null
            }, 500)
        },
        async editUserInput(id) {
            // this.changeUserId = row.id + index
            console.log(id)
            let reslut = await reqFindUserById(id)
            if (reslut.meta.status !== 200) return this.$message.error(this.meta.msg)
            this.changeUserInfo = reslut.data
            this.editUserFormVisible = true
        },
        async emitUserChangeInfo() {
            let reslut = await reqChangeUser(this.changeUserInfo.id, this.changeUserInfo)
            if (reslut.meta.status !== 200) {
                return this.$message.error(reslut.meta.msg)
            }
            this.$store.dispatch('getUserData', this.pageData)
            this.editUserFormVisible = false
            return this.$message.success(reslut.meta.msg)
        },
        async getUserChangeInfo(row) {
            this.changeUserInfo.mobile = row.mobile;
            this.changeUserInfo.email = row.email;
            let reslut = await reqChangeUser(row.id, this.changeUserInfo)
            if (reslut.meta.status !== 200) {
                return this.$message.error(reslut.meta.msg)
            }
            return this.$message.success(reslut.meta.msg)

        },
        deleteUser(row) {
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                reqDeleteUser(row.id).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.$store.dispatch('getUserData', this.pageData)
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        async handleCommand(row, command) {
            this.selectedRoleId = command
            let reslut = await reqChangeUserRole(row.id, this.selectedRoleId)
            if (reslut.meta.status !== 200) {
                return this.$message.error(reslut.meta.msg)
            }
            this.$store.dispatch('getUserData', this.pageData)
            return this.$message.success(reslut.meta.msg)
        },
        setRole(userInfo) {
            this.userInfo = userInfo
            this.setRoleDialogVisible = true
        },
        async saveRoleInfo() {
            if (!this.selectedRoleId) {
                return this.$message.error("请选择分配的角色！")
            }
            let reslut = await reqChangeUserRole(this.userInfo.id, this.selectedRoleId)
            if (reslut.meta.status !== 200) {
                return this.$message.error(reslut.meta.msg)
            }
            this.$message.success('更新角色成功！')
            this.$store.dispatch('getUserData', this.pageData)
            this.setRoleDialogVisible = false
        },
        setRoleDialogClosed() {
            this.selectedRoleId = ''
            this.userInfo = {}
        }


    },
    computed: {
        ...mapState({
            userData: state => state.users.usersData,
            rolesList: state => state.roles.rolesList,
        })
    },
    mounted() {
        this.pageData.pagenum = parseInt(sessionStorage.getItem('pagenum')) || 1;
        this.pageData.pagesize = parseInt(sessionStorage.getItem('pagesize')) || 4;
        this.$store.dispatch('getUserData', this.pageData)
        this.$store.dispatch('getRolesList')
    },

}
</script>

<style scoped>
.users {
    padding: 25px;
}

.el-row {
    margin-bottom: 20px;
}

.block {
    margin: 20px 0;
}

.el-button--default:hover,
.el-button--text:hover {
    background-color: #fff !important;
}

.el-button--text {
    background-color: #F5F7FA;
    width: 100px;
    color: #606266;
    border: 1px solid #DCDFE6
}

.creat-input {
    width: 210px;
    height: 52px;
    padding: 12px 0;
    outline: none;
}

.cell>input {
    outline: none;
    border: 1px solid #DCDFE6;
}

.el-icon--right {
    margin-left: 5px;
    position: absolute;
    top: 5px;
    right: 5px;
}

.el-dropdown-link>input {
    outline: none;
    border: 1px solid #DCDFE6;
}

.el-dialog__body p {
    margin: 10px;
}
</style>