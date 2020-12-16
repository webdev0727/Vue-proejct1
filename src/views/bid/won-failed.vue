<template>
  <div class="app-container">   
      <div class="filter-container">
        <el-input v-model="listQuery.AuctionID" 
          placeholder="AuctionID" 
          style="width: 200px;" 
          class="filter-item" 
          @keyup.enter.native="handleFilter" />

        <el-input v-model="listQuery.userId" 
          :placeholder="$t('login.username')" 
          style="width: 200px;" 
          class="filter-item" 
          type="number"
          @keyup.enter.native="handleFilter" />
        
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t('table.search') }}
        </el-button>

        <el-button 
            class="filter-item" 
            style="margin-left: 10px;" 
            type="primary" 
            icon="el-icon-delete" 
            :disabled.sync="multipleSelection.length ? false : true"
            @click="handleDelete">
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
            <a :href="`http://yahoogomall.com/auction-item/${row.AuctionID}`" target="_blank" rel="noopener noreferrer">
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

      <el-table-column :label="$t('bid.price')+ '(円)'" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.WonPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('bid.count')" width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Bids }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.user')+'ID'" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userId}}</span>
        </template>
      </el-table-column>

      <el-table-column label="WhyFailed?" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.failed}}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" class-name="status-col" width="110">
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
import { getConfig} from '@/api/config'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import cn_province from '@/services/cn_province.json'
import {getLocalDate} from "@/services/helper"

import {mapState, mapGetters, mapActions} from 'vuex'

export default {
  name: 'BidWon',
  components: { Pagination},
  directives: { waves },
  filters: {    
  },
  data() {
   
    return {
      tableKey: 22,
      listLoading: true,
      list: null,
      total: 0,      
      listQuery: {
        page: 1,
        limit: 10,        
        AuctionID: '',
        userId: null  ,        
        failed: true
      }, 
      multipleSelection: []  ,
    }
  },
  created() {
    this.getList()   
  },
  computed:{    
    ...mapState('common', ['roles']),
    ...mapState(['user']),    
  },
  methods: {
    ...mapActions('common', ['getConfig']),
    getList() {
      this.listLoading = true
      
      if (this.listQuery.userId) this.listQuery.userId = parseInt(this.listQuery.userId)
      getWonList(this.listQuery).then(response => {
        // console.log(response)
        this.list = response.WonList.items
        this.total = response.WonList.total 
      }).finally(()=>{          
          this.listLoading = false
      })
    },
  
    getAuctionIDs(){
        var delArr=[];
        this.multipleSelection.forEach(el => {
          delArr.push(el.AuctionID)
        }); 
        return delArr.join(',')
    },
    handleFilter() {
      this.listQuery.page = 1
      // console.log(this.listQuery)
      this.getList()
    },    
    handleSelectionChange(val) {
        this.multipleSelection = val;        
    },

    handleDelete() {
        // console.log(this.multipleSelection); 
        this.$confirm('This will permanently delete the items. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',          
          type: 'warning'
        }).then(() => {                
          remove(this.getAuctionIDs()).then((res)=>{
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
<style scoped>
  
</style>