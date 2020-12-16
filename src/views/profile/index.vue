<template>
  <div class="app-container" :key="userId">
    <div v-if="user" >
      <el-tabs v-model="activeTab">
        <el-tab-pane label="Info" name="info">
          <account />
        </el-tab-pane>
        <el-tab-pane label="Activity All" name="all">
          <activity-all />
        </el-tab-pane>
        <el-tab-pane label="Activity Won" name="won">
          <activity-won />
        </el-tab-pane>
        <el-tab-pane label="Pending" name="pending">
          <timeline />
        </el-tab-pane>
        <el-tab-pane label="BuyComplate" name="complate">
          <activity-all />
        </el-tab-pane>
        <el-tab-pane label="Failed" name="fail">
          <activity-all />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ActivityAll from './components/ActivityAll'
import ActivityWon from './components/ActivityWon'
import Timeline from './components/Timeline'
import Account from './components/Account'

export default {
  name: 'Profile',
  components: { ActivityAll, Timeline, Account, ActivityWon },
  props:['tab'],
  data() {
    return {
      user: {},
      userId: this.$route.params.userId,
      activeTab: this.tab ? this.tab : 'info'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    console.log("created")
    // const tab = this.$route.query.tab
    // if (tab) {
    //   this.activeTab = tab
    // }
    this.getUser()
  },
  watch: {
    activeTab(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  methods: {
    getUser() {
      // this.user = {
      //   name: this.name,
      //   role: this.roles.join(' | '),
      //   email: 'admin@test.com',
      //   avatar: this.avatar
      // }
    },
    // handleTab(tab, event){
    //   // console.log(tab.name)
    //   this.$router.push(`${this.$route.path}? tab=${tab.name}`)
    // }
  }
}
</script>
