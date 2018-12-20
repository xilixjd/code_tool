<template>
    <div class="div-history">
        <el-table
            :data="historyArray"
            border
            >
            <el-table-column
                prop="name"
                label="名称"
            >
            </el-table-column>
            <el-table-column
                prop="author"
                label="作者"
            >
            </el-table-column>
            <el-table-column
                prop="tagName"
                label="tag"
            >
            </el-table-column>
            <el-table-column
                prop="componentName"
                label="组件"
            >
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="日期"
            >
            </el-table-column>
            <el-table-column
                label="操作"
            >
            <template slot-scope="scope">
                <el-button @click="download(scope.row)" type="text">下载</el-button>
                <el-button @click="edit(scope.row)" type="text">编辑</el-button>
                <el-button @click="deleteHistory(scope.row)" type="text">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<style>

</style>

<script>
import request from '../util/request.js'
import { downloadFile } from '../util/util.js'

import { Message } from 'element-ui'

export default {
    name: 'history',
    components: {
    },
    data() {
        return {
            historyArray: [],
        }
    },
    methods: {
        download(history) {
            const { _id } = history
            downloadFile(`http://localhost:3000/generate/download?_id=${_id}`)
            downloadFile(`http://localhost:3000/generate/download?_id=${_id}&isJs=true`)
        },
        edit(history) {
            const { tagName, componentName, _id } = history
            this.$router.push({
                path: `/tag/${tagName}/component/${componentName}`,
                query: {
                    _id,
                },
            })
        },
        async deleteHistory(history) {
            const { _id } = history
            const data = await request("/history/deleteHistory", { data: { _id }})
            if (data.code === 0) {
                Message.success(data.message)
                const index = this.historyArray.indexOf(history)
                if (index >= 0) {
                    this.historyArray.splice(index, 1)
                }
            }
        }
    },
    computed: {
    },
    watch: {},
    async mounted() {
        const data = await request("/history")
        this.historyArray = data.data
    }
}
</script>