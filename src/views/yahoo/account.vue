<template>
  <div class="app-container">
    <div class="filter-container">      
      <el-button class="filter-item" 
      style="margin-left: 10px" 
      type="primary" 
      icon="el-icon-edit" 
      @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>   
      <div style="float: right">

        <el-link 
        href="https://login.yahoo.co.jp/config/login?.src=auc&.done=https%3A%2F%2Fauctions.yahoo.co.jp%2F" 
        target="_blank"
        icon="el-icon-s-home"
        type="primary"
        style="margin-right:20px; margin-left: 20px"
        >
        Yahoo Login
        </el-link>  
        
        <el-link 
        href="https://auctions.yahoo.co.jp/" 
        target="_blank"
        icon="el-icon-s-home"
        type="primary"
        >
        https://auctions.yahoo.co.jp/
        </el-link>  
      </div>
      
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
      <el-table-column :label="$t('table.id')" prop="id" align="center" width="50">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.name')" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column> 
      <el-table-column :label="$t('login.password')" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.password }}</span>
        </template>
      </el-table-column> 

      <el-table-column label="Cookie" min-width="150px" class-name="line-7" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.cookie }}</span>          
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.updatedAt')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updatedAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.active')" class-name="status-col" width="100">
        <template slot-scope="{row}">                   
          <el-button v-if="row.active" size="mini" type="success" @click="handleModifyStatus(row, 0)">
            {{ $t('table.actived') }}
          </el-button>
          <el-button v-if="!row.active" size="mini" type="danger" @click="handleModifyStatus(row, 1)">
            {{ $t('table.stopped') }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.status')" width="80" align="center">
        <template slot-scope="{row}">
          <el-tag  v-if="row.status==401" type="danger">{{ $t('error') }}</el-tag>
          <el-tag  v-else type="success">{{ $t('normal') }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>         
          
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            {{ $t('table.delete') }}
          </el-button>          
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" 
    center top="10vh" custom-class="el-dlg-w">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" 
      label-width="90px">
        
        <el-form-item :label="$t('table.name')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>

        <el-form-item :label="$t('login.password')" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>

        <el-form-item :label="$t('table.status')">
          <el-select v-model="temp.active" class="filter-item" placeholder="Please select">            
            <el-option v-for="option in options" :key="option.value" :value="option.value" :label="$t(option.text)" />                      
          </el-select>
        </el-form-item>
        
        <el-form-item label="Cookie" prop="cookie">
          <el-input v-model="temp.cookie" 
          :autosize="{ minRows: 20, maxRows: 4}" 
          type="textarea" placeholder="Please input" />
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

import { getYahooAccount, insertYahooAccount, updateYahooAccount, updateStatus, deleteYahooAccount} from '@/api/yahoo'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'

export default {
  name: 'YahooAccount',
  components: {},
  directives: { waves },
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,   
      options:[
        {value:0, text:'table.stopped'},
        {value:1, text:'table.actived'},
      ],         
      temp: {
        cookie: '',        
        name: '',       
        active: 1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },      
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'change' }],        
        cookie: [{ required: true, message: 'login is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getYahooAccount().then(response => {
        // console.log(response)
        this.list = response.yahooAccount         
        this.listLoading = false     
      })
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
        cookie: '',        
        name: '',
        active: 1,
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
          this.temp.id = ""          
          insertYahooAccount(this.temp).then((res) => {
            if(!res.upsertYahooAccount.error){
              this.temp.id=res.upsertYahooAccount.res.id
              this.temp.updatedAt=res.upsertYahooAccount.res.createdAt
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: this.$t('notify.success'),
                message: this.$t('notify.createSuccess'),
                type: 'success',
                duration: 2000
              })
              }
            else{              
              this.$notify.error({
                title: this.$t('notify.error'),
                message: this.$t('notify.createError'),                
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj      
      console.log(this.temp)
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
          updateYahooAccount(tempData).then((res) => {
            if(!res.upsertYahooAccount.error){

              const index = this.list.findIndex(v => v.id === this.temp.id)
              console.log(index)
              this.temp.updatedAt = new Date()
              this.list.splice(index, 1, this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: this.$t('notify.success'),
                message: this.$t('notify.updateSuccess'),
                type: 'success',
                duration: 2000
              })
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
      this.$confirm(this.$t('notify.confirmDel'), this.$t('notify.warning'),{
        confirmButtonText:this.$t('permission.ok'),
        cancelButtonText: this.$t('permission.cancel'),
        type: "warning"
      }).then(()=>{    
        deleteYahooAccount(row.id).then((res)=>{
          console.log(res)           
          this.$notify({
            title: this.$t('notify.success'),
            message: this.$t('notify.deleteSuccess'),
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
      }).catch(()=>{

      })
      
    },    
    
  }
}
</script>
<style lang="scss" scoped>
  .line-7 .link-type{    
      overflow: hidden;   
      display: -webkit-box;
      text-overflow: ellipsis;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;    
  }
</style>