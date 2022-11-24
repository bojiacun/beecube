
export default [
    {
        header: 'System Monitor Pages',
    },
    {
        title: '网关路由',
        route: 'monitor/gateway',
        icon: 'GitMerge'
    },
    {
        title: '定时任务',
        route: 'monitor/crons',
        icon: 'Clock'
    },
    {
        title: 'data log',
        route: 'monitor/datalog',
        icon: 'Terminal'
    },
    {
        title: 'system log',
        route: 'monitor/log',
        icon: 'Terminal'
    },
    {
        title: 'SQL监控',
        route: '/druid/login.html',
        icon: 'Crosshair',
        target: '_blank'
    },
    {
        title: '请求追踪',
        route: 'monitor/httptrace',
        icon: 'Eye'
    },
]