export const getSafeImageUrl = (url, name = 'User') => {
  const fallback = `https://ui-avatars.com/api/?background=1a1919&color=ff8d8c&name=${encodeURIComponent(name)}`;
  
  if (!url || url.trim() === '') {
    return fallback;
  }

  // Se for um link absoluto remoto
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Se vier da pasta public do frontend
  if (url.startsWith('/assets/')) {
    return url;
  }

  // Se for um caminho relativo que vêm do backend (ex: /uploads/...)
  const apiUrl = import.meta.env.VITE_API_URL || '';
  if (url.startsWith('/')) {
    return `${apiUrl}${url}`;
  }

  // Fallback seguro caso seja um formato estranho
  return `${apiUrl}/${url}`;
};
