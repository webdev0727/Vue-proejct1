<template>
  <div class="app-container">   
      <div class="filter-container">
        
        <el-button 
          class="filter-item" 
          style="margin-right:30px" 
          type="primary" 
          icon="el-icon-search"         
          @click="handleFind">
            Find Won Bid List
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
        
        <el-button 
            class="filter-item" 
            style="margin-left: 10px;" 
            type="primary"             
            icon="el-icon-check"  
            :disabled.sync="watchProcessing"           
            @click="handleProcess">
               {{btns.length-1>processCheck ? btns[processCheck+1]['btnName'] : "COMPLATED"}}               
        </el-button>  

        <div>
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

          <progress-check 
          :checked.sync="processCheck" 
          :btns='btns'
          @change="handleFilter" 
          style="margin: 0 10px 28px; width: 500px"></progress-check>
          
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            {{ $t('table.search') }}
          </el-button>
        </div>

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

      <el-table-column :label="$t('table.actions')" class-name="status-col" width="140">
        <template slot-scope="{row}">     
                        
          <a v-if="row.ContactUrl" :href="row.ContactUrl" target="_blank">
            {{ $t('bid.contact') }}
          </a>          
          <el-button size="mini" type="danger" @click="handleFail(row)">
            {{ $t('table.failed') }}
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
import ProgressCheck from '@/components/ProgressCheck' // secondary package based on el-pagination
import cn_province from '@/services/cn_province.json'
import {getLocalDate} from "@/services/helper"

import {mapState, mapGetters, mapActions} from 'vuex'

export default {
  name: 'BidWon',
  components: { Pagination, ProgressCheck },
  directives: { waves },
  filters: {    
  },
  data() {
   
    return {
      tableKey: 22,
      listLoading: true,
      list: null,
      total: 0,      
      processCheck: 0,
      listQuery: {
        page: 1,
        limit: 10,        
        AuctionID: '',
        userId: null  ,
        status: 0            
      }, 
      multipleSelection: []  ,
      btns:[
              {color: '#f56c6c', active: 0, action: 'admin',  text: '新',       btnName:"Admin NextProcess Checker"},          // win
              {color: '#f9b098', active: 0, action: 'admin',  text: '付款要求', btnName:'Send 1st Payment Request'},   //request to user for paying
              {color: '#e6a23c', active: 0, action: 'user',   text: '已付',     btnName:'Waiting By User'},       //paid
              {color: '#885af3', active: 0, action: 'admin',  text: '已付YH',   btnName:'Check Yahoo 1st Payment'},    //paid to YH
              {color: '#6f7ad3', active: 0, action: 'admin',  text: '仓库JP',   btnName:'Check Yahoo Store in Japan'},    // WareHouse arrived
              {color: '#1989fa', active: 0, action: 'admin',  text: '输类型要求',btnName:'Send Shipping Option Request '} ,   //
              {color: '#6091d0', active: 0, action: 'user',   text: '确定',     btnName:'Waiting By User'},   //
              {color: '#0ea59f', active: 0, action: 'admin',  text: '类型YH',   btnName:'Setted Yahoo Shipping Option'},    //
              {color: '#5cb87a', active: 0, action: 'admin',  text: '仓库CN',   btnName:'Check China Store'},    //
          ]
    }
  },
  created() {
    this.getList()   
  },
  computed:{    
    ...mapState('common', ['roles']),
    ...mapState(['user']),
    watchProcessing: function(){
      var disableProcessing= true;
      if(this.multipleSelection.length){
        if(this.btns.length-1 > this.processCheck){
          if(this.btns[this.processCheck+1]['action']!='user') disableProcessing= false
        }
      }
      return disableProcessing
    } 
  },
  methods: {
    ...mapActions('common', ['getConfig']),
    getList() {
      this.listLoading = true
      this.listQuery.process = this.processCheck +1
      if (this.listQuery.userId) this.listQuery.userId = parseInt(this.listQuery.userId)
      getWonList(this.listQuery).then(response => {
        // console.log(response)
        this.list = response.WonList.items
        this.total = response.WonList.total 
      }).finally(()=>{          
          this.listLoading = false
      })
    },
    
    handleFind() {
      apiWonList().then((res)=>{
        if(res.apiWonList.error){
          this.$notify.error({
                title: this.$t('notify.error'),
                message: res.apiWonList.error + ":  " + res.apiWonList.msg,                
                duration: 2000
          })
        }else{
          this.$notify({
                title: this.$t('notify.success'),
                message: this.$t('notify.createSuccess'),
                type: 'success',
                duration: 2000
          })
        }
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
    handleProcess() {
        const AuctionIDs = this.getAuctionIDs()
        this.$confirm('Correct? Continue?', 'Confirm', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'info'
        }).then(() => {                
            checkProcess({processId: this.processCheck+1, AuctionIDs}).then((res)=>{
              console.log(res)
              this.$notify({
                title: this.$t('notify.success'),
                message: this.$t('notify.success'),
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
    
    handleFail(row){
      this.$prompt('Please input failed reason', 'Faild Reason', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          inputErrorMessage: "Not empty",
          inputValidator: (v)=> v ? true : false,          
        }).then(({ value }) => {          
          checkProcess({processId: 15, AuctionIDs: row.AuctionID, msg: value}).then((res)=>{
              console.log(res)
              this.$notify({
                title: this.$t('notify.success'),
                message: this.$t('notify.success'),
                type: 'success',
                duration: 2000
              })
              this.getList()              
          }) 
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Input canceled'
          });       
        });
    }




  }
    
}
</script>
<style scoped>
  
</style>