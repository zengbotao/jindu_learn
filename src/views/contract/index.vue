<template>
<!-- vue-fragment解決根元素 利用注釋來處理 -->
    <div id="approve">
        <GSearchQuery @setValue="setQueryName"></GSearchQuery>
        <GTable :options="conf.options" :pageOptions="frontPageOptions" :data="tableData" :loadingTag="loadingTag"
            :columns="conf.columns" @handleCurrentChange="currentPageChange" @size-change="sizeChange">
            <template v-slot:status="col">
                <el-table-column width="140" align="center" :prop="col.prop" :label="col.label">
                    <template v-slot="{ row }">
                        <el-tag :type="row.status | contractColor">{{ row.status | contractText }}</el-tag>
                    </template>
                </el-table-column>
            </template>
            <template v-slot:opts="col">
                <el-table-column :label="col.label" :width="col.width">
                    <template v-slot="{ row }">
                        <el-button :disabled="row.status > 5" @click="genContract(row.id)" type="primary">生成合同</el-button>
                        <el-button :disabled="row.status < 5" @click="downloadContractFile(row.id)" type="success">下载合同</el-button>
                    </template>
                </el-table-column>
            </template>
        </GTable>


    </div>
</template>

<script>
import conf from './conf';
import { pager, crud } from '@/mixins';
import {
  genContractFile,
  downloadContract
} from '@/apis/loan';

import { downloadFile } from '@/utils'


import Vue from 'vue';
export default {
    name:'contract',
    mixins: [pager, crud],
    methods: {
        // 通过
        async genContract(id) {
            if (!await this.confirm('是否确认生成合同?')) return;
            let [res, err] = await genContractFile(id);
            if (!res) return;
            this.init();
        },
        async downloadContractFile(id) {
            if (!await this.confirm('是否确认下载合同?')) return;
            let [res, err] = await downloadContract(id);
            if (!res) return;
         
            // console.log(res,'下载文件的url');
            // 再次发起请求获取文件, 并实现下载
            let url = res?.data?.data?.url;
            if (!url)return this.$message.error(res.data.data);
            // 为了使用之前配置的baseUrl:'/api' 干掉/api
            await downloadFile(url.replace('/api',''),'贷款合同-' + id + '.docx')
        },
        showInfo(row) {
            this.dialogVisible = true;
            // 取出过滤器
            let filterFn = Vue.filter('birthday');
            this.editConf = {
                items: [
                    [{ key: 'id', label: 'id', value: row.id }],
                    [{ key: 'name', label: '姓名', value: row.name }],
                    [{ key: 'birthday', label: '出生日期', value: filterFn(row.birthday) }],
                    [{ key: 'sex', label: '性别', value: row.sex }],
                    [{ key: 'education', label: '教育程度', value: row.education }],
                    [{ key: 'address1', label: '地址', value: row.address1 }],
                    [{ key: 'mobile_phone', label: '手机号', value: row.mobile_phone }],
                    [{ key: 'identity_card', label: '身份证', value: row.identity_card }]

                ].map(rowArr => rowArr.map(item => ({ ...item, type: 'input', colspan: 24, attrs: { disabled: true } })))
            }
        },
        beforeInit() {
            this.url = "/contract/list";
            this.customField = {
                loadingTag: this.loadingTag
            };
            return true;
        },
        // 覆盖了crud的afterInit方法, 可以后续处理数据
        afterInit(data) {
            console.log('获取到数据:', data);
        }
    },
    created() {
        this.init();
    },
    data() {
        return {
            conf: conf,
            loadingTag: 'tab7',
            tableData: [],
            dialogVisible: false,
            editConf: {}
        }
    }
}
</script>

<style>
</style>