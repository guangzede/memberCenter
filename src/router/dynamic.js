import Layout from '@/layout'
export default [
  {
    path: '/member',
    component: Layout,
    redirect: 'member/management',
    name: '会员管理',
    meta: { title: '会员管理' },
    children: [
      {
        path: '/member/management',
        component: () => import('@/pages/member/management'),
        name: 'memberManagement',
        hidden: 'true',
        meta: { title: '会员信息管理' }
      },
      {
        path: '/member/management',
        component: () => import('@/pages/member/management'),
        name: '会员信息管理',
        meta: { title: '会员信息管理' },
        children: [
          {
            path: '/member/query',
            component: () => import('@/pages/member/query'),
            name: '高级查询',
            meta: { title: '高级查询' }
          },
          {
            path: '/member/detail',
            component: () => import('@/pages/member/detail'),
            name: '会员详情',
            meta: { title: '会员详情' }
          }
        ]
      }
    ]
  },

  {
    path: '/accumulate',
    component: Layout,
    redirect: '/accumulate/management',
    name: '积分管理',
    meta: { title: '积分管理' },
    children: [
      {
        path: '/accumulate/index',
        hidden: true,
        component: () => import('@/pages/accumulate/index'),
        name: '积分管理',
        meta: { title: '积分管理' }
      }, {
        path: '/accumulate/management',
        component: () => import('@/pages/accumulate/management'),
        name: '积分规则配置',
        meta: { title: '积分规则配置' },
        children: [
          {
            path: '/accumulate/management/add',
            component: () => import('@/pages/accumulate/add'),
            name: '新增积分规则',
            meta: { title: '新增积分规则' }
          },
          {
            path: '/accumulate/management/detail',
            component: () => import('@/pages/accumulate/detail'),
            name: '积分规则详情',
            meta: { title: '积分规则详情' }
          },
          {
            path: '/accumulate/management/eidtor',
            component: () => import('@/pages/accumulate/eidtor'),
            name: '积分规则编辑',
            meta: { title: '积分规则编辑' }
          },
          {
            path: '/accumulate/management/addRule',
            component: () => import('@/pages/accumulate/addRule'),
            name: '新增积分规则',
            meta: { title: '新增积分规则' }
          }
        ]
      },
      {
        path: '/accumulate/steam',
        component: () => import('@/pages/accumulate/steam'),
        name: '积分流水查询',
        meta: { title: '积分流水查询' }
      },
      {
        path: '/accumulate/steamBrand',
        component: () => import('@/pages/accumulate/steamBrand'),
        name: '积分流水查询(品牌)',
        meta: { title: '积分流水查询(品牌)' }
      }

    ]
  },
  {
    path: '/growth',
    component: Layout,
    name: '成长值管理',
    meta: { title: '成长值管理' },
    redirect: '/growth/level',
    children: [
      {
        path: '/growth/index',
        hidden: 'true',
        component: () => import('@/pages/growth/index'),
        name: '成长值管理',
        meta: { title: '成长值管理' }
      },
      {
        path: '/growth/actionGrowthConfig',
        component: () => import('@/pages/growth/growthConfig'),
        name: '互动成长值参数设置',
        meta: { title: '互动成长值参数设置' }
      },
      {
        path: '/growth/level',
        component: () => import('@/pages/growth/level'),
        name: '等级设置管理',
        meta: { title: '等级设置管理' }
      },
      {
        path: '/growth/steam',
        component: () => import('@/pages/growth/steam'),
        name: '成长值流水查询',
        meta: { title: '成长值流水查询' }
      },
      {
        path: '/growth/steamBrand',
        component: () => import('@/pages/growth/steamBrand'),
        name: '成长值流水查询(品牌)',
        meta: { title: '成长值流水查询(品牌)' }
      },
      {
        path: '/growth/pGConfigBrand',
        component: () => import('@/pages/growth/pGConfigBrand'),
        name: '积分与成长值参数配置（品牌）',
        meta: { title: '积分与成长值参数配置（品牌）' }
      },
      {
        path: '/growth/growthConfig',
        component: () => import('@/pages/growth/ruleConfig'),
        name: '成长值规则设置',
        meta: { title: '成长值规则设置' },
        children: [
          {
            path: '/growth/growthConfig/addRule',
            component: () => import('@/pages/growth/addRule'),
            name: '新增成长值规则',
            meta: { title: '新增成长值规则' }
          },
          {
            path: '/growth/growthConfig/detail',
            component: () => import('@/pages/growth/detail'),
            name: '成长值规则详情',
            meta: { title: '成长值规则详情' }
          },
          {
            path: '/growth/growthConfig/editor',
            component: () => import('@/pages/growth/editor'),
            name: '成长值规则编辑',
            meta: { title: '成长值规则编辑' }
          },
          {
            path: '/growth/growthConfig/interactionDetail',
            component: () => import('@/pages/growth/interactionDetail'),
            name: '成长值规则详情 - 互动',
            meta: { title: '成长值规则详情 - 互动' }
          },
          {
            path: '/growth/growthConfig/interactionEditor',
            component: () => import('@/pages/growth/interactionEditor'),
            name: '成长值规则编辑 - 互动',
            meta: { title: '成长值规则编辑 - 互动' }
          },
          {
            path: '/growth/rule/transformDetail',
            component: () => import('@/pages/growth/transformDetail'),
            name: '成长值规则详情 - 转化/车主',
            meta: { title: '成长值规则详情 - 转化/车主' }
          },
          {
            path: '/growth/rule/transformEditor',
            component: () => import('@/pages/growth/transformEditor'),
            name: '成长值规则编辑 - 转化/车主',
            meta: { title: '成长值规则编辑 - 转化/车主' }
          }
        ]
      }

    ]
  },

  {
    path: '/menu',
    name: '菜单管理',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/pages/menu/index'),
        name: '菜单管理',
        meta: { title: '菜单管理' }
      }
    ]
  },
  {
    path: '/role',
    name: '角色管理',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/pages/role/index'),
        name: '角色管理',
        meta: { title: '角色管理' }
      }
    ]
  },
  {
    path: '/icons',
    name: 'icons',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/pages/icons/index'),
        name: 'data',
        meta: { title: 'icons' }
      }
    ]
  },
  {
    path: '/scene',
    name: '积分应用场景配置',
    component: Layout,
    redirect: '/scene/media',
    children: [
      {
        path: '/scene/media',
        component: () => import('@/pages/scene/media'),
        name: '试听类事件设置',
        meta: { title: '试听类事件设置' },
        children: [
          {
            path: '/scene/meida/add',
            component: () => import('@/pages/scene/add'),
            name: '新增事件',
            meta: { title: '新增事件' }
          }, {
            path: '/scene/meida/detail',
            component: () => import('@/pages/scene/detail'),
            name: '事件规则详情',
            meta: { title: '事件规则详情' }
          }
        ]
      }
    ]
  },
  {
    path: '/honor',
    name: '荣誉管理',
    component: Layout,
    redirect: '/honor/typeManagement',
    children: [
      {
        path: '/honor/typeManagement',
        component: () => import('@/pages/honor/typeManagement'),
        name: '荣誉类型管理',
        meta: { title: '荣誉类型管理' },
        children: [
          // {
          //   path: '/scene/meida/add',
          //   component: () => import('@/pages/scene/add'),
          //   name: '新增事件',
          //   meta: { title: '新增事件' }
          // }
        ]
      }
    ]
  },
  {
    path: '/platform',
    name: '基础信息管理',
    component: Layout,
    redirect: '/platform/index',
    children: [
      {
        path: '/platform/index',
        component: () => import('@/pages/platform/index'),
        name: 'data',
        meta: { title: '应用平台信息管理' }
      }
    ]
  }
]
