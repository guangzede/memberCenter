
import Layout from '@/layout'
import match from '@/router/match'
import matchIcon from '@/router/matchIcon'

export function tree0(list, flag) {
  const arr = []
  for (const i of list) {
    if (i.menuLevel === 0) {
      arr.push({
        children: tree1(i, list, flag),
        // name: i.menuName,
        id: i.id,
        systemRoleMenuInfoId: i.systemRoleMenuInfoId,
        checked: Boolean(i.systemRoleMenuInfoId),
        menuCode: i.menuCode,
        menuDesc: i.menuDesc,
        menuLevel: i.menuLevel,
        menuName: i.menuName,
        parentCode: i.parentCode,
        path: i.menuUrl,
        menuUrl: i.menuUrl,
        component: Layout,
        icon: matchIcon.keymap[i.menuCode],
        meta: {
          title: i.menuName,
          noCache: true
        }
      })
    }
  }
  return arr
}
function parentPath(item, list) {
  let path = ''
  for (const i of list) {
    if (item.parentCode === i.menuCode) {
      path = item.parentCode + path
      if (i.parentCode) {
        parentPath(i, list)
      }
    }
  }

  return path
}

function tree1(item, list, flag) {
  const arr = []
  if (!flag) {
    arr.push({
      path: '',
      menuName: item.menuName,
      hidden: true,
      meta: {
        title: item.menuName,
        noCache: true
      },
      component: match.keymap[item.menuCode]
    })
  }
  for (const i of list) {
    if (i.parentCode === item.menuCode) {
      arr.push({
        children: tree1(i, list, flag),
        menuDesc: i.menuDesc,
        id: i.id,
        checked: Boolean(i.systemRoleMenuInfoId),
        menuCode: i.menuCode,
        systemRoleMenuInfoId: i.systemRoleMenuInfoId,
        parentCode: i.parentCode,
        menuLevel: i.menuLevel,
        parentPath: parentPath(i, list),
        meta: {
          title: i.menuName,
          noCache: true,
          icon: 'el-icon-s-goods'
        },
        menuName: i.menuName,
        path: i.menuUrl,
        menuUrl: i.menuUrl,
        component: match.keymap[i.menuCode]
      })
    }
  }
  return arr
}
