
const keymap = {
  'role_menu': () => import('@/pages/role/index'),
  'role': () => import('@/pages/role/index'),

  'query': () => import('@/pages/member/query'),

  'growthSteam': () => import('@/pages/growth/steam'),
  // 'growthRuleConfig': () => import('@/pages/growth/ruleConfig'),
  // 'growthAddRule': () => import('@/pages/growth/addRule'),

  /**
   *
   *
   * 菜单
   *
   *
   */
  'menu': () => import('@/pages/menu/index'),

  /**
   *
   *
   * 成长值
   *
   *
   */
  // 成长值管理
  // 'growth': () => import('@/pages/growth/index'),
  //  等级设置管理
  'growthLevel': () => import('@/pages/growth/level'),
  //  新增成长值等级
  'levelAdd': () => import('@/pages/growth/levelSubPage'),
  //  成长值等级编辑
  'levelEdit': () => import('@/pages/growth/levelSubPage'),
  //  成长值等级详情
  'levelDetail': () => import('@/pages/growth/levelSubPage'),

  // 成长值规则详情 - 互动
  'interactionDetail': () => import('@/pages/growth/interaction'),
  // 成长值规则编辑 - 互动
  'interactionEditor': () => import('@/pages/growth/interaction'),

  // 成长值规则详情 - 转化/车主
  'transformDetail': () => import('@/pages/growth/transform'),
  // 成长值规则编辑 - 转化/车主
  'transformEditor': () => import('@/pages/growth/transform'),

  // 应用基础信息管理
  'platform': () => import('@/pages/application/platform/index'),
  // 应用账户列表
  'account': () => import('@/pages/application/account/index'),
  // 应用账户流水查询
  'accountRecord': () => import('@/pages/application/accountRecord/index'),
  // 应用统一积分兑换规则
  'pointsExchange': () => import('@/pages/application/pointsExchange/index'),

  // 互动成长值详情
  // 'actionDetail': () => import('@/pages/growth/actionDetail'),

  'growthEditor': () => import('@/pages/growth/editor'),
  'actionGrowthConfig': () => import('@/pages/growth/actionConfig'),

  'growthConfig': () => import('@/pages/growth/ruleConfig'),
  'growthAddRule': () => import('@/pages/growth/addRule'),
  'growthDetail': () => import('@/pages/growth/detail'),
  'pGConfigBrand': () => import('@/pages/growth/pGConfigBrand'),
  /**
   *
   *
   * 积分
   *
   *
   */

  // 积分规则配置
  'management': () => import('@/pages/accumulate/management'),
  // 积分流水
  'steam': () => import('@/pages/accumulate/steam'),
  // 积分流水（品牌）
  'steamBrand': () => import('@/pages/accumulate/steamBrand'),
  // 积分流水（品牌）
  'growthSteamBrand': () => import('@/pages/growth/steamBrand'),
  // 新增积分规则
  'accumulateAddRule': () => import('@/pages/accumulate/addRule'),
  // 积分规则详情
  'mDetail': () => import('@/pages/accumulate/detail'),

  'accumulateEditor': () => import('@/pages/accumulate/detail'),

  'scoreAdd': () => import('@/pages/accumulate/add'),
  // 会员积分手动调整
  'manualAdjustment': () => import('@/pages/accumulate/adjustment'),
  // 会员积分手动调整 -- 详情
  'manualDetail': () => import('@/pages/accumulate/auditInfo'),
  // 批量积分调整
  'batch': () => import('@/pages/accumulate/batch'),

  // 申请单详情
  'orderDetail': () => import('@/pages/accumulate/orderDetail'),
  // 积分手动调整审核
  'adjustmentAudit': () => import('@/pages/accumulate/adjustmentAudit'),
  // 申请单详情
  'mOrderDetail': () => import('@/pages/accumulate/auditInfo'),
  // 申请信息审核
  'mAuditInfo': () => import('@/pages/accumulate/auditInfo'),
  // 新建申请单
  'newApply': () => import('@/pages/accumulate/newApply'),
  /**
   *
   *
   * 会员信息
   *
   *
   */

  // 会员信息
  'memberManagement': () => import('@/pages/member/management'),
  // 会员信息详情
  'memberDetail': () => import('@/pages/member/detail'),
  // 车辆解绑管理
  'unbind': () => import('@/pages/member/unbind'),
  // 查询车辆解绑
  'searchBind': () => import('@/pages/member/searchBind'),

  /**
     *
     *
    * 积分应用场景配置
    *
    *
  */

  // 数值区间类事件
  'media': () => import('@/pages/scene/media'),
  // 数值区间类事件 - 详情
  'detailMedia': () => import('@/pages/scene/detail'),
  // 数值区间类事件 - 新增
  'addMedia': () => import('@/pages/scene/add'),
  // 数值区间类事件 - 编辑
  'editorMedia': () => import('@/pages/scene/detail'),
  // 成长值数值区间类事件
  'growthmedia': () => import('@/pages/scene/growthmedia'),
  // 成长值数值区间类事件 - 详情
  'detailGrowthMedia': () => import('@/pages/scene/growthdetail'),
  // 成长值数值区间类事件 - 新增
  'addGrowthMedia': () => import('@/pages/scene/growthadd'),
  // 成长值数值区间类事件 - 编辑
  'editorGrowthMedia': () => import('@/pages/scene/growthdetail'),

  // 荣誉类型管理
  'typeManagement': () => import('@/pages/honor/typeManagement'),
  'quartzJob': () => import('@/pages/quartz/index'),

  // 404
  'menuCode': () => import('@/pages/404'),

  // 用户管理
  'user': () => import('@/pages/user/index'),

  // 会员权益
  'rightsLevelConfig': () => import('@/pages/rights/levelConfig'),
  'rightsInformation': () => import('@/pages/rights/information'),
  'rightsQuery': () => import('@/pages/rights/query'),
  'editRights': () => import('@/pages/rights/add'),
  'addRights': () => import('@/pages/rights/add'),
  'detailRights': () => import('@/pages/rights/add'),
  'rightsConfigList': () => import('@/pages/rights/rightsConfigList'),
  'rightsConfig': () => import('@/pages/rights/rightsConfig'),

  // 个人子账户管理
  'childAccount': () => import('@/pages/personalAccount/childAccount'),
  // 个人总账户管理
  'totalAccount': () => import('@/pages/personalAccount/totalAccount'),
  // 子账户总账户转换比例
  'childTotalRatio': () => import('@/pages/personalAccount/childTotalRatio'),
  // 个人子账户流水
  'childAccountDetail': () => import('@/pages/personalAccount/childAccountDetail'),
  // 个人总账户流水
  'totalAccountDetail': () => import('@/pages/personalAccount/totalAccountDetail'),

  // 积分池
  'integralPool': () => import('@/pages/pool/integralPool'),
  // 积分池新增
  'addIntegralPool': () => import('@/pages/pool/addAndEdit'),
  // 积分池编辑
  'editIntegralPool': () => import('@/pages/pool/addAndEdit'),
  // 积分池详情
  'detailIntegralPool': () => import('@/pages/pool/addAndEdit'),
  // 积分池流水
  'integralPoolDetail': () => import('@/pages/poolDetail/index'),
  // kpi
  'kpiInfo': () => import('@/pages/kpi/index')
}
export default{
  keymap: keymap
}

