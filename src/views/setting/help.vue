<template>
<div class="app-container">
	<div class="filter-container">
		<el-button class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-edit" v-waves @click="handleTabCreate()">{{ $t('table.add') }}</el-button>
	</div>

	<el-tabs v-model="tabsValue" type="card" closable @tab-remove="removeTab" @tab-click="clickTab">
		<el-tab-pane v-for="(item, index) in tabs" :key="item.id" :name="item.id">
			<span slot="label"> {{item.name}}
				<el-button type="primary" icon="el-icon-edit" circle size="mini" @click.stop="handleTabUpdate(item)"></el-button>
			</span>
		</el-tab-pane>
	</el-tabs>




	<div class="components-container">
		<split-pane split="vertical" :default-percent='25' :min-percent='25'>
			<template slot="paneL">
				<div class="left-container">
					<div v-for="tab_child in tab_children" :key='tab_child.id' class="d-flex flex-bet-center">
						<el-radio v-model="id" 
						:label="tab_child.id" 
						@change='handleTabRadio'>
						{{tab_child.name}}
						</el-radio>
						<div>
						<el-button type="primary" icon="el-icon-edit" circle size="mini" @click="handleTabUpdate(tab_child)"></el-button>
						<el-button type="danger" icon="el-icon-delete" circle  size="mini" @click="handleTabDelete(tab_child.id)"></el-button>
						</div>
					</div>
					
					<!-- add  -->
					<div class="text-center">
						<el-input placeholder="Please input" v-model="new_child"></el-input>
						<el-button type="primary" 
						icon="el-icon-plus" 
						style="width:100%"
						@click="createTabDataChild"
						> 
						{{ $t('table.add') }}
						</el-button>              
					</div>
				</div>
</template>
<template slot="paneR">
<div class="right-container">
	<p>edit</p>
</div>
</template>
		</split-pane>
	</div>

    <el-dialog :title="textMap[dialogStatus]"
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

        <el-form-item :label="$t('table.order')" >
          <div style="display:flex">
			<el-input-number v-model="temp.orders" :min="0" :max="20"></el-input-number>
          </div>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button v-waves type="primary" @click="dialogStatus==='create'?createTabData():updateTabData()">
          {{ $t('table.confirm') }}
        </el-button>        
      </div>
    </el-dialog>


</div>
</template>

<script>
import { getBanner } from "@/api/banner";
import CommonAPI from "@/api/common";
import splitPane from 'vue-splitpane'

