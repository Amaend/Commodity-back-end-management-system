// 统一接口管理
import requests from './request'

// 登录验证接口
export const reqLogin = (username, password) => {
  return requests({
    url: 'login',
    method: 'post',
    data: { username, password },
  })
}
// 左侧导航栏接口
export const reqMenus = () => {
  return requests({
    url: 'menus',
    method: 'get',
  })
}
// 获取用户数据信息接口
export const reqUsers = (pagedata) => {
  return requests({
    url: 'users',
    method: 'get',
    params: { ...pagedata },
  })
}
// 修改用户和状态接口
export const reqChangeUseState = (uId, type) => {
  return requests({
    url: `users/${uId}/state/${type}`,
    method: 'put',
  })
}
// 添加用户接口
export const reqAddUser = (adduserinfo) => {
  return requests({
    url: 'users',
    method: 'post',
    data: {
      ...adduserinfo,
    },
  })
}
// 修改用户数据接口
export const reqChangeUser = (id, changeUserInfo) => {
  return requests({
    url: `users/${id}`,
    method: 'put',
    data: {
      // ...changeUserInfo,
      email: changeUserInfo.email,
      mobile: changeUserInfo.mobile,
    },
  })
}
// 根据用户id查找数据
export const reqFindUserById = (id) => {
  return requests({
    url: `users/${id}`,
    method: 'get',
  })
}
// 删除用户数据
export const reqDeleteUser = (id) => {
  return requests({
    url: `users/${id}`,
    method: 'delete',
  })
}
// 编辑用户角色
export const reqChangeUserRole = (id, rid) => {
  return requests({
    url: `users/${id}/role`,
    method: 'put',
    data: {
      rid,
    },
  })
}
// 使用权限列表接口(列表)
export const reqRightsList = () => {
  return requests({
    url: 'rights/list',
    method: 'get',
  })
}
// 使用权限列表接口(树状)
export const reqRightsTree = () => {
  return requests({
    url: 'rights/tree',
    method: 'get',
  })
}
// 获取角色列表
export const reqRolesList = () => {
  return requests({
    url: 'roles',
    method: 'get',
  })
}
// 添加角色接口
export const reqAddRole = (addroleinfo) => {
  return requests({
    url: 'roles',
    method: 'post',
    data: {
      ...addroleinfo,
    },
  })
}
// 根据id查询数据
export const reqGetRoleId = (id) => {
  return requests({
    url: `roles/${id}`,
    method: 'get',
  })
}
// 角色编辑接口
export const reqEditRole = (editroleinfo) => {
  return requests({
    url: `roles/${editroleinfo.roleId}`,
    method: 'put',
    data: {
      ...editroleinfo,
    },
  })
}
// 删除角色接口
export const reqDeleteRole = (id) => {
  return requests({
    url: `roles/${id}`,
    method: 'delete',
  })
}
// 角色授权接口
export const reqAssignRight = (roleId, str) => {
  console.log(str)
  return requests({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: {
      rids: str,
    },
  })
}
// 删除权限接口
export const reqRemoveRight = (id, rightId) => {
  return requests({
    url: `roles/${id}/rights/${rightId}`,
    method: 'delete',
  })
}
// 获得参数列表
export const reqGetCateList = (queryinfo) => {
  return requests({
    url: 'categories',
    method: 'get',
    params: {
      ...queryinfo,
    },
  })
}
// 根据父级获取参数列表
export const reqGetCateParentList = () => {
  return requests({
    url: 'categories',
    method: 'get',
    params: {
      type: 2,
    },
  })
}
// 添加分类接口
export const reqAddCate = (addcateform) => {
  return requests({
    url: 'categories',
    method: 'post',
    data: {
      ...addcateform,
    },
  })
}
// 根据id查询分类
export const reqEditCateFormById = (editcateinfo) => {
  return requests({
    url: `categories/${editcateinfo.id}`,
    method: 'put',
    data: {
      ...editcateinfo,
    },
  })
}
// 删除分类接口
export const reqDeleteCateInfo = (id) => {
  return requests({
    url: `categories/${id}`,
    method: 'delete',
  })
}
// 获得参数列表
export const reqGetCatelist = () => {
  return requests({
    url: 'categories',
    method: 'get',
  })
}
// 参数列表
export const reqGetAttrList = (id, model) => {
  return requests({
    url: `categories/${id}/attributes`,
    method: 'get',
    params: {
      sel: model,
    },
  })
}
// 添加参数列表接口
export const reqAddParams = (id, model, name) => {
  return requests({
    url: `categories/${id}/attributes`,
    method: 'post',
    data: {
      attr_name: name,
      attr_sel: model,
    },
  })
}
// 编辑参数接口
export const reqEditParamsInfo = (id, arrid, name, sel, vlas) => {
  return requests({
    url: `categories/${id}/attributes/${arrid}`,
    method: 'put',
    data: {
      attr_name: name,
      attr_sel: sel,
      attr_vals: vlas,
    },
  })
}
// 删除参数接口
export const reqDeleteParams = (id, arrid) => {
  return requests({
    url: `categories/${id}/attributes/${arrid}`,
    method: 'delete',
  })
}
// 商品列表数据接口
export const reqGoodsList = (pagedata) => {
  return requests({
    url: 'goods',
    method: 'get',
    params: {
      ...pagedata,
    },
  })
}
// 根据id查询对应的goods货品
export const reqGoodsById = (id) => {
  return requests({
    url: `goods/${id}`,
    method: 'get',
  })
}
// 编辑商品内容
export const reqEmitGoodsInfo = (goodsinfo) => {
  return requests({
    url: `goods/${goodsinfo.id}`,
    method: 'put',
    data: {
      ...goodsinfo,
    },
  })
}
// 删除商品接口
export const reqDeleteGoods = (id) => {
  return requests({
    url: `goods/${id}`,
    method: 'delete',
  })
}
// 添加商品
export const reqAddGoods = (addform) => {
  console.log(addform)
  return requests({
    url: 'goods',
    method: 'post',
    data: {
      ...addform,
    },
  })
}
// 获取订单列表
export const reqOrdersList = (queryinfo) => {
  return requests({
    url: 'orders',
    method: 'get',
    params: {
      ...queryinfo,
    },
  })
}
// 显示物流信息接口
export const reqProgressInfo = (id) => {
  return requests({
    url: '/kuaidi/1106975712662',
    method: 'get',
  })
}
// 数据统计接口
export const reqReportsData = () => {
  return requests({
    url: 'reports/type/1',
    method: 'get',
  })
}
