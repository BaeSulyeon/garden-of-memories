import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

interface Photo {
  id?: number;
  photoUrl: string;
  displayOrder: number;
}

interface PhotoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
  onPhotosChange: (photos: Photo[]) => void;
  petName: string;
}

export default function PhotoEditModal({
  isOpen,
  onClose,
  photos,
  onPhotosChange,
  petName,
}: PhotoEditModalProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsLoading(true);
    try {
      const fileArray = Array.from(files);
      for (const file of fileArray) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const photoUrl = event.target?.result as string;
          const newPhoto: Photo = {
            photoUrl,
            displayOrder: photos.length,
          };
          onPhotosChange([...photos, newPhoto]);
        };
        reader.readAsDataURL(file);
      }
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeletePhoto = (index: number) => {
    const updatedPhotos = photos
      .filter((_, i) => i !== index)
      .map((photo, i) => ({ ...photo, displayOrder: i }));
    onPhotosChange(updatedPhotos);
  };

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{petName}의 기억들 편집</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 슬라이드 뷰 */}
          {photos.length > 0 ? (
            <div className="relative">
              <div className="overflow-hidden rounded-lg bg-slate-900" ref={emblaRef}>
                <div className="flex">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative min-w-0 flex-[0_0_100%]">
                      <img
                        src={photo.photoUrl}
                        alt={`${petName} - ${index + 1}`}
                        className="h-96 w-full object-cover"
                      />
                      <button
                        onClick={() => handleDeletePhoto(index)}
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 네비게이션 */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={scrollPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={scrollNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  >
                    <ChevronRight size={24} />
                  </button>

                  <div className="mt-2 flex justify-center gap-2">
                    {photos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          index === selectedIndex ? "bg-pink-400" : "bg-slate-400"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-slate-400 bg-slate-900/50">
              <p className="text-center text-slate-400">아직 사진이 없습니다</p>
            </div>
          )}

          {/* 사진 추가 버튼 */}
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleAddPhoto}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex-1 gap-2"
            >
              <Plus size={20} />
              사진 추가
            </Button>
          </div>

          {/* 사진 목록 */}
          {photos.length > 0 && (
            <div className="max-h-32 space-y-2 overflow-y-auto">
              <p className="text-sm font-medium text-slate-300">
                총 {photos.length}장의 사진
              </p>
              <div className="grid grid-cols-4 gap-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo.photoUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-20 w-full rounded object-cover"
                    />
                    <button
                      onClick={() => handleDeletePhoto(index)}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              취소
            </Button>
            <Button onClick={onClose} className="flex-1">
              완료
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
