<template>
    <div class="order">
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button type="primary" icon="el-icon-search" slot="append"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table border :data="ordersList.goods" style="width: 100%" stripe>
                <el-table-column label="#" type="index">
                </el-table-column>
                <el-table-column prop="order_number" label="订单编号">
                </el-table-column>
                <el-table-column prop="order_price" label="订单价格（元）">
                </el-table-column>
                <el-table-column prop="pay_status" label="是否付款">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货">
                </el-table-column>
                <el-table-column prop="create_time" label="下单时间">
                    <template slot-scope="scope">
                        {{ scope.row.create_time | dataFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template>
                        <!-- 编辑按钮 -->
                        <el-button type="primary" size="mini" icon="el-icon-edit" autofocus @click="showBox"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="success" size="mini" icon="el-icon-s-tools" autofocus
                            @click="showProgressBox"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页器功能 -->
            <div class=" block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :page-sizes="[1, 2, 3, 4, 5, 6]" :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper" :current-page="queryInfo.pagenum"
                    :total="this.ordersList.total">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog title="收货地址" :visible.sync="dialogFormVisible" @close="addressFormClosed">
            <el-form :model="addressForm" ref="addressFormRef">
                <el-form-item label="省市区/县" label-width="100px" prop="address1">
                    <el-cascader :options="cityData" v-model="addressForm.address1" expand-trigger="hover"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" label-width="100px" prop="address2">
                    <el-input v-model="addressForm.address2" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="物流信息" :visible.sync="dialogProgressVisible">
            <el-timeline>
                <el-timeline-item v-for="(item, index) in processInfo" :key="index" :timestamp="item.time">
                    {{ item.context }}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import cityData from './citydata.js'
import { reqProgressInfo } from '@/api'
export default {
    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: null,
                pagesize: null
            },
            dialogFormVisible: false,
            addressForm: {
                address1: [],
                address2: ''
            },
            cityData,
            dialogProgressVisible: false,
            processInfo: [
                {
                    "time": "2018-05-10 09:39:00",
                    "ftime": "2018-05-10 09:39:00",
                    "context": "已签收,感谢使用顺丰,期待再次为您服务",
                    "location": ""
                },
                {
                    "time": "2018-05-10 08:23:00",
                    "ftime": "2018-05-10 08:23:00",
                    "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
                    "location": ""
                },
                {
                    "time": "2018-05-10 07:32:00",
                    "ftime": "2018-05-10 07:32:00",
                    "context": "快件到达 [北京海淀育新小区营业点]",
                    "location": ""
                },
                {
                    "time": "2018-05-10 02:03:00",
                    "ftime": "2018-05-10 02:03:00",
                    "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 23:05:00",
                    "ftime": "2018-05-09 23:05:00",
                    "context": "快件到达 [北京顺义集散中心]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 21:21:00",
                    "ftime": "2018-05-09 21:21:00",
                    "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 13:07:00",
                    "ftime": "2018-05-09 13:07:00",
                    "context": "顺丰速运 已收取快件",
                    "location": ""
                },
                {
                    "time": "2018-05-09 12:25:03",
                    "ftime": "2018-05-09 12:25:03",
                    "context": "卖家发货",
                    "location": ""
                },
                {
                    "time": "2018-05-09 12:22:24",
                    "ftime": "2018-05-09 12:22:24",
                    "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
                    "location": ""
                },
                {
                    "time": "2018-05-08 21:36:04",
                    "ftime": "2018-05-08 21:36:04",
                    "context": "商品已经下单",
                    "location": ""
                }
            ]
        }
    },
    mounted() {
        this.queryInfo.pagenum = parseInt(sessionStorage.getItem('orderspagenum')) || 1;
        this.queryInfo.pagesize = parseInt(sessionStorage.getItem('orderspagesize')) || 6;
        this.$store.dispatch('getOrdersList', this.queryInfo)
    },
    computed: {
        ...mapState({
            ordersList: state => state.orders.ordersList, 	// 商品列表数据
        })
    },
    methods: {
        handleSizeChange(val) {
            this.queryInfo.pagesize = val
            window.sessionStorage.setItem('orderspagesize', val)
            this.$store.dispatch('getOrdersList', this.queryInfo)
        },
        handleCurrentChange(val) {
            this.queryInfo.pagenum = val;
            window.sessionStorage.setItem('orderspagenum', val)
            this.$store.dispatch('getOrdersList', this.queryInfo)
        },
        showBox() {
            this.dialogFormVisible = true; 	// 显示dialog对象
        },
        addressFormClosed() {
            this.$refs.addressFormRef.resetFields()
        },
        async showProgressBox() {
            this.dialogProgressVisible = true
            // let res = await reqProgressInfo()
            // if (res.meta.status !== 200) {
            //     return this.$message.error(res.meta.msg)
            // }
            // console.log(res.data)
        }
    },
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
.order {
    padding: 20px;
}

.el-table {
    margin: 20px 0;
}
</style>