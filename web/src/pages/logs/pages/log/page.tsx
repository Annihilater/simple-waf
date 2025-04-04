import { useState, useEffect } from "react"
import { useLocation } from "react-router"
import { Card } from "@/components/ui/card"
import {
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table"
import { DataTable } from "@/components/table/motion-data-table"
import { DataTablePagination } from "@/components/table/pagination"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { AttackLogFilter } from "@/feature/log/components/attack-log-filter"
import { AttackLogQueryFormValues } from "@/validation/log"
import { WAFLog, AttackDetailData } from "@/types/log"
import { useAttackLogs } from "@/feature/log/hook/useAttackLogs"
import { format } from "date-fns"
import { AttackDetailDialog } from "@/feature/log/components/attack-detail-dialog"
import { Eye } from "lucide-react"
import { AdvancedErrorDisplay } from "@/components/common/error/errorDisplay"
import { produce } from "immer"

export default function LogsPage() {
    const { t } = useTranslation()
    const location = useLocation()

    const [queryParams, setQueryParams] = useState<AttackLogQueryFormValues>({
        page: 1,
        pageSize: 10
    })

    const [selectedLog, setSelectedLog] = useState<AttackDetailData | null>(null)
    const [detailDialogOpen, setDetailDialogOpen] = useState(false)

    // 从URL参数中获取查询条件 - 使用 immer
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const domain = params.get('domain')
        const srcIp = params.get('srcIp')

        if (domain || srcIp) {
            setQueryParams(produce(draft => {
                if (domain) draft.domain = domain
                else delete draft.domain

                if (srcIp) draft.srcIp = srcIp
                else delete draft.srcIp
            }))
        }
    }, [location.search])

    const { data, isLoading, isError, error, refetch } = useAttackLogs(queryParams)

    const handleFilter = (values: AttackLogQueryFormValues) => {
        setQueryParams(values)
    }


    // 处理打开详情对话框
    const handleOpenDetail = (log: WAFLog) => {
        setSelectedLog({
            target: `${log.domain}:${log.dstPort}${log.uri}`,
            srcIp: log.srcIp,
            srcPort: log.srcPort,
            dstIp: log.dstIp,
            dstPort: log.dstPort,
            payload: log.payload,
            message: log.message,
            ruleId: log.ruleId,
            requestId: log.requestId,
            createdAt: log.createdAt,
            request: log.request,
            response: log.response,
            logs: log.logs.map(l => l.logRaw).join('\n\n')
        })
        setDetailDialogOpen(true)
    }

    const columns: ColumnDef<WAFLog>[] = [
        {
            header: t('attackTarget'),
            cell: ({ row }) => (
                <div className="max-w-[300px] truncate break-all">
                    {`${row.original.domain}:${row.original.dstPort}${row.original.uri}`}
                </div>
            )
        },
        {
            accessorKey: "srcIp",
            header: t('srcIp'),
            cell: ({ row }) => <span className="break-all">{row.getValue("srcIp")}</span>
        },
        {
            accessorKey: "srcPort",
            header: t('srcPort'),
            cell: ({ row }) => <span>{row.getValue("srcPort")}</span>
        },
        {
            accessorKey: "dstPort",
            header: t('dstPort'),
            cell: ({ row }) => <span>{row.getValue("dstPort")}</span>
        },
        {
            accessorKey: "dstIp",
            header: t('dstIp'),
            cell: ({ row }) => <span className="break-all">{row.getValue("dstIp")}</span>
        },
        {
            accessorKey: "createdAt",
            header: t('createdAt'),
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span>{format(new Date(row.getValue("createdAt")), "yyyy-MM-dd")}</span>
                    <span className="text-sm text-muted-foreground">{format(new Date(row.getValue("createdAt")), "HH:mm:ss")}</span>
                </div>
            )
        },
        {
            id: "actions",
            header: t('detail'),
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDetail(row.original)}
                    className="flex items-center gap-1"
                >
                    <Eye className="h-4 w-4" />
                    {t('detail')}
                </Button>
            )
        }
    ]

    const table = useReactTable({
        data: data?.results || [],
        columns,
        pageCount: data?.totalPages || 0,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        state: {
            pagination: {
                pageIndex: (queryParams.page || 1) - 1,
                pageSize: queryParams.pageSize || 10
            }
        },
        onPaginationChange: (updater) => {
            if (typeof updater === 'function') {
                const oldPagination = {
                    pageIndex: (queryParams.page || 1) - 1,
                    pageSize: queryParams.pageSize || 10
                }
                const newPagination = updater(oldPagination)

                // 使用 immer 统一处理分页变化
                setQueryParams(produce(draft => {
                    // 只有当页码改变时才更新页码
                    if (newPagination.pageIndex !== oldPagination.pageIndex) {
                        draft.page = newPagination.pageIndex + 1
                    }

                    // 只有当每页条数改变时才更新每页条数并重置页码
                    if (newPagination.pageSize !== oldPagination.pageSize) {
                        draft.pageSize = newPagination.pageSize
                        draft.page = 1 // 重置到第一页
                    }
                }))
            }
        }
    })


    return (
        <Card className="flex flex-col h-full p-0">
            {/* 头部筛选器 - 固定高度 */}
            <div className="p-6 flex-shrink-0">
                <AttackLogFilter onFilter={handleFilter} defaultValues={queryParams} onRefresh={refetch} />
            </div>

            {/* 表格区域 - 弹性高度，可滚动 */}
            <div className="px-6 flex-1 overflow-auto">
                {isError ? (
                    <AdvancedErrorDisplay error={error} onRetry={refetch} />
                ) : (
                    <DataTable
                        loadingStyle="skeleton"
                        table={table}
                        columns={columns}
                        isLoading={isLoading}
                        fixedHeader={true}
                        animatedRows={true}
                        showScrollShadows={true}
                    />
                )}
            </div>

            {/* 底部分页 - 固定高度 */}
            {!isError && <div className="py-6 px-4 flex-shrink-0">
                <DataTablePagination table={table} />
            </div>}
            <AttackDetailDialog
                open={detailDialogOpen}
                onOpenChange={setDetailDialogOpen}
                data={selectedLog}
            />
        </Card>
    )
}