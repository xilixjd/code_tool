<template>
    <div class="div-component">
        <el-row :gutter="12" v-for="index in rowLength" :key="index">
            <el-col :span="8" v-for="(component, index1) in components" :key="index+index1">
                <div @click="clickCard(component.name)">
                    <el-card shadow="hover" :body-style="cardStyle">
                        {{component.name}}
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
    name: 'componentList',
    data() {
        return {
            cardStyle: {
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: 'lavender',
            },
            components: [],
        }
    },
    methods: {
        clickCard(componentName) {
            const tagParam = this.$route.params.tag
            this.$router.push(`/tag/${tagParam}/component/${componentName}`)
        }
    },
    computed: {
        rowLength() {
            const rowLength = Math.ceil(this.components.length / 3)
            return rowLength
        }
    },
    watch: {},
    async mounted() {
        const tagParam = this.$route.params.tag
        if (tagParam) {
            const data = await request("/component/getComponents", { data: { tag: tagParam } })
            this.components = data.data
        }
    }
}
</script>