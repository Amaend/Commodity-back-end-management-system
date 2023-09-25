import Vue from 'vue'
// 引入App根组件
import App from './App.vue'
// 引入路由
import router from './router'
// 引入仓库
import store from './store'
// 引入element（按需引入）
import {
  Message,
  Container,
  Aside,
  Header,
  Main,
  RadioGroup,
  Menu,
  Submenu,
  MenuItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Breadcrumb,
  BreadcrumbItem,
  Pagination,
  Card,
  Button,
  Row,
  Col,
  Input,
  Table,
  TableColumn,
  Switch,
  Dialog,
  Form,
  FormItem,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  TabPane,
  Tabs,
  Steps,
  Step,
  Checkbox,
  CheckboxGroup,
  Upload,
  Timeline,
  TimelineItem,
} from 'element-ui'

// import 'https://cdnjs.cloudflare.com/ajax/libs/animejs/2.2.0/anime.js'
// 引入element样式
import 'element-ui/lib/theme-chalk/index.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入全局初始化css
import '@/assets/css/index.css'
import '@/assets/css/element.css'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
// 使用element组件
Vue.use(Container)
  .use(Aside)
  .use(Header)
  .use(Main)
  .use(Menu)
  .use(Submenu)
  .use(MenuItem)
  .use(RadioGroup)
  .use(Dropdown)
  .use(DropdownItem)
  .use(DropdownMenu)
  .use(Breadcrumb)
  .use(BreadcrumbItem)
  .use(Pagination)
  .use(Button)
  .use(Row)
  .use(Col)
  .use(Card)
  .use(Input)
  .use(Table)
  .use(TableColumn)
  .use(Switch)
  .use(Dialog)
  .use(Form)
  .use(FormItem)
  .use(Tag)
  .use(Tree)
  .use(Select)
  .use(Option)
  .use(Cascader)
  .use(Alert)
  .use(TabPane)
  .use(Tabs)
  .use(Steps)
  .use(Step)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Upload)
  .use(Timeline)
  .use(TimelineItem)
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
