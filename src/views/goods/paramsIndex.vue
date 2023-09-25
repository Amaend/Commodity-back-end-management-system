<template>
    <div class="params">
        <el-card>
            <el-alert title="注意:只允许为第三级分类设置相关参数!" type="warning" show-icon :closable="false">
            </el-alert>
            <!-- 选择商品分类区域-->
            <el-row class="cat-option">
                <el-col>
                    <span class="selected-span">选择商品分类：</span>
                    <div class="block">
                        <el-cascader v-model="selectedKeys" :options="cateList" :props="CateProps" @change="cateChange"
                            clearable expand-trigger="hover"></el-cascader>
                    </div>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" :disabled="this.selectedKeys.length !== 3 ? true : false"
                        @click="dialogFormVisible = true">动态参数</el-button>
                    <el-table border :data="manyTableData" style="width: 100%" stripe height="280">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="tagClose(index,
                                    scope.row)">{{ item }}</el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                                    ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New
                                    Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="#" type="index">
                        </el-table-column>
                        <el-table-column label="参数名称" prop="attr_name">
                        </el-table-column>
                        <el-table-column prop="address" label="操作">
                            <template v-slot="scope">
                                <!-- 编辑按钮 -->
                                <el-button type="primary" size="mini" icon="el-icon-edit" autofocus
                                    @click="editParamsInfo(scope.row)"></el-button>
                                <!-- 删除按钮 -->
                                <el-button type="danger" size="mini" icon="el-icon-delete" autofocus
                                    @click="deleteParams(scope.row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" :disabled="this.selectedKeys.length !== 3 ? true : false"
                        @click="dialogFormVisible = true">静态属性</el-button>
                    <el-table border :data="onlyTableData" style="width: 100%" stripe height="280">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable
                                    @close="tagClose(index, scope.row)">{{ item
                                    }}</el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                                    ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New
                                    Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="#" type="index">
                        </el-table-column>
                        <el-table-column label="参数名称" prop="attr_name">
                        </el-table-column>
                        <el-table-column prop="address" label="操作">
                            <template v-slot="scope">
                                <!-- 编辑按钮 -->
                                <el-button type="primary" size="mini" icon="el-icon-edit" autofocus
                                    @click="editParamsInfo(scope.row)"></el-button>
                                <!-- 删除按钮 -->
                                <el-button type="danger" size="mini" icon="el-icon-delete" autofocus
                                    @click="deleteParams(scope.row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <el-dialog :title="this.activeName == 'many' ? '添加动态参数' : '添加静态属性'" :visible.sync="dialogFormVisible" width="50%"
            @close="addDialogClose">
            <el-form ref="addFormRef" :model="addForm">
                <el-form-item :label="this.activeName == 'many' ? '动态参数' : '静态属性'" :label-width="formLabelWidth">
                    <el-input v-model="addForm.atrr_name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="this.activeName == 'many' ? '修改动态参数' : '修改静态属性'" :visible.sync="editdialogFormVisible"
            width="50%" @close="editDialogClose">
            <el-form ref="editFormRef" :model="editForm">
                <el-form-item :label="this.activeName == 'many' ? '动态参数' : '静态属性'" :label-width="formLabelWidth">
                    <el-input v-model="editForm.atrr_name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editdialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { reqGetAttrList, reqGetCatelist, reqAddParams, reqEditParamsInfo, reqDeleteParams } from '@/api';
export default {
    data() {
        return {
            cateList: [],
            selectedKeys: [],
            CateProps: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            activeName: 'many',
            manyTableData: [],
            onlyTableData: [],
            dialogFormVisible: false,
            addForm: {
                atrr_name: ''
            },
            formLabelWidth: '100px',
            editdialogFormVisible: false,
            editForm: {
                atrr_name: '',
                attr_id: null
            },
        }
    },
    methods: {
        async getCateList() {
            let res = await reqGetCatelist()
            if (res.meta.status !== 200) {
                return this.$message.error('获取分类列表失败！')
            }
            this.cateList = res.data;
        },
        cateChange() {
            this.getParamsData()
        },
        handleTabClick() {
            this.getParamsData()
        },
        async getParamsData() {
            if (this.selectedKeys.length !== 3) {
                this.selectedKeys = [],
                    this.manyTableData = []
                this.onlyTableData = []
                return
            }
            let res = await reqGetAttrList(this.cateId, this.activeName)
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                item.inputValue = '',
                    item.inputVisible = false
            })
            if (this.activeName == 'many') {
                this.manyTableData = res.data
            } else {
                this.onlyTableData = res.data;
            }
        },
        addDialogClose() {
            this.addForm.atrr_name = ''
        },
        addParams() {
            this.$refs.addFormRef.validate(async (valid) => {
                if (!valid) return
                let res = await reqAddParams(this.cateId, this.activeName, this.addForm.atrr_name)
                if (res.meta.status !== 201) {
                    this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                this.getParamsData()
            })
            this.dialogFormVisible = false;
        },
        editParamsInfo(row) {
            this.editdialogFormVisible = true
            this.editForm.atrr_name = row.attr_name
            this.editForm.attr_id = row.attr_id;
        },
        editDialogClose() {
            this.addForm.atrr_name = ''
        },
        async editParams() {
            let res = await reqEditParamsInfo(this.cateId, this.editForm.attr_id, this.editForm.atrr_name, this.activeName)
            if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.getParamsData()
            this.editdialogFormVisible = false;
        },
        deleteParams(row) {
            this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                reqDeleteParams(this.cateId, row.attr_id).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getParamsData()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        async handleInputConfirm(row) {
            if (row.inputValue.trim().length == 0) {
                row.inputVisible = false
                row.inputValue = ''
                return
            }
            row.attr_vals.push(row.inputValue.trim())
            row.inputVisible = false
            row.inputValue = ''
            // console.log(this.inputValue)
            let res = await reqEditParamsInfo(this.cateId, row.attr_id, row.attr_name, this.activeName, row.attr_vals.join(' '))
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
        },
        showInput(row) {
            row.inputVisible = true
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        async tagClose(index, row) {
            row.attr_vals.splice(index, 1)
            let res = await reqEditParamsInfo(this.cateId, row.attr_id, row.attr_name, this.activeName, row.attr_vals.join(' '))
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
        }
    },
    created() {
        this.getCateList();
    },
    computed: {
        cateId() {
            if (this.selectedKeys.length == 3) {
                return this.selectedKeys[2]
            }
            return null
        }
    }

}
</script>

<style scoped>
.params {
    padding: 20px;
}

.cat-option {
    margin: 15px 0;
}

.selected-span {
    font-size: 16px;
    display: block;
    margin-bottom: 10px;
}

.el-button--primary {
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
    margin-bottom: 10px;
}

.el-tag {
    margin: 10px;
}

.input-new-tag {
    width: 120px;
}
</style>