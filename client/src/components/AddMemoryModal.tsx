import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { addMemory } from '@/utils/memoryStorage';
import { Memory } from '@/types/memory';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  petId: number;
  onMemoryAdded: (memory: Memory) => void;
}

export function AddMemoryModal({ isOpen, onClose, petId, onMemoryAdded }: AddMemoryModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      // 간단한 Base64 인코딩으로 이미지 저장 (실제 프로덕션에서는 서버에 업로드)
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setImageUrl(base64);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      const newMemory = addMemory(petId, {
        title: title.trim(),
        content: content.trim(),
        imageUrl: imageUrl || undefined,
        createdAt: new Date().toISOString(),
        petId,
      });

      onMemoryAdded(newMemory);
      setTitle('');
      setContent('');
      setImageUrl('');
      onClose();
    } catch (error) {
      console.error('Failed to add memory:', error);
      alert('추억 저장에 실패했습니다.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>추억 기록하기</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 이미지 업로드 */}
          <div>
            <label className="block text-sm font-medium mb-2">사진 (선택사항)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="w-full border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-accent/50 transition-colors disabled:opacity-50"
            >
              {imageUrl ? '사진 변경' : '사진 선택'}
            </button>
            {imageUrl && (
              <div className="mt-2 relative">
                <img src={imageUrl} alt="preview" className="w-full h-40 object-cover rounded-lg" />
                <button
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium mb-2">제목</label>
            <Input
              placeholder="추억의 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium mb-2">내용</label>
            <Textarea
              placeholder="이 날의 추억을 기록해주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              저장하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
