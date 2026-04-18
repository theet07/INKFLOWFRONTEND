export const getSafeImageUrl = (url, name = 'User') => {
  if (!url || url.trim() === '') {
    return `https://ui-avatars.com/api/?background=1a1919&color=ff8d8c&name=${encodeURIComponent(name)}`;
  }

  // Se for um asset local, prepara para otimização (Cloudinary Fetch)
  // Em produção, isso ajuda a garantir que a imagem seja servida com compressão moderna
  if (url.startsWith('/assets/')) {
    // Usamos o serviço de fetch do Cloudinary para redimensionamento e formato inteligente
    // O prefixo garante que imagens locais sejam tratadas de forma estável
    return `https://res.cloudinary.com/demo/image/fetch/f_auto,q_auto/https://inkflow-frontend.vercel.app${url}`;
  }

  return url;
};