import { upload } from "@/api/upload";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Dropzone from "@/components/Dropzone";
import { getHelpTree } from '@/api/help'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
	name: "Help",
	components: { Dropzone, splitPane },
	directives: { waves, elDragDialog },
	filters: {},
	data() {
		return {
			id: '',
			new_child: '',
			list: [],
			tabsValue: '1',
			tabs: [],
			tab_children: [],
			tabIndex: 2,
			dialogFormVisible: false,
			temp: {},
			rules: {
				name: [{ required: true, message: 'name is required', trigger: 'change' }],
			},
			dialogStatus: '',
			textMap: {
				update: 'Edit',
				create: 'Create'
			},
		};
	},
	created() {
		// console.log(process.env.VUE_APP_API_UPLOAD, 'sdjflaksdf')
		// this.getList()
	},
	methods: {
		getChildList(tabsValue) {
			this.tab_children = this.list.filter(rr => rr.pid == tabsValue)
		},
		getList() {
			getHelpTree().then(response => {
				// console.log(response)
				this.list = response.helpTree
				this.tabs = this.list.filter(rr => rr.pid == 0)
				this.getChildList(this.tabsValue)
			})
		},
		addTab(targetName) {

			this.$prompt('Please input new tab name', 'Create Tab', {
				confirmButtonText: 'OK',
				cancelButtonText: 'Cancel',
				inputErrorMessage: "Not empty",
				inputValidator: (v) => v ? true : false,
			}).then(({ value }) => {
				this.$message({
					type: 'success',
					message: 'New tab:' + value
				});

				this.tabs.push({
					title: value,
					name: value,
					content: "New Tab content"
				});
				this.tabsValue = value;

			})

		},
		
		handleTabRadio(id) {
			console.log(id)
			// this.getChildList(id)
		},
		resetTemp() {
			this.temp = {
				id: '',
				name: '',
				orders: 0,
				pid: 0
			}
			this.$nextTick(() => {
				this.$refs['dataForm'].clearValidate()
			})
		},
		handleTabCreate() {
			this.resetTemp()
			this.dialogStatus = 'create'
			this.dialogFormVisible = true
		},

		createNode() {
			CommonAPI.add('addHelpTree', this.temp).then((res) => {
				if (!res.addHelpTree.error) {
					this.getList()
					this.resetTemp()
					this.new_child=''
					this.dialogFormVisible = false
					this.$notify({
						title: this.$t('notify.success'),
						message: this.$t('notify.createSuccess'),
						type: 'success',
						duration: 2000
					})
				} else {
					this.$notify.error({
						title: this.$t('notify.error'),
						message: this.$t('notify.createError'),
						duration: 2000
					})
				}
			})
		},
		clickTab(vv) {
			console.log(this.tabsValue)
			this.getChildList(this.tabsValue)
		},

		createTabData() {
			this.$refs['dataForm'].validate((valid) => {
				if (valid) {
					this.createNode()
				}
			})
		},
		createTabDataChild() {
			if (this.new_child){ 
				var max_order = 0
				if(this.tab_children.length){
					max_order = Math.max.apply(Math, this.tab_children.map(function(vv){ return vv.orders}))
					max_order++
					console.log(max_order)
				}
				this.temp={
					id: '',
					name: this.new_child,
					pid: this.tabsValue,
					orders: max_order
				}
				// console.log(this.temp)
				this.createNode()
			}	
		},
		handleTabUpdate(item) {
			this.temp = Object.assign({}, item)
			this.dialogStatus = 'Edit'
			this.dialogFormVisible = true
		},
		updateTabData() {
			this.$refs['dataForm'].validate((valid) => {
				if (valid) {
					CommonAPI.update('updateHelpTree', this.temp).then((res) => {
						if (!res.updateHelpTree.error) {
							this.dialogFormVisible = false
							this.getList()
							this.$notify({
								title: this.$t('notify.success'),
								message: this.$t('notify.updateSuccess'),
								type: 'success',
								duration: 2000
							})
						} else {
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
		handleTabDelete(val) {
			var delArr = [];
			if (val) delArr[0] = val
			const ids = delArr.join(',')

			this.$confirm('This will permanently delete the items. Continue?', 'Warning', {
				confirmButtonText: 'OK',
				cancelButtonText: 'Cancel',
				type: 'warning'
			}).then(() => {
				CommonAPI.del('delHelpTree', ids).then((res) => {
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
		removeTab(targetName) {
			console.log(targetName)
			this.handleTabDelete(targetName)
			// let tabs = this.tabs;
			// let activeName = this.tabsValue;
			// if (activeName === targetName) {
			// 	tabs.forEach((tab, index) => {
			// 		if (tab.name === targetName) {
			// 			let nextTab = tabs[index + 1] || tabs[index - 1];
			// 			if (nextTab) {
			// 				activeName = nextTab.name;
			// 			}
			// 		}
			// 	});
			// }

			// this.tabsValue = activeName;
			// this.tabs = tabs.filter(tab => tab.name !== targetName);
		},

	},

	created() {
		this.getList()
	},
}
</script>
<style lang="scss" scoped>
.line-7 .link-type {
	overflow: hidden;
	display: -webkit-box;
	text-overflow: ellipsis;
	-webkit-line-clamp: 4;
	-webkit-box-orient: vertical;
}

.editor-container {
	position: relative;
}

.components-container {
	position: relative;
	height: 100vh;
	margin: 0;
}

.left-container {
	// background-color: #F38181;
	height: 100%;
	padding: 10px;
	div {
		margin-bottom: 10px;
	}
}

.right-container {
	// background-color: #FCE38A;
	padding: 10px;
	width: 100%;
	height: 100%;
	div {
		margin-bottom: 15px;
	}
}
</style>
