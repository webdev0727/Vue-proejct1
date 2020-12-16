<template>
  <div class="app-container">
    <div class="filter-container">     

      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button> 
      
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"      
    >
      <el-table-column :label="$t('table.id')" prop="id" sortable align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      
      <el-table-column :label="$t('table.name')" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column> 
      <el-table-column label="Role" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.roles[0]['name'] }}</span>
        </template>
      </el-table-column> 
      <el-table-column :label="$t('table.createdAt')" width="155px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdAt | parseTime() }}</span>          
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.phone')" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column> 

      <el-table-column :label="$t('table.address')" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.aAddress }}</span>          
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
        <template slot-scope="{row}">     
                        
          <el-button v-if="row.active==1" size="mini" type="success" @click="handleModifyStatus(row, 0)">
            {{ $t('table.active') }}
          </el-button>
          <el-button v-if="row.active==0" size="mini" type="warning" @click="handleModifyStatus(row, 2)">
            {{ $t('table.stopped') }}
          </el-button>
          <el-button v-if="row.active==2" size="mini" type="danger" @click="handleModifyStatus(row, 1)">
            {{ $t('table.blocked') }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <!-- <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>          -->
          <el-button type="primary" size="mini" @click="handleViewProfile(row)">
            {{ $t('table.edit') }}
          </el-button>         

          <el-button size="mini" v-if="row.id!==user.id" type="danger" @click="handleDelete(row,$index)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" 
    :visible.sync="dialogFormVisible"
    top="5vh"
     custom-class="el-dlg-w">
      <el-form ref="dataForm" 
      :rules="rules" 
      :model="temp" 
      label-position="left" 
      label-width="110px"    
      >
        <el-form-item :label="$t('table.name')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>

        <el-form-item :label="$t('login.email')" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>

        <el-form-item :label="$t('table.phone')"  prop="phone">
          <el-input v-model="temp.phone" type="number"/>
        </el-form-item>

        <el-form-item label="Roles" style="margin-bottom:5px">
          <el-select v-model="temp.roles" class="filter-item" placeholder="Please select">
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>        
        
        <el-form-item :label="$t('new')+$t('login.password')" prop="password"> 
          <el-input v-model="temp.password" />
        </el-form-item>

        <el-form-item :label="$t('login.birth')">
          <el-date-picker v-model="temp.birth" type="date" value-format="yyyy-MM-dd" placeholder="Please pick a date" />
        </el-form-item>

        <el-form-item label="IdNumber" prop="IdNumber">
          <el-input v-model="temp.IdNumber" />
        </el-form-item>

       <el-form-item label="Province">
          <el-select v-model="temp.aProvince" class="filter-item" placeholder="Please select" @change="selProvince">
            <el-option v-for="item in cn_province" :key="item.region_id" :label="item.region_name" :value="item.region_id" />
          </el-select>
        </el-form-item>  

       <el-form-item label="County">
          <el-select v-model="temp.aCounty" class="filter-item" placeholder="Please select"  @change="selCounty">
            <el-option v-for="item in cn_counties" :key="item.region_id" :label="item.region_name" :value="item.region_id" />
          </el-select>
        </el-form-item>  

       <el-form-item label="City">
          <el-select v-model="temp.aCity" class="filter-item" placeholder="Please select">
            <el-option v-for="item1 in cn_cities" :key="item1.region_id" :label="item1.region_name" :value="item1.region_id" />
          </el-select>
        </el-form-item>  
        
        <el-form-item :label="$t('table.address')">
          <el-input v-model="temp.aAddress" />
        </el-form-item>

        <el-form-item :label="$t('table.status')" style="margin-bottom:5px">
          <el-select v-model="temp.active" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item.value" :label="$t(item.text)" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.createdAt')" v-if="dialogStatus=='update'"  style="margin-bottom:0">          
          <span>{{ temp.createdAt | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </el-form-item>

        <el-form-item :label="$t('table.updatedAt')" v-if="dialogStatus=='update'" style="margin-bottom:0">          
          <span>{{ temp.updatedAt | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { getAdmin, updateStatus, removeAdmin, existItem} from '@/api/user'
import CommonAPI from '@/api/common'
import { getConfig} from '@/api/config'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import cn_province from '@/services/cn_province.json'
import {getLocalDate} from "@/services/helper"

import {mapState, mapGetters, mapActions} from 'vuex'
const statusOptionsSearch=[
        {value:3, text:'all'},
        {value:0, text:'table.stopped'},
        {value:1, text:'table.active'},
        {value:2, text:'table.blocked'},
      ]
const statusOptions=[        
        {value:0, text:'table.stopped'},
        {value:1, text:'table.active'},
        {value:2, text:'table.blocked'},
      ]
export default {
  name: 'AdminUsers',
  components: { Pagination },
  directives: { waves },
  filters: {    
  },
  data() {
    var existName= async(rule, value, callback)=> {
      const res= await existItem("name", value, this.temp.id)        
      if(res.existItem.error==1) return callback(new Error('Already exist. Please input another name')); 
      else return callback();  
    }

    var existEmail= async(rule, value, callback)=> {
      const res= await existItem("email", value, this.temp.id)        
      if(res.existItem.error==1) return callback(new Error('Already exist. Please input another Email')); 
      else return callback();  
    }

    var existPhone= async(rule, value, callback)=> {
      const res= await existItem("phone", value, this.temp.id)        
      if(res.existItem.error==1) return callback(new Error('Already exist. Please input another phone')); 
      else return callback();  
    }
    var existIDnumber=async(rule, value, callback)=>{
      const res= await existItem("IdNumber", value, this.temp.id)        
      if(res.existItem.error==1) return callback(new Error('Already exist. Please input another ID number')); 
      else return callback();  
    }
    return {
      cn_province:cn_province,
      cn_counties:[],
      cn_cities:[],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      rolesOptins:['admin'],
      statusOptions,   
      statusOptionsSearch, 
      temp: {
        id: undefined, 
        name: '',
        phone: '',
        active: 3,
        IdNumber:null,
        aProvince: '',
        aCounty: '',
        aCity: '',
        birth:"",
        password:"",
        roles:2
      },      
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },            
      rules: {
        name: [{ required: true, message: 'name is required', trigger: ['blur', 'change']},
              {min: 2, max: 15, message: 'Length should be 2 to 15', trigger: ['blur', 'change'] },              
              { validator: existName, trigger: 'blur' }
              ],
        email: [{ type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change']},
                { validator: existEmail, trigger: 'blur' }
        ],
        phone: [{ required: true, message: 'phone is required', trigger: ['blur', 'change'] },
                {min: 11, max: 15, message: 'Length should be 11 to 15', trigger: ['blur', 'change'] },
                { validator: existPhone, trigger: 'blur' }
                ],
        IdNumber:[{ validator: existIDnumber, trigger: 'blur' }],
        password:[{ required: true, message: 'password is required', trigger: ['blur', 'change'] },]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getConfig();    
  },
  computed:{    
    ...mapState('common', ['roles']),
    ...mapState(['user'])
  },
  methods: {
    ...mapActions('common', ['getConfig']),
    getList() {
      this.listLoading = true
      getAdmin().then(response => {
        // console.log(response)
        this.list = response.allAdmins.items
        this.total = response.allAdmins.total  
        this.listLoading = false     
      })
    },
    setCountisAndCities(key_province, key_county=null){     
      console.log(key_province, key_county)       
      if(key_province){
          var cc=this.cn_province.filter(function(prov){
              return prov.region_id==key_province
          })
          this.cn_counties=cc[0].county
      }            
      if(key_county){
          if(this.cn_counties){
              var cityn=this.cn_counties.filter(function(county){
                  return county.region_id==key_county
              })
              this.cn_cities=cityn[0].city
          }
          else{
              this.cn_cities=[]            
          }                
      }            
    },    
    selProvince() {                  
        this.setCountisAndCities(this.temp.aProvince)
        this.cn_cities=[]
        this.temp.aCounty=''
        this.temp.aCity=''            
    },
    selCounty() {            
        this.setCountisAndCities(null, this.temp.aCounty)
        if(this.temp.aCounty){                
            this.temp.aCity=''
        } 
    },
    handleModifyStatus(row, status) {
      const statusD={
        id: row.id,
        active: status
      }
      updateStatus(statusD).then((res) => { 
        row.active = status
        this.$notify({
          title: this.$t('notify.success'),
          message: this.$t('notify.updateSuccess'),
          type: 'success',
          duration: 2000
        })
      })
    }, 
    resetTemp() {
      this.temp = {
        id: undefined,        
        name: '',
        email: '',
        IdNumber:null,
        phone: '',
        active: 1,
        birth: '',
        createdAt:"",
        password:"",
        roles:2
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {                   
          CommonAPI.add('addUser', this.temp).then((resp) => {
            const res=resp.addUser.res;
            console.log(res);
            this.temp.id=res.id;
            this.temp.roles= [this.roles.find(f=> f.id==this.temp.roles)];
            this.temp.createdAt=res.createdAt;
            this.list.push(this.temp);
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj  
      // console.log(row.roles)
      this.temp.roles=row.roles[0]['id'];    
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.setCountisAndCities(this.temp.aProvince, this.temp.aCounty)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          console.log(tempData)
          CommonAPI.update('updateUser', tempData).then((res)=>{
            console.log(res.updateUser)
            if(!res.updateUser.error){
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                })
                const index = this.list.findIndex(v => v.id === this.temp.id)
                this.list.splice(index, 1, this.temp)
                this.dialogFormVisible = false
                this.temp.password=""
            }
            else{
              this.$notify.error({
                title: this.$t('notify.error'),
                message: this.$t('notify.updateError'),                
                duration: 2000
              })
            }
          })          
        }
      })
    },
    handleDelete(row, index) {
      // this.delDialogVisible=true 
      this.$confirm('This will permanently delete the file. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          console.log(row.id )      
          removeAdmin(row.id ).then((res)=>{
              console.log(res)
              this.$notify({
                title: this.$t('notify.success'),
                message: this.$t('notify.deleteSuccess'),
                type: 'success',
                duration: 2000
              })
              this.list.splice(index, 1)
              this.total-=1
          })          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled'
          });          
        });      
    },
    handleBlock(){
      // console.log(this.removeId)
      const statusD={
        // id: this.removeId,
        active: 2
      }
      updateStatus(statusD).then((res) => {         
        this.list[this.removeIndex]['active']=2
        // this.delDialogVisible=false  
        this.$notify({
          title: this.$t('notify.success'),
          message: this.$t('notify.updateSuccess'),
          type: 'success',
          duration: 2000
        })
      })
    } ,
    handleViewProfile(row) {
      this.$router.push(`/profile/index/${row.id}?tab=info`)
      // this.$router.replace({

      // })
    },    
  }
}
</script>
<style scoped>
  
</style>