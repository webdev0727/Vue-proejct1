<template>
  <div class="progress-check">
      <el-progress :percentage='percentage' :color='color' :text-inside='true' :stroke-width='12'></el-progress>
      <div class="progress-check-button">
          <div class="progress-button" 
          v-for="(btn, index) in buttons" 
          :key="btn.text"
          @click="handleCheck(index)" 
          :style="disabled ? 'border-color:#E6EBF5' : `border-color:${btn.color};`"
          :class="{active: btn.active}"
          >          
          <p :style="btn.action=='user' ? 'color:red':  'color:black'">{{btn.text}}</p>
          </div>  
      </div>
  </div>
</template>

<script>
export default {
    props: {        
        checked: {
            type: Number,
            default: 0
        },
        btns: {
            type: Array,
            default() {
                return [
                    {color: '#f56c6c', active: 1, text: '都'},          // win
                    {color: '#f9b098', active: 0, text: '付款要求'},   //request to user for paying
                    {color: '#e6a23c', active: 0, text: '已付'},       //paid
                    {color: '#31da1e', active: 0, text: '已付YH'},    //paid to YH
                    {color: '#5cb87a', active: 0, text: '仓库JP'},    // WareHouse arrived
                    {color: '#885af3', active: 0, text: '输类型要求'} ,   //
                    {color: '#6f7ad3', active: 0, text: '确定'},   //
                    {color: '#6091d0', active: 0, text: '类型YH'},    //
                    {color: '#1989fa', active: 0, text: '仓库CN'},    //
                ]
            }
        }, 
        firstAlwaysCheck:{
            type: Boolean,
            default: false
        }       
    },
    data(){
        return{
            percentage: 0,
            color: "#E6EBF5", 
            curChecked: this.checked,
            buttons: this.btns,
            disabled: false     
        }
    },
    computed: {
        
    },
    methods:{
        // getPercent(index){
        //     const len_btn = this.buttons.length
        // },
        handleCheck(index, loaded=true){
            // console.log(index)
            const len_btn = this.buttons.length
            
            const cur_active = this.buttons[index].active
            if(this.firstAlwaysCheck){
                if(index){
                    this.buttons[index].active= !cur_active
                    if(cur_active){
                        if(index < this.curChecked) this.curChecked = index
                        else this.curChecked = index - 1
                    }
                    else{
                        this.curChecked = index
                    }            
                }
                else this.curChecked = index
            }
            else{

                this.buttons[index].active= !cur_active
                if(cur_active){
                    if(index < this.curChecked) this.curChecked = index
                    else this.curChecked = index - 1
                }
                else{
                    this.curChecked = index
                }            
            }
            
            var tmp=[]
            this.buttons.forEach((btn, ind) => {
                
                if(ind<=this.curChecked) btn.active=1
                else btn.active=0
                tmp.push(btn)
            });
            this.buttons = tmp
            if(this.curChecked>=0){   
                this.disabled = false             
                this.percentage =  parseInt((100/(len_btn-1)*this.curChecked).toFixed(0)) 
                this.color = this.buttons[this.curChecked]['color']
            }else{
                this.disabled = true
            }
            if(loaded){
                this.$emit('update:checked', this.curChecked)
                this.$emit('change', { checked: this.curChecked})
            }
        }
    },
    created(){
        this.handleCheck(this.checked, false)
    }
}
</script>

<style>
    .progress-check{
        position: relative;
        display: inline-block;
        min-width: 410px;   
        margin-bottom: 20px;     
    }
    .progress-check-button{
        position:absolute;
        top: -3px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

    }
    .progress-button{
        width: 26px;
        height: 26px;
        border: 2px solid;
        border-radius: 50%;
        background-color: white;
        display: flex;
        justify-content: center;
        cursor: pointer;
    }
    .progress-button.active{
        background-image: url('/icon/checked.svg');
        background-repeat: no-repeat;
        background-position: center;
    }
    .progress-button p{
        text-align: center;
        margin-top: 28px;
        white-space: nowrap;
        font-size: 13px;
    }
</style>