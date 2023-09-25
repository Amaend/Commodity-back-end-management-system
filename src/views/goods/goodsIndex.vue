<template>
    <div class="goods">
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" clearable v-model="pageData.query" @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="text" @click="goAddGoods">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table border :data="goodsList.goods" style="width: 100%" stripe>
                <el-table-column prop="date" label="#" type="index">
                </el-table-column>
                <el-table-column prop="goods_name" label="商品名称">
                </el-table-column>
                <el-table-column prop="goods_price" label="商品价格（元）" width="115">
                </el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="85">
                </el-table-column>
                <el-table-column prop="add_time" label="创建时间" width="150">
                    <template slot-scope="scope">
                        {{ scope.row.add_time | dataFormat }}
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="操作" width="120">
                    <template v-slot="scope">
                        <!-- 编辑按钮 -->
                        <el-button type="primary" size="mini" icon="el-icon-edit" autofocus></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" size="mini" icon="el-icon-delete" autofocus
                            @click="deleteGoods(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页器功能 -->
            <div class="block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :page-sizes="[1, 2, 3, 4, 5, 6]" :page-size="pageData.pagesize"
                    layout="total, sizes, prev, pager, next, jumper" :current-page="pageData.pagenum"
                    :total="this.goodsList.total">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { reqGoodsById, reqEmitGoodsInfo, reqDeleteGoods } from '@/api/index'
export default {
    data() {
        return {
            pageData: {
                query: '',
                pagenum: null,
                pagesize: null
            },
        }
    },
    methods: {
        handleSizeChange(val) {
            this.pageData.pagesize = val
            window.sessionStorage.setItem('goodspagesize', val)
            this.$store.dispatch('getGoodsList', this.pageData)
        },
        handleCurrentChange(val) {
            this.pageData.pagenum = val;
            window.sessionStorage.setItem('goodspagenum', val)
            this.$store.dispatch('getGoodsList', this.pageData)
        },
        getGoodsList() {
            this.$store.dispatch('getGoodsList', this.pageData)
        },
        deleteGoods(row) {
            // console.log(row)
            this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                reqDeleteGoods(row.goods_id).then((res) => {
                    this.$message({
                        type: 'success',
                        message: res.meta.msg
                    });
                    this.$store.dispatch('getGoodsList', this.pageData)
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        goAddGoods() {
            this.$router.push('goods/add')
        }
    },
    mounted() {
        this.pageData.pagenum = parseInt(sessionStorage.getItem('goodspagenum')) || 1;
        this.pageData.pagesize = parseInt(sessionStorage.getItem('goodspagesize')) || 6;
        this.$store.dispatch('getGoodsList', this.pageData)
    },
    computed: {
        ...mapState({
            goodsList: state => state.goods.goodsList, 	// 商品列表数据
        })
    },
    //这是时间戳js过滤器代码
    filters: {//与data同级
        dataFormat(val) {//val是传递过来的时间戳
            let data = new Date(val);
            let y = data.getFullYear();
            let m = data.getMonth() + 1;
            let d = data.getDay();
            let s = data.getHours();
            let f = data.getMinutes();
            let mi = data.getSeconds();
            return `${y}-${m}-${d} ${s}:${f}:${mi}`;
        }
    }

}
</script>

<style scoped>
.goods {
    padding: 20px;
    padding-bottom: 0;
}

.el-row {
    margin-bottom: 20px;
}

.block {
    margin-top: 20px;
}

.el-button--text:hover {
    background-color: #fff !important;
}

.el-button--text {
    background-color: #F5F7FA;
    width: 100px;
    color: #606266;
    border: 1px solid #DCDFE6
}
</style>