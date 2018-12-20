<template>
    <div class="div-tag">
        <el-row :gutter="12" v-for="index in tagRowLength" :key="index">
            <el-col :span="8" v-for="(tag, index1) in tags" :key="index+index1">
                <div @click="clickCard(tag.name)">
                    <el-card shadow="hover" :body-style="tagCardStyle">
                        {{tag.name}}
                    </el-card>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<style>

</style>

<script>
import request from '../util/request.js'

export default {
    name: 'tag',
    data() {
        return {
            tagCardStyle: {
                textAlign: 'center',
                cursor: 'pointer'
            },
            tags: [],
        }
    },
    methods: {
        clickCard(tagName) {
            this.$router.push(`/tag/${tagName}`)
        }
    },
    computed: {
        tagRowLength() {
            const rowLength = Math.ceil(this.tags.length / 3)
            return rowLength
        },
    },
    watch: {},
    async mounted() {
        const data = await request("/component")
        this.tags = data.data
    }
}
</script>