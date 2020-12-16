<template>
  <div class="app-container">
    <div class="filter-container">  
          
      <el-button class="filter-item" 
      style="margin-left: 10px" 
      type="primary" 
      icon="el-icon-edit" 
      v-waves
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
          <span>{{ row.title }}</span>
        </template>
      </el-table-column> 
      
      <el-table-column :label="$t('image')" align="center">
          <template slot-scope="{row}" >
              <img :src="row.img" style="width:100%; max-width:250px"/>            
          </template>
      </el-table-column> 

      <el-table-column :label="$t('table.color')" width="110px" align="center">
        <template slot-scope="{row}">
          <p>{{ row.bg_color }}</p>
          <div :style="`width:30px; height:30px; margin:0 auto; background-color:${row.bg_color}`"></div>
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


      <el-table-column :label="$t('table.actions')" align="center" width="160" class-name="small-padding fixed-width">
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
      <el-form ref="dataForm" :model="temp" label-position="left" 
      label-width="90px">
        
        <el-form-item :label="$t('table.title')" >
          <el-input v-model="temp.title" />
        </el-form-item>
        
        <el-form-item :label="$t('table.color')">
          <div style="display:flex">
            <el-input v-model="temp.bg_color" />
            <el-color-picker v-model="temp.bg_color"></el-color-picker>
          </div>
        </el-form-item>

        <p>{{temp.img}}</p>

        <div class="editor-container">
          <dropzone id="alsdjkflasd" 
          :key="temp.id"
          url="/upload" 
          @dropzone-removedFile="dropzoneR" 
          @dropzone-success="dropzoneS" 
          :maxFiles=1
          :thumbnailWidth=300
          :defaultImg='temp.img'
          ref="co_dropzone"
          />
        <p v-if="!valid" class="el-form-item__error">{{$t('validate.img')}}</p>
        </div>
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

import { getBanner} from '@/api/banner'
import CommonAPI from '@/api/common'

import { upload } from '@/api/upload'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Dropzone from '@/components/Dropzone'

export default {
  name: 'Banner',
  components: {Dropzone},
  directives: { waves},
  filters: {},
  data() {
    return {
      tableKey: 12,      
      list: null,
      listLoading: true,  
      valid : true,  
      temp: { 
        id:'',       
        title: '',       
        color: '',
        img:''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },      
      multipleSelection: []  
    }
  },
  created() {
    // console.log(process.env.VUE_APP_API_UPLOAD, 'sdjflaksdf')
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getBanner().then(response => {
        // console.log(response)
        this.list = response.banner         
        this.listLoading = false     
      })
    },
    dropzoneS(file) {
      this.temp.img = file.xhr.response  
      this.valid = true   
      console.log(this.temp.img)
      this.$message({ message: 'Upload success', type: 'success' })
    },
    dropzoneR(file) {
      // console.log(file)
      this.temp.img = ''
      this.$message({ message: 'Delete success', type: 'success' })
    },    
       
    resetTemp() {
      this.temp = {  
        id:'',      
        title: '',       
        color: '',
        img:''
      }
      if (this.$refs.co_dropzone){
        this.$refs.co_dropzone.removeAllFiles()
      }      
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true      
    },
    createData() {
      if (this.temp.img) this.valid = true
      else this.valid = false
      
      if (this.valid) {
        this.temp.id = ""          
        CommonAPI.add('addBanner', this.temp).then((res) => {
          if(!res.addBanner.error){
            this.temp.id=res.addBanner.res.id
            this.temp.updatedAt=res.addBanner.res.createdAt
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
      
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj      
      console.log(this.temp)
      delete this.temp.createdAt
      delete this.temp.updatedAt
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.valid = true
      if (this.$refs.co_dropzone){
        this.$refs.co_dropzone.removeAllFiles()
      }
    },
    updateData() {
      if (this.temp.img) this.valid = true
      else this.valid = false
      if (this.valid) {
        const tempData = Object.assign({}, this.temp)          
        CommonAPI.update('updateBanner', tempData).then((res) => {
          if(!res.updateBanner.error){

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
          CommonAPI.del('delBanner', ids).then((res)=>{
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
