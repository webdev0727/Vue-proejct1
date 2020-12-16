<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.AuctionID" 
      placeholder="AuctionID" 
      style="width: 200px;" 
      class="filter-item" 
      @keyup.enter.native="handleFilter" />

      <el-select 
      v-model="listQuery.exitTime" 
      :placeholder="$t('table.type')"        
      class="filter-item" 
      style="width: 100px">
        <el-option v-for="item in exitOptionsSearch" :key="item.text" :label="$t(item.text)" :value="item.value" />
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>

      <el-button 
      class="filter-item" 
      style="margin-left: 10px;" 
      type="primary" 
      icon="el-icon-delete" 
      :disabled.sync="multipleSelection.length ? false : true"
      @click="handleDeleteChecked">
        {{ $t('table.delete') }}
      </el-button> 
      
    </div>

    <el-table          
      :key="tableKey"
      v-loading="listLoading"
      @selection-change="handleSelectionChange"
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
      
      <el-table-column :label="$t('image')" width="110px" align="center">
          <template slot-scope="{row}">
            <a :href="row.AuctionItemUrl" target="_blank" rel="noopener noreferrer">
              <img :src="row.ImageUrl" style="width:100%"/>
            </a>
          </template>
      </el-table-column> 

      <el-table-column label="AuctionID" width="110px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.AuctionID }}</span>
          </template>
      </el-table-column> 

      <el-table-column :label="$t('bid.title')" min-width="150px" class-name="line-4">
        <template slot-scope="{row}">
          <span>{{ row.Title }}</span>          
        </template>
      </el-table-column>

      <el-table-column :label="$t('bid.price')" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.WonPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('bid.count')" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Bids }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.user')+'ID'" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userId}}</span>
        </template>
      </el-table-column>


      <el-table-column :label="$t('table.actions')" class-name="status-col" width="100">
        <template slot-scope="{row}">     
                        
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            {{ $t('table.delete') }}
          </el-button>

        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>

import { getWonList, apiWonList, remove, checkProcess} from '@/api/bidWon'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Timer from "@/components/Timer/Timer" 

const exitOptionsSearch=[
        {value:0, text:'all'},
        {value:1, text:'bid.expired'},
        {value:2, text:'bid.noExpired'},        
      ]
export default { 
  components: { Pagination, Timer },
  directives: { waves },
  filters: {    
  },
  data() {    
    return {
      tableKey: 'activity-won',
      list: null,
      total: 0,
      listLoading: true,      
      listQuery: {
        page: 1,
        limit: 10,  
        userId: parseInt(this.$route.params.userId) 
      }, 
      exitOptionsSearch,      
      multipleSelection: []  
    }
  },
  created() {
    this.getList()
  },
  methods: {    
    getList() {
     this.listLoading = true
      getWonList(this.listQuery).then(response => {
        console.log(response)
        this.list = response.WonList.items
        this.total = response.WonList.total 
      }).finally(()=>{          
          this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      // console.log(this.listQuery)
      this.getList()
    },
    handleDelete(row, index) {
      this.$confirm('This will permanently delete the item. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {                
            remove(row.id).then((res)=>{
            console.log(res)           
            this.delDialogVisible=false  
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
    handleSelectionChange(val) {
        this.multipleSelection = val;        
    },
    handleDeleteChecked(val) {
      var delArr=[];
        this.multipleSelection.forEach(el => {
          delArr.push(el.id)
        });
        // console.log(delArr.join(','));        

      this.$confirm('This will permanently delete the items. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {                
          remove(delArr.join(',')).then((res)=>{
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
    }  
  }
}
</script>