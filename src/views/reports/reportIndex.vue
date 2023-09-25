<template>
    <div class="reports">
        <el-card>
            <div id="main" style="height: 500px; width: 1000px;"></div>
        </el-card>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import { reqReportsData } from '@/api'
export default {
    data() {
        return {
            options: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            }
        }
    },
    async mounted() {
        var myChart = echarts.init(document.getElementById('main'));
        let res = await reqReportsData()
        if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
        }
        myChart.setOption({ ...this.options, ...res.data });
    }
}
</script>

<style scoped>
.reports {
    padding: 20px;
}
</style>