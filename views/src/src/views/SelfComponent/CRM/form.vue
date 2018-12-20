<template>
    <div class="div-crmList">
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="160px">
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
                    <el-form-item
                        :label="'是否为JSON'"
                        :prop="'isJson'"
                        :rules="{ required: true, message: '不能为空', trigger: 'blur' }"
                    >
                        <el-select v-model="dynamicValidateForm.isJson">
                            <el-option label="是" value="yes"></el-option>
                            <el-option label="否" value=""></el-option>
                        </el-select>
                    </el-form-item>
                </el-collapse-item>
                <el-collapse-item title="query" name="1" >
                    <div v-for="(query, index) in dynamicValidateForm.queryArray" :key="index">
                        <div v-if="query.type==='input'">
                            <el-form-item
                                style="display: inline-block;"
                                :label="'输入框后端参数' + index"
                                :prop="'.queryArray.' + index + '.queryKey'"
                                :rules="{
                                    required: true, message: '不能为空', trigger: 'blur'
                                }"
                            >
                                <el-input style="width: 200px;" v-model="query.queryKey"></el-input>
                            </el-form-item>
                            <el-form-item
                                style="display: inline-block;"
                                :label="'输入框参数中文' + index"
                                :prop="'.queryArray.' + index + '.queryValue'"
                                :rules="{
                                    required: true, message: '不能为空', trigger: 'blur'
                                }"
                            >
                                <el-input style="width: 200px;" v-model="query.queryValue"></el-input>
                            </el-form-item>
                            <el-form-item
                                style="display: inline-block;"
                                :label="'验证' + index"
                                :prop="'.queryArray.' + index + '.validType'"
                                :rules="{
                                    required: true, message: '不能为空', trigger: 'blur'
                                }"
                            >
                                <el-select v-model="query.validType">
                                    <el-option 
                                        v-for="(vop) in validSelectOptions"
                                        :key="vop"
                                        :label="vop" :value="vop"
                                    >
                                    </el-option>
                                </el-select>
                                <el-button @click.prevent="removeQuery(query)">删除</el-button>
                            </el-form-item>
                        </div>
                        <div v-else-if="query.type==='text'">
                            <el-form-item
                                style="display: inline-block;"
                                :label="'text label中文' + index"
                                :prop="'.queryArray.' + index + '.queryKey'"
                            >
                                <el-input style="width: 300px;" v-model="query.queryKey"></el-input>
                            </el-form-item>
                            <el-form-item
                                style="display: inline-block;"
                                :label="'text中文' + index"
                                :prop="'.queryArray.' + index + '.queryValue'"
                                :rules="{
                                    required: true, message: '不能为空', trigger: 'blur'
                                }"
                            >
                                <el-input style="width: 300px;" v-model="query.queryValue"></el-input>
                                <el-button @click.prevent="removeQuery(query)">删除</el-button>
                            </el-form-item>
                        </div>
                        <div v-else-if="query.type==='textarea'">
                            <el-form-item
                                style="display: inline-block;"
                                :label="'textarea后端参数' + index"
                                :prop="'.queryArray.' + index + '.queryKey'"
                                :rules="{
                                    required: true, message: '不能为空', trigger: 'blur'
                                }"
                            >
                                <el-input style="width: 200px;" v-model="query.queryKey"></el-input>
                            </el-form-item>
                            <el-form-item
                                style="display: inline-block;"
                                :label="'textarea参数中文' + index"
                                :prop="'.queryArray.' + index + '.queryValue'"
                                :rules="{
                                    required: true, message: '不能为空', trigger: 'blur'
                                }"
                            >
                                <el-input style="width: 200px;" v-model="query.queryValue"></el-input>
                            </el-form-item>
                            <el-form-item
                                style="display: inline-block;"
                                :label="'验证' + index"
                                :prop="'.queryArray.' + index + '.validType'"
                                :rules="{
                                    required: true, message: '不能为空', trigger: 'blur'
                                }"
                            >
                                <el-select v-model="query.validType">
                                    <el-option 
                                        v-for="(vop) in validSelectOptions"
                                        :key="vop"
                                        :label="vop" :value="vop"
                                    >
                                    </el-option>
                                </el-select>
                                <el-button @click.prevent="removeQuery(query)">删除</el-button>
                            </el-form-item>
                        </div>
                        <div v-else-if="query.type==='select'">
                            <el-form-item
                                style="display: inline-block;"
                                :label="'select框后端参数' + index"
                                :prop="'.queryArray.' + index + '.queryKey'"
                                :rules="{
                                    required: true, message: '不能为空', trigger: 'blur'
                                }"
                            >
                                <el-input style="width: 200px;" v-model="query.queryKey"></el-input>
                            </el-form-item>
                            <el-form-item
                                style="display: inline-block;"
                                :label="'select框参数中文' + index"
                                :prop="'.queryArray.' + index + '.queryValue'"
                                :rules="{
                                    required: true, message: '不能为空', trigger: 'blur'
                                }"
                            >
                                <el-input style="width: 200px;" v-model="query.queryValue"></el-input>
                                <el-button @click.prevent="removeQuery(query)">删除</el-button>
                                <el-button @click.prevent="addQuerySelectOption(query)">添加option</el-button>
                            </el-form-item>
                            <div v-for="(querySelectOption, qsoIndex) in query.options" :key="''+index+qsoIndex">
                                <el-form-item
                                    style="display: inline-block;"
                                    :label="'option后端参数' + qsoIndex"
                                    :prop="`.queryArray.${index}.options.${qsoIndex}.optionKey`"
                                    :rules="{
                                        required: true, message: '不能为空', trigger: 'blur'
                                    }"
                                >
                                    <el-input style="width: 300px;" v-model="querySelectOption.optionKey"></el-input>
                                </el-form-item>
                                <el-form-item
                                    style="display: inline-block;"
                                    :label="'option后端参数' + qsoIndex"
                                    :prop="`.queryArray.${index}.options.${qsoIndex}.optionValue`"
                                    :rules="{
                                        required: true, message: '不能为空', trigger: 'blur'
                                    }"
                                >
                                    <el-input style="width: 300px;" v-model="querySelectOption.optionValue"></el-input>
                                </el-form-item>
                                <el-button @click.prevent="removeQuerySelectOption(query, querySelectOption)">删除</el-button>
                            </div>
                        </div>
                        <div v-else-if="query.type==='radio'">
                            <el-form-item
                                style="display: inline-block;"
                                :label="'radio后端参数' + index"
                                :prop="'.queryArray.' + index + '.queryKey'"
                                :rules="{
                                    required: true, message: '不能为空', trigger: 'blur'
                                }"
                            >
                                <el-input style="width: 200px;" v-model="query.queryKey"></el-input>
                            </el-form-item>
                            <el-form-item
                                style="display: inline-block;"
                                :label="'radio参数中文' + index"
                                :prop="'.queryArray.' + index + '.queryValue'"
                                :rules="{
                                    required: true, message: '不能为空', trigger: 'blur'
                                }"
                            >
                                <el-input style="width: 200px;" v-model="query.queryValue"></el-input>
                                <el-button @click.prevent="removeQuery(query)">删除</el-button>
                                <el-button @click.prevent="addQueryRadioInput(query)">添加radio</el-button>
                            </el-form-item>
                            <div v-for="(radioInput, qsoIndex) in query.inputs" :key="''+index+qsoIndex">
                                <el-form-item
                                    style="display: inline-block;"
                                    :label="'RadioInput后端参数' + qsoIndex"
                                    :prop="`.queryArray.${index}.inputs.${qsoIndex}.inputKey`"
                                    :rules="{
                                        required: true, message: '不能为空', trigger: 'blur'
                                    }"
                                >
                                    <el-input style="width: 300px;" v-model="radioInput.inputKey"></el-input>
                                </el-form-item>
                                <el-form-item
                                    style="display: inline-block;"
                                    :label="'RadioInput后端中文' + qsoIndex"
                                    :prop="`.queryArray.${index}.inputs.${qsoIndex}.inputValue`"
                                    :rules="{
                                        required: true, message: '不能为空', trigger: 'blur'
                                    }"
                                >
                                    <el-input style="width: 300px;" v-model="radioInput.inputValue"></el-input>
                                </el-form-item>
                                <el-radio v-model="query.isChecked" :label="qsoIndex">checked</el-radio>
                                <el-button @click.prevent="removeQueryRadioInput(query, radioInput)">删除</el-button>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <el-form-item style="margin-top: 20px;">
                <el-button type="primary" @click="submit('dynamicValidateForm')">提交</el-button>
                <el-select v-model="dynamicValidateForm.queryType" style="margin-left: 10px;">
                    <el-option label="input" value="input"></el-option>
                    <el-option label="textarea" value="textarea"></el-option>
                    <el-option label="select" value="select"></el-option>
                    <el-option label="text" value="text"></el-option>
                    <el-option label="radio" value="radio"></el-option>
                </el-select>
                <el-button @click="addQuery()" style="margin-left: 10px;">添加query</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style>

