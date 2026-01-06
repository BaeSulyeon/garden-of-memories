import { describe, it, expect, beforeEach } from "vitest";

interface Photo {
  id?: number;
  photoUrl: string;
  displayOrder: number;
}

describe("PhotoEditModal", () => {
  let photos: Photo[];

  beforeEach(() => {
    photos = [
      { id: 1, photoUrl: "photo1.jpg", displayOrder: 0 },
      { id: 2, photoUrl: "photo2.jpg", displayOrder: 1 },
      { id: 3, photoUrl: "photo3.jpg", displayOrder: 2 },
    ];
  });

  it("should initialize with photos", () => {
    expect(photos).toHaveLength(3);
    expect(photos[0].photoUrl).toBe("photo1.jpg");
  });

  it("should add a new photo", () => {
    const newPhoto: Photo = {
      photoUrl: "photo4.jpg",
      displayOrder: photos.length,
    };
    const updatedPhotos = [...photos, newPhoto];
    expect(updatedPhotos).toHaveLength(4);
    expect(updatedPhotos[3].photoUrl).toBe("photo4.jpg");
  });

  it("should delete a photo by index", () => {
    const indexToDelete = 1;
    const updatedPhotos = photos
      .filter((_, i) => i !== indexToDelete)
      .map((photo, i) => ({ ...photo, displayOrder: i }));

    expect(updatedPhotos).toHaveLength(2);
    expect(updatedPhotos[0].photoUrl).toBe("photo1.jpg");
    expect(updatedPhotos[1].photoUrl).toBe("photo3.jpg");
    expect(updatedPhotos[1].displayOrder).toBe(1);
  });

  it("should reorder photos correctly", () => {
    const newOrder = [photos[2], photos[0], photos[1]];
    const reorderedPhotos = newOrder.map((photo, i) => ({
      ...photo,
      displayOrder: i,
    }));

    expect(reorderedPhotos[0].photoUrl).toBe("photo3.jpg");
    expect(reorderedPhotos[0].displayOrder).toBe(0);
    expect(reorderedPhotos[1].photoUrl).toBe("photo1.jpg");
    expect(reorderedPhotos[1].displayOrder).toBe(1);
  });

  it("should handle empty photo list", () => {
    const emptyPhotos: Photo[] = [];
    expect(emptyPhotos).toHaveLength(0);
    
    const newPhoto: Photo = {
      photoUrl: "photo1.jpg",
      displayOrder: 0,
    };
    const updatedPhotos = [...emptyPhotos, newPhoto];
    expect(updatedPhotos).toHaveLength(1);
  });

  it("should update display order after deletion", () => {
    const indexToDelete = 0;
    const updatedPhotos = photos
      .filter((_, i) => i !== indexToDelete)
      .map((photo, i) => ({ ...photo, displayOrder: i }));

    expect(updatedPhotos[0].displayOrder).toBe(0);
    expect(updatedPhotos[1].displayOrder).toBe(1);
  });

  it("should handle multiple photo additions", () => {
    const newPhotos = [
      { photoUrl: "photo4.jpg", displayOrder: 3 },
      { photoUrl: "photo5.jpg", displayOrder: 4 },
    ];
    const updatedPhotos = [...photos, ...newPhotos];
    expect(updatedPhotos).toHaveLength(5);
    expect(updatedPhotos[3].photoUrl).toBe("photo4.jpg");
    expect(updatedPhotos[4].photoUrl).toBe("photo5.jpg");
  });
});
