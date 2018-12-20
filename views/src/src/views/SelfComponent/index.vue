<template>
    <div class="div-selfComponent">
        <div v-if="tagParam==='CRM'&&componentParam==='list'">
            <CRM-List :submitCallback="submitCallback" :fieldStr="fieldStr"/>
        </div>
        <div v-else-if="tagParam==='CRM'&&componentParam==='form'">
            <CRM-Form :submitCallback="submitCallback" :fieldStr="fieldStr"/>
        </div>
    </div>
</template>

<style>

</style>

<script>
import request from '../../util/request.js'
import { downloadFile } from '../../util/util.js'

import CRMList from './CRM/list.vue'
import CRMForm from './CRM/form.vue'
import { MessageBox } from 'element-ui'

export default {
    name: 'selfComponent',
    components: {
        CRMList,
        CRMForm,
    },
    data() {
        return {
            components: [],
            tagParam: "",
            componentParam: "",
            fieldStr: "",
        }
    },
    methods: {
        async openDownload(resData) {
            MessageBox.confirm('下载', '成功', {
                confirmButtonText: '下载',
                cancelButtonText: '取消',
                type: 'success',
            }).then(async () => {
                // 确认（下载）
                const _id = resData.historyId
                console.log(_id)
                downloadFile(`http://localhost:3000/generate/download?_id=${_id}`)
                downloadFile(`http://localhost:3000/generate/download?_id=${_id}&isJs=true`)
            }).catch(() => {
                // 取消
                
            })
        },
        async submitCallback(url, field, componentName) {
            const resData = await request(url, {
                data: { field, componentName }
            })
            console.log(resData)
            this.openDownload(resData.data)
        },
        async getParamAndFetchId() {
            const { tag, component } = this.$route.params
            this.tagParam = tag
            this.componentParam = component
            const { _id } = this.$route.query

            if (_id) {
                const data = await request("/history/getHistoryById", { data: { _id } })
                this.fieldStr = data.data.field
            }
        }
    },
    computed: {
    },
    watch: {
        async $route(val) {
            this.getParamAndFetchId()
        }
    },
    async mounted() {
        this.getParamAndFetchId()
    }
}
</script>