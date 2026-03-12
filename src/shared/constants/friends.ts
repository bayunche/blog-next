export interface FriendLink {
    name: string;
    url: string;
    avatar: string;
    description: string;
}

export interface FriendGroup {
    title: string;
    description: string;
    links: FriendLink[];
}

export const friendLinkGroups: FriendGroup[] = [
  
    {
        title: '博客邻居',
        description: '会认真表达、认真记录，也值得顺手加入书签栏。',
        links: [
         
        ],
    },
];

export const friendAvatarColors = [
    'bg-pink-500',
    'bg-purple-500',
    'bg-blue-500',
    'bg-cyan-500',
    'bg-teal-500',
    'bg-green-500',
    'bg-orange-500',
];