</style>

<script>

export default {
    name: 'crmForm',
    data() {
        return {
            activeNames: ['0', '1'],
            validSelectOptions: ['fine', 'isNeed', 'length50', 'length100', 'length200', 'validNumber', 'validEmail', 'validPhoneNumber'],
            collapseItemStyle: {
                padding: "20px"
            },
            isAdd: "",
            dynamicValidateForm: {
                fileName: "",
                author: "",
                requestUrl: "",
                isJson: "yes",
                queryType: "input",
                queryArray: []
            }
        }
    },
    methods: {
        removeQuery(item) {
            const index = this.dynamicValidateForm.queryArray.indexOf(item)
            if (index !== -1) {
                this.dynamicValidateForm.queryArray.splice(index, 1)
            }
        },
        addQuery() {
            const queryType = this.dynamicValidateForm.queryType
            // {
            //     type: "input",
            //     queryKey: "",
            //     queryValue: "",
            //     validType: "fine",
            // },
            // {
            //     type: "select",
            //     queryKey: "",
            //     queryValue: "",
            //     validType: "fine",
            //     options: [
            //         {
            //             optionKey: "",
            //             optionValue: "",
            //         }
            //     ]
            // },
            // {
            //     type: "radio",
            //     queryKey: "",
            //     queryValue: "",
            //     validType: "fine",
            //     isChecked: 0,
            //     inputs: [
            //         {
            //             inputKey: "",
            //             inputValue: "",
            //         }
            //     ]
            // },
            // {
            //     type: "textarea",
            //     queryKey: "",
            //     queryValue: "",
            //     validType: "fine",
            // }
            let query = {
                queryKey: "",
                queryValue: "",
                validType: "fine",
            }
            switch (queryType) {
                case "input":
                    this.dynamicValidateForm.queryArray.push({ ...query, type: "input" })
                    break
                case "textarea":
                    this.dynamicValidateForm.queryArray.push({ ...query, type: "textarea" })
                    break
                case "text":
                    this.dynamicValidateForm.queryArray.push({ ...query, type: "text" })
                    break
                case "select":
                    this.dynamicValidateForm.queryArray.push({
                        type: "select",
                        queryKey: "",
                        queryValue: "",
                        validType: "fine",
                        options: [
                            {
                                optionKey: "",
                                optionValue: "",
                            }
                        ]
                    })
                    break
                case "radio":
                    this.dynamicValidateForm.queryArray.push({
                        type: "radio",
                        queryKey: "",
                        queryValue: "",
                        validType: "fine",
                        isChecked: 0,
                        inputs: [
                            {
                                inputKey: "",
                                inputValue: "",
                            }
                        ]
                    })
                    break
            }
            this.isAdd = "1"
        },
        addQuerySelectOption(query) {
            query.options.push({
                optionKey: "",
                optionValue: "",
            })
        },
        addQueryRadioInput(query) {
            query.inputs.push({
                inputKey: "",
                inputValue: "",
            })
        },
        removeQuerySelectOption(query, querySelectOption) {
            const index = query.options.indexOf(querySelectOption)
            if (index !== -1) {
                query.options.splice(index, 1)
            }
        },
        removeQueryRadioInput(query, queryRadioInput) {
            const index = query.inputs.indexOf(queryRadioInput)
            if (index !== -1) {
                query.inputs.splice(index, 1)
            }
        },
        submit(formName) {
            this.$refs[formName].validate(async (valid, prop) => {
                if (valid) {
                    let data = { ...this.dynamicValidateForm }
                    data.queryType = "input"
                    this.submitCallback("/generate/CRM", JSON.stringify(data), "form")
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
    updated() {
        if (this.isAdd === "1") {
            let evt = document.createEvent("HTMLEvents");
            // 初始化
            evt.initEvent("scrollDown", false, false);
            // 触发
            document.dispatchEvent(evt);
            this.isAdd = ""
        }
    },
    props: ['submitCallback', 'fieldStr']
}
</script>