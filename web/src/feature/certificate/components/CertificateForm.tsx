import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Upload, FileText, X, AlertCircle, Info } from 'lucide-react'
import { certificateFormSchema } from '@/validation/certificates'
import { parseCertificate, readFileAsText } from '@/utils/certificate-parser'
import { CertificateCreateRequest, ParsedCertificate } from '@/types/certificates'
import { useCreateCertificate, useUpdateCertificate } from '../hooks/useCertificates'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface CertificateFormProps {
    mode?: 'create' | 'update'
    certificateId?: string
    onSuccess?: () => void
    defaultValues?: Partial<CertificateCreateRequest>
}

export function CertificateForm({
    mode = 'create',
    certificateId,
    onSuccess,
    defaultValues = {
        name: '',
        description: '',
        publicKey: '',
        privateKey: '',
    },
}: CertificateFormProps) {
    // 状态管理
    const [parsedInfo, setParsedInfo] = useState<ParsedCertificate | null>(null)
    const [publicKeyFile, setPublicKeyFile] = useState<string | null>(null)
    const [privateKeyFile, setPrivateKeyFile] = useState<string | null>(null)
    const [parseError, setParseError] = useState<string | null>(null)

    // API钩子
    const {
        createCertificate,
        isLoading: isCreating,
        error: createError,
        clearError: clearCreateError
    } = useCreateCertificate()

    const {
        updateCertificate,
        isLoading: isUpdating,
        error: updateError,
        clearError: clearUpdateError
    } = useUpdateCertificate()

    // 动态状态
    const isLoading = mode === 'create' ? isCreating : isUpdating
    const error = mode === 'create' ? createError : updateError
    const clearError = mode === 'create' ? clearCreateError : clearUpdateError

    // 表单设置
    const form = useForm<CertificateCreateRequest>({
        resolver: zodResolver(certificateFormSchema),
        defaultValues,
    })

    // 尝试解析证书内容
    const tryParseCertificate = useCallback((content: string) => {
        if (!content) {
            setParsedInfo(null)
            setParseError(null)
            return
        }

        try {
            const parsed = parseCertificate(content)
            setParsedInfo(parsed)
            setParseError(null)

            // 如果之前有解析错误，清除相关表单错误
            form.clearErrors('publicKey')
        } catch (error) {
            console.error('证书解析错误:', error)

            // 清除已解析信息
            setParsedInfo(null)

            // 设置错误信息，但不阻止表单提交
            if (error instanceof Error) {
                setParseError(`证书解析失败: ${error.message}`)
            } else {
                setParseError('证书解析失败: 未知错误')
            }
        }
    }, [form])

    // 处理公钥文件上传
    const handlePublicKeyFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]

            try {
                const content = await readFileAsText(file)

                // 更新表单和UI状态
                form.setValue('publicKey', content)
                setPublicKeyFile(file.name)

                // 尝试解析证书
                tryParseCertificate(content)
            } catch (error) {
                console.error('文件读取错误:', error)

                // 文件读取错误显示在表单上
                const errorMessage = error instanceof Error ? error.message : '未知错误'
                form.setError('publicKey', {
                    type: 'manual',
                    message: `文件读取失败: ${errorMessage}`
                })
            }
        }
    }, [form, tryParseCertificate])

    // 处理私钥文件上传
    const handlePrivateKeyFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]

            try {
                const content = await readFileAsText(file)

                // 更新表单和UI状态
                form.setValue('privateKey', content)
                setPrivateKeyFile(file.name)
            } catch (error) {
                console.error('文件读取错误:', error)

                // 文件读取错误显示在表单上
                const errorMessage = error instanceof Error ? error.message : '未知错误'
                form.setError('privateKey', {
                    type: 'manual',
                    message: `文件读取失败: ${errorMessage}`
                })
            }
        }
    }, [form])

    // 清除公钥文件
    const clearPublicKeyFile = useCallback(() => {
        setPublicKeyFile(null)
        form.setValue('publicKey', '')
        setParsedInfo(null)
        setParseError(null)
    }, [form])

    // 清除私钥文件
    const clearPrivateKeyFile = useCallback(() => {
        setPrivateKeyFile(null)
        form.setValue('privateKey', '')
    }, [form])

    // 处理公钥文本框变更
    const handlePublicKeyTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        tryParseCertificate(value)
    }, [tryParseCertificate])

    // 表单提交处理
    const handleFormSubmit = useCallback((data: CertificateCreateRequest) => {
        // 清除之前的错误
        if (clearError) clearError()

        // 合并解析出来的证书信息
        const finalData = {
            ...data,
            ...(parsedInfo || {}),
        }

        // 根据模式执行创建或更新操作
        if (mode === 'create') {
            createCertificate(finalData, {
                onSuccess: () => {
                    // 重置表单
                    form.reset()
                    setPublicKeyFile(null)
                    setPrivateKeyFile(null)
                    setParsedInfo(null)
                    setParseError(null)
                    // 通知父组件成功
                    if (onSuccess) onSuccess()
                }
            })
        } else if (mode === 'update' && certificateId) {
            updateCertificate({ id: certificateId, data: finalData }, {
                onSuccess: () => {
                    // 通知父组件成功
                    if (onSuccess) onSuccess()
                }
            })
        }
    }, [mode, certificateId, clearError, parsedInfo, createCertificate, updateCertificate, form, onSuccess])

    // 渲染已解析的证书信息
    const renderParsedInfo = useCallback(() => {
        if (!parsedInfo) return null

        return (
            <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="text-sm font-medium mb-2">证书解析信息</h3>
                <div className="space-y-2 text-sm">
                    <InfoRow label="颁发机构" value={parsedInfo.issuerName} />
                    <InfoRow
                        label="过期日期"
                        value={new Date(parsedInfo.expireDate).toLocaleDateString()}
                    />
                    <InfoRow label="指纹" value={parsedInfo.fingerPrint} className="font-mono text-xs" />
                    <div className="flex">
                        <span className="w-24 text-muted-foreground">域名:</span>
                        <div className="flex flex-wrap gap-1">
                            {parsedInfo.domains.map((domain, index) => (
                                <span key={index} className="px-2 py-0.5 bg-gray-200 rounded text-xs">
                                    {domain}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }, [parsedInfo])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                {/* API错误提示 */}
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* 证书解析错误提示 */}
                {parseError && (
                    <Alert variant="default" className="bg-yellow-50 border-yellow-200">
                        <Info className="h-4 w-4 text-yellow-800" />
                        <AlertDescription className="text-yellow-800">{parseError}</AlertDescription>
                    </Alert>
                )}

                {/* 基本信息字段 */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>证书名称</FormLabel>
                            <FormControl>
                                <Input placeholder="输入证书名称" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>描述 (可选)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="输入证书描述"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* 公钥文件上传 */}
                <div className="space-y-2">
                    <FormLabel>公钥文件</FormLabel>
                    {publicKeyFile ? (
                        <FilePreview
                            filename={publicKeyFile}
                            onClear={clearPublicKeyFile}
                        />
                    ) : (
                        <FileUpload
                            label="上传公钥文件"
                            accept=".pem,.crt,.cert,.key"
                            onChange={handlePublicKeyFileChange}
                        />
                    )}
                </div>

                {/* 公钥内容 */}
                <FormField
                    control={form.control}
                    name="publicKey"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>公钥内容</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="输入PEM格式的公钥内容"
                                    className="font-mono text-xs h-32"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        handlePublicKeyTextChange(e)
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* 私钥文件上传 */}
                <div className="space-y-2">
                    <FormLabel>私钥文件</FormLabel>
                    {privateKeyFile ? (
                        <FilePreview
                            filename={privateKeyFile}
                            onClear={clearPrivateKeyFile}
                        />
                    ) : (
                        <FileUpload
                            label="上传私钥文件"
                            accept=".pem,.key"
                            onChange={handlePrivateKeyFileChange}
                        />
                    )}
                </div>

                {/* 私钥内容 */}
                <FormField
                    control={form.control}
                    name="privateKey"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>私钥内容</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="输入PEM格式的私钥内容"
                                    className="font-mono text-xs h-32"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* 证书解析信息 */}
                {renderParsedInfo()}

                {/* 提交按钮 */}
                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? '提交中...' : mode === 'create' ? '创建' : '更新'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

// 辅助组件：信息行
interface InfoRowProps {
    label: string
    value: string
    className?: string
}

function InfoRow({ label, value, className = '' }: InfoRowProps) {
    return (
        <div className="flex">
            <span className="w-24 text-muted-foreground">{label}:</span>
            <span className={className}>{value}</span>
        </div>
    )
}

// 辅助组件：文件预览
interface FilePreviewProps {
    filename: string
    onClear: () => void
}

function FilePreview({ filename, onClear }: FilePreviewProps) {
    return (
        <div className="flex items-center gap-2 p-2 border rounded">
            <FileText className="h-4 w-4" />
            <span className="text-sm flex-1 truncate">{filename}</span>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClear}
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    )
}

// 辅助组件：文件上传
interface FileUploadProps {
    label: string
    accept: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function FileUpload({ label, accept, onChange }: FileUploadProps) {
    return (
        <div className="flex items-center gap-2">
            <Button
                type="button"
                variant="outline"
                size="sm"
                asChild
            >
                <label className="cursor-pointer flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>{label}</span>
                    <input
                        type="file"
                        className="hidden"
                        accept={accept}
                        onChange={onChange}
                    />
                </label>
            </Button>
            <span className="text-sm text-muted-foreground">或直接输入内容</span>
        </div>
    )
}