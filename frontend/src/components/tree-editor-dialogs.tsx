import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TreeNode } from '@/lib/tree-layout';

export function ConfirmDeleteDialog({
    person,
    isOpen,
    onClose,
    onConfirm
}: {
    person: TreeNode | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (deleteDescendants: boolean) => void;
}) {
    const [deleteDescendants, setDeleteDescendants] = useState(false);

    if (!person) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-red-600">Xác nhận xóa</DialogTitle>
                    <DialogDescription>
                        Bạn đang chuẩn bị xóa <strong>{person.displayName}</strong> khỏi gia phả. Hành động này không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-start space-x-2 my-4">
                    <input
                        type="checkbox"
                        id="delete-descendants"
                        checked={deleteDescendants}
                        onChange={(e) => setDeleteDescendants(e.target.checked)}
                        className="mt-1"
                    />
                    <label
                        htmlFor="delete-descendants"
                        className="text-sm font-medium leading-none cursor-pointer"
                    >
                        Xóa luôn toàn bộ vợ/chồng và con cháu hậu duệ của người này
                    </label>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Hủy</Button>
                    <Button variant="destructive" onClick={() => onConfirm(deleteDescendants)}>
                        Xóa dữ liệu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export type AddRelationType = 'parent' | 'spouse' | 'child' | 'root';

export function AddPersonDialog({
    targetPerson,
    relationType,
    isOpen,
    onClose,
    onConfirm
}: {
    targetPerson: TreeNode | null;
    relationType: AddRelationType | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { displayName: string; gender: number; birthYear: string; isLiving: boolean }) => void;
}) {
    const [displayName, setDisplayName] = useState('');
    const [gender, setGender] = useState<number>(1);
    const [birthYear, setBirthYear] = useState('');
    const [isLiving, setIsLiving] = useState(true);

    if (!relationType || (relationType !== 'root' && !targetPerson)) return null;

    let title = '';
    if (relationType === 'root') title = `Thêm Thủy tổ (Người đầu tiên)`;
    else if (relationType === 'parent') title = `Thêm Cha/Mẹ cho ${targetPerson?.displayName}`;
    else if (relationType === 'spouse') title = `Thêm Vợ/Chồng cho ${targetPerson?.displayName}`;
    else if (relationType === 'child') title = `Thêm Con cho ${targetPerson?.displayName}`;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm({ displayName, gender, birthYear, isLiving });
        setDisplayName('');
        setBirthYear('');
        setIsLiving(true);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="name" className="text-sm font-medium">Họ tên *</label>
                            <Input
                                id="name"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Giới tính</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                                    <input type="radio" checked={gender === 1} onChange={() => setGender(1)} /> Nam
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                                    <input type="radio" checked={gender === 2} onChange={() => setGender(2)} /> Nữ
                                </label>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="birthYear" className="text-sm font-medium">Năm sinh</label>
                            <Input
                                id="birthYear"
                                type="number"
                                placeholder="VD: 1990"
                                value={birthYear}
                                onChange={(e) => setBirthYear(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isLiving"
                                checked={isLiving}
                                onChange={(e) => setIsLiving(e.target.checked)}
                            />
                            <label htmlFor="isLiving" className="text-sm font-medium cursor-pointer">Còn sống</label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
                        <Button type="submit" disabled={!displayName.trim()}>Thêm mới</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
