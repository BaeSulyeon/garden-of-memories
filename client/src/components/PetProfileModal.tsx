import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Pet } from '@/types/pet';
import { Memory } from '@/types/memory';
import { getMemories, deleteMemory } from '@/utils/memoryStorage';
import { AddMemoryModal } from './AddMemoryModal';
import { Trash2, Plus } from 'lucide-react';

interface PetProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: Pet | null;
}

export function PetProfileModal({ isOpen, onClose, pet }: PetProfileModalProps) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);

  useEffect(() => {
    if (pet) {
      const petMemories = getMemories(pet.id);
      setMemories(petMemories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, [pet, isOpen]);

  const handleMemoryAdded = (newMemory: Memory) => {
    setMemories([newMemory, ...memories]);
    setIsAddMemoryOpen(false);
  };

  const handleDeleteMemory = (memoryId: string) => {
    if (confirm('이 추억을 삭제하시겠습니까?')) {
      try {
        deleteMemory(memoryId);
        setMemories(memories.filter(m => m.id !== memoryId));
      } catch (error) {
        console.error('Failed to delete memory:', error);
        alert('추억 삭제에 실패했습니다.');
      }
    }
  };

  if (!pet) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{pet.name}의 프로필</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* 반려동물 기본 정보 */}
            <div className="bg-card rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-lg">기본 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">이름</p>
                  <p className="font-medium">{pet.name}</p>
                </div>
                {pet.type && (
                  <div>
                    <p className="text-sm text-muted-foreground">종류</p>
                    <p className="font-medium">{pet.type}</p>
                  </div>
                )}
                {pet.gender && (
                  <div>
                    <p className="text-sm text-muted-foreground">성별</p>
                    <p className="font-medium">{pet.gender}</p>
                  </div>
                )}
                {pet.age && (
                  <div>
                    <p className="text-sm text-muted-foreground">나이</p>
                    <p className="font-medium">{pet.age}세</p>
                  </div>
                )}
                {pet.status && (
                  <div>
                    <p className="text-sm text-muted-foreground">상태</p>
                    <p className="font-medium">{pet.status}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 추억 섹션 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">추억 ({memories.length})</h3>
                <Button
                  size="sm"
                  onClick={() => setIsAddMemoryOpen(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  추억 추가
                </Button>
              </div>

              {memories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>아직 기록된 추억이 없습니다.</p>
                  <p className="text-sm">첫 번째 추억을 기록해보세요!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {memories.map((memory) => (
                    <div key={memory.id} className="bg-card rounded-lg p-4 space-y-2">
                      {memory.imageUrl && (
                        <img
                          src={memory.imageUrl}
                          alt={memory.title}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold">{memory.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                            {memory.content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(memory.createdAt).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteMemory(memory.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddMemoryModal
        isOpen={isAddMemoryOpen}
        onClose={() => setIsAddMemoryOpen(false)}
        petId={pet.id}
        onMemoryAdded={handleMemoryAdded}
      />
    </>
  );
}
