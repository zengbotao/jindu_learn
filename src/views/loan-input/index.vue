<template>

    <GFormCreator ref="createForm" :conf="inputConf">
        <template>
            <div>
                <el-button @click="createUser" type="primary">立即创建</el-button>
                <el-button @click="reset">重置</el-button>
            </div>
        </template>
    </GFormCreator>

</template>

<script>
import inputConf from './inputPageConf';
import { createLoan } from '@/apis/loan'
export default {
    name:'loan-input',
    methods: {
        createUser() {
            this.$refs.createForm.validate(async (data) => {
                if (!data) return this.$message('表单验证不通过');
                console.log('数据:', data);
                // var mockdata = {
                //     "name": "Green2022",
                //     "birthday": "2022-07-10T16:00:00.000Z",
                //     "sex": "man",
                //     "identity_card": "444",
                //     "marriage": "married",
                //     "education": "college",
                //     "address1": "武汉",
                //     "address2": "武汉",
                //     "phone": "8123",
                //     "mobile_phone": "123",
                //     "company": "金渡",
                //     "trade": "education",
                //     "position": "1",
                //     "address3": "2",
                //     "company_type": "3",
                //     "company_email": "4",
                //     "company_phone": "5",
                //     "income": "6",
                //     "contact": "7",
                //     "contact_name": "8",
                //     "contact_phone": "9",
                //     "contact2": "11",
                //     "contact2_name": "12",
                //     "contact2_phone": "13",
                //     "contact2_dep": "14",
                //     "contact2_pos": "15",
                //     "remark": "111"
                // }
                let [res,err] = await createLoan(data);
                if (err) return this.$message('创建用户失败');
                console.log(res,'res');

            })
        },
        reset() {
            this.$refs.createForm.reset()
        }
    },
    data() {
        return {
            inputConf
        }
    }
}
</script>

<style>
</style>