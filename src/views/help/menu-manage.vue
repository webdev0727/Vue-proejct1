<template>
  <div class="components-container">    
    <split-pane split="vertical" @resize="resize" :default-percent='40'>
      <template slot="paneL">
        <div class="left-container" />
      </template>
      <template slot="paneR">
        <split-pane split="vertical">
          <template slot="paneL">
            <div class="top-container">
              <p>Level1</p>
              <!-- level 0 list -->
              <div v-for="level in level0" :key='level.id' class="d-flex flex-bet-center">
                <el-radio v-model="pid" 
                :label="level.id" 
                @change='handleRadio'>
                {{level.name}}
                </el-radio>
                <div>
                  <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="handleUpdate(level.id, level.name)"></el-button>
                  <el-button type="danger" icon="el-icon-delete" circle  size="mini" @click="handleDelete(level.id)"></el-button>
                </div>
              </div>
              <!-- add new level 0 -->
              <div class="text-center">
                <el-input placeholder="Please input" v-model="new_level0"></el-input>
                <el-button type="primary" 
                icon="el-icon-plus" 
                style="width:100%"
                @click="handleCreate(0)"
                > 
                  {{ $t('table.add') }}
                </el-button>              
              </div>
            </div>
          </template>

          <template slot="paneR">
            <div class="bottom-container" >
              <p>Level2</p>
              <!-- level 1 list -->
              <div v-for="level in level1" :key='level.id' class="d-flex flex-bet-center">
                <p >{{level.name}}</p>
                <div>
                  <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="handleUpdate(level.id, level.name)"></el-button>
                  <el-button type="danger" icon="el-icon-delete" circle  size="mini" @click="handleDelete(level.id)"></el-button>
                </div>
              </div>
              <!-- add new level 1 -->
              <div class="text-center">
                <el-input placeholder="Please input" v-model="new_level1"></el-input>
                <el-button type="primary" 
                icon="el-icon-plus" 
                style="width:100%"
                @click="handleCreate(pid)"
                > 
                  {{ $t('table.add') }}
                </el-button>              
              </div>
            </div>
          </template>

        </split-pane>
      </template>
    </split-pane>


    <el-dialog title="Edit" 
      v-el-drag-dialog
      :visible.sync="dialogFormVisible" 
      center top="10vh" custom-class="el-dlg-w">
      <el-form ref="dataForm" 
      :model="temp" label-position="left" 
      :rules="rules"
      label-width="90px">
       
        <el-form-item :label="$t('table.name')" prop="name">
          <div style="display:flex">
            <el-input v-model="temp.name" />
          </div>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button v-waves type="primary" @click="updateData()">
          {{ $t('table.confirm') }}
        </el-button>        
      </div>
    </el-dialog>

  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import CommonAPI from '@/api/common'
import {getHelpTree} from '@/api/help'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
  name: 'MenuManage',
  components: { splitPane },
  directives: { elDragDialog },
  data () {
      return {
        pid: 1,
        new_level0:'',
        new_level1:'',
        list:[],
        level0:[],
        level1:[],
        dialogFormVisible: false,
        rules: {
          name: [{ required: true, message: 'name is required', trigger: 'change' }],
        },
        temp:{
          id:'',
          name:''
        }
      };
  },
  methods: {
    resize() {
      console.log('resize')
    },
    getChildList(pid){
      this.level1 = this.list.filter(rr=>rr.pid==pid)
    },
    getList() {
      getHelpTree().then(response => {
        // console.log(response)
        this.list = response.helpTree  
        this.level0 = this.list.filter(rr=>rr.pid==0)
        this.getChildList(this.pid)
      })
    },
    handleRadio(pid){
      console.log(pid)
      this.getChildList(pid)
    },
    handleCreate(pid){
      var new_data=null
      console.log(this.pid, this.new_level1)
      if (pid==0){
        if (this.new_level0){ 
          new_data=  {'name': this.new_level0}
        }
      }
      else{
        if (this.new_level1){
          new_data=  {'name': this.new_level1, 'pid': this.pid} 
        }     
      }
      if(new_data){
        CommonAPI.add('addHelpTree', new_data).then((res) => {
          if(!res.addHelpTree.error){
            this.getList()
            this.new_level0 = ''
            this.new_level1 = ''
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
    handleDelete(val) {
      var delArr=[];
      if (val) delArr[0] = val      
      const ids = delArr.join(',')

      this.$confirm('This will permanently delete the items. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {                
          CommonAPI.del('delHelpMenu', ids).then((res)=>{
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


    handleUpdate(id, name) {
      this.temp = {id, name} // copy obj      
      console.log(this.temp)      
      this.dialogFormVisible = true      
    },
    updateData() {      
      this.$refs['dataForm'].validate((valid) => {
      if (valid) {                 
        CommonAPI.update('updateHelpMenu', this.temp).then((res) => {
          if(!res.updateHelpMenu.error){
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

  },
  created() {
    this.getList()
  },
}
</script>

<style lang="scss"  scoped>
  .components-container {
    position: relative;
    height: 100vh;
    margin: 0;
  }

  .left-container {
    // background-color: #F38181;
    height: 100%;
  }

  .right-container {
    background-color: #FCE38A;
    height: 200px;
  }

  .top-container {
    // background-color: #FCE38A;
    padding: 10px;
    width: 100%;
    height: 100%;
    div{
      margin-bottom: 15px;
    }
  }

  .bottom-container {
    width: 100%;
    // background-color: #95E1D3;
    padding: 10px;
    height: 100%;
    div{
      margin-bottom: 15px;
    }
  }
</style>
