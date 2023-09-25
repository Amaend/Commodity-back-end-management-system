<template>
    <div class="roles">
        <el-card>
            <el-table :data="rightsList" height="520" border stripe>
                <el-table-column type="index">
                </el-table-column>
                <el-table-column prop="authName" label="权限名称">
                </el-table-column>
                <el-table-column prop="path" label="路径">
                </el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level == 0">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level == 1">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    created() {
        this.$store.dispatch('getRightsList')
    },
    computed: {
        ...mapState({
            rightsList: state => state.rights.rightsList,
        })
    }
}
</script>

<style scoped>
.roles {
    padding: 20px;
}
</style>