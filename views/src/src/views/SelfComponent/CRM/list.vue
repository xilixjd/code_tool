<template>
    <div class="div-crmList">
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="150px">
            <el-collapse v-model="activeNames">
                <el-collapse-item title="文件名和作者" name="0" >
                    <el-form-item
                        style="display: inline-block;"
                        :label="'文件名'"
                        :prop="'fileName'"
                        :rules="{ required: true, message: '不能为空', trigger: 'blur' }"
                    >
                        <el-input style="width: 300px;" v-model="dynamicValidateForm.fileName"></el-input>
                    </el-form-item>
                    <el-form-item
                        style="display: inline-block;"
                        :label="'作者'"
                        :prop="'author'"
                        :rules="{ required: true, message: '不能为空', trigger: 'blur' }"
                    >
                        <el-input style="width: 300px;" v-model="dynamicValidateForm.author"></el-input>
                    </el-form-item>
                    <el-form-item
                        :label="'请求url'"
                        :prop="'requestUrl'"
                        :rules="{ required: true, message: '不能为空', trigger: 'blur' }"
                    >
                        <el-input style="width: 600px;" v-model="dynamicValidateForm.requestUrl"></el-input>
                    </el-form-item>
                </el-collapse-item>
                <el-collapse-item title="input框" name="1" >
                    <div v-for="(input, index) in dynamicValidateForm.inputs" :key="index">
                        <el-form-item
                            style="display: inline-block;"
                            :label="'输入框后端参数' + index"
                            :prop="'inputs.' + index + '.inputKey'"
                            :rules="{
                                required: true, message: '不能为空', trigger: 'blur'
                            }"
                        >
                            <el-input style="width: 300px;" v-model="input.inputKey"></el-input>
                        </el-form-item>
                        <el-form-item
                            style="display: inline-block;"
                            :label="'输入框参数中文' + index"
                            :prop="'inputs.' + index + '.inputValue'"
                            :rules="{
                                required: true, message: '不能为空', trigger: 'blur'
                            }"
                        >
                            <el-input style="width: 300px;" v-model="input.inputValue"></el-input><el-button @click.prevent="removeInput(input)">删除</el-button>
                        </el-form-item>
                    </div>
                    <el-form-item>
                        <el-button @click="addInput">新增input</el-button>
                    </el-form-item>
                </el-collapse-item>
                <el-collapse-item title="select框" name="2" >
                    <div v-for="(select, index) in dynamicValidateForm.selects" :key="index">
                        <el-form-item
                            style="display: inline-block;"
                            :label="'slect后端参数' + index"
                            :prop="'selects.' + index + '.selectKey'"
                            :rules="{
                                required: true, message: '不能为空', trigger: 'blur'
                            }"
                        >
                            <el-input style="width: 300px;" v-model="select.selectKey"></el-input>
                        </el-form-item>
                        <el-form-item
                            style="display: inline-block;"
                            :label="'slect后端中文' + index"
                            :prop="'selects.' + index + '.selectValue'"
                            :rules="{
                                required: true, message: '不能为空', trigger: 'blur'
                            }"
                        >
                            <el-input style="width: 300px;" v-model="select.selectValue"></el-input><el-button @click.prevent="removeSelect(select)">删除</el-button>
                        </el-form-item>
                        <div v-for="(option, index1) in select.options" :key="''+index+index1">
                            <el-form-item
                                style="display: inline-block;"
                                :label="'option参数后端' + index1"
                                :prop="'selects.' + index + '.options.' + index1 + '.optionKey'"
                                :rules="{
                                    required: true, message: '不能为空', trigger: 'blur'
                                }"
                            >
                                <el-input style="width: 300px;" v-model="option.optionKey"></el-input>
                            </el-form-item>
                            <el-form-item
                                style="display: inline-block;"
                                :label="'option参数中文' + index1"
                                :prop="'selects.' + index + '.options.' + index1 + '.optionValue'"
                                :rules="{
                                    required: true, message: '不能为空', trigger: 'blur'
                                }"
                            >
                                <el-input style="width: 300px;" v-model="option.optionValue"></el-input>
                                <el-button @click.prevent="addOption(select.options)">新增</el-button>
                                <el-button @click.prevent="removeOption(select, option)">删除</el-button>
                            </el-form-item>
                        </div>
                    </div>
                    <el-form-item>
                        <el-button @click="addSelect">新增select</el-button>
                    </el-form-item>
                </el-collapse-item>
                <el-collapse-item title="table" name="3" >
                    <div v-for="(table, index) in dynamicValidateForm.tables" :key="index">
                        <el-form-item
                            style="display: inline-block;"
                            :label="'table后端参数' + index"
                            :prop="'tables.' + index + '.tableKey'"
                            :rules="{
                                required: true, message: '不能为空', trigger: 'blur'
                            }"
                        >
                            <el-input style="width: 300px;" v-model="table.tableKey"></el-input>
                        </el-form-item>
                        <el-form-item
                            style="display: inline-block;"
                            :label="'table参数中文' + index"
                            :prop="'tables.' + index + '.tableValue'"
                            :rules="{
                                required: true, message: '不能为空', trigger: 'blur'
                            }"
                        >
                            <el-input style="width: 300px;" v-model="table.tableValue"></el-input><el-button @click.prevent="removeTable(table)">删除</el-button>
                        </el-form-item>
                    </div>
                    <el-form-item>
                        <el-button @click="addTable">新增table</el-button>
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>
            <el-form-item style="margin-top: 20px;">
                <el-button @click="submit('dynamicValidateForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style>

