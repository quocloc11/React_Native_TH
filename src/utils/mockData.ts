// src/utils/mockData.ts
export const generateProducts = (count = 1000) => {
  return Array.from({ length: count }).map((_, index) => ({
    id: index.toString(),
    name: `Sản phẩm cao cấp ${index + 1}`,
    category: index % 3 === 0 ? 'Điện thoại' : index % 3 === 1 ? 'Laptop' : 'Phụ kiện',
    price: (Math.random() * 1000 + 10).toFixed(2),
    // Dùng picsum để có ảnh random
    image: `https://picsum.photos/seed/${index}/200`,
    rating: (Math.random() * 5).toFixed(1),
  }));
};