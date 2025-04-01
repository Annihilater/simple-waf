// 攻击事件查询参数
export interface AttackEventQuery {
    srcIp?: string          // 来源IP地址，攻击者地址
    dstIp?: string          // 目标IP地址，被攻击的服务器地址
    domain?: string         // 域名，被攻击的站点域名
    srcPort?: number        // 来源端口号，发起攻击的端口
    dstPort?: number        // 目标端口号，被攻击的服务端口
    startTime?: string      // 查询起始时间
    endTime?: string        // 查询结束时间
    page?: number           // 当前页码，从1开始计数
    pageSize?: number       // 每页记录数，最大100条
}

// 攻击日志查询参数
export interface AttackLogQuery {
    ruleId?: number         // 规则ID，触发攻击检测的WAF规则标识
    srcIp?: string          // 来源IP地址，攻击者地址
    dstIp?: string          // 目标IP地址，被攻击的服务器地址
    domain?: string         // 域名，被攻击的站点域名
    srcPort?: number        // 来源端口号，发起攻击的端口
    dstPort?: number        // 目标端口号，被攻击的服务端口
    requestId?: string      // 请求ID，唯一标识HTTP请求的ID
    startTime?: string      // 查询起始时间
    endTime?: string        // 查询结束时间
    page?: number           // 当前页码，从1开始计数
    pageSize?: number       // 每页记录数，最大100条
}

// 攻击事件聚合结果
export interface AttackEventAggregateResult {
    srcIp: string            // 来源IP地址，攻击者地址
    count: number            // 攻击总次数，同一来源的攻击计数
    domain: string           // 域名，被攻击的站点
    dstPort: number          // 目标端口号，被攻击的服务端口
    durationInMinutes: number // 攻击持续时间(分钟)，从首次到最近攻击的时间跨度
    firstAttackTime: string   // 首次攻击时间，该IP首次发起攻击的时间点
    isOngoing: boolean        // 是否正在进行中，标识攻击是否仍在持续
    lastAttackTime: string    // 最近攻击时间，该IP最后一次攻击的时间点
}

// 攻击事件分页结果
export interface AttackEventResponse {
    currentPage: number
    pageSize: number
    results: AttackEventAggregateResult[]
    totalCount: number
    totalPages: number
}

// WAF日志条目
export interface Log {
    accuracy: number           // 规则匹配准确度(0-10)
    logRaw: string             // 原始日志数据
    message: string            // 日志消息
    payload: string            // 攻击载荷
    phase: number              // 请求处理阶段
    ruleId: number             // 规则ID
    secLangRaw: string         // 安全规则原始定义
    secMark: string            // 安全标记
    severity: number           // 严重级别(0-5)
}

// WAF安全事件日志记录
export interface WAFLog {
    id: string                // 日志唯一标识符
    accuracy: number          // 规则匹配准确度(0-10)
    srcIp: string             // 来源IP地址
    srcPort: number           // 来源端口
    dstIp: string             // 目标IP地址
    dstPort: number           // 目标端口
    createdAt: string         // 事件发生时间戳
    domain: string            // 目标域名
    logs: Log[]               // 关联的日志条目
    message: string           // 事件描述消息
    payload: string           // 攻击载荷
    phase: number             // 请求处理阶段
    request: string           // 原始HTTP请求
    requestId: string         // 请求唯一标识
    response: string          // 原始HTTP响应
    ruleId: number            // 触发的规则ID
    secLangRaw: string        // 安全规则原始定义
    secMark: string           // 安全标记
    severity: number          // 事件严重级别(0-5)
    uri: string               // 请求URI路径
}

// 攻击日志分页结果
export interface AttackLogResponse {
    currentPage: number
    pageSize: number
    results: WAFLog[]
    totalCount: number
    totalPages: number
}

// 日志详情对话框数据
export interface AttackDetailData {
    target: string           // 目标 (domain + dstPort + url)
    srcIp: string            // 来源IP地址
    srcPort: number          // 来源端口
    dstIp: string            // 目标IP地址 
    dstPort: number          // 目标端口
    payload: string          // 攻击载荷
    message: string          // 消息
    ruleId: number           // 规则ID
    createdAt: string        // 创建时间
    request: string          // 请求内容
    response: string         // 响应内容
    logs: string             // 日志内容
} 