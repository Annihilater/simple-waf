import { z } from 'zod'

// 攻击事件查询表单验证规则
export const attackEventQuerySchema = z.object({
  clientIpAddress: z.string().optional(),
  domain: z.string().optional(),
  port: z.coerce.number().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(10)
})

export type AttackEventQueryFormValues = z.infer<typeof attackEventQuerySchema>

// 攻击日志查询表单验证规则
export const attackLogQuerySchema = z.object({
  ruleId: z.coerce.number().optional(),
  clientIpAddress: z.string().optional(),
  domain: z.string().optional(), 
  port: z.coerce.number().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(10)
})

export type AttackLogQueryFormValues = z.infer<typeof attackLogQuerySchema> 