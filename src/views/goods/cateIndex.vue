<template>
    <div class="categories">
        <el-card>
            <!-- 添加按钮 -->
            <el-row>
                <el-row>
                    <el-button type="primary" @click="addCateDialogVisible">添加分类</el-button>
                </el-row>
            </el-row>
            <!-- 表格区域 -->
            <div class="tree-table">
                <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index
                    :show-row-index="false" border index-text="#">
                    <template slot="isok" slot-scope="scope">
                        <i class="el-icon-error" v-if="scope.row.cat_deleted" style="color: red;"></i>
                        <i class="el-icon-success" v-else type="success" style="color: lightgreen;"></i>
                    </template>
                    <template slot="order" slot-scope="scope">
                        <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.cat_level == 1">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                    <template slot="option" slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-button type="primary" size="mini" icon="el-icon-edit" autofocus
                            @click="editCateInfo(scope.row)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" size="mini" icon="el-icon-delete" autofocus
                            @click="deleteCateInfo(scope.row)"></el-button>
                    </template>
                </tree-table>
            </div>
            <!-- 分页器 -->
            <div class="block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :page-sizes="[1, 2, 3, 4, 5, 6]" :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper" :current-page="queryInfo.pagenum" :total="this.total">
                </el-pagination>
            </div>
            <!-- 弹出框 -->
            <el-dialog title="添加分类" :visible.sync="dialogFormVisible" @close="addCateDialogClose">
                <el-form ref="addCateForm" :model="addCateFrom">
                    <el-form-item label="分类名称" :label-width="formLabelWidth">
                        <el-input autocomplete="off" v-model="addCateFrom.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类" :label-width="formLabelWidth">
                        <div class="block">
                            <el-cascader v-model="selectedKeys" :options="parentCateList" :props="parentCateProps"
                                @change="parentCateChange" clearable expand-trigger="hover" change-on-select></el-cascader>
                        </div>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCate">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="编辑分类" :visible.sync="editCateDialogFormVisible">
                <el-form ref="addCateForm">
                    <el-form-item label="分类名称" :label-width="formLabelWidth">
                        <el-input autocomplete="off" v-model="editCateForm.cat_name"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editCateDialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="emitCateInfo">确 定</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import { reqGetCateParentList, reqAddCate, reqEditCateFormById, reqDeleteCateInfo } from '@/api/index'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            queryInfo: {
                type: 3,
                pagesize: null,
                pagenum: null
            },
            columns: [
                { lable: '分类名称', prop: 'cat_name', width: 'auto' },
                { lable: '是否有效', type: 'template', template: 'isok', width: 'auto' },
                { lable: '排序', type: 'template', template: 'order', width: 'auto' },
                { lable: '操作', type: 'template', template: 'option', width: 'auto' }
            ],
            formLabelWidth: '120px',
            dialogFormVisible: false,
            addCateFrom: {
                cat_name: '',
                cat_pid: 0,
                cat_level: 0
            },
            parentCateList: [],
            parentCateProps: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            selectedKeys: [],
            editCateDialogFormVisible: false,
            editCateForm: {
                id: null,
                cat_name: ''
            }
        }
    },
    methods: {
        handleSizeChange(val) {
            this.queryInfo.pagesize = val;
            this.$store.dispatch('getCateList', this.queryInfo)
            sessionStorage.setItem('catepagesize', val)
        },
        handleCurrentChange(val) {
            this.queryInfo.pagenum = val;
            this.$store.dispatch('getCateList', this.queryInfo)
            sessionStorage.setItem('catepagenum', val)
        },
        async addCateDialogVisible() {
            this.dialogFormVisible = true;
            let res = await reqGetCateParentList()
            if (res.meta.status == 200) {
                this.parentCateList = res.data;
            }
        },
        parentCateChange() {
            if (this.selectedKeys.length > 0) {
                this.addCateFrom.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
                this.addCateFrom.cat_level = this.selectedKeys.length
            } else {
                this.addCateFrom.cat_pid = 0
                this.addCateFrom.cat_level = 0
            }
        },
        addCateDialogClose() {
            this.addCateFrom.cat_level = 0,
                this.addCateFrom.cat_pid = 0,
                this.addCateFrom.cat_name = '';
            this.selectedKeys = []
        },
        addCate() {
            this.$refs.addCateForm.validate(async valid => {
                if (!valid) return
                let res = await reqAddCate(this.addCateFrom)
                if (res.meta.status !== 201) {
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                this.$store.dispatch('getCateList', this.queryInfo)
                this.dialogFormVisible = false
            })
        },
        editCateInfo(row) {
            this.editCateDialogFormVisible = true;
            this.editCateForm.id = row.cat_id
            this.editCateForm.cat_name = row.cat_name;
        },
        async emitCateInfo() {
            let res = await reqEditCateFormById(this.editCateForm)
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.editCateDialogFormVisible = false
            this.$store.dispatch('getCateList', this.queryInfo)
        },
        deleteCateInfo(row) {
            // console.log(row)
            this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                reqDeleteCateInfo(row.cat_id).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.$store.dispatch('getCateList', this.queryInfo)
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    },
    mounted() {
        this.queryInfo.pagenum = parseInt(sessionStorage.getItem('catepagenum')) || 1;
        this.queryInfo.pagesize = parseInt(sessionStorage.getItem('catepagesize')) || 6;
        this.$store.dispatch('getCateList', this.queryInfo)
    },
    computed: {
        ...mapState({
            cateList: state => state.cates.cateList,
            total: state => state.cates.total,
        })
    }

}
</script>

<style scoped>
.categories {
    padding: 20px;
}

.tree-table {
    margin: 20px;
    margin-left: 0;
    max-height: 380px;
    overflow: auto;
}
</style>