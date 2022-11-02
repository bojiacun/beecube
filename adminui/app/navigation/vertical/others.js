export default [
  {
    header: 'Others',
  },
  {
    title: 'Access Control',
    route: 'access-control',
    icon: 'Shield',
    // acl: {
    action: 'read',
    resource: 'ACL',
    // },
  },
  {
    title: 'Menu Levels',
    icon: 'Menu',
    children: [
      {
        title: 'Menu Level 2.1',
        route: null,
      },
      {
        title: 'Menu Level 2.2',
        children: [
          {
            title: 'Menu Level 3.1',
            route: null,
          },
          {
            title: 'Menu Level 3.2',
            route: null,
          },
        ],
      },
    ],
  },
  {
    title: 'Disabled Menu',
    route: null,
    icon: 'EyeOff',
    disabled: true,
  },
  {
    title: 'Raise Support',
    href: 'https://update.rexoui.com/',
    icon: 'LifeBuoy',
  },
  {
    title: 'Documentation',
    href: 'https://rexoui.com/demo/Rexo-vuejs-admin-dashboard-template/documentation',
    icon: 'FileText',
  },
]
