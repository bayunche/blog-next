/**
 * 博客配置文件
 * 包含侧边栏、公告等配置信息
 */

import { GithubOutlined } from '@ant-design/icons'

/**
 * 侧边栏配置
 */
export const SIDEBAR_CONFIG = {
  /** 头像 */
  avatar: '/avatar.jpg',
  /** 标题 */
  title: '八云澈的小站',
  /** 子标题 */
  subTitle: '睡了已经肝不动了',
  /** 个人主页链接 */
  homepages: {
    GitHub: {
      link: 'https://github.com/bayunche',
      icon: GithubOutlined,
    },
  },
  /** 友情链接 */
  friendsLinks: {
    // 示例：
    // '示例博客': {
    //   link: 'https://example.com',
    //   avatar: 'https://example.com/avatar.jpg'
    // }
  },
}

/**
 * 公告配置
 */
export const ANNOUNCEMENT_CONFIG = {
  /** 是否启用公告 */
  enable: true,
  /** 公告内容 */
  content: '欢迎访问我的博客！',
}

/**
 * 快速导航配置
 */
export const QUICK_NAV_CONFIG = {
  /** 是否启用 */
  enable: true,
  /** 显示文章数量 */
  maxItems: 3,
  /** 标题 */
  title: '快速导航',
}

export const OWNERSHIP_INFO = {
  owner: '0xDIYgod.eth',
  creationTx: '0x6f1f...abcd',
  creationTxUrl: 'https://etherscan.io/tx/0x6f1f...abcd',
  lastUpdateTx: '0x9e3d...42ff',
  lastUpdateTxUrl: 'https://etherscan.io/tx/0x9e3d...42ff',
  ipfsHash: 'bafybeigdyrztg42examplehash',
  ipfsGateway: 'https://ipfs.io/ipfs/bafybeigdyrztg42examplehash',
}
