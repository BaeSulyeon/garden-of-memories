/*
 * Design Philosophy: Celestial Poetics
 * Component: PetModal
 * - Slow, graceful expansion animation (0.8s)
 * - Soft backdrop blur
 * - Elegant typography with proper hierarchy
 * - Respectful presentation of pet information
 */

import { Pet } from "@/types/pet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PetModalProps {
  pet: Pet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PetModal({ pet, open, onOpenChange }: PetModalProps) {
  if (!pet) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl bg-card/95 backdrop-blur-xl border-border/50 text-card-foreground"
        style={{
          animation: "scale-in 0.8s ease-out",
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="text-3xl md:text-4xl text-center mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {pet.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
            <div>
              <span className="text-muted-foreground">종류</span>
              <p className="font-medium mt-1">{pet.species}</p>
            </div>
            {pet.age && (
              <div>
                <span className="text-muted-foreground">나이</span>
                <p className="font-medium mt-1">{pet.age}</p>
              </div>
            )}
            {pet.favoriteFood && (
              <div>
                <span className="text-muted-foreground">좋아했던 음식</span>
                <p className="font-medium mt-1">{pet.favoriteFood}</p>
              </div>
            )}
            {pet.dateOfPassing && (
              <div>
                <span className="text-muted-foreground">떠난 날</span>
                <p className="font-medium mt-1">{pet.dateOfPassing}</p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-border/30" />

          {/* Story */}
          <div>
            <h3
              className="text-xl mb-3 text-accent"
              style={{ fontFamily: "var(--font-accent)" }}
            >
              기억
            </h3>
            <p className="leading-relaxed text-foreground/90 whitespace-pre-line">
              {pet.story}
            </p>
          </div>

          {/* Photo placeholder */}
          {pet.photo && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={pet.photo}
                alt={pet.name}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Closing message */}
          <div className="text-center pt-4">
            <p
              className="text-sm text-muted-foreground italic"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              영원히 우리 마음 속에서 빛나는 별
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
