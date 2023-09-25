<template>
    <div class="add-goods">
        <el-card>
            <el-alert title="添加商品信息" type="info" show-icon :closable="false" center>
            </el-alert>
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs v-model="activeIndex" tab-position="left" class="el-tabs" :before-leave="beforeTabLeave"
                    @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model.number="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model.number="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model.number="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="">
                            <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="CateProps"
                                @change="cateChange" clearable expand-trigger="hover"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
                            <el-checkbox-group v-model="item.attr_vals" v-for="(itemchild, index) in item.attr_vals"
                                :key="index">
                                <el-checkbox :label="itemchild" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload class="upload-demo" :action="actionUrl" :on-preview="handlePreview"
                            :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                        <el-dialog title="提示" :visible.sync="dialogImgVisible" width="50%">
                            <img :src="previewFile" alt="">
                        </el-dialog>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <el-button type="primary" class="add-btn" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { reqGetCatelist, reqGetAttrList, reqAddGoods } from '@/api';
import _ from 'lodash'
export default {
    data() {
        return {
            activeIndex: 0,
            addForm: {
                goods_name: '',
                goods_number: null,
                goods_price: null,
                goods_weight: null,
                goods_cat: [],
                pics: [],
                goods_introduce: '',
                attrs: []
            },
            addFormRules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' },
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' },
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' },
                ],
                goods_cat: [
                    { required: true, message: '请选择商品分类', trigger: 'blur' },
                ]
            },
            cateList: [],
            CateProps: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            manyTableData: [],
            onlyTableData: [],
            actionUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
            headerObj: {
                Authorization: sessionStorage.getItem('token')
            },
            previewFile: '',
            dialogImgVisible: false
        }
    },
    methods: {
        async getCateList() {
            let res = await reqGetCatelist()
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.cateList = res.data
        },
        cateChange() {
            if (this.addForm.goods_cat.length !== 3) {
                this.addForm.goods_cat = []
            }
            console.log(this.addForm.goods_cat)
        },
        beforeTabLeave(activename, addleavename) {
            if (addleavename === '0' && this.addForm.goods_cat.length !== 3) {
                this.$message.error('请选择商品分类')
                return false
            }
        },
        async tabClicked() {
            if (this.activeIndex == '1') {
                let res = await reqGetAttrList(this.cateId, 'many')
                if (res.meta.status !== 200) {
                    this.$message.error(res.meta.msg)
                }
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                    item.inputValue = '',
                        item.inputVisible = false
                })
                console.log(res.data)
                this.manyTableData = res.data
            } else if (this.activeIndex == '2') {
                let res = await reqGetAttrList(this.cateId, 'only')
                if (res.meta.status !== 200) {
                    this.$message.error(res.meta.msg)
                }
                console.log(res.data)
                this.onlyTableData = res.data
            }
        },
        handlePreview(file) {
            this.previewFile = file.response.data.url
            this.dialogImgVisible = true
        },
        handleRemove(file) {
            const filePath = file.response.data.tmp_path
            const index = this.addForm.pics.findIndex(item => item.pic == filePath)
            this.addForm.pics.splice(index, 1)
        },
        handleSuccess(response) {
            const picInfo = {
                pic: response.data.tmp_path
            }
            this.addForm.pics.push(picInfo)
            console.log(response)
        },
        add() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) {
                    return this.$message.error('请输入必要的信息')
                }
                const form = _.cloneDeep(this.addForm)
                form.goods_cat = form.goods_cat.join(',')
                this.manyTableData.forEach(item => {
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals.join(' ')
                    }
                    this.addForm.attrs.push(newInfo)
                })
                this.onlyTableData.forEach(item => {
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals
                    }
                    this.addForm.attrs.push(newInfo)
                })
                form.attrs = this.addForm.attrs
                let res = await reqAddGoods(form)
                if (res.meta.status !== 201) {
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                this.$router.push('/home/goods')
            })
        }

    },
    created() {
        this.getCateList()
    },
    computed: {
        cateId() {
            if (this.addForm.goods_cat.length === 3) {
                return this.addForm.goods_cat[2]
            }
            return null
        }
    }
}
</script>

<style scoped>
.add-goods {
    padding: 20px;
}

.el-steps {
    margin: 15px 0;
}

.el-tabs {
    height: 400px;
    overflow: auto;
}

.add-btn {
    margin-top: 93px;
}
</style>