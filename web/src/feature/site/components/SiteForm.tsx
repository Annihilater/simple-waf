import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { certificatesApi } from '@/api/certificate'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    PlusCircle,
    Trash2,
    Server,
    Shield,
    Upload,
    Info,
    AlertCircle,
    RefreshCw
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { siteFormSchema } from '@/validation/site'
import { CreateSiteRequest, UpdateSiteRequest, WAFMode } from '@/types/site'
import { Certificate } from '@/types/certificates'
import { CertificateDialog } from '@/feature/certificate/components/CertificateDialog'
import { InfoRow } from '@/feature/certificate/components/CertificateForm'
import { useCreateSite, useUpdateSite } from '../hooks/useSites'

interface SiteFormProps {
    mode?: 'create' | 'update'
    siteId?: string
    onSuccess?: () => void
    defaultValues?: Partial<CreateSiteRequest>
}

export function SiteForm({
    mode = 'create',
    siteId,
    onSuccess,
    defaultValues = {
        name: '',
        domain: '',
        listenPort: 80,
        enableHTTPS: false,
        activeStatus: true,
        wafEnabled: false,
        wafMode: WAFMode.Observation,
        backend: {
            servers: [{ host: '', port: 80, isSSL: false }]
        },
    },
}: SiteFormProps) {
    // 状态
    const [showCertificateDialog, setShowCertificateDialog] = useState(false)
    const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
    const [selectedCertificateId, setSelectedCertificateId] = useState<string>('')

    // API钩子
    const {
        createSite,
        isLoading: isCreating,
        error: createError,
        clearError: clearCreateError
    } = useCreateSite()

    const {
        updateSite,
        isLoading: isUpdating,
        error: updateError,
        clearError: clearUpdateError
    } = useUpdateSite()

    // 获取证书列表
    const { data: certificates, refetch: refetchCertificates } = useQuery({
        queryKey: ['certificates'],
        queryFn: () => certificatesApi.getCertificates(1, 100),
        select: (data) => data.items,
    })

    // 动态状态
    const isLoading = mode === 'create' ? isCreating : isUpdating
    const error = mode === 'create' ? createError : updateError
    const clearError = mode === 'create' ? clearCreateError : clearUpdateError

    // 表单设置
    const form = useForm<CreateSiteRequest>({
        resolver: zodResolver(siteFormSchema),
        defaultValues,
    })

    // 服务器字段数组
    const { fields: serverFields, append: appendServer, remove: removeServer } = useFieldArray({
        control: form.control,
        name: "backend.servers"
    })

    // 初始化选中的证书ID（如果有）
    useEffect(() => {
        if (defaultValues.certificate && certificates) {
            const cert = certificates.find(c =>
                c.fingerPrint === defaultValues.certificate?.fingerPrint
            )
            if (cert) {
                setSelectedCertificateId(cert.id)
                setSelectedCertificate(cert)
            }
        }
    }, [defaultValues.certificate, certificates])

    // 监听证书选择变化
    useEffect(() => {
        if (selectedCertificateId && certificates) {
            const cert = certificates.find(c => c.id === selectedCertificateId)
            if (cert) {
                setSelectedCertificate(cert)
                // 更新证书字段
                form.setValue('certificate', {
                    certName: cert.name,
                    expireDate: cert.expireDate,
                    fingerPrint: cert.fingerPrint,
                    issuerName: cert.issuerName,
                    privateKey: cert.privateKey,
                    publicKey: cert.publicKey,
                })
            }
        } else if (selectedCertificateId === '') {
            setSelectedCertificate(null)
            form.setValue('certificate', undefined)
        }
    }, [selectedCertificateId, certificates, form])

    // 处理证书选择变更
    const handleCertificateChange = (value: string) => {
        if (value === 'upload-new') {
            setShowCertificateDialog(true)
        } else {
            setSelectedCertificateId(value)
        }
    }

    // 添加新服务器
    const addServer = () => {
        appendServer({ host: '', port: 80, isSSL: false })
    }

    // 表单提交处理
    const onSubmit = (data: CreateSiteRequest) => {
        // 清除之前的错误
        if (clearError) clearError()

        if (mode === 'create') {
            createSite(data, {
                onSuccess: () => {
                    if (onSuccess) onSuccess()
                }
            })
        } else if (mode === 'update' && siteId) {
            updateSite({
                id: siteId,
                data: data as UpdateSiteRequest
            }, {
                onSuccess: () => {
                    if (onSuccess) onSuccess()
                }
            })
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* API错误提示 */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* 基本信息部分 */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-medium">基本信息</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <div className="flex flex-col gap-1.5">
                                        <FormLabel className="text-sm font-medium">站点名称</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="请输入站点名称"
                                                className="rounded-md p-3 h-12"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="domain"
                                render={({ field }) => (
                                    <div className="flex flex-col gap-1.5">
                                        <FormLabel className="text-sm font-medium">域名</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="请输入域名"
                                                className="rounded-md p-3 h-12"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="listenPort"
                                render={({ field }) => (
                                    <div className="flex flex-col gap-1.5">
                                        <FormLabel className="text-sm font-medium">监听端口</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={65535}
                                                placeholder="80"
                                                className="rounded-md p-3 h-12"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="activeStatus"
                                render={({ field }) => (
                                    <div className="flex flex-col gap-1.5">
                                        <div className="text-sm font-medium">站点状态</div>
                                        <div className="w-full flex items-center justify-between rounded-md border p-3 h-12">
                                            <FormControl>
                                                <div className="flex items-center justify-between w-full">
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                    <label className="text-xs text-muted-foreground cursor-pointer">站点是否激活</label>
                                                </div>
                                            </FormControl>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    {/* HTTPS设置 */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-medium">HTTPS设置</h3>

                        <FormField
                            control={form.control}
                            name="enableHTTPS"
                            render={({ field }) => (
                                <div className="w-full">
                                    <div className="text-sm font-medium">启用HTTPS</div>
                                    <div className="text-xs text-muted-foreground mb-1">开启后需要配置证书</div>
                                    <div className="w-full rounded-md border p-3 flex justify-between items-center">
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </div>
                                </div>
                            )}
                        />

                        {form.watch('enableHTTPS') && (
                            <div className="p-4 border rounded-md">
                                <div>
                                    <FormLabel className="text-sm font-medium">选择证书</FormLabel>
                                    <div className="flex gap-2 mt-1">
                                        <Select
                                            value={selectedCertificateId}
                                            onValueChange={handleCertificateChange}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="选择证书" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {certificates?.map((cert) => (
                                                    <SelectItem key={cert.id} value={cert.id}>
                                                        <div className="flex flex-col">
                                                            <span>{cert.name}</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {cert.domains.join(', ')}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="upload-new">
                                                    <span className="flex items-center text-blue-600">
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        上传新证书
                                                    </span>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => refetchCertificates()}
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </div>

                                {selectedCertificate && (
                                    <div className="mt-4 p-4 border rounded-md bg-gray-50">
                                        <h4 className="text-sm font-medium mb-2">已选证书信息</h4>
                                        <div className="space-y-2 text-sm">
                                            <InfoRow label="证书名称" value={selectedCertificate.name} />
                                            <InfoRow
                                                label="颁发机构"
                                                value={selectedCertificate.issuerName}
                                            />
                                            <InfoRow
                                                label="过期日期"
                                                value={new Date(selectedCertificate.expireDate).toLocaleDateString()}
                                            />
                                            <div className="flex">
                                                <span className="w-24 text-muted-foreground">域名:</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {selectedCertificate.domains.map((domain, index) => (
                                                        <span key={index} className="px-2 py-0.5 bg-gray-200 rounded text-xs">
                                                            {domain}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 后端服务器 */}
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">后端服务器</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addServer}
                                className="flex items-center gap-1"
                            >
                                <PlusCircle className="h-4 w-4" />
                                添加服务器
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {serverFields.map((field, index) => (
                                <div key={field.id} className="p-4 border rounded-md">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <Server className="h-4 w-4 mr-2" />
                                            <span className="font-medium">服务器 {index + 1}</span>
                                        </div>
                                        {index > 0 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeServer(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`backend.servers.${index}.host`}
                                            render={({ field }) => (
                                                <div className="flex flex-col gap-1.5 justify-between">
                                                    <FormLabel className="text-sm font-medium">主机地址</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="如: 192.168.1.1 或 backend.com"
                                                            className="rounded-md p-3"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`backend.servers.${index}.port`}
                                            render={({ field }) => (

                                                <div className="flex flex-col gap-1.5 justify-between">
                                                    <FormLabel className="text-sm font-medium">端口</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            max={65535}
                                                            placeholder="80"
                                                            className="rounded-md p-3"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`backend.servers.${index}.isSSL`}
                                            render={({ field }) => (

                                                <div className="flex flex-col gap-1.5">
                                                    <div className="text-sm font-medium">启用SSL</div>
                                                    <FormControl>
                                                        <div className="w-full flex items-center justify-between rounded-md border p-3">
                                                            <div className="flex items-center justify-between w-full">
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                                <label className="text-xs text-muted-foreground cursor-pointer">后端使用HTTPS</label>
                                                            </div>
                                                        </div>
                                                    </FormControl>
                                                </div>

                                                // <div className="flex flex-col gap-1.5">
                                                //     <div className="text-sm font-medium">启用SSL</div>
                                                //     <div className="w-full flex items-center justify-between rounded-md border p-3">
                                                //         <FormControl>
                                                //             <div className="flex items-center justify-between w-full">
                                                //                 <Switch
                                                //                     checked={field.value}
                                                //                     onCheckedChange={field.onChange}
                                                //                 />
                                                //                 <label className="text-xs text-muted-foreground cursor-pointer">后端使用HTTPS</label>
                                                //             </div>
                                                //         </FormControl>
                                                //     </div>
                                                // </div>
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* WAF设置 */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-medium">WAF设置</h3>

                        <FormField
                            control={form.control}
                            name="wafEnabled"
                            render={({ field }) => (
                                <div className="w-full">
                                    <div className="text-sm font-medium">启用WAF</div>
                                    <div className="text-xs text-muted-foreground mb-1">Web应用防火墙</div>
                                    <div className="w-full rounded-md border p-3 flex justify-between items-center">
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </div>
                                </div>
                            )}
                        />

                        {form.watch('wafEnabled') && (
                            <FormField
                                control={form.control}
                                name="wafMode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">WAF模式</FormLabel>
                                        <div className="flex items-center gap-2 mt-1">
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="选择WAF模式" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value={WAFMode.Observation}>
                                                            <div className="flex items-center">
                                                                <Info className="mr-2 h-4 w-4 text-blue-500" />
                                                                <div className="flex flex-col">
                                                                    <span>观察模式</span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        只记录不拦截
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value={WAFMode.Protection}>
                                                            <div className="flex items-center">
                                                                <Shield className="mr-2 h-4 w-4 text-green-500" />
                                                                <div className="flex flex-col">
                                                                    <span>防护模式</span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        记录并拦截攻击
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>

                    {/* 提交按钮 */}
                    <div className="flex justify-end gap-2">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? '提交中...' : mode === 'create' ? '创建站点' : '更新站点'}
                        </Button>
                    </div>
                </form>
            </Form>

            {/* 证书创建对话框 */}
            <CertificateDialog
                open={showCertificateDialog || selectedCertificateId === 'upload-new'}
                onOpenChange={(open) => {
                    setShowCertificateDialog(open)
                    if (!open && selectedCertificateId === 'upload-new') {
                        setSelectedCertificateId('')
                    }
                }}
                mode="create"
                certificate={null}
            />
        </>
    )
}