<template>
  

  <el-form ref="dataForm" 
      :rules="rules" 
      :model="temp" 
      label-position="left" 
      label-width="110px"
      style="max-width:600px; margin:0 auto; margin-top:20px"    
      >
        <h2 style="text-align: center">{{$t('permission.role')}} ( <span>{{temp.roles ? temp.roles[0].name : ''}} )</span></h2>

        <el-form-item label="ID" style="margin-left:10px">          
          <span>{{temp.id}}</span>
        </el-form-item>

        <el-form-item :label="$t('table.name')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>

        <el-form-item :label="$t('login.email')" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>

        <el-form-item :label="$t('table.phone')" prop="phone">
          <el-input v-model="temp.phone" type="number"/>
        </el-form-item>
        
        <el-form-item :label="$t('new')+$t('login.password')">
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
            <el-option v-for="item in cn_cities" :key="item.region_id" :label="item.region_name" :value="item.region_id" />
          </el-select>
        </el-form-item>  
        
        <el-form-item :label="$t('table.address')">
          <el-input v-model="temp.aAddress" />
        </el-form-item>
        
        <el-form-item :label="$t('table.postalCode')">
          <el-input v-model="temp.postalCode" />
        </el-form-item>

        <el-form-item :label="$t('table.status')" style="margin-bottom:5px">
          <el-select v-model="temp.active" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item.value" :label="$t(item.text)" :value="item.value" />
          </el-select>
        </el-form-item>
        
        <el-form-item :label="$t('table.createdAt')" style="margin-bottom:0">          
          <span>{{ temp.createdAt | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </el-form-item>

        <el-form-item :label="$t('table.updatedAt')" style="margin-bottom:0">          
          <span>{{ temp.updatedAt | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </el-form-item>

        <el-form-item style="text-align:center">
          <el-button type="primary" @click="updateData()">Update</el-button>
        </el-form-item>

      </el-form>
</template>

<script>
import { mapGetters, mapActions} from 'vuex'
import { getInfo, update, existItem} from '@/api/user'
import CommonAPI from '@/api/common'

import cn_province from '@/services/cn_province.json'
import { parseTime } from '@/utils'
const statusOptions=[        
        {value:0, text:'table.stopped'},
        {value:1, text:'table.active'},
        {value:2, text:'table.blocked'},
      ]
export default {    
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
      statusOptions,           
      listQuery: {
        page: 1,
        limit: 20,        
        name: '',
        phone: undefined,
        active: 3,       
      },      

      temp: {
        id: undefined, 
        name: '',
        phone: '',
        active: 3,
        aProvince: '',
        aCounty: '',
        aCity: '',
        birth:"",
        password:""
      }, 
      rules: {
        name: [{ required: true, message: 'name is required', trigger: ['blur', 'change']},
              {min: 2, max: 15, message: 'Length should be 2 to 15', trigger: ['blur', 'change'] },              
              { validator: existName, trigger: 'blur' }
              ],
        email: [{ required: true, message: 'email is required', trigger: ['blur', 'change'] },
                { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change']},
                { validator: existEmail, trigger: 'blur' }
        ],
        phone: [{ required: true, message: 'phone is required', trigger: ['blur', 'change'] },
                {min: 11, max: 15, message: 'Length should be 11 to 15', trigger: ['blur', 'change'] },
                { validator: existPhone, trigger: 'blur' }
                ],
        IdNumber:[{ validator: existIDnumber, trigger: 'blur' }],
        // password:[{min: 6, max: 15, message: 'Length should be 6 to 15', trigger: ['blur', 'change'] }]
      },      
    }
  },
  methods: { 
    setCountisAndCities(key_province, key_county=null){     
      // console.log(key_province, key_county)       
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
    getUser() {
      getInfo(parseInt(this.$route.params.userId)).then((res)=>{        
        this.temp=res.getUser
        this.setCountisAndCities(this.temp.aProvince, this.temp.aCounty)
        // console.log(res.getUser)
      }).catch(()=>{
          // this.$router.push("/404")          
      }) 
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var tempData = Object.assign({}, this.temp)
          delete tempData.verified
          delete tempData.createdAt
          delete tempData.updatedAt
          delete tempData.roles
          console.log(tempData)
          CommonAPI.update('updateUser', tempData).then((res)=>{            
            // console.log(res.updateUser)
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
    
  },
  created() {
    this.getUser()
    console.log("Account created")    
  },
}
</script>
