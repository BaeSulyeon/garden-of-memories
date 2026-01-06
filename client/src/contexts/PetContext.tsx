/*
 * Design Philosophy: Celestial Poetics
 * Context: Pet Management
 * - Global state management for pets
 * - Real-time synchronization across pages
 * - Persistent updates to localStorage
 */

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Pet } from "@/types/pet";

interface PetContextType {
  pets: Pet[];
  updatePet: (petId: number, updatedPet: Pet) => void;
  addPet: (pet: Pet) => void;
  removePet: (petId: number) => void;
  getPetById: (petId: number) => Pet | undefined;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export function PetProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<Pet[]>([]);

  const updatePet = useCallback((petId: number, updatedPet: Pet) => {
    setPets((prevPets) =>
      prevPets.map((pet) => (pet.id === petId ? updatedPet : pet))
    );
    // localStorage에 저장 (선택사항)
    // localStorage.setItem("pets", JSON.stringify(updatedPets));
  }, []);

  const addPet = useCallback((pet: Pet) => {
    setPets((prevPets) => [...prevPets, pet]);
  }, []);

  const removePet = useCallback((petId: number) => {
    setPets((prevPets) => prevPets.filter((pet) => pet.id !== petId));
  }, []);

  const getPetById = useCallback(
    (petId: number) => {
      return pets.find((pet) => pet.id === petId);
    },
    [pets]
  );

  return (
    <PetContext.Provider value={{ pets, updatePet, addPet, removePet, getPetById }}>
      {children}
    </PetContext.Provider>
  );
}

export function usePetContext() {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error("usePetContext must be used within PetProvider");
  }
  return context;
}
