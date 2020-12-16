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

      <el-button 
      class="filter-item" 
      style="margin-left: 10px;" 
      type="primary" 
      icon="el-icon-delete" 
      :disabled.sync="multipleSelection.length ? false : true"
      @click="handleDelete()">
        {{ $t('table.delete') }}
      </el-button> 

    </div>

    <el-table
      :key="tableKey"
      @selection-change="handleSelectionChange"
      v-loading="listLoading"      
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"       
      >
      <el-table-column
        type="selection"
        width= "40" >
      </el-table-column>

      <el-table-column :label="$t('table.id')" prop="id" align="center" width="50">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.title')" width="130" align="center">
        <template slot-scope="{row}">
          <span>{{ row.item }}</span>
        </template>
      </el-table-column> 
      <el-table-column :label="$t('table.title')" align="center">
        <template slot-scope="{row}">
          <span>{{ row.val }}</span>
        </template>
      </el-table-column> 

      <el-table-column :label="$t('table.updatedAt')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updatedAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.createdAt')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updatedAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>      


      <el-table-column :label="$t('table.actions')" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>         
          
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row.id)">
            {{ $t('table.delete') }}
          </el-button>          
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" 
    center top="10vh" custom-class="el-dlg-w">
      <el-form ref="dataForm" 
      :model="temp" label-position="left" 
      :rules="rules"
      label-width="90px">
        
        <el-form-item :label="$t('table.title')" prop="item">
          <el-input v-model="temp.item" />
        </el-form-item>
        
        <el-form-item :label="$t('table.value')" prop="val">
          <div style="display:flex">
            <el-input v-model="temp.val" />
          </div>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button v-waves type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>        
      </div>
    </el-dialog>
   
  </div>
</template>

<script>

import {getConfig} from '@/api/config'
import CommonAPI from '@/api/common'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'

export default {
  name: 'Config',
  directives: { waves},
  filters: {},
  data() {
    return {
      tableKey: 13,      
      list: null,
      listLoading: true,
      temp: { 
        id:'',       
        item: '',       
        val: ''        
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },      
      multipleSelection: []  ,
      rules: {
        item: [{ required: true, message: 'item is required', trigger: 'change' }],        
        val: [{ required: true, message: 'val is required', trigger: 'blur' }]
      },
    }
  },
  created() {
    // console.log(process.env.VUE_APP_API_UPLOAD, 'sdjflaksdf')
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getConfig().then(response => {
        // console.log(response)
        this.list = response.config         
      }).finally(()=>{
        this.listLoading = false  
      })
    },

       
    resetTemp() {
      this.temp = { 
        item: '',       
        val: '',        
      } 
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })       
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true      
    },
    createData() {      
      this.$refs['dataForm'].validate((valid) => {
      if (valid) {
        this.temp.id = ""          
        CommonAPI.add('addConfig', this.temp).then((res) => {
          if(!res.addConfig.error){
            this.temp.id=res.addConfig.res.id
            this.temp.updatedAt=res.addConfig.res.createdAt
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
      delete this.temp.createdAt
      delete this.temp.updatedAt
      this.dialogStatus = 'update'
      this.dialogFormVisible = true      
    },

    updateData() {      
      this.$refs['dataForm'].validate((valid) => {
      if (valid) {
        const tempData = Object.assign({}, this.temp)          
        CommonAPI.update('updateConfig', tempData).then((res) => {
          if(!res.updateConfig.error){

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
    handleSelectionChange(val) {
        this.multipleSelection = val;        
    },
    handleDelete(val) {
      var delArr=[];
      if (val) delArr[0] = val
      else{
        this.multipleSelection.forEach(el => {
          delArr.push(el.id)
        });
      }
      const ids = delArr.join(',')     
      console.log(ids);  

      this.$confirm('This will permanently delete the items. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {                
          CommonAPI.del('delConfig', ids).then((res)=>{
              console.log(res)
              this.$notify({
                title: this.$t('notify.success'),
                message: this.$t('notify.deleteSuccess'),
                type: 'success',
                duration: 2000
              })
              this.getList()              
          })          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled'
          });          
        });
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
  .editor-container{
    position: relative;
  }
</style>
