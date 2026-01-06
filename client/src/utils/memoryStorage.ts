import { Memory } from '@/types/memory';

const MEMORIES_STORAGE_KEY = 'garden_memories';

export function getMemories(petId: number): Memory[] {
  try {
    const stored = localStorage.getItem(MEMORIES_STORAGE_KEY);
    if (!stored) return [];
    const allMemories: Memory[] = JSON.parse(stored);
    return allMemories.filter(memory => memory.petId === petId);
  } catch (error) {
    console.error('Failed to get memories:', error);
    return [];
  }
}

export function addMemory(petId: number, memory: Omit<Memory, 'id'>): Memory {
  try {
    const stored = localStorage.getItem(MEMORIES_STORAGE_KEY);
    const allMemories: Memory[] = stored ? JSON.parse(stored) : [];
    
    const newMemory: Memory = {
      ...memory,
      id: `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    allMemories.push(newMemory);
    localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(allMemories));
    
    return newMemory;
  } catch (error) {
    console.error('Failed to add memory:', error);
    throw error;
  }
}

export function deleteMemory(memoryId: string): void {
  try {
    const stored = localStorage.getItem(MEMORIES_STORAGE_KEY);
    if (!stored) return;
    
    const allMemories: Memory[] = JSON.parse(stored);
    const filtered = allMemories.filter(memory => memory.id !== memoryId);
    localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete memory:', error);
    throw error;
  }
}

export function updateMemory(memoryId: string, updates: Partial<Omit<Memory, 'id' | 'petId'>>): Memory | null {
  try {
    const stored = localStorage.getItem(MEMORIES_STORAGE_KEY);
    if (!stored) return null;
    
    const allMemories: Memory[] = JSON.parse(stored);
    const memoryIndex = allMemories.findIndex(m => m.id === memoryId);
    
    if (memoryIndex === -1) return null;
    
    const updatedMemory = { ...allMemories[memoryIndex], ...updates };
    allMemories[memoryIndex] = updatedMemory;
    localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(allMemories));
    
    return updatedMemory;
  } catch (error) {
    console.error('Failed to update memory:', error);
    throw error;
  }
}
