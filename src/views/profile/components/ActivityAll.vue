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
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      :key="tableKey"
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

      <el-table-column :label="$t('table.id')" prop="id" sortable align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="AuctionID" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.AuctionID }}</span>
        </template>
      </el-table-column> 

      <el-table-column :label="$t('table.address')" min-width="150px" class-name="line-4">
        <template slot-scope="{row}">
          <span>{{ row.Title }}</span>          
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.createdAt')" width="155px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdAt | parseTime() }}</span>          
        </template>
      </el-table-column>

      <el-table-column label="LeftTime" width="100px" align="center">
        <template slot-scope="{row}">
          <Timer :exitTime="row.exitTime"/>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.user')+'ID'" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column> 
      <el-table-column :label="$t('bid.price')" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
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
      <el-table-column :label="$t('table.actions')" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
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

import { getBids, remove} from '@/api/bidding'
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
      tableKey: "activity-all",
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,        
        exitTime: 0,       
        userId: this.$route.params.userId,
        AuctionID: undefined,
        bidType: '1',
        dateFrom: '',
        dateTo: '',
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
      getBids(this.listQuery).then(response => {
        // console.log(response)
        this.total = response.bidhistory.total  
        this.list = response.bidhistory.items
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