</style>

<script>

export default {
    name: 'crmList',
    data() {
        return {
            activeNames: ['0', '1', '2', '3'],
            collapseItemStyle: {
                padding: "20px"
            },
            dynamicValidateForm: {
                fileName: "",
                author: "",
                requestUrl: "",
                inputs: [{
                    inputKey: '',
                    inputValue: ''
                }],
                selects: [
                    {
                        selectKey: '',
                        selectValue: '',
                        options: [
                            {
                                optionKey: '',
                                optionValue: '',
                            }
                        ]
                    }
                ],
                tables: [
                    {
                        tableKey: '',
                        tableValue: ''
                    }
                ]
            }
        }
    },
    methods: {
        addInput() {
            this.dynamicValidateForm.inputs.push({
                inputKey: '',
                inputValue: '',
                key: Date.now()
            })
        },
        removeInput(item) {
            const index = this.dynamicValidateForm.inputs.indexOf(item)
            if (index !== -1) {
                this.dynamicValidateForm.inputs.splice(index, 1)
            }
        },
        addSelect() {
            this.dynamicValidateForm.selects.push({
                selectKey: '',
                options: [
                    {
                        optionKey: '',
                        optionValue: '',
                    }
                ],
                key: Date.now()
            })
        },
        removeSelect(select) {
            const index = this.dynamicValidateForm.selects.indexOf(select)
            if (index !== -1) {
                this.dynamicValidateForm.selects.splice(index, 1)
            }
        },
        addOption(options) {
            options.push({
                optionKey: '',
                optionValue: '',
                key: Date.now(),
            })
        },
        removeOption(select, option) {
            const index = this.dynamicValidateForm.selects.indexOf(select)
            if (index !== -1) {
                const selectLength = select.options.length
                if (selectLength <= 1) {
                    return
                }
                const indexOption = this.dynamicValidateForm.selects[index].options.indexOf(option)
                if (indexOption !== -1) {
                    this.dynamicValidateForm.selects[index].options.splice(indexOption, 1)
                }
            }
        },
        addTable() {
            this.dynamicValidateForm.tables.push({
                tableKey: '',
                tableValue: '',
                key: Date.now()
            })
        },
        removeTable(table) {
            const index = this.dynamicValidateForm.tables.indexOf(table)
            if (index !== -1) {
                this.dynamicValidateForm.tables.splice(index, 1)
            }
        },
        submit(formName) {
            this.$refs[formName].validate(async (valid, prop) => {
                if (valid) {
                    this.submitCallback("/generate/CRM", JSON.stringify(this.dynamicValidateForm), "list")
                }
            })
        }
    },
    computed: {

    },
    watch: {
        fieldStr(val) {
            this.dynamicValidateForm = JSON.parse(this.fieldStr)
            console.log(this.dynamicValidateForm)
        }
    },
    props: ['submitCallback', 'fieldStr']
}
</script>