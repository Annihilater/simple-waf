import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDeleteSite } from "../hooks/useSites"
import { AnimatePresence, motion } from "motion/react"
import { 
    dialogEnterExitAnimation, 
    dialogContentAnimation, 
    dialogHeaderAnimation,
    dialogContentItemAnimation
} from '@/components/ui/animation/dialog-animation'

interface DeleteSiteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    siteId: string | null
}

export function DeleteSiteDialog({
    open,
    onOpenChange,
    siteId
}: DeleteSiteDialogProps) {
    const { deleteSite, isLoading } = useDeleteSite()

    const handleDelete = () => {
        if (!siteId) return

        deleteSite(siteId, {
            onSettled: () => {
                onOpenChange(false)
            }
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AnimatePresence mode="wait">
                {open && (
                    <motion.div {...dialogEnterExitAnimation}>
                        <AlertDialogContent className="p-0 overflow-hidden">
                            <motion.div {...dialogContentAnimation}>
                                <motion.div {...dialogHeaderAnimation}>
                                    <AlertDialogHeader className="p-6 pb-3">
                                        <AlertDialogTitle className="text-xl">确认删除</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            您确定要删除此站点吗？此操作无法撤销，可能会影响当前正在使用此站点的服务。
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                </motion.div>
                                
                                <motion.div 
                                    {...dialogContentItemAnimation}
                                    className="px-6 pb-6"
                                >
                                    <AlertDialogFooter className="mt-2 flex justify-end space-x-2">
                                        <AlertDialogCancel>取消</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            disabled={isLoading}
                                            className="bg-red-500 hover:bg-red-600"
                                        >
                                            {isLoading ? '删除中...' : '删除'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </motion.div>
                            </motion.div>
                        </AlertDialogContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </AlertDialog>
    )
} 