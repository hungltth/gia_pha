'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useSiteSettings } from '@/components/settings-provider';

const settingsSchema = z.object({
    site_title: z.string().min(2, 'Tiêu đề phải có ít nhất 2 ký tự').max(100),
    site_subtitle: z.string().max(200).optional(),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
    const { settings, refreshSettings } = useSiteSettings();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SettingsForm>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            site_title: settings.site_title,
            site_subtitle: settings.site_subtitle,
        },
    });

    const onSubmit = async (data: SettingsForm) => {
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            // Update site_title
            const { error: err1 } = await supabase
                .from('system_settings')
                .update({ value: data.site_title })
                .eq('key', 'site_title');
            if (err1) throw err1;

            // Update site_subtitle
            if (data.site_subtitle !== undefined) {
                const { error: err2 } = await supabase
                    .from('system_settings')
                    .update({ value: data.site_subtitle })
                    .eq('key', 'site_subtitle');
                if (err2) throw err2;
            }

            setSuccessMessage('Lưu cấu hình thành công!');
            await refreshSettings(); // Trigger context refresh
        } catch (error: any) {
            setErrorMessage(error.message || 'Có lỗi xảy ra khi lưu cấu hình');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Cấu hình hệ thống</h1>
                <p className="text-muted-foreground">Quản lý các thiết lập chung của website</p>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Thông tin Website</CardTitle>
                        <CardDescription>
                            Chỉnh sửa tiêu đề chính và phụ hiển thị trên toàn bộ trang.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {successMessage && (
                            <div className="p-3 bg-green-50 text-green-700 text-sm rounded-md dark:bg-green-900/30 dark:text-green-400">
                                {successMessage}
                            </div>
                        )}
                        {errorMessage && (
                            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md dark:bg-red-900/30 dark:text-red-400">
                                {errorMessage}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tiêu đề chính (Site Title)</label>
                            <Input
                                placeholder="Gia phả dòng họ..."
                                {...register('site_title')}
                            />
                            {errors.site_title && (
                                <p className="text-xs text-red-500">{errors.site_title.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Hiển thị ở Sidebar, Headings, và Document Title.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tiêu đề phụ (Site Subtitle)</label>
                            <Input
                                placeholder="Tên nhánh, chi..."
                                {...register('site_subtitle')}
                            />
                            {errors.site_subtitle && (
                                <p className="text-xs text-red-500">{errors.site_subtitle.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Hiển thị phụ ở Header và một số màn hình chức năng.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t pt-4 mt-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Đang lưu...' : (
                                <>
                                    <Save className="w-4 h-4 mr-2" /> Lưu cấu hình
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
