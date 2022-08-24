<template>
    <div id="input-manager">
        <GSearchQuery>
            <template v-slot="{ q }">
                <el-button type="primary" @click="setQueryName(q)">搜索</el-button>
            </template>
        </GSearchQuery>
        <GTable :options="conf.options" :pageOptions="frontPageOptions" :data="tableData" :loadingTag="loadingTag"
            :columns="conf.columns" @handleCurrentChange="currentPageChange" @selection-change="onSelectionChange"
            @size-change="sizeChange">

            <!-- 数据处理在crud中,所以不方便在js中处理 -->
            
            <template #birthday="col">
                <el-table-column width="170" :prop="col.prop" :label="col.label"  >
                    <template v-slot="{ row }">
                        <span>{{ row.birthday | birthday }}</span>
                    </template>
                </el-table-column>
            </template>

            <template #sex="col">
                <el-table-column align="center" :prop="col.prop" :label="col.label"  >
                    <template v-slot="{ row }">
                        <span>{{ row.sex | sex }}</span>
                    </template>
                </el-table-column>
            </template>

             <template #education="col">
                <el-table-column align="center" :prop="col.prop" :label="col.label"  >
                    <template v-slot="{ row }">
                        <span>{{ row.education | education }}</span>
                    </template>
                </el-table-column>
            </template>

            <template v-slot:status="col">
                <el-table-column width="100" align="center" :prop="col.prop" :label="col.label">
                    <template v-slot="{ row }">
                        <el-tag :type="row.status | statusColor">{{ row.status |status }}</el-tag>
                    </template>
                </el-table-column>
            </template>

            <template v-slot:opts="col">
                <el-table-column :label="col.label" :width="col.width">
                    <template v-slot="{ row }">
                        <el-button @click="showEdit(row)" type="primary">编辑</el-button>
                        <el-button @click="delLoan(row.id)"  type="danger">删除</el-button>
                        <el-button @click="submit(row.id)"   type="success">提交审核</el-button>
                    </template>
                </el-table-column>
            </template>
        </GTable>

        <!-- 编辑对话框 -->
        <el-dialog title="申请管理-编辑" @open="exist=true"  @closed="exist=false"  :visible.sync="dialogVisible" width="30%">
            <!-- 不论如何都不会就地复用元素  
                <GFormCreator  :conf="editConf" @submit="save" :key="Math.random()" ></GFormCreator>
            -->
            <GFormCreator v-if="exist" :conf="editConf" @submit="save" ></GFormCreator>
        </el-dialog>



    </div>
</template>
<script>
import loanListConf from './loanListConf';

import { pager, crud } from '@/mixins';
import GFormCreator from '../../components/GFormCreator.vue';
import { saveLoan,deleteLoan,submitApprove } from '@/apis/loan';
import {
    sexOptions,
} from '@/conf';
export default {
    name:'input-manager',
    // 这里有问题就会报错 undefined components
    mixins: [pager, crud],
    created() {
        this.init(); // 2 调用方法
    },
    methods: {
        // 提交
        async submit(id){
            if (!await this.confirm('是否确认提交申请?'))return;
            let [res,err] = await submitApprove(id);
            if (!res) return; // 如果后续有依赖res比较严重的逻辑,最好判断一下
            this.init();
        },
        // 删除
        async delLoan(id) {
            let isConfirm = await this.confirm('是否确认删除?');
            if (!isConfirm)return;
            let [res,err] = await deleteLoan(id);
            this.init();
        },
        async save(data) {
            console.log('保存数据', data);

            let [res,err] = await saveLoan({
                ...data,
                id:this.editingId
            });

            if(err)return this.message.error('请求错误');


            this.dialogVisible = false;
            this.$notify.success({
                title: '提示',
                message: '编辑成功',
                showClose: false
            });
            // 列表更新
            this.init();
        },
        showEdit(row) {
            // 保存当前编辑id
            this.editingId = row.id;
            this.editConf = {
                items: [
                    [{ colspan: 20, type: 'input', key: 'name', label: '姓名', value: row.name }],
                    [{
                        colspan: 20, type: 'select', key: 'sex', label: '性别', value: row.sex,
                        options: sexOptions
                    }]
                ],
                rules: {
                    name: [{ required: true, message: '必须填写用户名' }],
                    sex: [{ required: true, message: '必须填写性别' }],
                }
            }
            this.dialogVisible = true;
        },
        beforeInit() {
            this.url = "/loan/list";
            this.customField = {
                loadingTag: this.loadingTag
            };
            return true;
        },
        onSelectionChange(data) {
            console.log("选中改变了", data);
        },
    },
    data() {
        return {
            conf: loanListConf,
            tableData: [],
            loadingTag: "tab1",
            dialogVisible: false,
            editConf: {},
            exist:false
        };
    },
    components: { GFormCreator }
}
</script>
<style>
</style>